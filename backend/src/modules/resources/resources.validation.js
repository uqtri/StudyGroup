import { body, param, query } from 'express-validator';

export const listResourcesValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('groupId').optional().isUUID(),
];

export const createResourceValidation = [
  body('groupId').isUUID(),
  body('title').trim().isLength({ min: 2, max: 150 }),
  body('description').optional().isString(),
  body('fileUrl').isURL(),
  body('fileType').trim().notEmpty(),
];

export const resourceIdValidation = [param('id').isUUID()];
