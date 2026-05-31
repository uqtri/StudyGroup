import { body, param } from 'express-validator';

export const createCommentValidation = [
  body('postId').isUUID(),
  body('content').trim().isLength({ min: 1, max: 2000 }),
  body('parentCommentId').optional().isUUID(),
];

export const commentIdValidation = [param('id').isUUID()];
