import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import reportsRoutes from '../../../../src/modules/reports/reports.routes.js';
import { reportsService } from '../../../../src/modules/reports/reports.service.js';
import { prisma } from '../../../../src/config/prisma.js';
import { signAccessToken } from '../../../../src/utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/reports', reportsRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(reportsService, 'list');
jest.spyOn(reportsService, 'create');
jest.spyOn(reportsService, 'updateStatus');
jest.spyOn(prisma.user, 'findFirst');

const TEST_UUID = '123e4567-e89b-12d3-a456-426614174000';
const generateTestToken = () => signAccessToken({ userId: TEST_UUID, email: 'test@example.com' });

const mockAuth = (roles = []) => {
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

describe('Reports Controller', () => {
  describe('GET /reports', () => {
    /* UTCIDs: UTCID01, UTCID04 */

    it('UTCID01 - should list reports for admin', async () => {
      mockAuth(['ADMIN']);
      reportsService.list.mockResolvedValue({ items: [], pagination: { total: 0 } });
      const res = await request(app)
        .get('/reports')
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(reportsService.list).toHaveBeenCalled();
    });

    it('UTCID04 - should forbid non-admin', async () => {
      mockAuth(['MEMBER']);
      const res = await request(app)
        .get('/reports')
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(403);
    });
  });

  describe('POST /reports', () => {
    /* UTCIDs: UTCID01, UTCID02 */

    it('UTCID01 - should create report', async () => {
      mockAuth();
      reportsService.create.mockResolvedValue({ id: 'report1' });
      const res = await request(app)
        .post('/reports')
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ reportedType: 'POST', reportedId: TEST_UUID, reason: 'This is a test spam report' });
        
      expect(res.status).toBe(201);
    });

    it('UTCID02 - should return 400 when reason is too short', async () => {
      mockAuth();
      const res = await request(app)
        .post('/reports')
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ reportedType: 'POST', reportedId: TEST_UUID, reason: 'short' });

      expect(res.status).toBe(400);
      expect(reportsService.create).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /reports/:id', () => {
    /* UTCIDs: UTCID01, UTCID04 */

    it('UTCID01 - should update status if admin', async () => {
      mockAuth(['ADMIN']);
      reportsService.updateStatus.mockResolvedValue({ id: TEST_UUID, status: 'RESOLVED' });
      const res = await request(app)
        .patch(`/reports/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ status: 'RESOLVED' });
        
      expect(res.status).toBe(200);
    });

    it('UTCID04 - should forbid non-admin', async () => {
      mockAuth(['MEMBER']);
      const res = await request(app)
        .patch(`/reports/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ status: 'RESOLVED' });
        
      expect(res.status).toBe(403);
    });
  });
});
