import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resourcesService } from '../../../../src/modules/resources/resources.service.js';
import { resourcesRepository } from '../../../../src/modules/resources/resources.repository.js';
import { resourceFoldersRepository } from '../../../../src/modules/resource-folders/resource-folders.repository.js';
import { groupsRepository } from '../../../../src/modules/groups/groups.repository.js';
import { userId, groupId, resourceId, folderId, mockResource, mockFolder } from '../../../helpers/fixtures.js';

vi.mock('../../../../src/modules/resources/resources.repository.js', () => ({
  resourcesRepository: {
    findMany: vi.fn(),
    count: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    softDelete: vi.fn(),
    findRating: vi.fn(),
    deleteRating: vi.fn(),
    createRating: vi.fn(),
  },
}));

vi.mock('../../../../src/modules/resource-folders/resource-folders.repository.js', () => ({
  resourceFoldersRepository: { findById: vi.fn() },
}));

vi.mock('../../../../src/modules/groups/groups.repository.js', () => ({
  groupsRepository: {
    isMember: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock('../../../../src/modules/notifications/notifications.service.js', () => ({
  notificationsService: { notifyUsers: vi.fn().mockResolvedValue(1) },
}));

describe('Tài liệu (resourcesService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
  });

  describe('Tạo tài liệu', () => {
    it('creates resource when user is member and folder is valid', async () => {
      resourceFoldersRepository.findById.mockResolvedValue(mockFolder);
      resourcesRepository.create.mockResolvedValue(mockResource);

      const result = await resourcesService.create(
        { groupId, folderId, title: 'Lecture notes.pdf', fileUrl: 'https://cdn/file.pdf' },
        userId,
      );

      expect(resourcesRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ uploadedBy: userId, title: 'Lecture notes.pdf' }),
      );
      expect(result.id).toBe(resourceId);
    });

    it('rejects invalid folder for group', async () => {
      resourceFoldersRepository.findById.mockResolvedValue({ ...mockFolder, groupId: 'other-group' });

      await expect(
        resourcesService.create({ groupId, folderId, title: 'x' }, userId),
      ).rejects.toMatchObject({ statusCode: 400, message: 'Invalid folder for this group' });
    });

    it('forbids non-members', async () => {
      groupsRepository.isMember.mockResolvedValue(null);

      await expect(
        resourcesService.create({ groupId, folderId, title: 'x' }, userId),
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  describe('Xem danh sách tài liệu', () => {
    it('returns paginated resources for group', async () => {
      resourcesRepository.findMany.mockResolvedValue([mockResource]);
      resourcesRepository.count.mockResolvedValue(1);

      const result = await resourcesService.list({ groupId }, userId);

      expect(result.items).toHaveLength(1);
      expect(groupsRepository.isMember).toHaveBeenCalledWith(groupId, userId);
    });
  });

  describe('Xem chi tiết tài liệu', () => {
    it('returns resource when member', async () => {
      resourcesRepository.findById.mockResolvedValue(mockResource);

      const result = await resourcesService.getById(resourceId, userId);

      expect(result.title).toBe('Lecture notes.pdf');
    });

    it('throws when resource not found', async () => {
      resourcesRepository.findById.mockResolvedValue(null);

      await expect(resourcesService.getById('missing', userId)).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('Xóa tài liệu', () => {
    it('allows uploader to delete own resource', async () => {
      resourcesRepository.findById.mockResolvedValue(mockResource);
      resourcesRepository.softDelete.mockResolvedValue({});

      await resourcesService.remove(resourceId, userId);

      expect(resourcesRepository.softDelete).toHaveBeenCalledWith(resourceId);
    });

    it('forbids other members from deleting', async () => {
      resourcesRepository.findById.mockResolvedValue({ ...mockResource, uploadedBy: 'other-user' });
      groupsRepository.findById.mockResolvedValue({ createdBy: 'another' });

      await expect(resourcesService.remove(resourceId, userId)).rejects.toMatchObject({
        statusCode: 403,
      });
    });

    it('allows leader to delete another user resource', async () => {
      resourcesRepository.findById.mockResolvedValue({ ...mockResource, uploadedBy: 'other-user' });
      groupsRepository.isMember.mockResolvedValue({ role: 'LEADER' });
      groupsRepository.findById.mockResolvedValue({ createdBy: userId });
      resourcesRepository.softDelete.mockResolvedValue({});

      await resourcesService.remove(resourceId, userId);

      expect(resourcesRepository.softDelete).toHaveBeenCalledWith(resourceId);
    });
  });

  describe('Đánh dấu sao tài liệu', () => {
    it('toggleStar creates rating when not starred', async () => {
      resourcesRepository.findById.mockResolvedValue(mockResource);
      resourcesRepository.findRating.mockResolvedValue(null);
      resourcesRepository.createRating.mockResolvedValue({});

      const result = await resourcesService.toggleStar(resourceId, userId);

      expect(resourcesRepository.createRating).toHaveBeenCalledWith(resourceId, userId);
      expect(result.starred).toBe(true);
    });

    it('toggleStar removes rating when already starred', async () => {
      resourcesRepository.findById.mockResolvedValue(mockResource);
      resourcesRepository.findRating.mockResolvedValue({ userId });
      resourcesRepository.deleteRating.mockResolvedValue({});

      const result = await resourcesService.toggleStar(resourceId, userId);

      expect(resourcesRepository.deleteRating).toHaveBeenCalledWith(resourceId, userId);
      expect(result.starred).toBe(false);
    });
  });
});
