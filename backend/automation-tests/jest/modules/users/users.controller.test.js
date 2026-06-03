import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import usersRoutes from '../../../../src/modules/users/users.routes.js';
import { usersService } from '../../../../src/modules/users/users.service.js';
import { prisma } from '../../../../src/config/prisma.js';
import { signAccessToken } from '../../../../src/utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/users', usersRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(usersService, 'list');
jest.spyOn(usersService, 'getById');
jest.spyOn(usersService, 'update');
jest.spyOn(usersService, 'remove');
jest.spyOn(usersService, 'setStatus');
jest.spyOn(prisma.user, 'findFirst');

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = 'test_secret';
  process.env.JWT_ACCESS_EXPIRES_IN = '1h';
});

afterEach(() => {
  jest.clearAllMocks();
});

const TEST_UUID = '123e4567-e89b-12d3-a456-426614174000';
const generateTestToken = () => signAccessToken({ userId: TEST_UUID, email: 'test@example.com' });

const mockAuth = () => {
  prisma.user.findFirst.mockResolvedValue({
    id: TEST_UUID, email: 'test@example.com', status: 'ACTIVE', roles: [{ role: { name: 'ADMIN' } }]
  });
};

describe('Users Controller', () => {
  describe('GET /users', () => {
    /* UTCIDs: UTCID04, UTCID01 */

    it('UTCID04 - should return 401 if not authenticated', async () => {
      const res = await request(app).get('/users');
      expect(res.status).toBe(401);
    });

    it('UTCID01 - should return paginated list of users', async () => {
      mockAuth();
      usersService.list.mockResolvedValue({ items: [], pagination: { total: 0 } });
      const res = await request(app)
        .get('/users?page=1&limit=10')
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(usersService.list).toHaveBeenCalled();
    });
  });

  describe('GET /users/:id', () => {
    /* UTCIDs: UTCID01, UTCID02 */

    it('UTCID01 - should return user by id', async () => {
      mockAuth();
      usersService.getById.mockResolvedValue({ id: TEST_UUID, email: 'user2@example.com' });
      const res = await request(app)
        .get(`/users/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(TEST_UUID);
    });

    it('UTCID02 - should return 400 for invalid user id UUID', async () => {
      mockAuth();
      const res = await request(app)
        .get('/users/not-a-uuid')
        .set('Authorization', `Bearer ${generateTestToken()}`);

      expect(res.status).toBe(400);
      expect(usersService.getById).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /users/:id', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should call update and return updated user', async () => {
      mockAuth();
      usersService.update.mockResolvedValue({ id: TEST_UUID, fullName: 'New Name' });
      const res = await request(app)
        .patch(`/users/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ fullName: 'New Name' });
        
      expect(res.status).toBe(200);
      expect(usersService.update).toHaveBeenCalledWith(TEST_UUID, { fullName: 'New Name' }, TEST_UUID);
    });
  });

  describe('DELETE /users/:id', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should call remove on user', async () => {
      mockAuth();
      usersService.remove.mockResolvedValue(true);
      const res = await request(app)
        .delete(`/users/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(usersService.remove).toHaveBeenCalledWith(TEST_UUID);
    });
  });

  describe('PATCH /users/:id/status', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should update user status', async () => {
      mockAuth();
      usersService.setStatus.mockResolvedValue({ id: TEST_UUID, status: 'INACTIVE' });
      const res = await request(app)
        .patch(`/users/${TEST_UUID}/status`)
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ status: 'INACTIVE' });
        
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('INACTIVE');
      expect(usersService.setStatus).toHaveBeenCalledWith(TEST_UUID, "INACTIVE", TEST_UUID);
    });
  });
});
