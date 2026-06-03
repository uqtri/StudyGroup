import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postsService } from '../../../../src/modules/posts/posts.service.js';
import { postsRepository } from '../../../../src/modules/posts/posts.repository.js';
import { groupsRepository } from '../../../../src/modules/groups/groups.repository.js';
import { userId, groupId, postId, mockPost } from '../../../helpers/fixtures.js';

vi.mock('../../../../src/modules/posts/posts.repository.js', () => ({
  postsRepository: {
    findMany: vi.fn(),
    findManyForVoteSort: vi.fn(),
    count: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
    removeVote: vi.fn(),
    upsertVote: vi.fn(),
  },
}));

vi.mock('../../../../src/modules/groups/groups.repository.js', () => ({
  groupsRepository: { isMember: vi.fn() },
}));

describe('Phòng chat – bài thảo luận (postsService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    groupsRepository.isMember.mockResolvedValue({ role: 'MEMBER' });
  });

  describe('Vào phòng chat / Xem chi tiết', () => {
    it('getById returns post with vote meta', async () => {
      postsRepository.findById.mockResolvedValue(mockPost);

      const result = await postsService.getById(postId, userId);

      expect(result.id).toBe(postId);
      expect(result.commentCount).toBe(2);
      expect(result.voteScore).toBe(0);
    });

    it('throws when post not found', async () => {
      postsRepository.findById.mockResolvedValue(null);

      await expect(postsService.getById('missing', userId)).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('Xem lịch sử chat (danh sách bài)', () => {
    it('list returns paginated posts in group', async () => {
      postsRepository.findMany.mockResolvedValue([mockPost]);
      postsRepository.count.mockResolvedValue(1);

      const result = await postsService.list({ groupId }, userId);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].title).toBe('Question');
    });
  });

  describe('Gửi tin nhắn (tạo bài thảo luận)', () => {
    it('create post when user is group member', async () => {
      postsRepository.create.mockResolvedValue({
        ...mockPost,
        votes: [],
        _count: { comments: 0 },
      });

      const result = await postsService.create(
        { groupId, title: 'Hello', content: 'First message' },
        userId,
      );

      expect(postsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          groupId,
          title: 'Hello',
          content: 'First message',
          authorId: userId,
        }),
      );
      expect(result.title).toBe('Question');
    });

    it('forbids non-members from posting', async () => {
      groupsRepository.isMember.mockResolvedValue(null);

      await expect(
        postsService.create({ groupId, title: 'x', content: 'y' }, userId),
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  describe('Chỉnh sửa tin nhắn', () => {
    it('author can update own post', async () => {
      postsRepository.findById.mockResolvedValue(mockPost);
      postsRepository.update.mockResolvedValue({
        ...mockPost,
        content: 'Updated content',
        editedAt: new Date(),
      });

      const result = await postsService.update(
        postId,
        { content: 'Updated content' },
        userId,
      );

      expect(result.content).toBe('Updated content');
      expect(result.isEdited).toBe(true);
    });

    it('forbids editing another user post', async () => {
      postsRepository.findById.mockResolvedValue({ ...mockPost, authorId: 'other' });

      await expect(
        postsService.update(postId, { content: 'hack' }, userId),
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  describe('Bình chọn bài thảo luận', () => {
    it('vote upserts upvote when none exists', async () => {
      postsRepository.findById
        .mockResolvedValueOnce({ ...mockPost, votes: [] })
        .mockResolvedValueOnce({ ...mockPost, votes: [{ userId, value: 1 }] });
      postsRepository.upsertVote.mockResolvedValue({});

      const result = await postsService.vote(postId, 1, userId);

      expect(postsRepository.upsertVote).toHaveBeenCalledWith(postId, userId, 1);
      expect(result.userVote).toBe(1);
    });

    it('vote removes vote when same value clicked again', async () => {
      postsRepository.findById
        .mockResolvedValueOnce({ ...mockPost, votes: [{ userId, value: 1 }] })
        .mockResolvedValueOnce({ ...mockPost, votes: [] });
      postsRepository.removeVote.mockResolvedValue({});

      const result = await postsService.vote(postId, 1, userId);

      expect(postsRepository.removeVote).toHaveBeenCalledWith(postId, userId);
      expect(result.userVote).toBeNull();
    });
  });

  describe('Xóa bài thảo luận', () => {
    it('author can delete own post', async () => {
      postsRepository.findById.mockResolvedValue(mockPost);
      postsRepository.softDelete.mockResolvedValue({});

      await postsService.remove(postId, userId);

      expect(postsRepository.softDelete).toHaveBeenCalledWith(postId);
    });

    it('forbids deleting another user post', async () => {
      postsRepository.findById.mockResolvedValue({ ...mockPost, authorId: 'other' });

      await expect(postsService.remove(postId, userId)).rejects.toMatchObject({
        statusCode: 403,
      });
    });
  });
});
