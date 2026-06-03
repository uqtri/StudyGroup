import { jest } from '@jest/globals';

const mockCreateLiveKitToken = jest.fn().mockResolvedValue('token123');
const mockDeleteLiveKitRoom = jest.fn().mockResolvedValue(true);
const mockGetLiveKitUrl = jest.fn().mockReturnValue('ws://localhost');
const mockIsLiveKitConfigured = jest.fn().mockReturnValue(true);

jest.unstable_mockModule('../../../../src/utils/livekit.js', () => ({
  createLiveKitToken: mockCreateLiveKitToken,
  deleteLiveKitRoom: mockDeleteLiveKitRoom,
  getLiveKitUrl: mockGetLiveKitUrl,
  isLiveKitConfigured: mockIsLiveKitConfigured,
}));

const { sessionsService } = await import('../../../../src/modules/sessions/sessions.service.js');
const { sessionsRepository } = await import('../../../../src/modules/sessions/sessions.repository.js');
const { groupsRepository } = await import('../../../../src/modules/groups/groups.repository.js');
const { notificationsService } = await import('../../../../src/modules/notifications/notifications.service.js');
const { ApiError } = await import('../../../../src/utils/ApiError.js');

jest.spyOn(sessionsRepository, 'findMany').mockResolvedValue([]);
jest.spyOn(sessionsRepository, 'count').mockResolvedValue(0);
jest.spyOn(sessionsRepository, 'findById').mockResolvedValue(null);
jest.spyOn(sessionsRepository, 'create').mockResolvedValue({});
jest.spyOn(sessionsRepository, 'update').mockResolvedValue({});
jest.spyOn(sessionsRepository, 'softDelete').mockResolvedValue(true);

jest.spyOn(groupsRepository, 'isMember').mockResolvedValue(null);
jest.spyOn(groupsRepository, 'getMemberUserIds').mockResolvedValue([]);

jest.spyOn(notificationsService, 'notifyUsers').mockResolvedValue(0);

const mockSession = {
  id: 'sess1',
  groupId: 'group1',
  title: 'Test Session',
  status: 'SCHEDULED',
  createdBy: 'user1',
  group: { name: 'Test Group' }
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('Sessions Service', () => {
  describe('list', () => {
    /* UTCIDs: UTCID01, UTCID05 */

    it('UTCID01 - should return paginated list of sessions', async () => {
      sessionsRepository.findMany.mockResolvedValue([mockSession]);
      sessionsRepository.count.mockResolvedValue(1);

      const result = await sessionsService.list({ page: 1, limit: 10 }, 'user1');
      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('UTCID05 - should propagate error when findMany fails', async () => {
      sessionsRepository.findMany.mockRejectedValue(new Error('DB query failed'));
      sessionsRepository.count.mockResolvedValue(0);

      await expect(sessionsService.list({ page: 1, limit: 10 }, 'user1')).rejects.toThrow('DB query failed');
    });
  });

  describe('getById', () => {
    /* UTCIDs: UTCID01, UTCID03 */

    it('UTCID01 - should return session by id', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      const result = await sessionsService.getById('sess1');
      expect(result.id).toBe('sess1');
    });

    it('UTCID03 - should throw not found', async () => {
      sessionsRepository.findById.mockResolvedValue(null);
      await expect(sessionsService.getById('sess2')).rejects.toThrow('Session not found');
    });
  });

  describe('create', () => {
    /* UTCIDs: UTCID01, UTCID02, UTCID04, UTCID05 */

    it('UTCID01 - should create a scheduled session', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      sessionsRepository.create.mockResolvedValue(mockSession);
      
      const payload = { groupId: 'group1', title: 'Test', startTime: new Date().toISOString(), endTime: new Date(Date.now() + 3600000).toISOString() };
      const result = await sessionsService.create(payload, 'user1');
      
      expect(result.id).toBe('sess1');
      expect(sessionsRepository.create).toHaveBeenCalled();
    });

    it('UTCID01 - should create an immediate session and notify', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      sessionsRepository.create.mockResolvedValue({ ...mockSession, status: 'IN_PROGRESS' });
      sessionsRepository.findById.mockResolvedValue({ ...mockSession, status: 'IN_PROGRESS' });
      
      const payload = { groupId: 'group1', title: 'Test', startNow: true, notifyMembers: true };
      const result = await sessionsService.create(payload, 'user1');
      
      expect(result.status).toBe('IN_PROGRESS');
      expect(notificationsService.notifyUsers).toHaveBeenCalled();
    });

    it('UTCID04 - should throw forbidden if not group member', async () => {
      groupsRepository.isMember.mockResolvedValue(null);
      await expect(sessionsService.create({ groupId: 'group1' }, 'user1')).rejects.toThrow('Must be a group member');
    });

    it('UTCID02 - should throw bad request if scheduled session missing end time', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });

      await expect(
        sessionsService.create(
          {
            groupId: 'group1',
            title: 'Scheduled',
            startTime: new Date().toISOString(),
          },
          'user1',
        ),
      ).rejects.toThrow('End time is required for scheduled sessions');
    });

    it('UTCID05 - should propagate error when create fails', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      sessionsRepository.create.mockRejectedValue(new Error('DB write failed'));

      await expect(
        sessionsService.create({ groupId: 'group1', title: 'Test', startNow: true }, 'user1'),
      ).rejects.toThrow('DB write failed');
    });
  });

  describe('update', () => {
    /* UTCIDs: UTCID01, UTCID04 */

    it('UTCID01 - should update session if creator', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession); // createdBy: 'user1'
      sessionsRepository.update.mockResolvedValue({ ...mockSession, title: 'Updated' });
      
      const result = await sessionsService.update('sess1', { title: 'Updated' }, 'user1');
      expect(result.title).toBe('Updated');
    });

    it('UTCID01 - should update session if leader', async () => {
      sessionsRepository.findById.mockResolvedValue({ ...mockSession, createdBy: 'user2' });
      groupsRepository.isMember.mockResolvedValue({ role: 'LEADER' }); // user1 is leader
      sessionsRepository.update.mockResolvedValue({ ...mockSession, title: 'Updated' });
      
      const result = await sessionsService.update('sess1', { title: 'Updated' }, 'user1');
      expect(result.title).toBe('Updated');
    });

    it('UTCID04 - should throw forbidden if not creator and not leader', async () => {
      sessionsRepository.findById.mockResolvedValue({ ...mockSession, createdBy: 'user2' });
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      
      await expect(sessionsService.update('sess1', { title: 'Updated' }, 'user1')).rejects.toThrow(ApiError);
    });
  });

  describe('end', () => {
    /* UTCIDs: UTCID01, UTCID05, UTCID06 */

    it('UTCID01 - should end session and delete livekit room if live', async () => {
      sessionsRepository.findById.mockResolvedValue({ ...mockSession, status: 'IN_PROGRESS' });
      sessionsRepository.update.mockResolvedValue({ ...mockSession, status: 'COMPLETED' });
      
      const result = await sessionsService.end('sess1', 'user1');
      expect(result.status).toBe('COMPLETED');
      expect(mockDeleteLiveKitRoom).toHaveBeenCalledWith('sess1');
    });

    it('UTCID06 - should cancel scheduled session', async () => {
      sessionsRepository.findById.mockResolvedValue({ ...mockSession, status: 'SCHEDULED' });
      sessionsRepository.update.mockResolvedValue({ ...mockSession, status: 'CANCELLED' });
      
      const result = await sessionsService.end('sess1', 'user1');
      expect(result.status).toBe('CANCELLED');
    });

    it('UTCID05 - should propagate error when deleteLiveKitRoom fails', async () => {
      sessionsRepository.findById.mockResolvedValue({ ...mockSession, status: 'IN_PROGRESS' });
      mockDeleteLiveKitRoom.mockRejectedValueOnce(new Error('LiveKit unavailable'));

      await expect(sessionsService.end('sess1', 'user1')).rejects.toThrow('LiveKit unavailable');
    });
  });

  describe('getLiveKitToken', () => {
    /* UTCIDs: UTCID01, UTCID03, UTCID04, UTCID05 */

    it('UTCID01 - should return token if session is live', async () => {
      sessionsRepository.findById.mockResolvedValue({ ...mockSession, status: 'IN_PROGRESS' });
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      
      const result = await sessionsService.getLiveKitToken('sess1', 'user2', 'Test User 2');
      expect(result.token).toBe('token123');
    });

    it('UTCID03 - should throw if session not in progress', async () => {
      sessionsRepository.findById.mockResolvedValue(mockSession);
      await expect(sessionsService.getLiveKitToken('sess1', 'user2', 'Test')).rejects.toThrow('Session is not in progress');
    });

    it('UTCID04 - should throw if not group member', async () => {
      sessionsRepository.findById.mockResolvedValue({ ...mockSession, status: 'IN_PROGRESS' });
      groupsRepository.isMember.mockResolvedValue(null);
      await expect(sessionsService.getLiveKitToken('sess1', 'user2', 'Test')).rejects.toThrow('Must be a group member to join');
    });

    it('UTCID05 - should propagate error when createLiveKitToken fails', async () => {
      sessionsRepository.findById.mockResolvedValue({ ...mockSession, status: 'IN_PROGRESS' });
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      mockCreateLiveKitToken.mockRejectedValueOnce(new Error('LiveKit token error'));

      await expect(sessionsService.getLiveKitToken('sess1', 'user2', 'Test')).rejects.toThrow('LiveKit token error');
    });
  });

  describe('remove', () => {
    /* UTCIDs: UTCID01, UTCID03, UTCID04, UTCID05 */

    it('UTCID01 - should soft delete session when requester is creator', async () => {
      sessionsRepository.findById.mockResolvedValue({ ...mockSession, createdBy: 'user1' });
      sessionsRepository.softDelete.mockResolvedValue(true);

      const result = await sessionsService.remove('sess1', 'user1');
      expect(result).toBe(true);
      expect(mockDeleteLiveKitRoom).toHaveBeenCalledWith('sess1');
      expect(sessionsRepository.softDelete).toHaveBeenCalledWith('sess1');
    });

    it('UTCID03 - should throw not found when session does not exist', async () => {
      sessionsRepository.findById.mockResolvedValue(null);
      await expect(sessionsService.remove('sess1', 'user1')).rejects.toThrow('Session not found');
    });

    it('UTCID04 - should throw forbidden when requester is not creator', async () => {
      sessionsRepository.findById.mockResolvedValue({ ...mockSession, createdBy: 'user1' });
      await expect(sessionsService.remove('sess1', 'user2')).rejects.toThrow();
    });

    it('UTCID05 - should propagate error when softDelete fails', async () => {
      sessionsRepository.findById.mockResolvedValue({ ...mockSession, createdBy: 'user1' });
      sessionsRepository.softDelete.mockRejectedValue(new Error('DB error'));
      await expect(sessionsService.remove('sess1', 'user1')).rejects.toThrow('DB error');
    });
  });
});
