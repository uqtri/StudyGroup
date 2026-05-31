import { notificationsRepository } from './notifications.repository.js';
import { buildPaginatedResult, parsePagination } from '../../utils/pagination.js';

export const notificationsService = {
  list: async (userId, query) => {
    const { page, limit, skip } = parsePagination(query);
    const where = {};
    if (query.unread === 'true') where.isRead = false;

    const [items, total] = await Promise.all([
      notificationsRepository.findMany(userId, { skip, take: limit }),
      notificationsRepository.count(userId, where),
    ]);

    return buildPaginatedResult(items, total, { page, limit });
  },

  markRead: (id, userId) => notificationsRepository.markRead(id, userId),

  markAllRead: (userId) => notificationsRepository.markAllRead(userId),
};
