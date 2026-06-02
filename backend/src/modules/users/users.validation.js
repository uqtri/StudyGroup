import { body, param, query } from 'express-validator';

export const listUsersValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
];

export const updateUserValidation = [
  param('id').isUUID(),
  body('fullName').optional().trim().isLength({ min: 2, max: 100 }),
  body('bio').optional().isString().isLength({ max: 500 }),
  body('avatar').optional().isURL(),
];

export const userIdValidation = [param('id').isUUID()];

export const updateUserStatusValidation = [
  param('id').isUUID(),
  body('status').isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
];
