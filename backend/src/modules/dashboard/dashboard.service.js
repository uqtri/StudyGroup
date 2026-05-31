import { prisma } from '../../config/prisma.js';
import { attendanceRepository } from '../attendance/attendance.repository.js';
import { ROLES } from '../../constants/roles.js';
import { ApiError } from '../../utils/ApiError.js';

export const dashboardService = {
  getStats: async (user) => {
    const isAdmin = user.roles.includes(ROLES.ADMIN);
    const isLeader = user.roles.includes(ROLES.LEADER);

    if (isAdmin) return getAdminStats();
    if (isLeader) return getLeaderStats(user.id);
    return getStudentStats(user.id);
  },

  getGroupStats: async (groupId, user) => {
    if (!user.roles.includes(ROLES.ADMIN)) {
      throw ApiError.forbidden();
    }
    return getGroupStats(groupId);
  },
};

async function getStudentStats(userId) {
  const [totalGroups, upcomingSessions, recentResources, attendance] = await Promise.all([
    prisma.groupMember.count({ where: { userId, deletedAt: null } }),
    prisma.studySession.findMany({
      where: {
        deletedAt: null,
        startTime: { gte: new Date() },
        status: 'SCHEDULED',
        group: { members: { some: { userId, deletedAt: null } } },
      },
      take: 5,
      orderBy: { startTime: 'asc' },
      include: { group: { select: { name: true } } },
    }),
    prisma.resource.findMany({
      where: {
        deletedAt: null,
        group: { members: { some: { userId, deletedAt: null } } },
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { group: { select: { name: true } } },
    }),
    attendanceRepository.getUserStats(userId),
  ]);

  const sessionTrend = await prisma.attendance.groupBy({
    by: ['status'],
    where: { userId },
    _count: true,
  });

  return {
    role: 'MEMBER',
    totalGroups,
    upcomingSessions,
    attendanceRate: attendance.rate,
    recentResources,
    charts: {
      attendanceBreakdown: sessionTrend.map((s) => ({
        name: s.status,
        value: s._count,
      })),
      sessionsByMonth: await getSessionsByMonth(userId),
    },
  };
}

async function getLeaderStats(userId) {
  const groups = await prisma.studyGroup.findMany({
    where: {
      deletedAt: null,
      members: { some: { userId, role: 'LEADER', deletedAt: null } },
    },
    include: {
      _count: { select: { members: true, sessions: true } },
    },
  });

  const groupIds = groups.map((g) => g.id);

  const [sessionStats, memberCount] = await Promise.all([
    prisma.studySession.groupBy({
      by: ['status'],
      where: { groupId: { in: groupIds }, deletedAt: null },
      _count: true,
    }),
    prisma.groupMember.count({
      where: { groupId: { in: groupIds }, deletedAt: null },
    }),
  ]);

  return {
    role: 'LEADER',
    groupCount: groups.length,
    totalMembers: memberCount,
    groups: groups.map((g) => ({
      id: g.id,
      name: g.name,
      members: g._count.members,
      sessions: g._count.sessions,
    })),
    charts: {
      sessionStats: sessionStats.map((s) => ({ name: s.status, value: s._count })),
      memberGrowth: groups.map((g) => ({ name: g.name, members: g._count.members })),
    },
  };
}

async function getAdminStats() {
  const [totalUsers, activeGroups, usersByStatus, groupsBySubject, topGroups] =
    await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.studyGroup.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
      prisma.user.groupBy({
        by: ['status'],
        where: { deletedAt: null },
        _count: true,
      }),
      prisma.studyGroup.groupBy({
        by: ['subject'],
        where: { deletedAt: null, status: 'ACTIVE' },
        _count: true,
      }),
      prisma.studyGroup.findMany({
        where: { deletedAt: null, status: 'ACTIVE' },
        take: 10,
        orderBy: { members: { _count: 'desc' } },
        include: { _count: { select: { members: true } } },
      }),
    ]);

  return {
    role: 'ADMIN',
    totalUsers,
    activeGroups,
    charts: {
      usersByStatus: usersByStatus.map((u) => ({ name: u.status, value: u._count })),
      groupsBySubject: groupsBySubject
        .sort((a, b) => b._count - a._count)
        .slice(0, 6)
        .map((g) => ({
          name: g.subject,
          value: g._count,
        })),
      membersPerGroup: topGroups.map((g) => ({
        name: g.name.length > 12 ? `${g.name.slice(0, 12)}…` : g.name,
        value: g._count.members,
      })),
    },
  };
}

export async function getGroupStats(groupId) {
  const group = await prisma.studyGroup.findFirst({
    where: { id: groupId, deletedAt: null },
  });
  if (!group) throw ApiError.notFound('Group not found');

  const [sessionStats, membersByMonth] = await Promise.all([
    prisma.studySession.groupBy({
      by: ['status'],
      where: { groupId, deletedAt: null },
      _count: true,
    }),
    prisma.groupMember.findMany({
      where: { groupId, deletedAt: null },
      select: { joinedAt: true },
      orderBy: { joinedAt: 'asc' },
    }),
  ]);

  const growthByMonth = {};
  for (const member of membersByMonth) {
    const key = member.joinedAt.toISOString().slice(0, 7);
    growthByMonth[key] = (growthByMonth[key] || 0) + 1;
  }

  let cumulative = 0;
  const memberGrowth = Object.entries(growthByMonth).map(([name, count]) => {
    cumulative += count;
    return { name, value: cumulative };
  });

  return {
    charts: {
      sessionStats: sessionStats.map((s) => ({ name: s.status, value: s._count })),
      memberGrowth,
    },
  };
}

async function getSessionsByMonth(userId) {
  const sessions = await prisma.studySession.findMany({
    where: {
      deletedAt: null,
      group: { members: { some: { userId, deletedAt: null } } },
    },
    select: { startTime: true },
    take: 50,
    orderBy: { startTime: 'desc' },
  });

  const months = {};
  for (const s of sessions) {
    const key = s.startTime.toISOString().slice(0, 7);
    months[key] = (months[key] || 0) + 1;
  }

  return Object.entries(months).map(([name, value]) => ({ name, value }));
}
