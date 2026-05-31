import { Router } from 'express';
import { uploadController } from './upload.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/cloudinary-signature', asyncHandler(uploadController.getCloudinarySignature));

export default router;
