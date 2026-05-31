import { body, param } from 'express-validator';

export const markAttendanceValidation = [
  param('sessionId').isUUID(),
  body('userId').optional().isUUID(),
  body('status').isIn(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
];
