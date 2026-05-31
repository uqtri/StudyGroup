import { prisma } from '../../config/prisma.js';

export const reportsRepository = {
  findMany: ({ where, skip, take, orderBy }) =>
    prisma.report.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        reporter: { select: { id: true, fullName: true, email: true } },
      },
    }),

  count: (where) => prisma.report.count({ where }),

  create: (data) => prisma.report.create({ data }),

  update: (id, data) => prisma.report.update({ where: { id }, data }),
};
