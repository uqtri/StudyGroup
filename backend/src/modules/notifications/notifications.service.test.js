import { jest } from '@jest/globals';
import { notificationsService } from './notifications.service.js';
import { notificationsRepository } from './notifications.repository.js';

jest.spyOn(notificationsRepository, 'findMany').mockResolvedValue([]);
jest.spyOn(notificationsRepository, 'count').mockResolvedValue(0);
jest.spyOn(notificationsRepository, 'markRead').mockResolvedValue({});
jest.spyOn(notificationsRepository, 'markAllRead').mockResolvedValue({});
jest.spyOn(notificationsRepository, 'createMany').mockResolvedValue({});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Notifications Service', () => {
  describe('list', () => {
    it('should list notifications', async () => {
      notificationsRepository.findMany.mockResolvedValue([{ id: 'notif1' }]);
      notificationsRepository.count.mockResolvedValue(1);

      const result = await notificationsService.list('user1', { page: 1, limit: 10, unread: 'true' });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('getUnreadCount', () => {
    it('should return count', async () => {
      notificationsRepository.count.mockResolvedValue(5);
      const result = await notificationsService.getUnreadCount('user1');
      expect(result).toBe(5);
    });
  });

  describe('markRead', () => {
    it('should mark read', async () => {
      await notificationsService.markRead('notif1', 'user1');
      expect(notificationsRepository.markRead).toHaveBeenCalledWith('notif1', 'user1');
    });
  });

  describe('markAllRead', () => {
    it('should mark all read', async () => {
      await notificationsService.markAllRead('user1');
      expect(notificationsRepository.markAllRead).toHaveBeenCalledWith('user1');
    });
  });

  describe('notifyUsers', () => {
    it('should create notifications for users', async () => {
      const result = await notificationsService.notifyUsers(['user1', 'user2'], { title: 'Test', message: 'Message' });
      expect(notificationsRepository.createMany).toHaveBeenCalled();
      expect(result).toBe(2);
    });

    it('should do nothing if no users', async () => {
      const result = await notificationsService.notifyUsers([], { title: 'Test', message: 'Message' });
      expect(notificationsRepository.createMany).not.toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });
});
