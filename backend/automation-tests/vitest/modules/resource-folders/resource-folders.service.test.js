import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resourceFoldersService } from '../../../../src/modules/resource-folders/resource-folders.service.js';
import { resourceFoldersRepository } from '../../../../src/modules/resource-folders/resource-folders.repository.js';
import { groupsRepository } from '../../../../src/modules/groups/groups.repository.js';
import { userId, groupId, folderId, mockFolder } from '../../../helpers/fixtures.js';

vi.mock('../../../../src/modules/resource-folders/resource-folders.repository.js', () => ({
  resourceFoldersRepository: {
    findMany: vi.fn(),
    count: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../../../../src/modules/groups/groups.repository.js', () => ({
  groupsRepository: {
    isMember: vi.fn(),
    findById: vi.fn(),
  },
}));

describe('Chỉnh sửa tài liệu – thư mục (resourceFoldersService)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('leader can update folder name and description', async () => {
    resourceFoldersRepository.findById.mockResolvedValue(mockFolder);
    groupsRepository.isMember.mockResolvedValue({ role: 'LEADER' });
    groupsRepository.findById.mockResolvedValue({ createdBy: userId });
    resourceFoldersRepository.update.mockResolvedValue({
      ...mockFolder,
      name: 'Week 2',
      description: 'Updated',
    });

    const result = await resourceFoldersService.update(
      folderId,
      { name: 'Week 2', description: 'Updated' },
      userId,
    );

    expect(resourceFoldersRepository.update).toHaveBeenCalledWith(folderId, {
      name: 'Week 2',
      description: 'Updated',
    });
    expect(result.name).toBe('Week 2');
  });

  it('forbids regular member from editing folder', async () => {
    resourceFoldersRepository.findById.mockResolvedValue(mockFolder);
    groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
    groupsRepository.findById.mockResolvedValue({ createdBy: 'other-user' });

    await expect(
      resourceFoldersService.update(folderId, { name: 'Hack' }, userId),
    ).rejects.toMatchObject({ statusCode: 403, message: 'Only group leaders can edit folders' });
  });

  describe('Tạo thư mục', () => {
    it('member can create folder in group', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      resourceFoldersRepository.create.mockResolvedValue(mockFolder);

      const result = await resourceFoldersService.create(
        { groupId, name: 'Week 2', description: 'Notes' },
        userId,
      );

      expect(resourceFoldersRepository.create).toHaveBeenCalledWith({
        groupId,
        name: 'Week 2',
        description: 'Notes',
        createdBy: userId,
      });
      expect(result.id).toBe(folderId);
    });
  });

  describe('Xem danh sách thư mục', () => {
    it('list returns folders for group member', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      resourceFoldersRepository.findMany.mockResolvedValue([mockFolder]);
      resourceFoldersRepository.count.mockResolvedValue(1);

      const result = await resourceFoldersService.list({ groupId }, userId);

      expect(result.items).toHaveLength(1);
    });

    it('list throws when groupId and myGroups missing', async () => {
      await expect(resourceFoldersService.list({}, userId)).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });

  describe('Xem chi tiết thư mục', () => {
    it('getById returns folder for member', async () => {
      resourceFoldersRepository.findById.mockResolvedValue(mockFolder);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });

      const result = await resourceFoldersService.getById(folderId, userId);

      expect(result.name).toBe('Week 1');
    });

    it('getById throws when folder not found', async () => {
      resourceFoldersRepository.findById.mockResolvedValue(null);

      await expect(resourceFoldersService.getById('missing', userId)).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });
});
