import { sessionsRepository } from './sessions.repository.js';
import { groupsRepository } from '../groups/groups.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPaginatedResult, parsePagination, parseSort } from '../../utils/pagination.js';

export const sessionsService = {
  list: async (query, userId) => {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = parseSort(query, ['startTime', 'createdAt', 'title'], 'startTime');
    const where = { deletedAt: null };

    if (query.groupId) where.groupId = query.groupId;
    if (query.status) where.status = query.status;
    if (query.upcoming === 'true') {
      where.startTime = { gte: new Date() };
      where.status = 'SCHEDULED';
    }
    if (query.mySessions === 'true' && userId) {
      where.group = { members: { some: { userId, deletedAt: null } } };
    }

    const [items, total] = await Promise.all([
      sessionsRepository.findMany({ where, skip, take: limit, orderBy }),
      sessionsRepository.count(where),
    ]);

    return buildPaginatedResult(items, total, { page, limit });
  },

  getById: async (id) => {
    const session = await sessionsRepository.findById(id);
    if (!session) throw ApiError.notFound('Session not found');
    return session;
  },

  create: async (data, userId) => {
    const membership = await groupsRepository.isMember(data.groupId, userId);
    if (!membership) throw ApiError.forbidden('Must be a group member');

    return sessionsRepository.create({ ...data, createdBy: userId });
  },

  update: async (id, data, userId) => {
    const session = await sessionsRepository.findById(id);
    if (!session) throw ApiError.notFound('Session not found');
    if (session.createdBy !== userId) {
      const membership = await groupsRepository.isMember(session.groupId, userId);
      if (!membership || membership.role !== 'LEADER') {
        throw ApiError.forbidden();
      }
    }
    return sessionsRepository.update(id, data);
  },

  remove: async (id, userId) => {
    const session = await sessionsRepository.findById(id);
    if (!session) throw ApiError.notFound('Session not found');
    if (session.createdBy !== userId) throw ApiError.forbidden();
    await sessionsRepository.softDelete(id);
    return true;
  },
};
