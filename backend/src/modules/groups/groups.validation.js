import { body, param, query } from 'express-validator';

export const listGroupsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('myGroups').optional().isIn(['true', 'false']),
  query('status').optional().isIn(['ACTIVE', 'ARCHIVED', 'DELETED']),
];

export const createGroupValidation = [
  body('name').trim().isLength({ min: 3, max: 100 }),
  body('description').optional().isString(),
  body('subject').trim().notEmpty(),
  body('maxMembers').optional().isInt({ min: 2, max: 100 }),
];

export const updateGroupValidation = [
  param('id').isUUID(),
  body('name').optional().trim().isLength({ min: 3, max: 100 }),
  body('description').optional().isString(),
  body('subject').optional().trim().notEmpty(),
  body('maxMembers').optional().isInt({ min: 2, max: 100 }),
  body('status').optional().isIn(['ACTIVE', 'ARCHIVED']),
];

export const groupIdValidation = [param('id').isUUID()];

export const joinRequestIdValidation = [param('requestId').isUUID()];

export const joinRequestValidation = [
  param('id').isUUID(),
  body('status').isIn(['APPROVED', 'REJECTED']),
];

export const updateGroupStatusValidation = [
  param('id').isUUID(),
  body('status').isIn(['ACTIVE', 'ARCHIVED']),
];
