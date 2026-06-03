import { describe, it, expect, vi, beforeEach } from 'vitest';
import { commentsService } from '../../../../src/modules/comments/comments.service.js';
import { commentsRepository } from '../../../../src/modules/comments/comments.repository.js';
import { postsRepository } from '../../../../src/modules/posts/posts.repository.js';
import { groupsRepository } from '../../../../src/modules/groups/groups.repository.js';
import { userId, postId, mockPost } from '../../../helpers/fixtures.js';

vi.mock('../../../../src/modules/comments/comments.repository.js', () => ({
  commentsRepository: {
    findAllByPostId: vi.fn(),
    findById: vi.fn(),
    findByIdDetailed: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
    removeVote: vi.fn(),
    upsertVote: vi.fn(),
  },
}));

vi.mock('../../../../src/modules/posts/posts.repository.js', () => ({
  postsRepository: { findById: vi.fn() },
}));

vi.mock('../../../../src/modules/groups/groups.repository.js', () => ({
  groupsRepository: {
    isMember: vi.fn(),
    getMemberUserIds: vi.fn(),
  },
}));

vi.mock('../../../../src/modules/notifications/notifications.service.js', () => ({
  notificationsService: { notifyUsers: vi.fn().mockResolvedValue(1) },
}));

const flatComments = [
  {
    id: 'c1',
    postId,
    authorId: userId,
    parentCommentId: null,
    content: 'Hello',
    createdAt: new Date('2026-01-02'),
    votes: [],
    mentions: [],
    author: { fullName: 'Alice' },
  },
  {
    id: 'c2',
    postId,
    authorId: 'user-2',
    parentCommentId: 'c1',
    content: 'Reply',
    createdAt: new Date('2026-01-03'),
    votes: [],
    mentions: [],
    author: { fullName: 'Bob' },
  },
];

describe('Chat – tin nhắn (commentsService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    postsRepository.findById.mockResolvedValue(mockPost);
    groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
    groupsRepository.getMemberUserIds.mockResolvedValue([userId, 'user-2']);
  });

  describe('Xem lịch sử chat', () => {
    it('listByPost returns comment tree for members', async () => {
      commentsRepository.findAllByPostId.mockResolvedValue(flatComments);

      const result = await commentsService.listByPost(postId, {}, userId);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('c1');
      expect(result[0].replies).toHaveLength(1);
      expect(result[0].replies[0].content).toBe('Reply');
    });

    it('forbids non-members from reading chat', async () => {
      groupsRepository.isMember.mockResolvedValue(null);

      await expect(commentsService.listByPost(postId, {}, userId)).rejects.toMatchObject({
        statusCode: 403,
      });
    });
  });

  describe('Gửi tin nhắn', () => {
    it('create comment on post', async () => {
      commentsRepository.create.mockResolvedValue({
        id: 'c-new',
        postId,
        content: 'New message',
        author: { fullName: 'Alice' },
      });
      commentsRepository.findByIdDetailed.mockResolvedValue({
        id: 'c-new',
        content: 'New message',
        votes: [],
        mentions: [],
        editedAt: null,
        author: { fullName: 'Alice' },
      });

      const result = await commentsService.create(
        { postId, content: 'New message' },
        userId,
      );

      expect(commentsRepository.create).toHaveBeenCalled();
      expect(result.content).toBe('New message');
    });

    it('rejects invalid parent comment', async () => {
      commentsRepository.findById.mockResolvedValue({
        id: 'bad-parent',
        postId: 'other-post',
        authorId: 'user-2',
      });

      await expect(
        commentsService.create(
          { postId, content: 'reply', parentCommentId: 'bad-parent' },
          userId,
        ),
      ).rejects.toMatchObject({ statusCode: 400, message: 'Invalid parent comment' });
    });
  });

  describe('Chỉnh sửa / Xóa tin nhắn', () => {
    it('author can update comment', async () => {
      commentsRepository.findById.mockResolvedValue({
        id: 'c1',
        authorId: userId,
        post: { groupId: mockPost.group.id },
      });
      commentsRepository.update.mockResolvedValue({
        id: 'c1',
        content: 'Edited',
        editedAt: new Date(),
        votes: [],
        mentions: [],
      });

      const result = await commentsService.update('c1', { content: 'Edited' }, userId);

      expect(result.content).toBe('Edited');
      expect(result.isEdited).toBe(true);
    });

    it('author can delete comment', async () => {
      commentsRepository.findById.mockResolvedValue({
        id: 'c1',
        authorId: userId,
      });
      commentsRepository.softDelete.mockResolvedValue({});

      await commentsService.remove('c1', userId);

      expect(commentsRepository.softDelete).toHaveBeenCalledWith('c1');
    });
  });

  describe('Bình chọn bình luận', () => {
    it('vote upserts when user has no vote', async () => {
      commentsRepository.findById.mockResolvedValue({
        id: 'c1',
        post: { groupId: mockPost.group.id },
      });
      commentsRepository.findByIdDetailed
        .mockResolvedValueOnce({ id: 'c1', votes: [] })
        .mockResolvedValueOnce({ id: 'c1', votes: [{ userId, value: 1 }] });
      commentsRepository.upsertVote.mockResolvedValue({});

      const result = await commentsService.vote('c1', 1, userId);

      expect(commentsRepository.upsertVote).toHaveBeenCalledWith('c1', userId, 1);
      expect(result.userVote).toBe(1);
    });

    it('vote removes when same value toggled', async () => {
      commentsRepository.findById.mockResolvedValue({
        id: 'c1',
        post: { groupId: mockPost.group.id },
      });
      commentsRepository.findByIdDetailed
        .mockResolvedValueOnce({ id: 'c1', votes: [{ userId, value: 1 }] })
        .mockResolvedValueOnce({ id: 'c1', votes: [] });
      commentsRepository.removeVote.mockResolvedValue({});

      const result = await commentsService.vote('c1', 1, userId);

      expect(commentsRepository.removeVote).toHaveBeenCalledWith('c1', userId);
      expect(result.userVote).toBeNull();
    });
  });
});
