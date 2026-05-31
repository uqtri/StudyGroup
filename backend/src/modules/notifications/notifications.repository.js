import { prisma } from '../../config/prisma.js';

export const notificationsRepository = {
  findMany: (userId, { skip, take }) =>
    prisma.notification.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),

  count: (userId, where = {}) =>
    prisma.notification.count({ where: { userId, ...where } }),

  markRead: (id, userId) =>
    prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    }),

  markAllRead: (userId) =>
    prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    }),
};
