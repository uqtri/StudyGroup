import { prisma } from '../../config/prisma.js';

export const commentsRepository = {
  create: (data) =>
    prisma.comment.create({
      data,
      include: { author: { select: { id: true, fullName: true } } },
    }),

  softDelete: (id) => prisma.comment.update({ where: { id }, data: { deletedAt: new Date() } }),

  findById: (id) => prisma.comment.findFirst({ where: { id, deletedAt: null } }),
};
