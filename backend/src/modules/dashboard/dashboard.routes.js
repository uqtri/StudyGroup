import { Router } from 'express';
import { param } from 'express-validator';
import { dashboardController } from './dashboard.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { ROLES } from '../../constants/roles.js';

const router = Router();

router.use(authenticate);
router.get('/stats', asyncHandler(dashboardController.getStats));
router.get(
  '/groups/:groupId/stats',
  authorize(ROLES.ADMIN),
  [param('groupId').isUUID()],
  asyncHandler(dashboardController.getGroupStats),
);

export default router;
