import { prisma } from '../../config/prisma.js';

export const resourcesRepository = {
  findMany: ({ where, skip, take, orderBy }) =>
    prisma.resource.findMany({
      where: { ...where, deletedAt: null },
      skip,
      take,
      orderBy,
      include: {
        group: { select: { id: true, name: true } },
        uploader: { select: { id: true, fullName: true } },
      },
    }),

  count: (where) => prisma.resource.count({ where: { ...where, deletedAt: null } }),

  findById: (id) =>
    prisma.resource.findFirst({
      where: { id, deletedAt: null },
      include: {
        group: { select: { id: true, name: true } },
        uploader: { select: { id: true, fullName: true, email: true } },
      },
    }),

  create: (data) => prisma.resource.create({ data }),

  softDelete: (id) => prisma.resource.update({ where: { id }, data: { deletedAt: new Date() } }),
};
