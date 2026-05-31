import { Router } from 'express';
import { resourceFoldersController } from './resource-folders.controller.js';
import {
  listResourceFoldersValidation,
  createResourceFolderValidation,
  resourceFolderIdValidation,
} from './resource-folders.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', listResourceFoldersValidation, asyncHandler(resourceFoldersController.list));
router.get('/:id', resourceFolderIdValidation, asyncHandler(resourceFoldersController.getById));
router.post('/', createResourceFolderValidation, asyncHandler(resourceFoldersController.create));

export default router;
