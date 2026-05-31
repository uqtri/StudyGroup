import { describe, it, expect, vi, beforeEach } from 'vitest';
import { attendanceService } from '../../../src/modules/attendance/attendance.service.js';
import { attendanceRepository } from '../../../src/modules/attendance/attendance.repository.js';
import { sessionsRepository } from '../../../src/modules/sessions/sessions.repository.js';
import { groupsRepository } from '../../../src/modules/groups/groups.repository.js';
import { userId, sessionId, mockSession } from '../../helpers/fixtures.js';

vi.mock('../../../src/modules/attendance/attendance.repository.js', () => ({
  attendanceRepository: {
    upsert: vi.fn(),
    findBySession: vi.fn(),
    getUserStats: vi.fn(),
  },
}));

vi.mock('../../../src/modules/sessions/sessions.repository.js', () => ({
  sessionsRepository: { findById: vi.fn() },
}));

vi.mock('../../../src/modules/groups/groups.repository.js', () => ({
  groupsRepository: { isMember: vi.fn() },
}));

describe('Điểm danh (attendanceService)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('Điểm danh phiên học', () => {
    it('mark allows user to mark own attendance', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      attendanceRepository.upsert.mockResolvedValue({ status: 'PRESENT' });

      const result = await attendanceService.mark(sessionId, userId, 'PRESENT', userId);

      expect(attendanceRepository.upsert).toHaveBeenCalledWith(
        sessionId,
        userId,
        expect.objectContaining({ status: 'PRESENT' }),
      );
      expect(result.status).toBe('PRESENT');
    });

    it('mark allows session creator to mark for others', async () => {
      sessionsRepository.findById.mockResolvedValue({ ...mockSession, createdBy: userId });
      attendanceRepository.upsert.mockResolvedValue({ status: 'ABSENT' });

      await attendanceService.mark(sessionId, 'user-2', 'ABSENT', userId);

      expect(attendanceRepository.upsert).toHaveBeenCalledWith(sessionId, 'user-2', expect.any(Object));
    });

    it('mark forbids non-creator from marking others', async () => {
      sessionsRepository.findById.mockResolvedValue({
        ...mockSession,
        createdBy: 'other-user',
      });

      await expect(
        attendanceService.mark(sessionId, 'user-2', 'PRESENT', userId),
      ).rejects.toMatchObject({
        statusCode: 403,
        message: 'Cannot mark attendance for others',
      });
    });

    it('mark throws when session not found', async () => {
      sessionsRepository.findById.mockResolvedValue(null);

      await expect(attendanceService.mark('missing', userId, 'PRESENT', userId)).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('Ghi nhận tham gia khi vào call', () => {
    it('recordJoin upserts PRESENT for in-progress session', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      attendanceRepository.upsert.mockResolvedValue({ status: 'PRESENT' });

      const result = await attendanceService.recordJoin(sessionId, userId);

      expect(attendanceRepository.upsert).toHaveBeenCalledWith(
        sessionId,
        userId,
        expect.objectContaining({ status: 'PRESENT' }),
      );
      expect(result.status).toBe('PRESENT');
    });

    it('recordJoin rejects when session is not in progress', async () => {
      sessionsRepository.findById.mockResolvedValue({
        ...mockSession,
        status: 'SCHEDULED',
      });

      await expect(attendanceService.recordJoin(sessionId, userId)).rejects.toMatchObject({
        statusCode: 400,
        message: 'Session is not in progress',
      });
    });

    it('recordJoin forbids non-members', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      groupsRepository.isMember.mockResolvedValue(null);

      await expect(attendanceService.recordJoin(sessionId, userId)).rejects.toMatchObject({
        statusCode: 403,
      });
    });
  });

  describe('Xem danh sách điểm danh', () => {
    it('listBySession returns attendance for session', async () => {
      const rows = [{ userId, status: 'PRESENT' }];
      attendanceRepository.findBySession.mockResolvedValue(rows);

      const result = await attendanceService.listBySession(sessionId);

      expect(attendanceRepository.findBySession).toHaveBeenCalledWith(sessionId);
      expect(result).toEqual(rows);
    });
  });

  describe('Tỷ lệ điểm danh user', () => {
    it('getUserRate returns stats from repository', async () => {
      attendanceRepository.getUserStats.mockResolvedValue({ rate: 0.85, total: 10 });

      const stats = await attendanceService.getUserRate(userId);

      expect(stats.rate).toBe(0.85);
    });
  });
});
