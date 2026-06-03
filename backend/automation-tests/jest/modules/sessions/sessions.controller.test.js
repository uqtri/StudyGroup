import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import sessionsRoutes from '../../../../src/modules/sessions/sessions.routes.js';
import { sessionsService } from '../../../../src/modules/sessions/sessions.service.js';
import { prisma } from '../../../../src/config/prisma.js';
import { signAccessToken } from '../../../../src/utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/sessions', sessionsRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(sessionsService, 'list');
jest.spyOn(sessionsService, 'getById');
jest.spyOn(sessionsService, 'create');
jest.spyOn(sessionsService, 'update');
jest.spyOn(sessionsService, 'end');
jest.spyOn(sessionsService, 'notifyMembers');
jest.spyOn(sessionsService, 'getLiveKitToken');
jest.spyOn(sessionsService, 'remove');
jest.spyOn(prisma.user, 'findFirst');

const TEST_UUID = '123e4567-e89b-12d3-a456-426614174000';
const GROUP_UUID = '123e4567-e89b-12d3-a456-426614174001';
const generateTestToken = () => signAccessToken({ userId: TEST_UUID, email: 'test@example.com' });

const mockAuth = () => {
  prisma.user.findFirst.mockResolvedValue({
    id: TEST_UUID, email: 'test@example.com', status: 'ACTIVE', roles: [], fullName: 'Test User'
  });
};

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = 'test_secret';
  process.env.JWT_ACCESS_EXPIRES_IN = '1h';
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Sessions Controller', () => {
  describe('GET /sessions', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should list sessions without auth', async () => {
      sessionsService.list.mockResolvedValue({ items: [], pagination: { total: 0 } });
      const res = await request(app).get('/sessions');
      expect(res.status).toBe(200);
      expect(sessionsService.list).toHaveBeenCalled();
    });
  });

  describe('GET /sessions/:id', () => {
    /* UTCIDs: UTCID01, UTCID02 */

    it('UTCID01 - should return session', async () => {
      sessionsService.getById.mockResolvedValue({ id: TEST_UUID, title: 'Test' });
      const res = await request(app).get(`/sessions/${TEST_UUID}`);
      expect(res.status).toBe(200);
      expect(sessionsService.getById).toHaveBeenCalledWith(TEST_UUID);
    });

    it('UTCID02 - should return 400 for invalid session id UUID', async () => {
      const res = await request(app).get('/sessions/not-a-valid-uuid');
      expect(res.status).toBe(400);
      expect(sessionsService.getById).not.toHaveBeenCalled();
    });
  });

  describe('POST /sessions', () => {
    /* UTCIDs: UTCID01, UTCID02 */

    it('UTCID01 - should create session', async () => {
      mockAuth();
      sessionsService.create.mockResolvedValue({ id: TEST_UUID, title: 'New' });
      const res = await request(app)
        .post('/sessions')
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ groupId: GROUP_UUID, title: 'New Session', startNow: true });
        
      expect(res.status).toBe(201);
    });

    it('UTCID02 - should return 400 when title is too short', async () => {
      mockAuth();
      const res = await request(app)
        .post('/sessions')
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ groupId: GROUP_UUID, title: 'AB', startNow: true });

      expect(res.status).toBe(400);
      expect(sessionsService.create).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /sessions/:id', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should update session', async () => {
      mockAuth();
      sessionsService.update.mockResolvedValue({ id: TEST_UUID, title: 'Updated' });
      const res = await request(app)
        .patch(`/sessions/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ title: 'Updated Session' });
        
      expect(res.status).toBe(200);
    });
  });

  describe('POST /sessions/:id/end', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should end session', async () => {
      mockAuth();
      sessionsService.end.mockResolvedValue({ id: TEST_UUID, status: 'COMPLETED' });
      const res = await request(app)
        .post(`/sessions/${TEST_UUID}/end`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });
  });

  describe('POST /sessions/:id/notify', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should notify members', async () => {
      mockAuth();
      sessionsService.notifyMembers.mockResolvedValue({ notified: 5 });
      const res = await request(app)
        .post(`/sessions/${TEST_UUID}/notify`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });
  });

  describe('GET /sessions/:id/livekit-token', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should get livekit token', async () => {
      mockAuth();
      sessionsService.getLiveKitToken.mockResolvedValue({ token: 'abc' });
      const res = await request(app)
        .get(`/sessions/${TEST_UUID}/livekit-token`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /sessions/:id', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should delete session', async () => {
      mockAuth();
      sessionsService.remove.mockResolvedValue(true);
      const res = await request(app)
        .delete(`/sessions/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });
  });
});
