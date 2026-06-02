import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notificationsService } from '../../../src/modules/notifications/notifications.service.js';
import { notificationsRepository } from '../../../src/modules/notifications/notifications.repository.js';
import { userId } from '../../helpers/fixtures.js';

vi.mock('../../../src/modules/notifications/notifications.repository.js', () => ({
  notificationsRepository: {
    findMany: vi.fn(),
    count: vi.fn(),
    markRead: vi.fn(),
    markAllRead: vi.fn(),
    createMany: vi.fn(),
  },
}));

describe('Thông báo (notificationsService)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('Xem thông báo', () => {
    it('list returns paginated notifications', async () => {
      const items = [{ id: 'n1', title: 'Hello', isRead: false }];
      notificationsRepository.findMany.mockResolvedValue(items);
      notificationsRepository.count.mockResolvedValue(1);

      const result = await notificationsService.list(userId, {});

      expect(result.items).toEqual(items);
      expect(result.pagination.total).toBe(1);
    });

    it('list filters unread when unread=true', async () => {
      notificationsRepository.findMany.mockResolvedValue([]);
      notificationsRepository.count.mockResolvedValue(0);

      await notificationsService.list(userId, { unread: 'true' });

      expect(notificationsRepository.findMany).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({
          where: { isRead: false },
        }),
      );
    });
  });

  describe('Đếm thông báo chưa đọc', () => {
    it('getUnreadCount returns count from repository', async () => {
      notificationsRepository.count.mockResolvedValue(3);

      const count = await notificationsService.getUnreadCount(userId);

      expect(count).toBe(3);
      expect(notificationsRepository.count).toHaveBeenCalledWith(userId, { isRead: false });
    });
  });

  describe('Đánh dấu đã đọc', () => {
    it('markRead delegates to repository', async () => {
      notificationsRepository.markRead.mockResolvedValue({ id: 'n1', isRead: true });

      const result = await notificationsService.markRead('n1', userId);

      expect(notificationsRepository.markRead).toHaveBeenCalledWith('n1', userId);
      expect(result.isRead).toBe(true);
    });

    it('markAllRead delegates to repository', async () => {
      notificationsRepository.markAllRead.mockResolvedValue({ count: 5 });

      await notificationsService.markAllRead(userId);

      expect(notificationsRepository.markAllRead).toHaveBeenCalledWith(userId);
    });
  });

  describe('Gửi thông báo (notifyUsers)', () => {
    it('returns 0 when userIds is empty', async () => {
      const count = await notificationsService.notifyUsers([], {
        title: 'T',
        message: 'M',
      });

      expect(count).toBe(0);
      expect(notificationsRepository.createMany).not.toHaveBeenCalled();
    });

    it('creates notifications for each user', async () => {
      notificationsRepository.createMany.mockResolvedValue({ count: 2 });

      const count = await notificationsService.notifyUsers(['u1', 'u2'], {
        title: 'Session',
        message: 'Starting soon',
        link: '/sessions/1',
      });

      expect(notificationsRepository.createMany).toHaveBeenCalledWith([
        { userId: 'u1', title: 'Session', message: 'Starting soon', link: '/sessions/1' },
        { userId: 'u2', title: 'Session', message: 'Starting soon', link: '/sessions/1' },
      ]);
      expect(count).toBe(2);
    });

    it('sets link to null when omitted', async () => {
      await notificationsService.notifyUsers([userId], {
        title: 'Alert',
        message: 'Hi',
      });

      expect(notificationsRepository.createMany).toHaveBeenCalledWith([
        expect.objectContaining({ link: null }),
      ]);
    });
  });
});
