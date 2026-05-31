import { prisma } from '../../config/prisma.js';

export const postsRepository = {
  findMany: ({ where, skip, take, orderBy }) =>
    prisma.post.findMany({
      where: { ...where, deletedAt: null },
      skip,
      take,
      orderBy,
      include: {
        author: { select: { id: true, fullName: true, avatar: true } },
        _count: { select: { comments: true } },
      },
    }),

  count: (where) => prisma.post.count({ where: { ...where, deletedAt: null } }),

  findById: (id) =>
    prisma.post.findFirst({
      where: { id, deletedAt: null },
      include: {
        author: { select: { id: true, fullName: true, avatar: true } },
        comments: {
          where: { deletedAt: null, parentCommentId: null },
          include: {
            author: { select: { id: true, fullName: true } },
            replies: {
              where: { deletedAt: null },
              include: { author: { select: { id: true, fullName: true } } },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    }),

  create: (data) => prisma.post.create({ data }),

  softDelete: (id) => prisma.post.update({ where: { id }, data: { deletedAt: new Date() } }),
};
