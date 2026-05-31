import { resourcesRepository } from './resources.repository.js';
import { resourceFoldersRepository } from '../resource-folders/resource-folders.repository.js';
import { groupsRepository } from '../groups/groups.repository.js';
import { notificationsService } from '../notifications/notifications.service.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPaginatedResult, parsePagination } from '../../utils/pagination.js';

const assertMember = async (groupId, userId) => {
  const membership = await groupsRepository.isMember(groupId, userId);
  if (!membership) throw ApiError.forbidden('Must be a group member');
  return membership;
};

const isGroupLeader = async (groupId, userId, membership) => {
  const group = await groupsRepository.findById(groupId);
  return group?.createdBy === userId || membership?.role === 'LEADER';
};

export const resourcesService = {
  list: async (query, userId) => {
    const { page, limit, skip } = parsePagination(query);
    const where = {};

    if (query.groupId) where.groupId = query.groupId;
    if (query.folderId) where.folderId = query.folderId;
    if (query.myGroups === 'true') {
      where.group = { members: { some: { userId, deletedAt: null } } };
    }

    if (query.folderId) {
      const folder = await resourceFoldersRepository.findById(query.folderId);
      if (!folder) throw ApiError.notFound('Folder not found');
      await assertMember(folder.groupId, userId);
    } else if (query.groupId) {
      await assertMember(query.groupId, userId);
    }

    const [items, total] = await Promise.all([
      resourcesRepository.findMany({ where, skip, take: limit, userId }),
      resourcesRepository.count(where),
    ]);

    return buildPaginatedResult(items, total, { page, limit });
  },

  getById: async (id, userId) => {
    const resource = await resourcesRepository.findById(id, userId);
    if (!resource) throw ApiError.notFound('Resource not found');
    await assertMember(resource.groupId, userId);
    return resource;
  },

  create: async (data, userId) => {
    await assertMember(data.groupId, userId);

    const folder = await resourceFoldersRepository.findById(data.folderId);
    if (!folder || folder.groupId !== data.groupId) {
      throw ApiError.badRequest('Invalid folder for this group');
    }

    return resourcesRepository.create({ ...data, uploadedBy: userId });
  },

  remove: async (id, userId) => {
    const resource = await resourcesRepository.findById(id);
    if (!resource) throw ApiError.notFound('Resource not found');

    const membership = await assertMember(resource.groupId, userId);
    const isUploader = resource.uploadedBy === userId;
    const isLeader = await isGroupLeader(resource.groupId, userId, membership);

    if (!isUploader && !isLeader) throw ApiError.forbidden();

    await resourcesRepository.softDelete(id);

    if (isLeader && !isUploader) {
      await notificationsService.notifyUsers([resource.uploadedBy], {
        title: 'Resource deleted',
        message: `Your file "${resource.title}" was removed by a group leader.`,
        link: `/groups/${resource.groupId}`,
      });
    }

    return true;
  },

  toggleStar: async (id, userId) => {
    const resource = await resourcesRepository.findById(id);
    if (!resource) throw ApiError.notFound('Resource not found');

    await assertMember(resource.groupId, userId);

    const existing = await resourcesRepository.findRating(id, userId);

    if (existing) {
      await resourcesRepository.deleteRating(id, userId);
      return { starred: false };
    }

    await resourcesRepository.createRating(id, userId);
    return { starred: true };
  },
};
