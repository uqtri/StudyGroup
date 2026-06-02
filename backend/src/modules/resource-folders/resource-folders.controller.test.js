import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import resourceFoldersRoutes from './resource-folders.routes.js';
import { resourceFoldersService } from './resource-folders.service.js';
import { prisma } from '../../config/prisma.js';
import { signAccessToken } from '../../utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/resource-folders', resourceFoldersRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(resourceFoldersService, 'list');
jest.spyOn(resourceFoldersService, 'getById');
jest.spyOn(resourceFoldersService, 'create');
jest.spyOn(resourceFoldersService, 'update');
jest.spyOn(prisma.user, 'findFirst');

const TEST_UUID = '123e4567-e89b-12d3-a456-426614174000';
const GROUP_UUID = '123e4567-e89b-12d3-a456-426614174001';
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

describe('Resource Folders Controller', () => {
  describe('GET /resource-folders', () => {
    it('should list folders', async () => {
      mockAuth();
      resourceFoldersService.list.mockResolvedValue({ items: [], pagination: { total: 0 } });
      const res = await request(app)
        .get(`/resource-folders?groupId=${GROUP_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(resourceFoldersService.list).toHaveBeenCalled();
    });
  });

  describe('GET /resource-folders/:id', () => {
    it('should get folder', async () => {
      mockAuth();
      resourceFoldersService.getById.mockResolvedValue({ id: TEST_UUID, name: 'Test' });
      const res = await request(app)
        .get(`/resource-folders/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(resourceFoldersService.getById).toHaveBeenCalledWith(TEST_UUID, TEST_UUID);
    });
  });

  describe('POST /resource-folders', () => {
    it('should create folder', async () => {
      mockAuth();
      resourceFoldersService.create.mockResolvedValue({ id: TEST_UUID, name: 'New Folder' });
      const res = await request(app)
        .post('/resource-folders')
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ groupId: GROUP_UUID, name: 'New Folder' });
        
      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /resource-folders/:id', () => {
    it('should update folder', async () => {
      mockAuth();
      resourceFoldersService.update.mockResolvedValue({ id: TEST_UUID, name: 'Updated' });
      const res = await request(app)
        .patch(`/resource-folders/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ name: 'Updated Folder' });
        
      expect(res.status).toBe(200);
    });
  });
});
