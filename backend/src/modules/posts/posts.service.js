import { postsRepository } from './posts.repository.js';
import { groupsRepository } from '../groups/groups.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPaginatedResult, parsePagination } from '../../utils/pagination.js';
import { attachVoteMeta, computeVoteScore, sortByVoteScore } from '../../utils/voteHelpers.js';

const mapPost = (post, userId) => {
  const withVotes = attachVoteMeta(post, userId);
  return {
    ...withVotes,
    commentCount: post._count?.comments ?? 0,
    isEdited: Boolean(post.editedAt),
  };
};

export const postsService = {
  list: async (query, userId) => {
    const { page, limit, skip } = parsePagination(query);
    const where = {};
    if (query.groupId) where.groupId = query.groupId;
    if (query.myGroups === 'true' && userId) {
      where.group = { members: { some: { userId, deletedAt: null } } };
    }

    const sortBy = query.sortBy === 'votes' ? 'votes' : 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

    let items;
    let total;

    if (sortBy === 'votes') {
      const all = await postsRepository.findManyForVoteSort({ where, userId });
      const mapped = all.map((p) => mapPost(p, userId));
      const sorted = sortByVoteScore(mapped, sortOrder);
      total = sorted.length;
      items = sorted.slice(skip, skip + limit);
    } else {
      const orderBy = { createdAt: sortOrder };
      [items, total] = await Promise.all([
        postsRepository.findMany({ where, skip, take: limit, orderBy, userId }),
        postsRepository.count(where),
      ]);
      items = items.map((p) => mapPost(p, userId));
    }

    return buildPaginatedResult(items, total, { page, limit });
  },

  getById: async (id, userId) => {
    const post = await postsRepository.findById(id);
    if (!post) throw ApiError.notFound('Post not found');
    return mapPost(post, userId);
  },

  create: async (data, userId) => {
    const membership = await groupsRepository.isMember(data.groupId, userId);
    if (!membership) throw ApiError.forbidden('Must be a group member');

    const { attachments = [], groupId, title, content } = data;
    const post = await postsRepository.create({
      groupId,
      title,
      content,
      authorId: userId,
      attachments,
    });
    return mapPost({ ...post, votes: [], _count: { comments: 0 } }, userId);
  },

  update: async (id, data, userId) => {
    const post = await postsRepository.findById(id);
    if (!post) throw ApiError.notFound('Post not found');
    if (post.authorId !== userId) throw ApiError.forbidden();
    if (!data.title && !data.content) throw ApiError.badRequest('Nothing to update');

    const membership = await groupsRepository.isMember(post.group.id, userId);
    if (!membership) throw ApiError.forbidden('Must be a group member');

    const updated = await postsRepository.update(id, {
      ...data,
      editedAt: new Date(),
    });
    return mapPost({ ...updated, _count: { comments: 0 } }, userId);
  },

  vote: async (id, value, userId) => {
    if (![1, -1].includes(value)) throw ApiError.badRequest('Invalid vote value');

    const post = await postsRepository.findById(id);
    if (!post) throw ApiError.notFound('Post not found');

    const membership = await groupsRepository.isMember(post.group.id, userId);
    if (!membership) throw ApiError.forbidden('Must be a group member');

    const existing = post.votes?.find((v) => v.userId === userId);
    if (existing?.value === value) {
      await postsRepository.removeVote(id, userId);
    } else {
      await postsRepository.upsertVote(id, userId, value);
    }

    const refreshed = await postsRepository.findById(id, userId);
    return {
      voteScore: computeVoteScore(refreshed.votes),
      userVote: existing?.value === value ? null : value,
    };
  },

  remove: async (id, userId) => {
    const post = await postsRepository.findById(id);
    if (!post) throw ApiError.notFound('Post not found');
    if (post.authorId !== userId) throw ApiError.forbidden();
    await postsRepository.softDelete(id);
    return true;
  },
};
