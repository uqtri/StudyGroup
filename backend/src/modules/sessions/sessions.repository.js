import { prisma } from '../../config/prisma.js';

export const sessionsRepository = {
  findMany: ({ where, skip, take, orderBy }) =>
    prisma.studySession.findMany({
      where: { ...where, deletedAt: null },
      skip,
      take,
      orderBy,
      include: {
        group: { select: { id: true, name: true, subject: true } },
        creator: { select: { id: true, fullName: true } },
        _count: { select: { attendances: true } },
      },
    }),

  count: (where) => prisma.studySession.count({ where: { ...where, deletedAt: null } }),

  findById: (id) =>
    prisma.studySession.findFirst({
      where: { id, deletedAt: null },
      include: {
        group: { select: { id: true, name: true } },
        creator: { select: { id: true, fullName: true, email: true } },
        attendances: {
          include: { user: { select: { id: true, fullName: true, email: true } } },
        },
      },
    }),

  create: (data) => prisma.studySession.create({ data }),

  update: (id, data) => prisma.studySession.update({ where: { id }, data }),

  softDelete: (id) =>
    prisma.studySession.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'CANCELLED' },
    }),
};
