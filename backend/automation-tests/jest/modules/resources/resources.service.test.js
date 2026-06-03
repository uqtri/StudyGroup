import { jest } from '@jest/globals';
import { resourcesService } from '../../../../src/modules/resources/resources.service.js';
import { resourcesRepository } from '../../../../src/modules/resources/resources.repository.js';
import { resourceFoldersRepository } from '../../../../src/modules/resource-folders/resource-folders.repository.js';
import { groupsRepository } from '../../../../src/modules/groups/groups.repository.js';
import { notificationsService } from '../../../../src/modules/notifications/notifications.service.js';

jest.spyOn(resourcesRepository, 'findMany').mockResolvedValue([]);
jest.spyOn(resourcesRepository, 'count').mockResolvedValue(0);
jest.spyOn(resourcesRepository, 'findById').mockResolvedValue(null);
jest.spyOn(resourcesRepository, 'create').mockResolvedValue({});
jest.spyOn(resourcesRepository, 'softDelete').mockResolvedValue(true);
jest.spyOn(resourcesRepository, 'findRating').mockResolvedValue(null);
jest.spyOn(resourcesRepository, 'deleteRating').mockResolvedValue(true);
jest.spyOn(resourcesRepository, 'createRating').mockResolvedValue(true);

jest.spyOn(resourceFoldersRepository, 'findById').mockResolvedValue(null);
jest.spyOn(groupsRepository, 'isMember').mockResolvedValue(null);
jest.spyOn(groupsRepository, 'findById').mockResolvedValue(null);
jest.spyOn(notificationsService, 'notifyUsers').mockResolvedValue(0);

const mockResource = {
  id: 'res1',
  groupId: 'group1',
  folderId: 'folder1',
  title: 'Test Res',
  uploadedBy: 'user1'
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('Resources Service', () => {
  describe('list', () => {
    /* UTCIDs: UTCID01, UTCID05 */

    it('UTCID01 - should list resources in group if member', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      resourcesRepository.findMany.mockResolvedValue([mockResource]);
      resourcesRepository.count.mockResolvedValue(1);

      const result = await resourcesService.list({ page: 1, limit: 10, groupId: 'group1' }, 'user1');
      expect(result.items).toHaveLength(1);
    });

    it('UTCID01 - should list resources in folder if member', async () => {
      resourceFoldersRepository.findById.mockResolvedValue({ groupId: 'group1' });
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      resourcesRepository.findMany.mockResolvedValue([mockResource]);

      const result = await resourcesService.list({ folderId: 'folder1' }, 'user1');
      expect(result.items).toHaveLength(1);
    });

    it('UTCID03 - should throw if folder not found', async () => {
      resourceFoldersRepository.findById.mockResolvedValue(null);
      await expect(resourcesService.list({ folderId: 'folder1' }, 'user1')).rejects.toThrow('Folder not found');
    });

    it('UTCID04 - should throw if not group member', async () => {
      groupsRepository.isMember.mockResolvedValue(null);
      await expect(resourcesService.list({ groupId: 'group1' }, 'user1')).rejects.toThrow('Must be a group member');
    });

    it('UTCID05 - should propagate error when findMany fails', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      resourcesRepository.findMany.mockRejectedValue(new Error('DB query failed'));
      resourcesRepository.count.mockResolvedValue(0);

      await expect(resourcesService.list({ groupId: 'group1' }, 'user1')).rejects.toThrow('DB query failed');
    });
  });

  describe('getById', () => {
    /* UTCIDs: UTCID01, UTCID03 */

    it('UTCID01 - should return resource if member', async () => {
      resourcesRepository.findById.mockResolvedValue(mockResource);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      
      const result = await resourcesService.getById('res1', 'user1');
      expect(result.id).toBe('res1');
    });

    it('UTCID03 - should throw if resource not found', async () => {
      resourcesRepository.findById.mockResolvedValue(null);
      await expect(resourcesService.getById('res1', 'user1')).rejects.toThrow('Resource not found');
    });
  });

  describe('create', () => {
    /* UTCIDs: UTCID01, UTCID03, UTCID05 */

    it('UTCID01 - should create resource', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      resourceFoldersRepository.findById.mockResolvedValue({ groupId: 'group1' });
      resourcesRepository.create.mockResolvedValue(mockResource);

      const result = await resourcesService.create({ groupId: 'group1', folderId: 'folder1', title: 'Test' }, 'user1');
      expect(result.id).toBe('res1');
    });

    it('UTCID03 - should throw if folder belongs to different group', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      resourceFoldersRepository.findById.mockResolvedValue({ groupId: 'group2' }); // Mismatch

      await expect(resourcesService.create({ groupId: 'group1', folderId: 'folder1' }, 'user1')).rejects.toThrow('Invalid folder for this group');
    });

    it('UTCID05 - should propagate error when create fails', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      resourceFoldersRepository.findById.mockResolvedValue({ groupId: 'group1' });
      resourcesRepository.create.mockRejectedValue(new Error('DB write failed'));

      await expect(
        resourcesService.create({ groupId: 'group1', folderId: 'folder1', title: 'Test' }, 'user1'),
      ).rejects.toThrow('DB write failed');
    });
  });

  describe('remove', () => {
    /* UTCIDs: UTCID01, UTCID02, UTCID04 */

    it('UTCID01 - should remove if uploader', async () => {
      resourcesRepository.findById.mockResolvedValue(mockResource); // uploadedBy: user1
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      groupsRepository.findById.mockResolvedValue({ createdBy: 'user2' });

      await resourcesService.remove('res1', 'user1');
      expect(resourcesRepository.softDelete).toHaveBeenCalledWith('res1');
    });

    it('UTCID02 - should remove and notify if leader (but not uploader)', async () => {
      resourcesRepository.findById.mockResolvedValue(mockResource); // uploadedBy: user1
      groupsRepository.isMember.mockResolvedValue({ role: 'LEADER' }); // user2 is leader
      groupsRepository.findById.mockResolvedValue({ createdBy: 'user3' });

      await resourcesService.remove('res1', 'user2'); // user2 is leader deleting user1's resource
      expect(resourcesRepository.softDelete).toHaveBeenCalledWith('res1');
      expect(notificationsService.notifyUsers).toHaveBeenCalled();
    });

    it('UTCID04 - should throw if not uploader and not leader', async () => {
      resourcesRepository.findById.mockResolvedValue(mockResource); // uploadedBy: user1
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      groupsRepository.findById.mockResolvedValue({ createdBy: 'user3' });

      await expect(resourcesService.remove('res1', 'user2')).rejects.toThrow();
    });
  });

  describe('toggleStar', () => {
    /* UTCIDs: UTCID01, UTCID02 */

    it('UTCID01 - should add star if not starred', async () => {
      resourcesRepository.findById.mockResolvedValue(mockResource);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      resourcesRepository.findRating.mockResolvedValue(null);

      const result = await resourcesService.toggleStar('res1', 'user1');
      expect(result.starred).toBe(true);
      expect(resourcesRepository.createRating).toHaveBeenCalled();
    });

    it('UTCID02 - should remove star if already starred', async () => {
      resourcesRepository.findById.mockResolvedValue(mockResource);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      resourcesRepository.findRating.mockResolvedValue({ id: 'rating1' });

      const result = await resourcesService.toggleStar('res1', 'user1');
      expect(result.starred).toBe(false);
      expect(resourcesRepository.deleteRating).toHaveBeenCalled();
    });
  });
});
