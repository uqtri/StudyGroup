import { prisma } from '../../config/prisma.js';

const userSelect = {
  id: true,
  email: true,
  fullName: true,
  avatar: true,
  bio: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  roles: { include: { role: true } },
};

export const usersRepository = {
  findMany: ({ where, skip, take, orderBy }) =>
    prisma.user.findMany({
      where: { ...where, deletedAt: null },
      skip,
      take,
      orderBy,
      select: userSelect,
    }),

  count: (where) => prisma.user.count({ where: { ...where, deletedAt: null } }),

  findById: (id) =>
    prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: userSelect,
    }),

  update: (id, data) =>
    prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    }),

  softDelete: (id) =>
    prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    }),
};
