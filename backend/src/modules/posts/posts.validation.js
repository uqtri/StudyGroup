import { body, param, query } from 'express-validator';

export const listPostsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('groupId').optional().isUUID(),
  query('sortBy').optional().isIn(['createdAt', 'votes']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
];

export const createPostValidation = [
  body('groupId').isUUID(),
  body('title').trim().isLength({ min: 3, max: 200 }),
  body('content').trim().isLength({ min: 1 }),
  body('attachments').optional().isArray({ max: 10 }),
  body('attachments.*.fileUrl').isURL(),
  body('attachments.*.fileName').trim().isLength({ min: 1, max: 255 }),
  body('attachments.*.fileType').trim().isLength({ min: 1, max: 128 }),
  body('attachments.*.fileSize').optional().isInt({ min: 0 }),
];

export const updatePostValidation = [
  param('id').isUUID(),
  body('title').optional().trim().isLength({ min: 3, max: 200 }),
  body('content').optional().trim().isLength({ min: 1 }),
];

export const votePostValidation = [
  param('id').isUUID(),
  body('value').toInt().isIn([1, -1]),
];

export const postIdValidation = [param('id').isUUID()];
