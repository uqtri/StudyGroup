import { Router } from 'express';
import { authController } from './auth.controller.js';
import {
  registerValidation,
  loginValidation,
  refreshValidation,
} from './auth.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerValidation, asyncHandler(authController.register));
router.post('/login', loginValidation, asyncHandler(authController.login));
router.get('/me', authenticate, asyncHandler(authController.me));
router.post('/refresh', refreshValidation, asyncHandler(authController.refresh));
router.post('/logout', authenticate, asyncHandler(authController.logout));

export default router;
