import { jest } from '@jest/globals';
import { dashboardService } from './dashboard.service.js';
import { prisma } from '../../config/prisma.js';
import { attendanceRepository } from '../attendance/attendance.repository.js';
import { ROLES } from '../../constants/roles.js';

jest.spyOn(prisma.groupMember, 'count').mockResolvedValue(0);
jest.spyOn(prisma.groupMember, 'findMany').mockResolvedValue([]);
jest.spyOn(prisma.studySession, 'findMany').mockResolvedValue([]);
jest.spyOn(prisma.studySession, 'groupBy').mockResolvedValue([]);
jest.spyOn(prisma.resource, 'findMany').mockResolvedValue([]);
jest.spyOn(prisma.attendance, 'groupBy').mockResolvedValue([]);
jest.spyOn(attendanceRepository, 'getUserStats').mockResolvedValue({ rate: 100 });
jest.spyOn(prisma.studyGroup, 'findMany').mockResolvedValue([]);
jest.spyOn(prisma.studyGroup, 'findFirst').mockResolvedValue(null);
jest.spyOn(prisma.studyGroup, 'count').mockResolvedValue(0);
jest.spyOn(prisma.studyGroup, 'groupBy').mockResolvedValue([]);
jest.spyOn(prisma.user, 'count').mockResolvedValue(0);
jest.spyOn(prisma.user, 'groupBy').mockResolvedValue([]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('Dashboard Service', () => {
  describe('getStats', () => {
    it('should return student stats for member', async () => {
      prisma.groupMember.count.mockResolvedValue(2);
      prisma.studySession.findMany.mockResolvedValue([]);
      prisma.resource.findMany.mockResolvedValue([]);
      attendanceRepository.getUserStats.mockResolvedValue({ rate: 90 });
      prisma.attendance.groupBy.mockResolvedValue([{ status: 'PRESENT', _count: 5 }]);

      const result = await dashboardService.getStats({ id: 'user1', roles: [ROLES.MEMBER] });
      expect(result.role).toBe('MEMBER');
      expect(result.totalGroups).toBe(2);
    });

    it('should return leader stats for leader', async () => {
      prisma.studyGroup.findMany.mockResolvedValue([{ id: 'group1', name: 'G1', _count: { members: 2, sessions: 1 } }]);
      prisma.studySession.groupBy.mockResolvedValue([{ status: 'COMPLETED', _count: 1 }]);
      prisma.groupMember.count.mockResolvedValue(2);

      const result = await dashboardService.getStats({ id: 'user1', roles: [ROLES.LEADER] });
      expect(result.role).toBe('LEADER');
      expect(result.groupCount).toBe(1);
    });

    it('should return admin stats for admin', async () => {
      prisma.user.count.mockResolvedValue(10);
      prisma.studyGroup.count.mockResolvedValue(3);
      prisma.user.groupBy.mockResolvedValue([{ status: 'ACTIVE', _count: 10 }]);
      prisma.studyGroup.groupBy.mockResolvedValue([{ subject: 'Math', _count: 3 }]);
      prisma.studyGroup.findMany.mockResolvedValue([{ id: 'g1', name: 'G1', _count: { members: 5 } }]);

      const result = await dashboardService.getStats({ id: 'user1', roles: [ROLES.ADMIN] });
      expect(result.role).toBe('ADMIN');
      expect(result.totalUsers).toBe(10);
    });
  });

  describe('getGroupStats', () => {
    it('should throw if not admin', async () => {
      await expect(dashboardService.getGroupStats('group1', { roles: [ROLES.MEMBER] })).rejects.toThrow('Forbidden');
    });

    it('should return group stats if admin', async () => {
      prisma.studyGroup.findFirst.mockResolvedValue({ id: 'group1' });
      prisma.studySession.groupBy.mockResolvedValue([{ status: 'COMPLETED', _count: 2 }]);
      prisma.groupMember.findMany.mockResolvedValue([{ joinedAt: new Date('2023-01-01') }]);

      const result = await dashboardService.getGroupStats('group1', { roles: [ROLES.ADMIN] });
      expect(result.charts.sessionStats).toHaveLength(1);
    });

    it('should throw if group not found', async () => {
      prisma.studyGroup.findFirst.mockResolvedValue(null);
      await expect(dashboardService.getGroupStats('group1', { roles: [ROLES.ADMIN] })).rejects.toThrow('Group not found');
    });
  });
});
