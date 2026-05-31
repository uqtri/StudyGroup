import { Router } from 'express';
import { reportsController } from './reports.controller.js';
import { createReportValidation, updateReportValidation } from './reports.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { ROLES } from '../../constants/roles.js';

const router = Router();

router.use(authenticate);

router.post('/', createReportValidation, asyncHandler(reportsController.create));
router.get('/', authorize(ROLES.ADMIN), asyncHandler(reportsController.list));
router.patch(
  '/:id',
  authorize(ROLES.ADMIN),
  updateReportValidation,
  asyncHandler(reportsController.updateStatus),
);

export default router;
