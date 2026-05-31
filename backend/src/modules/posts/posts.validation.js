import { body, param, query } from 'express-validator';

export const listPostsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('groupId').optional().isUUID(),
];

export const createPostValidation = [
  body('groupId').isUUID(),
  body('title').trim().isLength({ min: 3, max: 200 }),
  body('content').trim().isLength({ min: 1 }),
];

export const postIdValidation = [param('id').isUUID()];
