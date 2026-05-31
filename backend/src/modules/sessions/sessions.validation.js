import { body, param, query } from 'express-validator';

export const listSessionsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('groupId').optional().isUUID(),
  query('upcoming').optional().isIn(['true', 'false']),
];

export const createSessionValidation = [
  body('groupId').isUUID(),
  body('title').trim().isLength({ min: 3, max: 150 }),
  body('description').optional().isString(),
  body('startTime').isISO8601(),
  body('endTime').isISO8601(),
  body('meetingLink').optional().isURL(),
];

export const updateSessionValidation = [
  param('id').isUUID(),
  body('title').optional().trim().isLength({ min: 3, max: 150 }),
  body('description').optional().isString(),
  body('startTime').optional().isISO8601(),
  body('endTime').optional().isISO8601(),
  body('meetingLink').optional().isURL(),
  body('status').optional().isIn(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
];

export const sessionIdValidation = [param('id').isUUID()];
