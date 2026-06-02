import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import postsRoutes from './posts.routes.js';
import commentsRoutes from '../comments/comments.routes.js';
import { prisma } from '../../config/prisma.js';
import { signAccessToken } from '../../utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(prisma.user, 'findFirst');
jest.spyOn(prisma.groupMember, 'findFirst');
jest.spyOn(prisma.post, 'create');
jest.spyOn(prisma.post, 'findFirst');
jest.spyOn(prisma.comment, 'create');
jest.spyOn(prisma.comment, 'findFirst');
jest.spyOn(prisma, '$transaction').mockImplementation(cb => cb(prisma));

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = 'test_secret';
  process.env.JWT_ACCESS_EXPIRES_IN = '1h';
});

afterEach(() => {
  jest.clearAllMocks();
});

const generateTestToken = (userId) => signAccessToken({ userId, email: 'test@example.com' });

describe('E2E Flow: Create Post -> Comment', () => {
  it('should create a post and then comment on it', async () => {
    const GROUP_UUID = '123e4567-e89b-12d3-a456-426614174000';
    const POST_UUID = '123e4567-e89b-12d3-a456-426614174001';
    const COMMENT_UUID = '123e4567-e89b-12d3-a456-426614174002';
    const USER_UUID = '123e4567-e89b-12d3-a456-426614174003';

    prisma.user.findFirst.mockImplementation(async (args) => ({
      id: args.where.id, email: `user@test.com`, status: 'ACTIVE', roles: []
    }));

    // 1. Create Post
    prisma.groupMember.findFirst.mockResolvedValueOnce({ role: 'MEMBER' });
    prisma.post.create.mockResolvedValueOnce({ id: POST_UUID, title: 'My Post' });

    const createPostRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${generateTestToken(USER_UUID)}`)
      .send({ groupId: GROUP_UUID, title: 'My Post', content: 'Discussion thread' });

    expect(createPostRes.status).toBe(201);
    expect(createPostRes.body.data.id).toBe(POST_UUID);

    // 2. Add Comment to Post
    prisma.post.findFirst.mockResolvedValueOnce({
      id: POST_UUID,
      groupId: GROUP_UUID,
      authorId: USER_UUID,
      group: { id: GROUP_UUID, name: 'Group' },
      _count: { comments: 0 },
      votes: [],
    });
    prisma.groupMember.findFirst.mockResolvedValueOnce({ role: 'MEMBER' }); // User can comment
    prisma.comment.create.mockResolvedValueOnce({ id: COMMENT_UUID, content: 'Nice post', author: { fullName: 'Test User' } });
    prisma.comment.findFirst.mockResolvedValueOnce({ id: COMMENT_UUID, content: 'Nice post', author: { fullName: 'Test User' } });

    const createCommentRes = await request(app)
      .post('/comments')
      .set('Authorization', `Bearer ${generateTestToken(USER_UUID)}`)
      .send({ postId: POST_UUID, content: 'Nice post' });

    console.log(createCommentRes.body);
    expect(createCommentRes.status).toBe(201);
    expect(createCommentRes.body.data.id).toBe(COMMENT_UUID);
  });
});
