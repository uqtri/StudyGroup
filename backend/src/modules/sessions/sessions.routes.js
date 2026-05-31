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
import { optionalAuthenticate } from '../../middlewares/optionalAuth.middleware.js';

const router = Router();

router.get('/', optionalAuthenticate, listSessionsValidation, asyncHandler(sessionsController.list));
router.get(
  '/:id/livekit-token',
  authenticate,
  sessionIdValidation,
  asyncHandler(sessionsController.getLiveKitToken),
);
router.get('/:id', optionalAuthenticate, sessionIdValidation, asyncHandler(sessionsController.getById));

router.use(authenticate);
router.post('/', createSessionValidation, asyncHandler(sessionsController.create));
router.post('/:id/end', sessionIdValidation, asyncHandler(sessionsController.end));
router.post('/:id/notify', sessionIdValidation, asyncHandler(sessionsController.notifyMembers));
router.patch('/:id', updateSessionValidation, asyncHandler(sessionsController.update));
router.delete('/:id', sessionIdValidation, asyncHandler(sessionsController.remove));

export default router;
