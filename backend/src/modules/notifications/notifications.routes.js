import { Router } from 'express';
import { notificationsController } from './notifications.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { param } from 'express-validator';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(notificationsController.list));
router.get('/unread-count', asyncHandler(notificationsController.unreadCount));
router.patch('/read-all', asyncHandler(notificationsController.markAllRead));
router.patch('/:id/read', [param('id').isUUID()], asyncHandler(notificationsController.markRead));

export default router;
