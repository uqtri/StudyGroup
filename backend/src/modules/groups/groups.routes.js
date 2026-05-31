import { Router } from 'express';
import { groupsController } from './groups.controller.js';
import {
  listGroupsValidation,
  createGroupValidation,
  updateGroupValidation,
  groupIdValidation,
  joinRequestValidation,
  joinRequestIdValidation,
} from './groups.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { optionalAuthenticate } from '../../middlewares/optionalAuth.middleware.js';
import { param } from 'express-validator';

const router = Router();

router.get('/', optionalAuthenticate, listGroupsValidation, asyncHandler(groupsController.list));
router.get('/:id', optionalAuthenticate, groupIdValidation, asyncHandler(groupsController.getById));

router.use(authenticate);
router.post('/', createGroupValidation, asyncHandler(groupsController.create));
router.patch('/:id', updateGroupValidation, asyncHandler(groupsController.update));
router.delete(
  '/:id',
  groupIdValidation,
  asyncHandler(groupsController.remove),
);
router.post('/:id/join', groupIdValidation, asyncHandler(groupsController.requestJoin));
router.delete('/:id/join', groupIdValidation, asyncHandler(groupsController.cancelJoinRequest));
router.post(
  '/join-requests/:requestId/approve',
  joinRequestIdValidation,
  asyncHandler(groupsController.approveJoinRequest),
);
router.post(
  '/join-requests/:requestId/reject',
  joinRequestIdValidation,
  asyncHandler(groupsController.rejectJoinRequest),
);
router.patch(
  '/join-requests/:requestId',
  [param('requestId').isUUID(), ...joinRequestValidation.slice(1)],
  asyncHandler(groupsController.handleJoinRequest),
);

export default router;
