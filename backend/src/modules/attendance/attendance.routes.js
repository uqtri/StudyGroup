import { Router } from 'express';
import { attendanceController } from './attendance.controller.js';
import { markAttendanceValidation } from './attendance.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { param } from 'express-validator';

const router = Router();

router.use(authenticate);

router.post(
  '/:sessionId',
  markAttendanceValidation,
  asyncHandler(attendanceController.mark),
);
router.get(
  '/:sessionId',
  [param('sessionId').isUUID()],
  asyncHandler(attendanceController.list),
);

export default router;
