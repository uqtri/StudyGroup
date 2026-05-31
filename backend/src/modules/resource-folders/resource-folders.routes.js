import { Router } from 'express';
import { resourceFoldersController } from './resource-folders.controller.js';
import {
  listResourceFoldersValidation,
  createResourceFolderValidation,
  updateResourceFolderValidation,
  resourceFolderIdValidation,
} from './resource-folders.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', listResourceFoldersValidation, asyncHandler(resourceFoldersController.list));
router.get('/:id', resourceFolderIdValidation, asyncHandler(resourceFoldersController.getById));
router.post('/', createResourceFolderValidation, asyncHandler(resourceFoldersController.create));
router.patch('/:id', updateResourceFolderValidation, asyncHandler(resourceFoldersController.update));

export default router;
