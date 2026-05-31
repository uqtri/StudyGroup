import { prisma } from '../../config/prisma.js';
import { attendanceRepository } from '../attendance/attendance.repository.js';
import { ROLES } from '../../constants/roles.js';

export const dashboardService = {
  getStats: async (user) => {
    const isAdmin = user.roles.includes(ROLES.ADMIN);
    const isLeader = user.roles.includes(ROLES.LEADER);

    if (isAdmin) return getAdminStats();
    if (isLeader) return getLeaderStats(user.id);
    return getStudentStats(user.id);
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
  const [totalUsers, activeGroups, pendingReports, usersByStatus, groupsBySubject] =
    await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.studyGroup.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.user.groupBy({
        by: ['status'],
        where: { deletedAt: null },
        _count: true,
      }),
      prisma.studyGroup.groupBy({
        by: ['subject'],
        where: { deletedAt: null },
        _count: true,
      }),
    ]);

  const recentReports = await prisma.report.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { reporter: { select: { fullName: true } } },
  });

  return {
    role: 'ADMIN',
    totalUsers,
    activeGroups,
    pendingReports,
    recentReports,
    charts: {
      usersByStatus: usersByStatus.map((u) => ({ name: u.status, value: u._count })),
      groupsBySubject: groupsBySubject
        .sort((a, b) => b._count - a._count)
        .slice(0, 6)
        .map((g) => ({
          name: g.subject,
          value: g._count,
        })),
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
