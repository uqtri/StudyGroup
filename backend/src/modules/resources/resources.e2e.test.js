import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import resourcesRoutes from './resources.routes.js';
import { prisma } from '../../config/prisma.js';
import { signAccessToken } from '../../utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/resources', resourcesRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(prisma.user, 'findFirst');
jest.spyOn(prisma.groupMember, 'findFirst');
jest.spyOn(prisma.resourceFolder, 'findFirst');
jest.spyOn(prisma.resource, 'create');

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = 'test_secret';
  process.env.JWT_ACCESS_EXPIRES_IN = '1h';
});

afterEach(() => {
  jest.clearAllMocks();
});

const generateTestToken = (userId) => signAccessToken({ userId, email: 'test@example.com' });

describe('E2E Flow: Upload Resource', () => {
  it('should create a resource after an imaginary file upload', async () => {
    const GROUP_UUID = '123e4567-e89b-12d3-a456-426614174000';
    const FOLDER_UUID = '123e4567-e89b-12d3-a456-426614174001';
    const USER_UUID = '123e4567-e89b-12d3-a456-426614174002';
    const RESOURCE_UUID = '123e4567-e89b-12d3-a456-426614174003';

    prisma.user.findFirst.mockImplementation(async (args) => ({
      id: args.where.id, email: `user@test.com`, status: 'ACTIVE', roles: []
    }));

    // 1. User calls POST /resources with a fileUrl (assuming upload happened)
    prisma.groupMember.findFirst.mockResolvedValueOnce({ role: 'MEMBER' }); // is group member
    prisma.resourceFolder.findFirst.mockResolvedValueOnce({ id: FOLDER_UUID, groupId: GROUP_UUID }); // folder belongs to group
    prisma.resource.create.mockResolvedValueOnce({ id: RESOURCE_UUID, title: 'My PDF' });

    const createRes = await request(app)
      .post('/resources')
      .set('Authorization', `Bearer ${generateTestToken(USER_UUID)}`)
      .send({ groupId: GROUP_UUID, folderId: FOLDER_UUID, title: 'My PDF', fileUrl: 'http://cdn.example.com/file.pdf', fileType: 'application/pdf' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.id).toBe(RESOURCE_UUID);
  });
});
