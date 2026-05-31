import { describe, it, expect, vi, beforeEach } from 'vitest';
import { groupsService } from '../../../src/modules/groups/groups.service.js';
import { groupsRepository } from '../../../src/modules/groups/groups.repository.js';
import { notificationsService } from '../../../src/modules/notifications/notifications.service.js';
import { userId, groupId, mockGroup } from '../../helpers/fixtures.js';

vi.mock('../../../src/modules/groups/groups.repository.js', () => ({
  groupsRepository: {
    findMany: vi.fn(),
    count: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    isMember: vi.fn(),
    findJoinRequest: vi.fn(),
    findJoinRequestById: vi.fn(),
    createJoinRequest: vi.fn(),
    updateJoinRequest: vi.fn(),
    addMember: vi.fn(),
    deleteJoinRequest: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
  },
}));

vi.mock('../../../src/modules/notifications/notifications.service.js', () => ({
  notificationsService: { notifyUsers: vi.fn().mockResolvedValue(1) },
}));

describe('Groups', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('Tạo nhóm học', () => {
    it('creates group with creator as leader', async () => {
      groupsRepository.create.mockResolvedValue(mockGroup);

      const result = await groupsService.create(
        { name: 'Math Study', subject: 'Calculus', maxMembers: 50 },
        userId,
      );

      expect(groupsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          createdBy: userId,
          members: { create: { userId, role: 'LEADER' } },
        }),
      );
      expect(result.name).toBe('Math Study');
    });
  });

  describe('Tham gia nhóm', () => {
    it('submits join request when eligible', async () => {
      groupsRepository.findById.mockResolvedValue(mockGroup);
      groupsRepository.isMember.mockResolvedValue(null);
      groupsRepository.findJoinRequest.mockResolvedValue(null);
      groupsRepository.createJoinRequest.mockResolvedValue({
        id: 'req-1',
        groupId,
        userId: 'user-2',
        status: 'PENDING',
      });

      const result = await groupsService.requestJoin(groupId, 'user-2');

      expect(groupsRepository.createJoinRequest).toHaveBeenCalledWith({
        groupId,
        userId: 'user-2',
      });
      expect(result.status).toBe('PENDING');
    });

    it('rejects join when already a member', async () => {
      groupsRepository.findById.mockResolvedValue(mockGroup);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });

      await expect(groupsService.requestJoin(groupId, userId)).rejects.toMatchObject({
        statusCode: 409,
        message: 'Already a member',
      });
    });

    it('rejects join when group is full', async () => {
      groupsRepository.findById.mockResolvedValue({
        ...mockGroup,
        maxMembers: 1,
        members: [{ userId: 'other' }],
      });
      groupsRepository.isMember.mockResolvedValue(null);
      groupsRepository.findJoinRequest.mockResolvedValue(null);

      await expect(groupsService.requestJoin(groupId, 'user-2')).rejects.toMatchObject({
        statusCode: 400,
        message: 'Group is full',
      });
    });
  });

  describe('Xem danh sách nhóm', () => {
    it('returns paginated groups', async () => {
      groupsRepository.findMany.mockResolvedValue([mockGroup]);
      groupsRepository.count.mockResolvedValue(1);

      const result = await groupsService.list({}, userId);

      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('filters to active groups for non-admin', async () => {
      groupsRepository.findMany.mockResolvedValue([]);
      groupsRepository.count.mockResolvedValue(0);

      await groupsService.list({}, userId, false);

      expect(groupsRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'ACTIVE' }),
        }),
      );
    });
  });

  describe('Xem chi tiết nhóm', () => {
    it('returns group details', async () => {
      groupsRepository.findById.mockResolvedValue(mockGroup);
      groupsRepository.findJoinRequest.mockResolvedValue(null);

      const result = await groupsService.getById(groupId, userId);

      expect(result.id).toBe(groupId);
      expect(result.joinRequests).toBeUndefined();
    });

    it('throws when group not found', async () => {
      groupsRepository.findById.mockResolvedValue(null);

      await expect(groupsService.getById('missing', userId)).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('hides archived groups from non-admin', async () => {
      groupsRepository.findById.mockResolvedValue({ ...mockGroup, status: 'ARCHIVED' });

      await expect(groupsService.getById(groupId, userId, false)).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('Cập nhật nhóm', () => {
    it('leader can update group', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'LEADER' });
      groupsRepository.update.mockResolvedValue({ ...mockGroup, name: 'Updated' });

      const result = await groupsService.update(groupId, { name: 'Updated' }, userId);

      expect(groupsRepository.update).toHaveBeenCalledWith(groupId, { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('forbids non-leader from updating', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });

      await expect(
        groupsService.update(groupId, { name: 'Hack' }, userId),
      ).rejects.toMatchObject({
        statusCode: 403,
        message: 'Only group leaders can update',
      });
    });
  });

  describe('Xóa nhóm', () => {
    it('creator can delete group', async () => {
      groupsRepository.findById.mockResolvedValue(mockGroup);
      groupsRepository.softDelete.mockResolvedValue({});

      await groupsService.remove(groupId, userId, false);

      expect(groupsRepository.softDelete).toHaveBeenCalledWith(groupId);
    });

    it('forbids non-creator non-admin from deleting', async () => {
      groupsRepository.findById.mockResolvedValue({ ...mockGroup, createdBy: 'other' });

      await expect(groupsService.remove(groupId, userId, false)).rejects.toMatchObject({
        statusCode: 403,
      });
    });
  });

  describe('Hủy yêu cầu tham gia', () => {
    it('cancelJoinRequest deletes pending request', async () => {
      groupsRepository.findJoinRequest.mockResolvedValue({
        id: 'req-1',
        status: 'PENDING',
      });
      groupsRepository.deleteJoinRequest.mockResolvedValue({});

      await groupsService.cancelJoinRequest(groupId, userId);

      expect(groupsRepository.deleteJoinRequest).toHaveBeenCalledWith('req-1');
    });
  });

  describe('Duyệt yêu cầu tham gia', () => {
    const pendingRequest = {
      id: 'req-1',
      groupId,
      userId: 'user-2',
      status: 'PENDING',
    };

    it('approveJoinRequest adds member when leader approves', async () => {
      groupsRepository.findJoinRequestById.mockResolvedValue(pendingRequest);
      groupsRepository.isMember.mockResolvedValue({ role: 'LEADER' });
      groupsRepository.updateJoinRequest.mockResolvedValue({
        ...pendingRequest,
        status: 'APPROVED',
      });
      groupsRepository.addMember.mockResolvedValue({});

      const result = await groupsService.approveJoinRequest('req-1', userId);

      expect(groupsRepository.addMember).toHaveBeenCalledWith({
        groupId,
        userId: 'user-2',
        role: 'MEMBER',
      });
      expect(result.status).toBe('APPROVED');
    });

    it('rejectJoinRequest does not add member', async () => {
      groupsRepository.findJoinRequestById.mockResolvedValue(pendingRequest);
      groupsRepository.isMember.mockResolvedValue({ role: 'LEADER' });
      groupsRepository.updateJoinRequest.mockResolvedValue({
        ...pendingRequest,
        status: 'REJECTED',
      });

      await groupsService.rejectJoinRequest('req-1', userId);

      expect(groupsRepository.addMember).not.toHaveBeenCalled();
    });
  });

  describe('Quản lý trạng thái nhóm', () => {
    it('setStatus forbids non-admin', async () => {
      await expect(groupsService.setStatus(groupId, 'ARCHIVED', false)).rejects.toMatchObject({
        statusCode: 403,
      });
    });

    it('setStatus updates group and notifies creator', async () => {
      groupsRepository.findById.mockResolvedValue(mockGroup);
      groupsRepository.update.mockResolvedValue({ ...mockGroup, status: 'ARCHIVED' });

      await groupsService.setStatus(groupId, 'ARCHIVED', true);

      expect(groupsRepository.update).toHaveBeenCalledWith(groupId, { status: 'ARCHIVED' });
      expect(notificationsService.notifyUsers).toHaveBeenCalled();
    });
  });
});
