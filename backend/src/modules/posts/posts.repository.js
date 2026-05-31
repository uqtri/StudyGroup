import { prisma } from '../../config/prisma.js';

const authorSelect = { id: true, fullName: true, avatar: true };
const votesInclude = { votes: { select: { userId: true, value: true } } };
const attachmentsInclude = {
  attachments: { orderBy: { sortOrder: 'asc' } },
};

export const postsRepository = {
  findMany: ({ where, skip, take, orderBy }) =>
    prisma.post.findMany({
      where: { ...where, deletedAt: null },
      skip,
      take,
      orderBy,
      include: {
        author: { select: authorSelect },
        group: { select: { id: true, name: true } },
        ...votesInclude,
        ...attachmentsInclude,
        _count: { select: { comments: { where: { deletedAt: null } } } },
      },
    }),

  findManyForVoteSort: ({ where, skip, take, userId }) =>
    prisma.post.findMany({
      where: { ...where, deletedAt: null },
      skip,
      take: 500,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: authorSelect },
        group: { select: { id: true, name: true } },
        votes: { select: { userId: true, value: true } },
        ...attachmentsInclude,
        _count: { select: { comments: { where: { deletedAt: null } } } },
      },
    }),

  count: (where) => prisma.post.count({ where: { ...where, deletedAt: null } }),

  findById: (id) =>
    prisma.post.findFirst({
      where: { id, deletedAt: null },
      include: {
        author: { select: authorSelect },
        votes: { select: { userId: true, value: true } },
        ...attachmentsInclude,
        group: { select: { id: true } },
        _count: { select: { comments: { where: { deletedAt: null } } } },
      },
    }),

  create: ({ attachments = [], ...data }) =>
    prisma.post.create({
      data: {
        ...data,
        attachments: attachments.length
          ? {
              create: attachments.map((file, index) => ({
                fileUrl: file.fileUrl,
                fileName: file.fileName,
                fileType: file.fileType,
                fileSize: file.fileSize ?? null,
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        author: { select: authorSelect },
        ...attachmentsInclude,
      },
    }),

  update: (id, data) =>
    prisma.post.update({
      where: { id },
      data,
      include: {
        author: { select: authorSelect },
        votes: { select: { userId: true, value: true } },
        ...attachmentsInclude,
      },
    }),

  softDelete: (id) => prisma.post.update({ where: { id }, data: { deletedAt: new Date() } }),

  upsertVote: (postId, userId, value) =>
    prisma.postVote.upsert({
      where: { postId_userId: { postId, userId } },
      create: { postId, userId, value },
      update: { value },
    }),

  removeVote: (postId, userId) =>
    prisma.postVote.deleteMany({ where: { postId, userId } }),
};
