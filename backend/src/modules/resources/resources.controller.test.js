import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import resourcesRoutes from './resources.routes.js';
import { resourcesService } from './resources.service.js';
import { prisma } from '../../config/prisma.js';
import { signAccessToken } from '../../utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/resources', resourcesRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(resourcesService, 'list');
jest.spyOn(resourcesService, 'getById');
jest.spyOn(resourcesService, 'create');
jest.spyOn(resourcesService, 'remove');
jest.spyOn(resourcesService, 'toggleStar');
jest.spyOn(prisma.user, 'findFirst');

const TEST_UUID = '123e4567-e89b-12d3-a456-426614174000';
const GROUP_UUID = '123e4567-e89b-12d3-a456-426614174001';
const FOLDER_UUID = '123e4567-e89b-12d3-a456-426614174002';
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

describe('Resources Controller', () => {
  describe('GET /resources', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should list resources', async () => {
      mockAuth();
      resourcesService.list.mockResolvedValue({ items: [], pagination: { total: 0 } });
      const res = await request(app)
        .get(`/resources?groupId=${GROUP_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(resourcesService.list).toHaveBeenCalled();
    });
  });

  describe('GET /resources/:id', () => {
    /* UTCIDs: UTCID01, UTCID02 */

    it('UTCID01 - should get resource', async () => {
      mockAuth();
      resourcesService.getById.mockResolvedValue({ id: TEST_UUID, title: 'Test' });
      const res = await request(app)
        .get(`/resources/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });

    it('UTCID02 - should return 400 for invalid resource id UUID', async () => {
      mockAuth();
      const res = await request(app)
        .get('/resources/not-a-valid-uuid')
        .set('Authorization', `Bearer ${generateTestToken()}`);

      expect(res.status).toBe(400);
      expect(resourcesService.getById).not.toHaveBeenCalled();
    });
  });

  describe('POST /resources', () => {
    /* UTCIDs: UTCID01, UTCID02 */

    it('UTCID01 - should create resource', async () => {
      mockAuth();
      resourcesService.create.mockResolvedValue({ id: TEST_UUID });
      const res = await request(app)
        .post('/resources')
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ groupId: GROUP_UUID, folderId: FOLDER_UUID, title: 'New Res', fileUrl: 'http://test.com/file.pdf', fileType: 'pdf' });
        
      expect(res.status).toBe(201);
    });

    it('UTCID02 - should return 400 when fileUrl is invalid', async () => {
      mockAuth();
      const res = await request(app)
        .post('/resources')
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({
          groupId: GROUP_UUID,
          folderId: FOLDER_UUID,
          title: 'New Res',
          fileUrl: 'not-a-url',
          fileType: 'pdf',
        });

      expect(res.status).toBe(400);
      expect(resourcesService.create).not.toHaveBeenCalled();
    });
  });

  describe('POST /resources/:id/star', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should toggle star', async () => {
      mockAuth();
      resourcesService.toggleStar.mockResolvedValue({ starred: true });
      const res = await request(app)
        .post(`/resources/${TEST_UUID}/star`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /resources/:id', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should delete resource', async () => {
      mockAuth();
      resourcesService.remove.mockResolvedValue(true);
      const res = await request(app)
        .delete(`/resources/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });
  });
});
