import { jest } from '@jest/globals';
import { postsService } from '../../../../src/modules/posts/posts.service.js';
import { postsRepository } from '../../../../src/modules/posts/posts.repository.js';
import { groupsRepository } from '../../../../src/modules/groups/groups.repository.js';

jest.spyOn(postsRepository, 'findMany').mockResolvedValue([]);
jest.spyOn(postsRepository, 'findManyForVoteSort').mockResolvedValue([]);
jest.spyOn(postsRepository, 'count').mockResolvedValue(0);
jest.spyOn(postsRepository, 'findById').mockResolvedValue(null);
jest.spyOn(postsRepository, 'create').mockResolvedValue({});
jest.spyOn(postsRepository, 'update').mockResolvedValue({});
jest.spyOn(postsRepository, 'softDelete').mockResolvedValue(true);
jest.spyOn(postsRepository, 'upsertVote').mockResolvedValue({});
jest.spyOn(postsRepository, 'removeVote').mockResolvedValue({});

jest.spyOn(groupsRepository, 'isMember').mockResolvedValue(null);

const mockPost = {
  id: 'post1',
  groupId: 'group1',
  title: 'Test Post',
  authorId: 'user1',
  group: { id: 'group1' },
  votes: [{ userId: 'user2', value: 1 }],
  _count: { comments: 2 }
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('Posts Service', () => {
  describe('list', () => {
    /* UTCIDs: UTCID01, UTCID02, UTCID05 */

    it('UTCID01 - should list posts ordered by createdAt', async () => {
      postsRepository.findMany.mockResolvedValue([mockPost]);
      postsRepository.count.mockResolvedValue(1);

      const result = await postsService.list({ page: 1, limit: 10, sortBy: 'createdAt' }, 'user1');
      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('UTCID02 - should list posts ordered by votes', async () => {
      postsRepository.findManyForVoteSort.mockResolvedValue([mockPost]);

      const result = await postsService.list({ page: 1, limit: 10, sortBy: 'votes' }, 'user1');
      expect(result.items).toHaveLength(1);
    });

    it('UTCID05 - should propagate error when findMany fails', async () => {
      postsRepository.findMany.mockRejectedValue(new Error('DB error'));
      await expect(postsService.list({ page: 1, limit: 10, sortBy: 'createdAt' }, 'user1')).rejects.toThrow('DB error');
    });
  });

  describe('getById', () => {
    /* UTCIDs: UTCID01, UTCID03 */

    it('UTCID01 - should return post', async () => {
      postsRepository.findById.mockResolvedValue(mockPost);
      const result = await postsService.getById('post1', 'user1');
      expect(result.id).toBe('post1');
      expect(result.commentCount).toBe(2);
    });

    it('UTCID03 - should throw if not found', async () => {
      postsRepository.findById.mockResolvedValue(null);
      await expect(postsService.getById('post1', 'user1')).rejects.toThrow('Post not found');
    });
  });

  describe('create', () => {
    /* UTCIDs: UTCID01, UTCID04, UTCID05 */

    it('UTCID01 - should create post if member', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      postsRepository.create.mockResolvedValue(mockPost);
      
      const result = await postsService.create({ groupId: 'group1', title: 'New', content: 'Content' }, 'user1');
      expect(result.id).toBe('post1');
    });

    it('UTCID04 - should throw if not member', async () => {
      groupsRepository.isMember.mockResolvedValue(null);
      await expect(postsService.create({ groupId: 'group1' }, 'user1')).rejects.toThrow('Must be a group member');
    });

    it('UTCID05 - should propagate error when create fails', async () => {
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      postsRepository.create.mockRejectedValue(new Error('DB error'));
      await expect(postsService.create({ groupId: 'group1', title: 'New', content: 'Content' }, 'user1')).rejects.toThrow('DB error');
    });
  });

  describe('update', () => {
    /* UTCIDs: UTCID01, UTCID04, UTCID03 */

    it('UTCID01 - should update post if author and member', async () => {
      postsRepository.findById.mockResolvedValue(mockPost); // authorId: 'user1'
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      postsRepository.update.mockResolvedValue({ ...mockPost, title: 'Updated' });

      const result = await postsService.update('post1', { title: 'Updated' }, 'user1');
      expect(result.title).toBe('Updated');
    });

    it('UTCID04 - should throw if not author', async () => {
      postsRepository.findById.mockResolvedValue(mockPost);
      await expect(postsService.update('post1', { title: 'Updated' }, 'user2')).rejects.toThrow();
    });

    it('UTCID03 - should throw if nothing to update', async () => {
      postsRepository.findById.mockResolvedValue(mockPost);
      await expect(postsService.update('post1', {}, 'user1')).rejects.toThrow('Nothing to update');
    });
  });

  describe('vote', () => {
    /* UTCIDs: UTCID01, UTCID02 */

    it('UTCID01 - should add upvote if no vote exists', async () => {
      postsRepository.findById.mockResolvedValue(mockPost).mockResolvedValueOnce(mockPost).mockResolvedValueOnce({ ...mockPost, votes: [{ userId: 'user3', value: 1 }] });
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      
      const result = await postsService.vote('post1', 1, 'user3');
      expect(postsRepository.upsertVote).toHaveBeenCalled();
      expect(result.voteScore).toBe(1);
    });

    it('UTCID02 - should remove vote if clicking same vote again', async () => {
      postsRepository.findById.mockResolvedValue(mockPost).mockResolvedValueOnce(mockPost).mockResolvedValueOnce({ ...mockPost, votes: [] });
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      
      const result = await postsService.vote('post1', 1, 'user2'); // user2 already upvoted
      expect(postsRepository.removeVote).toHaveBeenCalled();
      expect(result.voteScore).toBe(0);
    });
  });

  describe('remove', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should remove if author', async () => {
      postsRepository.findById.mockResolvedValue(mockPost);
      await postsService.remove('post1', 'user1');
      expect(postsRepository.softDelete).toHaveBeenCalledWith('post1');
    });
  });
});
