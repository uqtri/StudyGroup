import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import groupsRoutes from './groups.routes.js';
import { groupsService } from './groups.service.js';
import { prisma } from '../../config/prisma.js';
import { signAccessToken } from '../../utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/groups', groupsRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(groupsService, 'list');
jest.spyOn(groupsService, 'getById');
jest.spyOn(groupsService, 'create');
jest.spyOn(groupsService, 'update');
jest.spyOn(groupsService, 'remove');
jest.spyOn(groupsService, 'requestJoin');
jest.spyOn(groupsService, 'handleJoinRequest');
jest.spyOn(groupsService, 'approveJoinRequest');
jest.spyOn(groupsService, 'rejectJoinRequest');
jest.spyOn(groupsService, 'cancelJoinRequest');
jest.spyOn(groupsService, 'setStatus');
jest.spyOn(prisma.user, 'findFirst');

const TEST_UUID = '123e4567-e89b-12d3-a456-426614174000';
const generateTestToken = () => signAccessToken({ userId: TEST_UUID, email: 'test@example.com' });

const mockAuth = (isAdmin = false) => {
  prisma.user.findFirst.mockResolvedValue({
    id: TEST_UUID, email: 'test@example.com', status: 'ACTIVE', roles: isAdmin ? [{ role: { name: 'ADMIN' } }] : []
  });
};

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = 'test_secret';
  process.env.JWT_ACCESS_EXPIRES_IN = '1h';
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Groups Controller', () => {
  describe('GET /groups', () => {
    it('should list groups without auth if not protected', async () => {
      groupsService.list.mockResolvedValue({ items: [], pagination: { total: 0 } });
      const res = await request(app).get('/groups');
      expect(res.status).toBe(200);
      expect(groupsService.list).toHaveBeenCalled();
    });
  });

  describe('GET /groups/:id', () => {
    it('should get group by id without auth', async () => {
      groupsService.getById.mockResolvedValue({ id: TEST_UUID, name: 'Test' });
      const res = await request(app).get(`/groups/${TEST_UUID}`);
      expect(res.status).toBe(200);
      expect(groupsService.getById).toHaveBeenCalled();
    });
  });

  describe('POST /groups', () => {
    it('should create group if authenticated', async () => {
      mockAuth();
      groupsService.create.mockResolvedValue({ id: TEST_UUID, name: 'New' });
      const res = await request(app)
        .post('/groups')
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ name: 'New Group', subject: 'Math', maxMembers: 10 });
        
      expect(res.status).toBe(201);
      expect(groupsService.create).toHaveBeenCalled();
    });

    it('should return 401 if not auth', async () => {
      const res = await request(app).post('/groups').send({ name: 'New' });
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /groups/:id', () => {
    it('should update group', async () => {
      mockAuth();
      groupsService.update.mockResolvedValue({ id: TEST_UUID, name: 'Updated' });
      const res = await request(app)
        .patch(`/groups/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ name: 'Updated Group' });
        
      expect(res.status).toBe(200);
      expect(groupsService.update).toHaveBeenCalled();
    });
  });

  describe('DELETE /groups/:id', () => {
    it('should delete group', async () => {
      mockAuth();
      groupsService.remove.mockResolvedValue(true);
      const res = await request(app)
        .delete(`/groups/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });
  });

  describe('POST /groups/:id/join', () => {
    it('should request join', async () => {
      mockAuth();
      groupsService.requestJoin.mockResolvedValue({ id: TEST_UUID });
      const res = await request(app)
        .post(`/groups/${TEST_UUID}/join`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(201);
    });
  });

  describe('POST /groups/join-requests/:requestId/approve', () => {
    it('should approve join request', async () => {
      mockAuth();
      groupsService.approveJoinRequest.mockResolvedValue({ status: 'APPROVED' });
      const res = await request(app)
        .post(`/groups/join-requests/${TEST_UUID}/approve`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });
  });

  describe('POST /groups/join-requests/:requestId/reject', () => {
    it('should reject join request', async () => {
      mockAuth();
      groupsService.rejectJoinRequest.mockResolvedValue({ status: 'REJECTED' });
      const res = await request(app)
        .post(`/groups/join-requests/${TEST_UUID}/reject`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /groups/:id/join', () => {
    it('should cancel join request', async () => {
      mockAuth();
      groupsService.cancelJoinRequest.mockResolvedValue(true);
      const res = await request(app)
        .delete(`/groups/${TEST_UUID}/join`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });
  });

  describe('PATCH /groups/:id/status', () => {
    it('should set status if admin', async () => {
      mockAuth(true); // isAdmin
      groupsService.setStatus.mockResolvedValue({ id: TEST_UUID, status: 'ARCHIVED' });
      const res = await request(app)
        .patch(`/groups/${TEST_UUID}/status`)
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ status: 'ARCHIVED' });
        
      expect(res.status).toBe(200);
    });
  });
});
