import { jest } from '@jest/globals';
import { commentsService } from './comments.service.js';
import { commentsRepository } from './comments.repository.js';
import { postsRepository } from '../posts/posts.repository.js';
import { groupsRepository } from '../groups/groups.repository.js';
import { notificationsService } from '../notifications/notifications.service.js';

jest.spyOn(commentsRepository, 'create').mockResolvedValue({});
jest.spyOn(commentsRepository, 'findAllByPostId').mockResolvedValue([]);
jest.spyOn(commentsRepository, 'findById').mockResolvedValue(null);
jest.spyOn(commentsRepository, 'findByIdDetailed').mockResolvedValue(null);
jest.spyOn(commentsRepository, 'update').mockResolvedValue({});
jest.spyOn(commentsRepository, 'softDelete').mockResolvedValue(true);
jest.spyOn(commentsRepository, 'upsertVote').mockResolvedValue({});
jest.spyOn(commentsRepository, 'removeVote').mockResolvedValue({});

jest.spyOn(postsRepository, 'findById').mockResolvedValue(null);
jest.spyOn(groupsRepository, 'isMember').mockResolvedValue(null);
jest.spyOn(groupsRepository, 'getMemberUserIds').mockResolvedValue([]);
jest.spyOn(notificationsService, 'notifyUsers').mockResolvedValue(0);

const mockPost = { id: 'post1', group: { id: 'group1' } };
const mockComment = {
  id: 'comment1',
  postId: 'post1',
  authorId: 'user1',
  post: mockPost,
  votes: [],
  mentions: []
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('Comments Service', () => {
  describe('listByPost', () => {
    /* UTCIDs: UTCID01, UTCID03, UTCID04 */

    it('UTCID01 - should return comments tree', async () => {
      postsRepository.findById.mockResolvedValue(mockPost);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      commentsRepository.findAllByPostId.mockResolvedValue([mockComment]);

      const result = await commentsService.listByPost('post1', { sort: 'newest' }, 'user1');
      expect(result).toHaveLength(1);
    });

    it('UTCID03 - should throw if post not found', async () => {
      postsRepository.findById.mockResolvedValue(null);
      await expect(commentsService.listByPost('post1', {}, 'user1')).rejects.toThrow('Post not found');
    });

    it('UTCID04 - should throw if not group member', async () => {
      postsRepository.findById.mockResolvedValue(mockPost);
      groupsRepository.isMember.mockResolvedValue(null);
      await expect(commentsService.listByPost('post1', {}, 'user1')).rejects.toThrow('Must be a group member');
    });
  });

  describe('create', () => {
    /* UTCIDs: UTCID01, UTCID03, UTCID05 */

    it('UTCID01 - should create comment and notify mentions', async () => {
      postsRepository.findById.mockResolvedValue(mockPost);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      groupsRepository.getMemberUserIds.mockResolvedValue(['user1', 'user2']);
      commentsRepository.create.mockResolvedValue(mockComment);
      commentsRepository.findByIdDetailed.mockResolvedValue(mockComment);

      const result = await commentsService.create({ postId: 'post1', content: 'Test', mentionedUserIds: ['user2'] }, 'user1');
      
      expect(result.id).toBe('comment1');
      expect(notificationsService.notifyUsers).toHaveBeenCalled();
    });

    it('UTCID03 - should throw if replying to invalid parent', async () => {
      postsRepository.findById.mockResolvedValue(mockPost);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      commentsRepository.findById.mockResolvedValue({ postId: 'otherPost' });

      await expect(commentsService.create({ postId: 'post1', parentCommentId: 'parent1' }, 'user1')).rejects.toThrow('Invalid parent comment');
    });

    it('UTCID05 - should propagate error when create fails', async () => {
      postsRepository.findById.mockResolvedValue(mockPost);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      commentsRepository.create.mockRejectedValue(new Error('DB error'));
      await expect(commentsService.create({ postId: 'post1', content: 'Test' }, 'user1')).rejects.toThrow('DB error');
    });
  });

  describe('update', () => {
    /* UTCIDs: UTCID01, UTCID04 */

    it('UTCID01 - should update comment if author', async () => {
      commentsRepository.findById.mockResolvedValue(mockComment); // author: user1
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      commentsRepository.update.mockResolvedValue({ ...mockComment, content: 'Updated' });

      const result = await commentsService.update('comment1', { content: 'Updated' }, 'user1');
      expect(result.content).toBe('Updated');
    });

    it('UTCID04 - should throw if not author', async () => {
      commentsRepository.findById.mockResolvedValue({ ...mockComment, authorId: 'user2' });
      await expect(commentsService.update('comment1', { content: 'Updated' }, 'user1')).rejects.toThrow();
    });
  });

  describe('vote', () => {
    /* UTCIDs: UTCID01, UTCID02 */

    it('UTCID01 - should add vote if new', async () => {
      commentsRepository.findById.mockResolvedValue(mockComment);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      commentsRepository.findByIdDetailed.mockResolvedValue(mockComment).mockResolvedValueOnce(mockComment).mockResolvedValueOnce({ ...mockComment, votes: [{ userId: 'user2', value: 1 }] });

      const result = await commentsService.vote('comment1', 1, 'user2');
      expect(commentsRepository.upsertVote).toHaveBeenCalled();
      expect(result.voteScore).toBe(1);
    });

    it('UTCID02 - should remove vote if same', async () => {
      commentsRepository.findById.mockResolvedValue(mockComment);
      groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
      commentsRepository.findByIdDetailed.mockResolvedValue({ ...mockComment, votes: [{ userId: 'user2', value: 1 }] }).mockResolvedValueOnce({ ...mockComment, votes: [{ userId: 'user2', value: 1 }] }).mockResolvedValueOnce(mockComment);

      const result = await commentsService.vote('comment1', 1, 'user2');
      expect(commentsRepository.removeVote).toHaveBeenCalled();
      expect(result.voteScore).toBe(0);
    });
  });

  describe('remove', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should remove if author', async () => {
      commentsRepository.findById.mockResolvedValue(mockComment);
      await commentsService.remove('comment1', 'user1');
      expect(commentsRepository.softDelete).toHaveBeenCalledWith('comment1');
    });
  });
});
