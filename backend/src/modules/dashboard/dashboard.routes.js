import { Router } from 'express';
import { dashboardController } from './dashboard.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/stats', asyncHandler(dashboardController.getStats));

export default router;
