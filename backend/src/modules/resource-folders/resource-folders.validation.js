import { body, param, query } from 'express-validator';

export const listResourceFoldersValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('groupId').optional().isUUID(),
  query('myGroups').optional().isIn(['true', 'false']),
];

export const createResourceFolderValidation = [
  body('groupId').isUUID(),
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('description').optional({ values: 'null' }).isString().isLength({ max: 500 }),
];

export const updateResourceFolderValidation = [
  param('id').isUUID(),
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional({ values: 'null' }).isString().isLength({ max: 500 }),
];

export const resourceFolderIdValidation = [param('id').isUUID()];
