import { body, param, query } from 'express-validator';

export const createReportValidation = [
  body('reportedType').isIn(['USER', 'GROUP', 'POST', 'COMMENT', 'RESOURCE']),
  body('reportedId').isString().notEmpty(),
  body('reason').trim().isLength({ min: 10, max: 500 }),
];

export const updateReportValidation = [
  param('id').isUUID(),
  body('status').isIn(['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED']),
];
