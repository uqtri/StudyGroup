import { Router } from 'express';
import { postsController } from './posts.controller.js';
import {
  listPostsValidation,
  createPostValidation,
  updatePostValidation,
  votePostValidation,
  postIdValidation,
} from './posts.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', listPostsValidation, asyncHandler(postsController.list));
router.get('/:id', postIdValidation, asyncHandler(postsController.getById));
router.post('/', createPostValidation, asyncHandler(postsController.create));
router.patch('/:id', updatePostValidation, asyncHandler(postsController.update));
router.post('/:id/vote', votePostValidation, asyncHandler(postsController.vote));
router.delete('/:id', postIdValidation, asyncHandler(postsController.remove));

export default router;
