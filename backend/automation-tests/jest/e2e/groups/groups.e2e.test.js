import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import groupsRoutes from '../../../../src/modules/groups/groups.routes.js';
import { prisma } from '../../../../src/config/prisma.js';
import { signAccessToken } from '../../../../src/utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/groups', groupsRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(prisma.user, 'findFirst');
jest.spyOn(prisma.studyGroup, 'create');
jest.spyOn(prisma.studyGroup, 'findFirst');
jest.spyOn(prisma.groupMember, 'findFirst');
jest.spyOn(prisma.joinRequest, 'findUnique');
jest.spyOn(prisma.joinRequest, 'create');
jest.spyOn(prisma.joinRequest, 'update');
jest.spyOn(prisma.groupMember, 'create');

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = 'test_secret';
  process.env.JWT_ACCESS_EXPIRES_IN = '1h';
});

afterEach(() => {
  jest.clearAllMocks();
});

const generateTestToken = (userId) => signAccessToken({ userId, email: 'test@example.com' });

describe('E2E Groups Flow: Create Group -> Request Join -> Approve', () => {
  it('should complete the group lifecycle', async () => {
    // User 1 (Leader), User 2 (Member)
    prisma.user.findFirst.mockImplementation(async (args) => {
      const id = args.where.id;
      return { id, email: `user${id}@test.com`, status: 'ACTIVE', roles: [] };
    });

    // 1. User 1 Creates Group
    const GROUP_UUID = '123e4567-e89b-12d3-a456-426614174000';
    const REQ_UUID = '123e4567-e89b-12d3-a456-426614174001';
    const USER1_UUID = '123e4567-e89b-12d3-a456-426614174002';
    const USER2_UUID = '123e4567-e89b-12d3-a456-426614174003';

    const mockGroup = {
      id: GROUP_UUID,
      name: 'E2E Group',
      subject: 'E2E',
      status: 'ACTIVE',
      maxMembers: 10,
      createdBy: USER1_UUID,
      members: [{ userId: USER1_UUID, role: 'LEADER' }]
    };
    prisma.studyGroup.create.mockResolvedValueOnce(mockGroup);

    const createRes = await request(app)
      .post('/groups')
      .set('Authorization', `Bearer ${generateTestToken(USER1_UUID)}`)
      .send({ name: 'E2E Group', subject: 'E2E', maxMembers: 10 });
      
    expect(createRes.status).toBe(201);
    expect(createRes.body.data.id).toBe(GROUP_UUID);

    // 2. User 2 Requests to Join
    prisma.studyGroup.findFirst.mockResolvedValueOnce(mockGroup); // Group exists
    prisma.groupMember.findFirst.mockResolvedValueOnce(null); // User 2 is not a member
    prisma.joinRequest.findUnique.mockResolvedValueOnce(null); // No pending request
    const mockRequest = { id: REQ_UUID, groupId: GROUP_UUID, userId: USER2_UUID, status: 'PENDING' };
    prisma.joinRequest.create.mockResolvedValueOnce(mockRequest);

    const joinRes = await request(app)
      .post(`/groups/${GROUP_UUID}/join`)
      .set('Authorization', `Bearer ${generateTestToken(USER2_UUID)}`);
      
    expect(joinRes.status).toBe(201);
    expect(joinRes.body.data.id).toBe(REQ_UUID);

    // 3. User 1 Approves Join Request
    prisma.joinRequest.findUnique.mockResolvedValueOnce({ ...mockRequest, user: { id: USER2_UUID } }); // Join request exists
    prisma.groupMember.findFirst.mockResolvedValueOnce({ role: 'LEADER' }); // User 1 is leader
    prisma.joinRequest.update.mockResolvedValueOnce({ ...mockRequest, status: 'APPROVED' });
    prisma.groupMember.create.mockResolvedValueOnce({ id: 'mem123', groupId: GROUP_UUID, userId: USER2_UUID, role: 'MEMBER' });

    const approveRes = await request(app)
      .post(`/groups/join-requests/${REQ_UUID}/approve`)
      .set('Authorization', `Bearer ${generateTestToken(USER1_UUID)}`);
      
    expect(approveRes.status).toBe(200);
    expect(approveRes.body.data.status).toBe('APPROVED');
  });
});
