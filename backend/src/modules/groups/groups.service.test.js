import { jest } from '@jest/globals';
import { groupsService } from './groups.service.js';
import { groupsRepository } from './groups.repository.js';
import { notificationsService } from '../notifications/notifications.service.js';
import { ApiError } from '../../utils/ApiError.js';

jest.spyOn(groupsRepository, 'findMany').mockResolvedValue([]);
jest.spyOn(groupsRepository, 'count').mockResolvedValue(0);
jest.spyOn(groupsRepository, 'findById').mockResolvedValue(null);
jest.spyOn(groupsRepository, 'create').mockResolvedValue({});
jest.spyOn(groupsRepository, 'update').mockResolvedValue({});
jest.spyOn(groupsRepository, 'softDelete').mockResolvedValue(true);
jest.spyOn(groupsRepository, 'isMember').mockResolvedValue(null);
jest.spyOn(groupsRepository, 'createJoinRequest').mockResolvedValue({});
jest.spyOn(groupsRepository, 'findJoinRequest').mockResolvedValue(null);
jest.spyOn(groupsRepository, 'findJoinRequestById').mockResolvedValue(null);
jest.spyOn(groupsRepository, 'updateJoinRequest').mockResolvedValue({});
jest.spyOn(groupsRepository, 'addMember').mockResolvedValue(true);
jest.spyOn(groupsRepository, 'deleteJoinRequest').mockResolvedValue(true);
jest.spyOn(notificationsService, 'notifyUsers').mockResolvedValue(true);

const mockGroup = {
  id: 1,
  name: 'Test Group',
  subject: 'Math',
  status: 'ACTIVE',
  maxMembers: 10,
  createdBy: 1,
  members: [{ userId: 1, role: 'LEADER' }],
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('Groups Service', () => {
  describe('list', () => {
    /* UTCIDs: UTCID01, UTCID05 */

    it('UTCID01 - should return paginated list of groups', async () => {
      groupsRepository.findMany.mockResolvedValue([mockGroup]);
      groupsRepository.count.mockResolvedValue(1);

      const result = await groupsService.list({ page: 1, limit: 10 }, 1, false);
      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(groupsRepository.findMany).toHaveBeenCalled();
    });

    it('UTCID05 - should propagate error when findMany fails', async () => {
      groupsRepository.findMany.mockRejectedValue(new Error('DB query failed'));
      groupsRepository.count.mockResolvedValue(0);

      await expect(groupsService.list({ page: 1, limit: 10 }, 1, false)).rejects.toThrow('DB query failed');
    });
  });

  describe('getById', () => {
    /* UTCIDs: UTCID01, UTCID07, UTCID06 */

    it('UTCID01 - should return group with join requests if user is leader', async () => {
      groupsRepository.findById.mockResolvedValue({ ...mockGroup, joinRequests: [] });
      const result = await groupsService.getById(1, 1, false);
      expect(result.joinRequests).toBeDefined();
    });

    it('UTCID01 - should not return join requests if user is not leader', async () => {
      groupsRepository.findById.mockResolvedValue({ ...mockGroup, joinRequests: [] });
      const result = await groupsService.getById(1, 2, false); // User 2 is not leader
      expect(result.joinRequests).toBeUndefined();
    });

    it('UTCID07 - should throw not found if group archived and not admin', async () => {
      groupsRepository.findById.mockResolvedValue({ ...mockGroup, status: 'ARCHIVED' });
      await expect(groupsService.getById(1, 1, false)).rejects.toThrow('Group not found');
    });

    it('UTCID06 - should return group if archived and user is admin', async () => {
      groupsRepository.findById.mockResolvedValue({ ...mockGroup, status: 'ARCHIVED' });
      const result = await groupsService.getById(1, 1, true); // isAdmin = true
      expect(result.status).toBe('ARCHIVED');
    });
  });

  describe('create', () => {
    /* UTCIDs: UTCID01, UTCID05 */

    it('UTCID01 - should create a group', async () => {
      groupsRepository.create.mockResolvedValue(mockGroup);
      const result = await groupsService.create({ name: 'New' }, 1);
      expect(result.name).toBe('Test Group');
      expect(groupsRepository.create).toHaveBeenCalled();
    });

    it('UTCID05 - should propagate error when create fails', async () => {
      groupsRepository.create.mockRejectedValue(new Error('DB write failed'));
      await expect(groupsService.create({ name: 'New' }, 1)).rejects.toThrow('DB write failed');
    });
  });

  describe('update', () => {
    /* UTCIDs: UTCID01, UTCID04 */

    it('UTCID01 - should update group if leader', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'LEADER' });
      groupsRepository.update.mockResolvedValue({ ...mockGroup, name: 'Updated' });
      const result = await groupsService.update(1, { name: 'Updated' }, 1);
      expect(result.name).toBe('Updated');
    });

    it('UTCID04 - should throw forbidden if not leader', async () => {
      groupsRepository.isMember.mockResolvedValue(null);
      await expect(groupsService.update(1, { name: 'Updated' }, 2)).rejects.toThrow('Only group leaders can update');
    });
  });

  describe('remove', () => {
    /* UTCIDs: UTCID01, UTCID04 */

    it('UTCID01 - should soft delete if creator', async () => {
      groupsRepository.findById.mockResolvedValue(mockGroup); // createdBy: 1
      groupsRepository.softDelete.mockResolvedValue(true);
      await groupsService.remove(1, 1, false);
      expect(groupsRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('UTCID01 - should soft delete if admin (even if not creator)', async () => {
      groupsRepository.findById.mockResolvedValue(mockGroup); // createdBy: 1
      groupsRepository.softDelete.mockResolvedValue(true);
      await groupsService.remove(1, 2, true); // userId: 2, isAdmin: true
      expect(groupsRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('UTCID04 - should throw forbidden if not creator and not admin', async () => {
      groupsRepository.findById.mockResolvedValue(mockGroup); // createdBy: 1
      await expect(groupsService.remove(1, 2, false)).rejects.toThrow(ApiError);
    });
  });

  describe('requestJoin', () => {
    /* UTCIDs: UTCID01, UTCID03, UTCID06 */

    it('UTCID01 - should create join request', async () => {
      groupsRepository.findById.mockResolvedValue(mockGroup);
      groupsRepository.isMember.mockResolvedValue(null);
      groupsRepository.findJoinRequest.mockResolvedValue(null);
      groupsRepository.createJoinRequest.mockResolvedValue({ id: 1 });

      const result = await groupsService.requestJoin(1, 2);
      expect(result.id).toBe(1);
    });

    it('UTCID03 - should throw if group not ACTIVE', async () => {
      groupsRepository.findById.mockResolvedValue({ ...mockGroup, status: 'ARCHIVED' });
      await expect(groupsService.requestJoin(1, 2)).rejects.toThrow('This group is not accepting members');
    });

    it('UTCID06 - should throw if already member', async () => {
      groupsRepository.findById.mockResolvedValue(mockGroup);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      await expect(groupsService.requestJoin(1, 2)).rejects.toThrow('Already a member');
    });

    it('UTCID03 - should throw if group full', async () => {
      groupsRepository.findById.mockResolvedValue({ ...mockGroup, maxMembers: 1, members: [1] });
      groupsRepository.isMember.mockResolvedValue(null);
      groupsRepository.findJoinRequest.mockResolvedValue(null);
      await expect(groupsService.requestJoin(1, 2)).rejects.toThrow('Group is full');
    });
  });

  describe('handleJoinRequest', () => {
    /* UTCIDs: UTCID01, UTCID06, UTCID04 */

    it('UTCID01 - should approve and add member', async () => {
      groupsRepository.findJoinRequestById.mockResolvedValue({ id: 1, status: 'PENDING', groupId: 1, userId: 2 });
      groupsRepository.isMember.mockResolvedValue({ role: 'LEADER' }); // Requester is leader
      groupsRepository.updateJoinRequest.mockResolvedValue({ id: 1, status: 'APPROVED' });
      groupsRepository.addMember.mockResolvedValue(true);

      const result = await groupsService.handleJoinRequest(1, 'APPROVED', 1);
      expect(result.status).toBe('APPROVED');
      expect(groupsRepository.addMember).toHaveBeenCalledWith({ groupId: 1, userId: 2, role: 'MEMBER' });
    });

    it('UTCID06 - should reject without adding member', async () => {
      groupsRepository.findJoinRequestById.mockResolvedValue({ id: 1, status: 'PENDING', groupId: 1, userId: 2 });
      groupsRepository.isMember.mockResolvedValue({ role: 'LEADER' }); // Requester is leader
      groupsRepository.updateJoinRequest.mockResolvedValue({ id: 1, status: 'REJECTED' });

      const result = await groupsService.handleJoinRequest(1, 'REJECTED', 1);
      expect(result.status).toBe('REJECTED');
      expect(groupsRepository.addMember).not.toHaveBeenCalled();
    });

    it('UTCID04 - should throw forbidden if not leader', async () => {
      groupsRepository.findJoinRequestById.mockResolvedValue({ id: 1, status: 'PENDING', groupId: 1, userId: 2 });
      groupsRepository.isMember.mockResolvedValue(null); // Requester not leader
      await expect(groupsService.handleJoinRequest(1, 'APPROVED', 3)).rejects.toThrow(ApiError);
    });
  });

  describe('cancelJoinRequest', () => {
    /* UTCIDs: UTCID01, UTCID03 */

    it('UTCID01 - should delete join request', async () => {
      groupsRepository.findJoinRequest.mockResolvedValue({ id: 1, status: 'PENDING' });
      groupsRepository.deleteJoinRequest.mockResolvedValue(true);
      await groupsService.cancelJoinRequest(1, 2);
      expect(groupsRepository.deleteJoinRequest).toHaveBeenCalledWith(1);
    });

    it('UTCID03 - should throw if not pending', async () => {
      groupsRepository.findJoinRequest.mockResolvedValue({ id: 1, status: 'APPROVED' });
      await expect(groupsService.cancelJoinRequest(1, 2)).rejects.toThrow('Only pending join requests can be cancelled');
    });
  });

  describe('setStatus', () => {
    /* UTCIDs: UTCID01, UTCID04 */

    it('UTCID01 - should update status and notify users', async () => {
      groupsRepository.findById.mockResolvedValue(mockGroup);
      groupsRepository.update.mockResolvedValue({ ...mockGroup, status: 'ARCHIVED' });
      
      const result = await groupsService.setStatus(1, 'ARCHIVED', true); // isAdmin: true
      expect(result.status).toBe('ARCHIVED');
      expect(notificationsService.notifyUsers).toHaveBeenCalled();
    });

    it('UTCID04 - should throw forbidden if not admin', async () => {
      await expect(groupsService.setStatus(1, 'ARCHIVED', false)).rejects.toThrow(ApiError);
    });
  });
});
