import { Router } from 'express';
import { groupsController } from './groups.controller.js';
import {
  listGroupsValidation,
  createGroupValidation,
  updateGroupValidation,
  groupIdValidation,
  joinRequestValidation,
} from './groups.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { ROLES } from '../../constants/roles.js';
import { param } from 'express-validator';

const router = Router();

router.use(authenticate);

router.get('/', listGroupsValidation, asyncHandler(groupsController.list));
router.get('/:id', groupIdValidation, asyncHandler(groupsController.getById));
router.post('/', createGroupValidation, asyncHandler(groupsController.create));
router.patch('/:id', updateGroupValidation, asyncHandler(groupsController.update));
router.delete(
  '/:id',
  groupIdValidation,
  asyncHandler(groupsController.remove),
);
router.post('/:id/join', groupIdValidation, asyncHandler(groupsController.requestJoin));
router.patch(
  '/join-requests/:requestId',
  [param('requestId').isUUID(), ...joinRequestValidation.slice(1)],
  asyncHandler(groupsController.handleJoinRequest),
);

export default router;
