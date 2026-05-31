import { notificationsService } from './notifications.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { validate } from '../../utils/validationHandler.js';

export const notificationsController = {
  list: async (req, res) => {
    const data = await notificationsService.list(req.user.id, req.query);
    ApiResponse.success(res, { message: 'Notifications retrieved', data });
  },

  unreadCount: async (req, res) => {
    const count = await notificationsService.getUnreadCount(req.user.id);
    ApiResponse.success(res, { message: 'Unread count retrieved', data: { count } });
  },

  markRead: async (req, res) => {
    validate(req);
    await notificationsService.markRead(req.params.id, req.user.id);
    ApiResponse.success(res, { message: 'Notification marked as read', data: null });
  },

  markAllRead: async (req, res) => {
    await notificationsService.markAllRead(req.user.id);
    ApiResponse.success(res, { message: 'All notifications marked as read', data: null });
  },
};
