import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import notificationsRoutes from '../../../../src/modules/notifications/notifications.routes.js';
import { notificationsService } from '../../../../src/modules/notifications/notifications.service.js';
import { prisma } from '../../../../src/config/prisma.js';
import { signAccessToken } from '../../../../src/utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/notifications', notificationsRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(notificationsService, 'list');
jest.spyOn(notificationsService, 'getUnreadCount');
jest.spyOn(notificationsService, 'markRead');
jest.spyOn(notificationsService, 'markAllRead');
jest.spyOn(prisma.user, 'findFirst');

const TEST_UUID = '123e4567-e89b-12d3-a456-426614174000';
const generateTestToken = () => signAccessToken({ userId: TEST_UUID, email: 'test@example.com' });

const mockAuth = () => {
  prisma.user.findFirst.mockResolvedValue({
    id: TEST_UUID, email: 'test@example.com', status: 'ACTIVE', roles: []
  });
};

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = 'test_secret';
  process.env.JWT_ACCESS_EXPIRES_IN = '1h';
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Notifications Controller', () => {
  describe('GET /notifications', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should list notifications', async () => {
      mockAuth();
      notificationsService.list.mockResolvedValue({ items: [], pagination: { total: 0 } });
      const res = await request(app)
        .get(`/notifications`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(notificationsService.list).toHaveBeenCalled();
    });
  });

  describe('GET /notifications/unread-count', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should return unread count', async () => {
      mockAuth();
      notificationsService.getUnreadCount.mockResolvedValue(5);
      const res = await request(app)
        .get(`/notifications/unread-count`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(res.body.data.count).toBe(5);
    });
  });

  describe('PATCH /notifications/:id/read', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should mark as read', async () => {
      mockAuth();
      notificationsService.markRead.mockResolvedValue(true);
      const res = await request(app)
        .patch(`/notifications/${TEST_UUID}/read`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });
  });

  describe('PATCH /notifications/read-all', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should mark all as read', async () => {
      mockAuth();
      notificationsService.markAllRead.mockResolvedValue(true);
      const res = await request(app)
        .patch(`/notifications/read-all`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });
  });
});
