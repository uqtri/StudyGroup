import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sessionsService } from '../../../src/modules/sessions/sessions.service.js';
import { sessionsRepository } from '../../../src/modules/sessions/sessions.repository.js';
import { groupsRepository } from '../../../src/modules/groups/groups.repository.js';
import { userId, groupId, sessionId, mockSession } from '../../helpers/fixtures.js';

vi.mock('../../../src/modules/sessions/sessions.repository.js', () => ({
  sessionsRepository: {
    findMany: vi.fn(),
    count: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
  },
}));

vi.mock('../../../src/modules/groups/groups.repository.js', () => ({
  groupsRepository: {
    isMember: vi.fn(),
    getMemberUserIds: vi.fn(),
  },
}));

vi.mock('../../../src/modules/notifications/notifications.service.js', () => ({
  notificationsService: { notifyUsers: vi.fn().mockResolvedValue(1) },
}));

vi.mock('../../../src/utils/livekit.js', () => ({
  isLiveKitConfigured: vi.fn(() => true),
  createLiveKitToken: vi.fn().mockResolvedValue('livekit-jwt-token'),
  getLiveKitUrl: vi.fn(() => 'wss://livekit.example.com'),
  deleteLiveKitRoom: vi.fn().mockResolvedValue(undefined),
}));

import {
  createLiveKitToken,
  deleteLiveKitRoom,
  isLiveKitConfigured,
} from '../../../src/utils/livekit.js';
import { notificationsService } from '../../../src/modules/notifications/notifications.service.js';

describe('Video call (sessionsService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
    isLiveKitConfigured.mockReturnValue(true);
  });

  describe('Tạo phòng video call', () => {
    it('creates instant session when startNow is true', async () => {
      sessionsRepository.create.mockResolvedValue({
        ...mockSession,
        status: 'IN_PROGRESS',
      });

      const result = await sessionsService.create(
        { groupId, title: 'Quick call', startNow: true },
        userId,
      );

      expect(sessionsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          groupId,
          title: 'Quick call',
          status: 'IN_PROGRESS',
          createdBy: userId,
        }),
      );
      expect(result.status).toBe('IN_PROGRESS');
    });

    it('requires end time for scheduled sessions', async () => {
      await expect(
        sessionsService.create({
          groupId,
          title: 'Later',
          startNow: false,
          startTime: '2026-06-01T10:00:00.000Z',
        }),
        userId,
      ).rejects.toMatchObject({
        statusCode: 400,
        message: 'End time is required for scheduled sessions',
      });
    });

    it('forbids non-members from creating session', async () => {
      groupsRepository.isMember.mockResolvedValue(null);

      await expect(
        sessionsService.create({ groupId, title: 'x', startNow: true }, userId),
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('creates scheduled session when end time provided', async () => {
      sessionsRepository.create.mockResolvedValue({
        ...mockSession,
        status: 'SCHEDULED',
      });

      const result = await sessionsService.create(
        {
          groupId,
          title: 'Later',
          startNow: false,
          startTime: '2026-06-01T10:00:00.000Z',
          endTime: '2026-06-01T11:00:00.000Z',
        },
        userId,
      );

      expect(sessionsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'SCHEDULED' }),
      );
      expect(result.status).toBe('SCHEDULED');
    });
  });

  describe('Xem danh sách phiên học', () => {
    it('list returns paginated sessions', async () => {
      sessionsRepository.findMany.mockResolvedValue([mockSession]);
      sessionsRepository.count.mockResolvedValue(1);

      const result = await sessionsService.list({}, userId);

      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('Cập nhật phiên học', () => {
    it('creator can update session', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      sessionsRepository.update.mockResolvedValue({ ...mockSession, title: 'Updated' });

      const result = await sessionsService.update(sessionId, { title: 'Updated' }, userId);

      expect(sessionsRepository.update).toHaveBeenCalledWith(sessionId, { title: 'Updated' });
      expect(result.title).toBe('Updated');
    });
  });

  describe('Thông báo phiên học', () => {
    it('notifyMembers sends notifications to group members except creator', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      groupsRepository.getMemberUserIds.mockResolvedValue([userId, 'user-2', 'user-3']);
      notificationsService.notifyUsers.mockImplementation(async (ids) => ids.length);

      const result = await sessionsService.notifyMembers(sessionId, userId);

      expect(notificationsService.notifyUsers).toHaveBeenCalledWith(
        ['user-2', 'user-3'],
        expect.objectContaining({ title: expect.stringContaining('Session') }),
      );
      expect(result.notified).toBe(2);
    });
  });

  describe('Xóa phiên học', () => {
    it('creator can remove session and livekit room', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      sessionsRepository.softDelete.mockResolvedValue({});

      await sessionsService.remove(sessionId, userId);

      expect(deleteLiveKitRoom).toHaveBeenCalledWith(sessionId);
      expect(sessionsRepository.softDelete).toHaveBeenCalledWith(sessionId);
    });

    it('forbids non-creator from removing', async () => {
      sessionsRepository.findById.mockResolvedValue({
        ...mockSession,
        createdBy: 'other-user',
      });

      await expect(sessionsService.remove(sessionId, userId)).rejects.toMatchObject({
        statusCode: 403,
      });
    });
  });

  describe('Validate phòng (xem chi tiết session)', () => {
    it('getById returns session when exists', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);

      const session = await sessionsService.getById(sessionId);

      expect(session.id).toBe(sessionId);
      expect(session.title).toBe('Weekly call');
    });

    it('getById throws when session not found', async () => {
      sessionsRepository.findById.mockResolvedValue(null);

      await expect(sessionsService.getById('missing')).rejects.toMatchObject({
        statusCode: 404,
        message: 'Session not found',
      });
    });
  });

  describe('Tham gia video call', () => {
    it('issues LiveKit token for in-progress session', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);

      const result = await sessionsService.getLiveKitToken(sessionId, userId, 'Alice');

      expect(createLiveKitToken).toHaveBeenCalledWith({
        roomName: sessionId,
        participantName: 'Alice',
        participantId: userId,
      });
      expect(result).toEqual({
        token: 'livekit-jwt-token',
        serverUrl: 'wss://livekit.example.com',
        roomName: sessionId,
      });
    });

    it('rejects join when session is not in progress', async () => {
      sessionsRepository.findById.mockResolvedValue({
        ...mockSession,
        status: 'SCHEDULED',
      });

      await expect(
        sessionsService.getLiveKitToken(sessionId, userId, 'Alice'),
      ).rejects.toMatchObject({
        statusCode: 400,
        message: 'Session is not in progress',
      });
    });

    it('rejects join when user is not a group member', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      groupsRepository.isMember.mockResolvedValue(null);

      await expect(
        sessionsService.getLiveKitToken(sessionId, userId, 'Alice'),
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('fails when LiveKit is not configured', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      isLiveKitConfigured.mockReturnValue(false);

      await expect(
        sessionsService.getLiveKitToken(sessionId, userId, 'Alice'),
      ).rejects.toMatchObject({
        statusCode: 500,
        message: 'LiveKit is not configured on the server',
      });
    });
  });

  describe('Kết thúc video call', () => {
    it('ends live session and deletes LiveKit room', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      sessionsRepository.update.mockResolvedValue({
        ...mockSession,
        status: 'COMPLETED',
      });

      const result = await sessionsService.end(sessionId, userId);

      expect(sessionsRepository.update).toHaveBeenCalledWith(
        sessionId,
        expect.objectContaining({ status: 'COMPLETED' }),
      );
      expect(deleteLiveKitRoom).toHaveBeenCalledWith(sessionId);
      expect(result.status).toBe('COMPLETED');
    });

    it('rejects ending already completed session', async () => {
      sessionsRepository.findById.mockResolvedValue({
        ...mockSession,
        status: 'COMPLETED',
      });

      await expect(sessionsService.end(sessionId, userId)).rejects.toMatchObject({
        statusCode: 400,
        message: 'Session is already ended',
      });
    });

    it('forbids non-creator non-leader from ending session', async () => {
      sessionsRepository.findById.mockResolvedValue({
        ...mockSession,
        createdBy: 'other-user',
      });
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });

      await expect(sessionsService.end(sessionId, userId)).rejects.toMatchObject({
        statusCode: 403,
      });
    });
  });
});
