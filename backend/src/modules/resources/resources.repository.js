import { prisma } from '../../config/prisma.js';

const resourceInclude = (userId) => ({
  group: { select: { id: true, name: true } },
  folder: { select: { id: true, name: true } },
  uploader: { select: { id: true, fullName: true, avatar: true } },
  _count: { select: { ratings: true } },
  ...(userId
    ? { ratings: { where: { userId }, select: { id: true } } }
    : {}),
});

const mapResource = (resource) => ({
  ...resource,
  starCount: resource._count?.ratings ?? 0,
  starredByMe: (resource.ratings?.length ?? 0) > 0,
  _count: undefined,
  ratings: undefined,
});

export const resourcesRepository = {
  findMany: ({ where, skip, take, userId }) =>
    prisma.resource
      .findMany({
        where: { ...where, deletedAt: null },
        skip,
        take,
        orderBy: [{ ratings: { _count: 'desc' } }, { createdAt: 'desc' }],
        include: resourceInclude(userId),
      })
      .then((items) => items.map(mapResource)),

  count: (where) => prisma.resource.count({ where: { ...where, deletedAt: null } }),

  findById: (id, userId) =>
    prisma.resource
      .findFirst({
        where: { id, deletedAt: null },
        include: {
          ...resourceInclude(userId),
          uploader: { select: { id: true, fullName: true, email: true, avatar: true } },
        },
      })
      .then((resource) => (resource ? mapResource(resource) : null)),

  create: (data) =>
    prisma.resource.create({
      data,
      include: resourceInclude(data.uploadedBy),
    }).then(mapResource),

  softDelete: (id) => prisma.resource.update({ where: { id }, data: { deletedAt: new Date() } }),

  findRating: (resourceId, userId) =>
    prisma.resourceRating.findUnique({
      where: { resourceId_userId: { resourceId, userId } },
    }),

  createRating: (resourceId, userId) =>
    prisma.resourceRating.create({ data: { resourceId, userId } }),

  deleteRating: (resourceId, userId) =>
    prisma.resourceRating.delete({
      where: { resourceId_userId: { resourceId, userId } },
    }),
};
