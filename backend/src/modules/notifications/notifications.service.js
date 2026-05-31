import { notificationsRepository } from './notifications.repository.js';
import { buildPaginatedResult, parsePagination } from '../../utils/pagination.js';

export const notificationsService = {
  list: async (userId, query) => {
    const { page, limit, skip } = parsePagination(query);
    const where = {};
    if (query.unread === 'true') where.isRead = false;

    const [items, total] = await Promise.all([
      notificationsRepository.findMany(userId, { skip, take: limit, where }),
      notificationsRepository.count(userId, where),
    ]);

    return buildPaginatedResult(items, total, { page, limit });
  },

  getUnreadCount: (userId) =>
    notificationsRepository.count(userId, { isRead: false }),

  markRead: (id, userId) => notificationsRepository.markRead(id, userId),

  markAllRead: (userId) => notificationsRepository.markAllRead(userId),

  notifyUsers: async (userIds, { title, message, link }) => {
    if (!userIds.length) return 0;

    const data = userIds.map((userId) => ({ userId, title, message, link: link || null }));
    await notificationsRepository.createMany(data);
    return data.length;
  },
};
