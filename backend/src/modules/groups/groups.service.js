import { groupsRepository } from './groups.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPaginatedResult, parsePagination, parseSort } from '../../utils/pagination.js';

export const groupsService = {
  list: async (query, userId) => {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = parseSort(query, ['createdAt', 'name', 'subject'], 'createdAt');
    const where = { status: query.status || 'ACTIVE' };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.myGroups === 'true' && userId) {
      where.members = { some: { userId, deletedAt: null } };
    }

    const [items, total] = await Promise.all([
      groupsRepository.findMany({ where, skip, take: limit, orderBy }),
      groupsRepository.count(where),
    ]);

    return buildPaginatedResult(items, total, { page, limit });
  },

  getById: async (id) => {
    const group = await groupsRepository.findById(id);
    if (!group) throw ApiError.notFound('Group not found');
    return group;
  },

  create: async (data, userId) => {
    return groupsRepository.create({
      ...data,
      createdBy: userId,
      members: {
        create: { userId, role: 'LEADER' },
      },
    });
  },

  update: async (id, data, userId) => {
    const membership = await groupsRepository.isMember(id, userId);
    if (!membership || membership.role !== 'LEADER') {
      throw ApiError.forbidden('Only group leaders can update');
    }
    return groupsRepository.update(id, data);
  },

  remove: async (id, userId, isAdmin) => {
    const group = await groupsRepository.findById(id);
    if (!group) throw ApiError.notFound('Group not found');
    if (!isAdmin && group.createdBy !== userId) {
      throw ApiError.forbidden();
    }
    await groupsRepository.softDelete(id);
    return true;
  },

  requestJoin: async (groupId, userId) => {
    const group = await groupsRepository.findById(groupId);
    if (!group) throw ApiError.notFound('Group not found');

    const existing = await groupsRepository.isMember(groupId, userId);
    if (existing) throw ApiError.conflict('Already a member');

    const pending = await groupsRepository.findJoinRequest(groupId, userId);
    if (pending) throw ApiError.conflict('Join request already pending');

    if (group.members?.length >= group.maxMembers) {
      throw ApiError.badRequest('Group is full');
    }

    return groupsRepository.createJoinRequest({ groupId, userId });
  },

  handleJoinRequest: async (requestId, status, userId) => {
    const request = await groupsRepository.findJoinRequestById(requestId);
    if (!request) throw ApiError.notFound('Join request not found');

    const membership = await groupsRepository.isMember(request.groupId, userId);
    if (!membership || membership.role !== 'LEADER') {
      throw ApiError.forbidden();
    }

    const updated = await groupsRepository.updateJoinRequest(requestId, status);
    if (status === 'APPROVED') {
      await groupsRepository.addMember({
        groupId: request.groupId,
        userId: request.userId,
        role: 'MEMBER',
      });
    }
    return updated;
  },
};
