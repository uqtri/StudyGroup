import { prisma } from '../../config/prisma.js';

export const resourceFoldersRepository = {
  findMany: ({ where, skip, take, orderBy }) =>
    prisma.resourceFolder.findMany({
      where: { ...where, deletedAt: null },
      skip,
      take,
      orderBy,
      include: {
        creator: { select: { id: true, fullName: true } },
        group: { select: { id: true, name: true } },
        _count: { select: { resources: { where: { deletedAt: null } } } },
      },
    }),

  count: (where) =>
    prisma.resourceFolder.count({ where: { ...where, deletedAt: null } }),

  findById: (id) =>
    prisma.resourceFolder.findFirst({
      where: { id, deletedAt: null },
      include: {
        creator: { select: { id: true, fullName: true } },
        group: { select: { id: true, name: true } },
        _count: { select: { resources: { where: { deletedAt: null } } } },
      },
    }),

  create: (data) =>
    prisma.resourceFolder.create({
      data,
      include: {
        creator: { select: { id: true, fullName: true } },
        _count: { select: { resources: { where: { deletedAt: null } } } },
      },
    }),

  update: (id, data) =>
    prisma.resourceFolder.update({
      where: { id },
      data,
      include: {
        creator: { select: { id: true, fullName: true } },
        group: { select: { id: true, name: true } },
        _count: { select: { resources: { where: { deletedAt: null } } } },
      },
    }),
};
