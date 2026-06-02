import { jest } from '@jest/globals';
import { resourceFoldersService } from './resource-folders.service.js';
import { resourceFoldersRepository } from './resource-folders.repository.js';
import { groupsRepository } from '../groups/groups.repository.js';
import { ApiError } from '../../utils/ApiError.js';

jest.spyOn(resourceFoldersRepository, 'findMany').mockResolvedValue([]);
jest.spyOn(resourceFoldersRepository, 'count').mockResolvedValue(0);
jest.spyOn(resourceFoldersRepository, 'findById').mockResolvedValue(null);
jest.spyOn(resourceFoldersRepository, 'create').mockResolvedValue({});
jest.spyOn(resourceFoldersRepository, 'update').mockResolvedValue({});

jest.spyOn(groupsRepository, 'isMember').mockResolvedValue(null);
jest.spyOn(groupsRepository, 'findById').mockResolvedValue(null);

const mockFolder = {
  id: 'folder1',
  groupId: 'group1',
  name: 'Test Folder',
  createdBy: 'user1'
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('Resource Folders Service', () => {
  describe('list', () => {
    /* UTCIDs: UTCID01, UTCID04, UTCID03, UTCID05 */

    it('UTCID01 - should return paginated list of folders for myGroups', async () => {
      resourceFoldersRepository.findMany.mockResolvedValue([mockFolder]);
      resourceFoldersRepository.count.mockResolvedValue(1);

      const result = await resourceFoldersService.list({ page: 1, limit: 10, myGroups: 'true' }, 'user1');
      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('UTCID01 - should return list by groupId if member', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      resourceFoldersRepository.findMany.mockResolvedValue([mockFolder]);
      resourceFoldersRepository.count.mockResolvedValue(1);

      const result = await resourceFoldersService.list({ page: 1, limit: 10, groupId: 'group1' }, 'user1');
      expect(result.items).toHaveLength(1);
    });

    it('UTCID04 - should throw forbidden if not group member', async () => {
      groupsRepository.isMember.mockResolvedValue(null);
      await expect(resourceFoldersService.list({ groupId: 'group1' }, 'user1')).rejects.toThrow('Must be a group member');
    });

    it('UTCID03 - should throw bad request if missing params', async () => {
      await expect(resourceFoldersService.list({}, 'user1')).rejects.toThrow('groupId or myGroups is required');
    });

    it('UTCID05 - should propagate error when findMany fails', async () => {
      resourceFoldersRepository.findMany.mockRejectedValue(new Error('DB error'));
      await expect(resourceFoldersService.list({ myGroups: 'true' }, 'user1')).rejects.toThrow('DB error');
    });
  });

  describe('getById', () => {
    /* UTCIDs: UTCID01, UTCID03, UTCID04 */

    it('UTCID01 - should return folder if member', async () => {
      resourceFoldersRepository.findById.mockResolvedValue(mockFolder);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      const result = await resourceFoldersService.getById('folder1', 'user1');
      expect(result.id).toBe('folder1');
    });

    it('UTCID03 - should throw not found', async () => {
      resourceFoldersRepository.findById.mockResolvedValue(null);
      await expect(resourceFoldersService.getById('folder1', 'user1')).rejects.toThrow('Folder not found');
    });

    it('UTCID04 - should throw forbidden if not member', async () => {
      resourceFoldersRepository.findById.mockResolvedValue(mockFolder);
      groupsRepository.isMember.mockResolvedValue(null);
      await expect(resourceFoldersService.getById('folder1', 'user1')).rejects.toThrow('Must be a group member');
    });
  });

  describe('create', () => {
    /* UTCIDs: UTCID01, UTCID04, UTCID05 */

    it('UTCID01 - should create folder if member', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      resourceFoldersRepository.create.mockResolvedValue(mockFolder);
      const result = await resourceFoldersService.create({ groupId: 'group1', name: 'New Folder' }, 'user1');
      expect(result.id).toBe('folder1');
    });

    it('UTCID04 - should throw forbidden if not member', async () => {
      groupsRepository.isMember.mockResolvedValue(null);
      await expect(resourceFoldersService.create({ groupId: 'group1', name: 'New' }, 'user1')).rejects.toThrow('Must be a group member');
    });

    it('UTCID05 - should propagate error when create fails', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      resourceFoldersRepository.create.mockRejectedValue(new Error('DB error'));
      await expect(resourceFoldersService.create({ groupId: 'group1', name: 'New Folder' }, 'user1')).rejects.toThrow('DB error');
    });
  });

  describe('update', () => {
    /* UTCIDs: UTCID01, UTCID04 */

    it('UTCID01 - should update folder if leader', async () => {
      resourceFoldersRepository.findById.mockResolvedValue(mockFolder);
      groupsRepository.isMember.mockResolvedValue({ role: 'LEADER' });
      groupsRepository.findById.mockResolvedValue({ createdBy: 'user2' });
      resourceFoldersRepository.update.mockResolvedValue({ ...mockFolder, name: 'Updated' });
      
      const result = await resourceFoldersService.update('folder1', { name: 'Updated' }, 'user1');
      expect(result.name).toBe('Updated');
    });

    it('UTCID04 - should throw forbidden if not leader or group creator', async () => {
      resourceFoldersRepository.findById.mockResolvedValue(mockFolder);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      groupsRepository.findById.mockResolvedValue({ createdBy: 'user2' });
      
      await expect(resourceFoldersService.update('folder1', { name: 'Updated' }, 'user1')).rejects.toThrow('Only group leaders can edit folders');
    });
  });
});
