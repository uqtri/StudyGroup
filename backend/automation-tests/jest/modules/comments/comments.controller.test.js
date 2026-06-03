import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import commentsRoutes from '../../../../src/modules/comments/comments.routes.js';
import { commentsService } from '../../../../src/modules/comments/comments.service.js';
import { prisma } from '../../../../src/config/prisma.js';
import { signAccessToken } from '../../../../src/utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/comments', commentsRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(commentsService, 'listByPost');
jest.spyOn(commentsService, 'create');
jest.spyOn(commentsService, 'update');
jest.spyOn(commentsService, 'vote');
jest.spyOn(commentsService, 'remove');
jest.spyOn(prisma.user, 'findFirst');

const TEST_UUID = '123e4567-e89b-12d3-a456-426614174000';
const POST_UUID = '123e4567-e89b-12d3-a456-426614174001';
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

describe('Comments Controller', () => {
  describe('GET /comments/post/:postId', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should list comments', async () => {
      mockAuth();
      commentsService.listByPost.mockResolvedValue([]);
      const res = await request(app)
        .get(`/comments/post/${POST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(commentsService.listByPost).toHaveBeenCalled();
    });
  });

  describe('POST /comments', () => {
    /* UTCIDs: UTCID01, UTCID02 */

    it('UTCID01 - should create comment', async () => {
      mockAuth();
      commentsService.create.mockResolvedValue({ id: TEST_UUID });
      const res = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ postId: POST_UUID, content: 'Comment' });
        
      expect(res.status).toBe(201);
    });

    it('UTCID02 - should return 400 when content is empty', async () => {
      mockAuth();
      const res = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ postId: POST_UUID, content: '' });

      expect(res.status).toBe(400);
      expect(commentsService.create).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /comments/:id', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should update comment', async () => {
      mockAuth();
      commentsService.update.mockResolvedValue({ id: TEST_UUID, content: 'Updated' });
      const res = await request(app)
        .patch(`/comments/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ content: 'Updated' });
        
      expect(res.status).toBe(200);
    });
  });

  describe('POST /comments/:id/vote', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should vote on comment', async () => {
      mockAuth();
      commentsService.vote.mockResolvedValue({ voteScore: 1 });
      const res = await request(app)
        .post(`/comments/${TEST_UUID}/vote`)
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ value: 1 });
        
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /comments/:id', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should delete comment', async () => {
      mockAuth();
      commentsService.remove.mockResolvedValue(true);
      const res = await request(app)
        .delete(`/comments/${TEST_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
    });
  });
});
