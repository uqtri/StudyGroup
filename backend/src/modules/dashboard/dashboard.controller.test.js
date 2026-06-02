import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import dashboardRoutes from './dashboard.routes.js';
import { dashboardService } from './dashboard.service.js';
import { prisma } from '../../config/prisma.js';
import { signAccessToken } from '../../utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/dashboard', dashboardRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(dashboardService, 'getStats');
jest.spyOn(dashboardService, 'getGroupStats');
jest.spyOn(prisma.user, 'findFirst');

const TEST_UUID = '123e4567-e89b-12d3-a456-426614174000';
const GROUP_UUID = '123e4567-e89b-12d3-a456-426614174001';
const generateTestToken = () => signAccessToken({ userId: TEST_UUID, email: 'test@example.com' });

const mockAuth = (roles = ['MEMBER']) => {
  prisma.user.findFirst.mockResolvedValue({
    id: TEST_UUID, email: 'test@example.com', status: 'ACTIVE', roles: roles.map(r => ({ role: { name: r } }))
  });
};

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = 'test_secret';
  process.env.JWT_ACCESS_EXPIRES_IN = '1h';
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Dashboard Controller', () => {
  describe('GET /dashboard/stats', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should get stats', async () => {
      mockAuth();
      dashboardService.getStats.mockResolvedValue({ role: 'MEMBER' });
      const res = await request(app)
        .get('/dashboard/stats')
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      console.log(res.body);
      expect(res.status).toBe(200);
      expect(dashboardService.getStats).toHaveBeenCalled();
    });
  });

  describe('GET /dashboard/groups/:groupId/stats', () => {
    /* UTCIDs: UTCID04, UTCID01 */

    it('UTCID04 - should return 403 if not admin', async () => {
      mockAuth(['MEMBER']);
      const res = await request(app)
        .get(`/dashboard/groups/${GROUP_UUID}/stats`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(403);
    });

    it('UTCID01 - should get group stats if admin', async () => {
      mockAuth(['ADMIN']);
      dashboardService.getGroupStats.mockResolvedValue({});
      const res = await request(app)
        .get(`/dashboard/groups/${GROUP_UUID}/stats`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(dashboardService.getGroupStats).toHaveBeenCalled();
    });
  });
});
