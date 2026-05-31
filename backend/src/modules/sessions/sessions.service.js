import { sessionsRepository } from './sessions.repository.js';
import { groupsRepository } from '../groups/groups.repository.js';
import { notificationsService } from '../notifications/notifications.service.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPaginatedResult, parsePagination, parseSort } from '../../utils/pagination.js';
import {
  createLiveKitToken,
  deleteLiveKitRoom,
  getLiveKitUrl,
  isLiveKitConfigured,
} from '../../utils/livekit.js';

const assertCanManageSession = async (session, userId) => {
  if (session.createdBy === userId) return;
  const membership = await groupsRepository.isMember(session.groupId, userId);
  if (!membership || membership.role !== 'LEADER') {
    throw ApiError.forbidden();
  }
};

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

    const startNow = Boolean(data.startNow);
    const now = new Date();

    const payload = {
      groupId: data.groupId,
      title: data.title,
      description: data.description,
      createdBy: userId,
      startTime: startNow ? now : new Date(data.startTime),
      endTime: startNow ? null : data.endTime ? new Date(data.endTime) : null,
      meetingLink: data.meetingLink,
      status: startNow ? 'IN_PROGRESS' : 'SCHEDULED',
    };

    if (!startNow && !payload.endTime) {
      throw ApiError.badRequest('End time is required for scheduled sessions');
    }

    const session = await sessionsRepository.create(payload);

    if (data.notifyMembers) {
      await sessionsService.notifyMembers(session.id, userId);
    }

    return session;
  },

  update: async (id, data, userId) => {
    const session = await sessionsRepository.findById(id);
    if (!session) throw ApiError.notFound('Session not found');
    await assertCanManageSession(session, userId);
    return sessionsRepository.update(id, data);
  },

  end: async (id, userId) => {
    const session = await sessionsRepository.findById(id);
    if (!session) throw ApiError.notFound('Session not found');
    await assertCanManageSession(session, userId);

    if (session.status === 'COMPLETED' || session.status === 'CANCELLED') {
      throw ApiError.badRequest('Session is already ended');
    }

    const wasLive = session.status === 'IN_PROGRESS';
    const updated = await sessionsRepository.update(id, {
      status: wasLive ? 'COMPLETED' : 'CANCELLED',
      endTime: new Date(),
    });

    if (wasLive) {
      await deleteLiveKitRoom(id);
    }

    return updated;
  },

  notifyMembers: async (id, userId) => {
    const session = await sessionsRepository.findById(id);
    if (!session) throw ApiError.notFound('Session not found');
    await assertCanManageSession(session, userId);

    const members = await groupsRepository.getMemberUserIds(session.groupId);
    const recipientIds = members.filter((memberId) => memberId !== userId);

    const count = await notificationsService.notifyUsers(recipientIds, {
      title: `Session: ${session.title}`,
      message: `You have been notified about the session "${session.title}" in ${session.group?.name || 'your group'}.`,
      link: `/sessions/${session.id}`,
    });

    return { notified: count };
  },

  getLiveKitToken: async (id, userId, userName) => {
    const session = await sessionsRepository.findById(id);
    if (!session) throw ApiError.notFound('Session not found');

    if (session.status !== 'IN_PROGRESS') {
      throw ApiError.badRequest('Session is not in progress');
    }

    const membership = await groupsRepository.isMember(session.groupId, userId);
    if (!membership) throw ApiError.forbidden('Must be a group member to join');

    if (!isLiveKitConfigured()) {
      throw ApiError.internal('LiveKit is not configured on the server');
    }

    const token = await createLiveKitToken({
      roomName: id,
      participantName: userName,
      participantId: userId,
    });

    return { token, serverUrl: getLiveKitUrl(), roomName: id };
  },

  remove: async (id, userId) => {
    const session = await sessionsRepository.findById(id);
    if (!session) throw ApiError.notFound('Session not found');
    if (session.createdBy !== userId) throw ApiError.forbidden();
    await deleteLiveKitRoom(id);
    await sessionsRepository.softDelete(id);
    return true;
  },
};
