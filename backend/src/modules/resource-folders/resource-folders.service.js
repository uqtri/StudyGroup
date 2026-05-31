import { resourceFoldersRepository } from './resource-folders.repository.js';
import { groupsRepository } from '../groups/groups.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPaginatedResult, parsePagination } from '../../utils/pagination.js';

export const resourceFoldersService = {
  list: async (query, userId) => {
    if (!query.groupId) throw ApiError.badRequest('groupId is required');

    const membership = await groupsRepository.isMember(query.groupId, userId);
    if (!membership) throw ApiError.forbidden('Must be a group member');

    const { page, limit, skip } = parsePagination(query);

    const where = { groupId: query.groupId };

    const [items, total] = await Promise.all([
      resourceFoldersRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      resourceFoldersRepository.count(where),
    ]);

    return buildPaginatedResult(items, total, { page, limit });
  },

  getById: async (id, userId) => {
    const folder = await resourceFoldersRepository.findById(id);
    if (!folder) throw ApiError.notFound('Folder not found');

    const membership = await groupsRepository.isMember(folder.groupId, userId);
    if (!membership) throw ApiError.forbidden('Must be a group member');

    return folder;
  },

  create: async (data, userId) => {
    const membership = await groupsRepository.isMember(data.groupId, userId);
    if (!membership) throw ApiError.forbidden('Must be a group member');

    return resourceFoldersRepository.create({
      groupId: data.groupId,
      name: data.name,
      description: data.description?.trim() || null,
      createdBy: userId,
    });
  },

  update: async (id, data, userId) => {
    const folder = await resourceFoldersRepository.findById(id);
    if (!folder) throw ApiError.notFound('Folder not found');

    const membership = await groupsRepository.isMember(folder.groupId, userId);
    if (!membership) throw ApiError.forbidden('Must be a group member');

    const group = await groupsRepository.findById(folder.groupId);
    const isLeader = group?.createdBy === userId || membership?.role === 'LEADER';
    if (!isLeader) throw ApiError.forbidden('Only group leaders can edit folders');

    const payload = {};
    if (data.name !== undefined) payload.name = data.name.trim();
    if (data.description !== undefined) {
      payload.description = data.description?.trim() || null;
    }

    return resourceFoldersRepository.update(id, payload);
  },
};
