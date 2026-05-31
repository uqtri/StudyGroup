import { attendanceRepository } from './attendance.repository.js';
import { sessionsRepository } from '../sessions/sessions.repository.js';
import { ApiError } from '../../utils/ApiError.js';

export const attendanceService = {
  mark: async (sessionId, userId, status, markerId) => {
    const session = await sessionsRepository.findById(sessionId);
    if (!session) throw ApiError.notFound('Session not found');

    if (markerId !== userId && session.createdBy !== markerId) {
      throw ApiError.forbidden('Cannot mark attendance for others');
    }

    return attendanceRepository.upsert(sessionId, userId, {
      status,
      checkedAt: new Date(),
    });
  },

  listBySession: async (sessionId) => attendanceRepository.findBySession(sessionId),

  getUserRate: async (userId) => attendanceRepository.getUserStats(userId),
};
