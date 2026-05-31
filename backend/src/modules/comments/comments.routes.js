import { Router } from 'express';
import { commentsController } from './comments.controller.js';
import {
  createCommentValidation,
  updateCommentValidation,
  voteCommentValidation,
  listCommentsValidation,
  commentIdValidation,
} from './comments.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/post/:postId', listCommentsValidation, asyncHandler(commentsController.listByPost));
router.post('/', createCommentValidation, asyncHandler(commentsController.create));
router.patch('/:id', updateCommentValidation, asyncHandler(commentsController.update));
router.post('/:id/vote', voteCommentValidation, asyncHandler(commentsController.vote));
router.delete('/:id', commentIdValidation, asyncHandler(commentsController.remove));

export default router;
