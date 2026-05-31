import { prisma } from '../../config/prisma.js';

const authorSelect = { id: true, fullName: true, avatar: true };

const commentInclude = {
  author: { select: authorSelect },
  votes: { select: { userId: true, value: true } },
  mentions: {
    include: { user: { select: authorSelect } },
  },
};

export const commentsRepository = {
  create: (data, mentionUserIds = []) =>
    prisma.$transaction(async (tx) => {
      const comment = await tx.comment.create({
        data,
        include: {
          author: { select: authorSelect },
          parent: { select: { authorId: true, id: true } },
          post: { select: { groupId: true, id: true, title: true } },
        },
      });

      if (mentionUserIds.length) {
        await tx.commentMention.createMany({
          data: mentionUserIds.map((userId) => ({ commentId: comment.id, userId })),
          skipDuplicates: true,
        });
      }

      return comment;
    }),

  findAllByPostId: (postId) =>
    prisma.comment.findMany({
      where: { postId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
      include: commentInclude,
    }),

  findById: (id) =>
    prisma.comment.findFirst({
      where: { id, deletedAt: null },
      include: {
        author: { select: authorSelect },
        post: { select: { groupId: true, id: true, authorId: true } },
        parent: { select: { authorId: true, id: true } },
      },
    }),

  findByIdDetailed: (id) =>
    prisma.comment.findFirst({
      where: { id, deletedAt: null },
      include: {
        author: { select: authorSelect },
        votes: { select: { userId: true, value: true } },
        mentions: { include: { user: { select: authorSelect } } },
        replies: {
          where: { deletedAt: null },
          include: {
            author: { select: authorSelect },
            votes: { select: { userId: true, value: true } },
            mentions: { include: { user: { select: authorSelect } } },
          },
        },
      },
    }),

  update: (id, data) =>
    prisma.comment.update({
      where: { id },
      data,
      include: {
        author: { select: authorSelect },
        votes: { select: { userId: true, value: true } },
        mentions: { include: { user: { select: authorSelect } } },
      },
    }),

  softDelete: (id) => prisma.comment.update({ where: { id }, data: { deletedAt: new Date() } }),

  upsertVote: (commentId, userId, value) =>
    prisma.commentVote.upsert({
      where: { commentId_userId: { commentId, userId } },
      create: { commentId, userId, value },
      update: { value },
    }),

  removeVote: (commentId, userId) =>
    prisma.commentVote.deleteMany({ where: { commentId, userId } }),
};
