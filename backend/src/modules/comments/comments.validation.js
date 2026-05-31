import { body, param, query } from 'express-validator';

export const createCommentValidation = [
  body('postId').isUUID(),
  body('content').trim().isLength({ min: 1, max: 2000 }),
  body('parentCommentId').optional().isUUID(),
  body('mentionedUserIds').optional().isArray(),
  body('mentionedUserIds.*').optional().isUUID(),
];

export const updateCommentValidation = [
  param('id').isUUID(),
  body('content').trim().isLength({ min: 1, max: 2000 }),
];

export const voteCommentValidation = [
  param('id').isUUID(),
  body('value').toInt().isIn([1, -1]),
];

export const listCommentsValidation = [
  param('postId').isUUID(),
  query('sort').optional().isIn(['newest', 'votes']),
];

export const commentIdValidation = [param('id').isUUID()];
