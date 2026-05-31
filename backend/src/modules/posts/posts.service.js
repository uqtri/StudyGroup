import { postsRepository } from './posts.repository.js';
import { groupsRepository } from '../groups/groups.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPaginatedResult, parsePagination, parseSort } from '../../utils/pagination.js';

export const postsService = {
  list: async (query) => {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = parseSort(query, ['createdAt', 'title'], 'createdAt');
    const where = {};
    if (query.groupId) where.groupId = query.groupId;

    const [items, total] = await Promise.all([
      postsRepository.findMany({ where, skip, take: limit, orderBy }),
      postsRepository.count(where),
    ]);

    return buildPaginatedResult(items, total, { page, limit });
  },

  getById: async (id) => {
    const post = await postsRepository.findById(id);
    if (!post) throw ApiError.notFound('Post not found');
    return post;
  },

  create: async (data, userId) => {
    const membership = await groupsRepository.isMember(data.groupId, userId);
    if (!membership) throw ApiError.forbidden('Must be a group member');
    return postsRepository.create({ ...data, authorId: userId });
  },

  remove: async (id, userId) => {
    const post = await postsRepository.findById(id);
    if (!post) throw ApiError.notFound('Post not found');
    if (post.authorId !== userId) throw ApiError.forbidden();
    await postsRepository.softDelete(id);
    return true;
  },
};
