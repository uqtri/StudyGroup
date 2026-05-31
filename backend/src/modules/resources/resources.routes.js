import { Router } from 'express';
import { resourcesController } from './resources.controller.js';
import {
  listResourcesValidation,
  createResourceValidation,
  resourceIdValidation,
} from './resources.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', listResourcesValidation, asyncHandler(resourcesController.list));
router.get('/:id', resourceIdValidation, asyncHandler(resourcesController.getById));
router.post('/', createResourceValidation, asyncHandler(resourcesController.create));
router.delete('/:id', resourceIdValidation, asyncHandler(resourcesController.remove));

export default router;
