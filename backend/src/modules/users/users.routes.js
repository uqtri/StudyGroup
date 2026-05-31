import { Router } from 'express';
import { usersController } from './users.controller.js';
import {
  listUsersValidation,
  updateUserValidation,
  updateUserStatusValidation,
  userIdValidation,
} from './users.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { ROLES } from '../../constants/roles.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize(ROLES.ADMIN), listUsersValidation, asyncHandler(usersController.list));
router.get('/:id', userIdValidation, asyncHandler(usersController.getById));
router.patch('/:id', updateUserValidation, asyncHandler(usersController.update));
router.patch(
  '/:id/status',
  authorize(ROLES.ADMIN),
  updateUserStatusValidation,
  asyncHandler(usersController.setStatus),
);
router.delete('/:id', authorize(ROLES.ADMIN), userIdValidation, asyncHandler(usersController.remove));

export default router;
