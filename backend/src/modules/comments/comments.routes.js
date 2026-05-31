import { Router } from 'express';
import { commentsController } from './comments.controller.js';
import { createCommentValidation, commentIdValidation } from './comments.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', createCommentValidation, asyncHandler(commentsController.create));
router.delete('/:id', commentIdValidation, asyncHandler(commentsController.remove));

export default router;
