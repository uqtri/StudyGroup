import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dashboardService } from '../../../../src/modules/dashboard/dashboard.service.js';
import { prisma } from '../../../../src/config/prisma.js';
import { attendanceRepository } from '../../../../src/modules/attendance/attendance.repository.js';
import { ROLES } from '../../../../src/constants/roles.js';
import { userId, groupId } from '../../../helpers/fixtures.js';

vi.mock('../../../../src/config/prisma.js', () => ({
  prisma: {
    groupMember: { count: vi.fn(), findMany: vi.fn() },
    studySession: { findMany: vi.fn(), groupBy: vi.fn() },
    resource: { findMany: vi.fn() },
    user: { count: vi.fn(), groupBy: vi.fn() },
    studyGroup: { count: vi.fn(), findMany: vi.fn(), findFirst: vi.fn(), groupBy: vi.fn() },
    attendance: { groupBy: vi.fn() },
  },
}));

vi.mock('../../../../src/modules/attendance/attendance.repository.js', () => ({
  attendanceRepository: { getUserStats: vi.fn() },
}));

describe('Dashboard (dashboardService)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('Xem thống kê tổng quan', () => {
    it('getStats returns member stats for regular user', async () => {
      prisma.groupMember.count.mockResolvedValue(2);
      prisma.studySession.findMany.mockResolvedValue([]);
      prisma.resource.findMany.mockResolvedValue([]);
      attendanceRepository.getUserStats.mockResolvedValue({ rate: 0.5 });
      prisma.attendance.groupBy.mockResolvedValue([
        { status: 'PRESENT', _count: 3 },
        { status: 'ABSENT', _count: 1 },
      ]);
      prisma.studySession.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await dashboardService.getStats({
        id: userId,
        roles: [ROLES.MEMBER],
      });

      expect(result.role).toBe('MEMBER');
      expect(result.totalGroups).toBe(2);
      expect(result.attendanceRate).toBe(0.5);
      expect(result.charts.attendanceBreakdown).toHaveLength(2);
    });

    it('getStats returns leader stats when user has LEADER role', async () => {
      prisma.studyGroup.findMany.mockResolvedValue([
        {
          id: groupId,
          name: 'Math',
          _count: { members: 5, sessions: 2 },
        },
      ]);
      prisma.studySession.groupBy.mockResolvedValue([{ status: 'COMPLETED', _count: 1 }]);
      prisma.groupMember.count.mockResolvedValue(5);

      const result = await dashboardService.getStats({
        id: userId,
        roles: [ROLES.LEADER],
      });

      expect(result.role).toBe('LEADER');
      expect(result.groupCount).toBe(1);
      expect(result.totalMembers).toBe(5);
    });

    it('getStats returns admin stats when user has ADMIN role', async () => {
      prisma.user.count.mockResolvedValue(100);
      prisma.studyGroup.count.mockResolvedValue(20);
      prisma.user.groupBy.mockResolvedValue([{ status: 'ACTIVE', _count: 90 }]);
      prisma.studyGroup.groupBy.mockResolvedValue([{ subject: 'Math', _count: 5 }]);
      prisma.studyGroup.findMany.mockResolvedValue([
        { id: groupId, name: 'Math Study', _count: { members: 10 } },
      ]);

      const result = await dashboardService.getStats({
        id: userId,
        roles: [ROLES.ADMIN],
      });

      expect(result.role).toBe('ADMIN');
      expect(result.totalUsers).toBe(100);
      expect(result.activeGroups).toBe(20);
    });
  });

  describe('Xem thống kê theo nhóm', () => {
    it('getGroupStats forbids non-admin', async () => {
      await expect(
        dashboardService.getGroupStats(groupId, { roles: [ROLES.MEMBER] }),
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('getGroupStats returns charts for admin', async () => {
      prisma.studyGroup.findFirst.mockResolvedValue({ id: groupId, name: 'Math' });
      prisma.studySession.groupBy.mockResolvedValue([{ status: 'COMPLETED', _count: 2 }]);
      prisma.groupMember.findMany.mockResolvedValue([
        { joinedAt: new Date('2026-01-01') },
        { joinedAt: new Date('2026-02-01') },
      ]);

      const result = await dashboardService.getGroupStats(groupId, { roles: [ROLES.ADMIN] });

      expect(result.charts.sessionStats).toHaveLength(1);
      expect(result.charts.memberGrowth.length).toBeGreaterThan(0);
    });

    it('getGroupStats throws when group not found', async () => {
      prisma.studyGroup.findFirst.mockResolvedValue(null);

      await expect(
        dashboardService.getGroupStats('missing', { roles: [ROLES.ADMIN] }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
