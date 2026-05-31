import { Router } from 'express';
import { sessionsController } from './sessions.controller.js';
import {
  listSessionsValidation,
  createSessionValidation,
  updateSessionValidation,
  sessionIdValidation,
} from './sessions.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', listSessionsValidation, asyncHandler(sessionsController.list));
router.get('/:id', sessionIdValidation, asyncHandler(sessionsController.getById));
router.post('/', createSessionValidation, asyncHandler(sessionsController.create));
router.patch('/:id', updateSessionValidation, asyncHandler(sessionsController.update));
router.delete('/:id', sessionIdValidation, asyncHandler(sessionsController.remove));

export default router;
