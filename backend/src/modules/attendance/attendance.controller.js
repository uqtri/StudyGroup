import { attendanceService } from './attendance.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { validate } from '../../utils/validationHandler.js';

export const attendanceController = {
  mark: async (req, res) => {
    validate(req);
    const targetUserId = req.body.userId || req.user.id;
    const data = await attendanceService.mark(
      req.params.sessionId,
      targetUserId,
      req.body.status,
      req.user.id,
    );
    ApiResponse.success(res, { message: 'Attendance recorded', data });
  },

  recordJoin: async (req, res) => {
    validate(req);
    const data = await attendanceService.recordJoin(req.params.sessionId, req.user.id);
    ApiResponse.success(res, { message: 'Attendance recorded', data });
  },

  list: async (req, res) => {
    const data = await attendanceService.listBySession(req.params.sessionId);
    ApiResponse.success(res, { message: 'Attendance list retrieved', data });
  },
};
