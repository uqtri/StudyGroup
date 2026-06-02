import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import postsRoutes from './posts.routes.js';
import { postsService } from './posts.service.js';
import { prisma } from '../../config/prisma.js';
import { signAccessToken } from '../../utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/posts', postsRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(postsService, 'list');
jest.spyOn(postsService, 'getById');
jest.spyOn(postsService, 'create');
jest.spyOn(postsService, 'update');
jest.spyOn(postsService, 'vote');
jest.spyOn(postsService, 'remove');
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

describe('Posts Controller', () => {
  describe('GET /posts', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should list posts', async () => {
      mockAuth();
      postsService.list.mockResolvedValue({ items: [], pagination: { total: 0 } });
      const res = await request(app)
        .get(`/posts?groupId=${GROUP_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(postsService.list).toHaveBeenCalled();
    });
  });

  describe('GET /posts/:id', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should get post', async () => {
      mockAuth();
      postsService.getById.mockResolvedValue({ id: TEST_UUID, title: 'Test' });
      const res = await request(app)
        .get(`/posts/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(postsService.getById).toHaveBeenCalledWith(TEST_UUID, TEST_UUID);
    });
  });

  describe('POST /posts', () => {
    /* UTCIDs: UTCID01, UTCID02 */

    it('UTCID01 - should create post', async () => {
      mockAuth();
      postsService.create.mockResolvedValue({ id: TEST_UUID });
      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ groupId: GROUP_UUID, title: 'New Post', content: 'Content' });
        
      expect(res.status).toBe(201);
    });

    it('UTCID02 - should return 400 when title is too short', async () => {
      mockAuth();
      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ groupId: GROUP_UUID, title: 'ab', content: 'Content' });

      expect(res.status).toBe(400);
      expect(postsService.create).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /posts/:id', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should update post', async () => {
      mockAuth();
      postsService.update.mockResolvedValue({ id: TEST_UUID, title: 'Updated' });
      const res = await request(app)
        .patch(`/posts/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ title: 'Updated Post' });
        
      expect(res.status).toBe(200);
    });
  });

  describe('POST /posts/:id/vote', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should vote on post', async () => {
      mockAuth();
      postsService.vote.mockResolvedValue({ voteScore: 1 });
      const res = await request(app)
        .post(`/posts/${TEST_UUID}/vote`)
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ value: 1 });
        
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /posts/:id', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should delete post', async () => {
      mockAuth();
      postsService.remove.mockResolvedValue(true);
      const res = await request(app)
        .delete(`/posts/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });
  });
});
