import { jest } from '@jest/globals';
import { notificationsService } from '../../../../src/modules/notifications/notifications.service.js';
import { notificationsRepository } from '../../../../src/modules/notifications/notifications.repository.js';

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
    /* UTCIDs: UTCID01, UTCID05 */

    it('UTCID01 - should list notifications', async () => {
      notificationsRepository.findMany.mockResolvedValue([{ id: 'notif1' }]);
      notificationsRepository.count.mockResolvedValue(1);

      const result = await notificationsService.list('user1', { page: 1, limit: 10, unread: 'true' });
      expect(result.items).toHaveLength(1);
    });

    it('UTCID05 - should propagate error when findMany fails', async () => {
      notificationsRepository.findMany.mockRejectedValue(new Error('DB error'));
      await expect(notificationsService.list('user1', { page: 1, limit: 10 })).rejects.toThrow('DB error');
    });
  });

  describe('getUnreadCount', () => {
    /* UTCIDs: UTCID01, UTCID05 */

    it('UTCID01 - should return count', async () => {
      notificationsRepository.count.mockResolvedValue(5);
      const result = await notificationsService.getUnreadCount('user1');
      expect(result).toBe(5);
    });

    it('UTCID05 - should propagate error when count fails', async () => {
      notificationsRepository.count.mockRejectedValue(new Error('DB error'));
      await expect(notificationsService.getUnreadCount('user1')).rejects.toThrow('DB error');
    });
  });

  describe('markRead', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should mark read', async () => {
      await notificationsService.markRead('notif1', 'user1');
      expect(notificationsRepository.markRead).toHaveBeenCalledWith('notif1', 'user1');
    });
  });

  describe('markAllRead', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should mark all read', async () => {
      await notificationsService.markAllRead('user1');
      expect(notificationsRepository.markAllRead).toHaveBeenCalledWith('user1');
    });
  });

  describe('notifyUsers', () => {
    /* UTCIDs: UTCID01, UTCID03 */

    it('UTCID01 - should create notifications for users', async () => {
      const result = await notificationsService.notifyUsers(['user1', 'user2'], { title: 'Test', message: 'Message' });
      expect(notificationsRepository.createMany).toHaveBeenCalled();
      expect(result).toBe(2);
    });

    it('UTCID03 - should do nothing if no users', async () => {
      const result = await notificationsService.notifyUsers([], { title: 'Test', message: 'Message' });
      expect(notificationsRepository.createMany).not.toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });
});
