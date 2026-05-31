import { resourcesRepository } from './resources.repository.js';
import { groupsRepository } from '../groups/groups.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPaginatedResult, parsePagination, parseSort } from '../../utils/pagination.js';

export const resourcesService = {
  list: async (query, userId) => {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = parseSort(query, ['createdAt', 'title'], 'createdAt');
    const where = {};

    if (query.groupId) where.groupId = query.groupId;
    if (query.myGroups === 'true') {
      where.group = { members: { some: { userId, deletedAt: null } } };
    }

    const [items, total] = await Promise.all([
      resourcesRepository.findMany({ where, skip, take: limit, orderBy }),
      resourcesRepository.count(where),
    ]);

    return buildPaginatedResult(items, total, { page, limit });
  },

  getById: async (id) => {
    const resource = await resourcesRepository.findById(id);
    if (!resource) throw ApiError.notFound('Resource not found');
    return resource;
  },

  create: async (data, userId) => {
    const membership = await groupsRepository.isMember(data.groupId, userId);
    if (!membership) throw ApiError.forbidden('Must be a group member');
    return resourcesRepository.create({ ...data, uploadedBy: userId });
  },

  remove: async (id, userId) => {
    const resource = await resourcesRepository.findById(id);
    if (!resource) throw ApiError.notFound('Resource not found');
    if (resource.uploadedBy !== userId) throw ApiError.forbidden();
    await resourcesRepository.softDelete(id);
    return true;
  },
};
