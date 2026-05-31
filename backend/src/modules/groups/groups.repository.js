import { prisma } from '../../config/prisma.js';

export const groupsRepository = {
  findMany: ({ where, skip, take, orderBy }) =>
    prisma.studyGroup.findMany({
      where: { ...where, deletedAt: null },
      skip,
      take,
      orderBy,
      include: {
        creator: { select: { id: true, fullName: true, email: true } },
        _count: { select: { members: true, sessions: true } },
      },
    }),

  count: (where) => prisma.studyGroup.count({ where: { ...where, deletedAt: null } }),

  findById: (id) =>
    prisma.studyGroup.findFirst({
      where: { id, deletedAt: null },
      include: {
        creator: { select: { id: true, fullName: true, email: true, avatar: true } },
        members: {
          where: { deletedAt: null },
          include: { user: { select: { id: true, fullName: true, email: true, avatar: true } } },
        },
        joinRequests: {
          where: { status: 'PENDING' },
          include: { user: { select: { id: true, fullName: true, email: true, avatar: true } } },
        },
        _count: { select: { sessions: true, resources: true, posts: true } },
      },
    }),

  create: (data) =>
    prisma.studyGroup.create({
      data,
      include: {
        creator: { select: { id: true, fullName: true } },
        members: { include: { user: { select: { id: true, fullName: true } } } },
      },
    }),

  update: (id, data) => prisma.studyGroup.update({ where: { id }, data }),

  softDelete: (id) =>
    prisma.studyGroup.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'DELETED' },
    }),

  isMember: (groupId, userId) =>
    prisma.groupMember.findFirst({
      where: { groupId, userId, deletedAt: null },
    }),

  addMember: (data) => prisma.groupMember.create({ data }),

  createJoinRequest: (data) => prisma.joinRequest.create({ data }),

  updateJoinRequest: (id, status) => prisma.joinRequest.update({ where: { id }, data: { status } }),

  findJoinRequest: (groupId, userId) =>
    prisma.joinRequest.findUnique({ where: { groupId_userId: { groupId, userId } } }),

  findJoinRequestById: (id) =>
    prisma.joinRequest.findUnique({
      where: { id },
      include: { user: { select: { id: true, fullName: true } } },
    }),

  deleteJoinRequest: (id) => prisma.joinRequest.delete({ where: { id } }),
};
