import { jest } from '@jest/globals';
import { attendanceService } from './attendance.service.js';
import { attendanceRepository } from './attendance.repository.js';
import { sessionsRepository } from '../sessions/sessions.repository.js';
import { groupsRepository } from '../groups/groups.repository.js';
import { ApiError } from '../../utils/ApiError.js';

jest.spyOn(attendanceRepository, 'upsert').mockResolvedValue({});
jest.spyOn(attendanceRepository, 'findBySession').mockResolvedValue([]);
jest.spyOn(attendanceRepository, 'getUserStats').mockResolvedValue({ total: 10, present: 8, rate: 80 });

jest.spyOn(sessionsRepository, 'findById').mockResolvedValue(null);
jest.spyOn(groupsRepository, 'isMember').mockResolvedValue(null);

const mockSession = {
  id: 'sess1',
  groupId: 'group1',
  status: 'IN_PROGRESS',
  createdBy: 'user1'
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('Attendance Service', () => {
  describe('mark', () => {
    it('should allow user to mark their own attendance', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      attendanceRepository.upsert.mockResolvedValue({ status: 'PRESENT' });
      
      const result = await attendanceService.mark('sess1', 'user2', 'PRESENT', 'user2');
      expect(result.status).toBe('PRESENT');
      expect(attendanceRepository.upsert).toHaveBeenCalled();
    });

    it('should allow creator to mark attendance for others', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession); // createdBy: 'user1'
      
      await attendanceService.mark('sess1', 'user2', 'LATE', 'user1'); // user1 marks for user2
      expect(attendanceRepository.upsert).toHaveBeenCalled();
    });

    it('should throw forbidden if marking for others and not creator', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      await expect(attendanceService.mark('sess1', 'user3', 'PRESENT', 'user2')).rejects.toThrow('Cannot mark attendance for others');
    });

    it('should throw not found if session missing', async () => {
      sessionsRepository.findById.mockResolvedValue(null);
      await expect(attendanceService.mark('sess1', 'user1', 'PRESENT', 'user1')).rejects.toThrow('Session not found');
    });
  });

  describe('recordJoin', () => {
    it('should mark present if session in progress and user is member', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      
      await attendanceService.recordJoin('sess1', 'user2');
      expect(attendanceRepository.upsert).toHaveBeenCalledWith('sess1', 'user2', expect.objectContaining({ status: 'PRESENT' }));
    });

    it('should throw if session not in progress', async () => {
      sessionsRepository.findById.mockResolvedValue({ ...mockSession, status: 'SCHEDULED' });
      await expect(attendanceService.recordJoin('sess1', 'user2')).rejects.toThrow('Session is not in progress');
    });

    it('should throw if user not member', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      groupsRepository.isMember.mockResolvedValue(null);
      await expect(attendanceService.recordJoin('sess1', 'user2')).rejects.toThrow('Must be a group member');
    });
  });

  describe('listBySession', () => {
    it('should return attendance records', async () => {
      const result = await attendanceService.listBySession('sess1');
      expect(result).toEqual([]);
      expect(attendanceRepository.findBySession).toHaveBeenCalledWith('sess1');
    });
  });

  describe('getUserRate', () => {
    it('should return user stats', async () => {
      const result = await attendanceService.getUserRate('user1');
      expect(result.rate).toBe(80);
      expect(attendanceRepository.getUserStats).toHaveBeenCalledWith('user1');
    });
  });
});
