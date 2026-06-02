import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import sessionsRoutes from '../sessions/sessions.routes.js';
import attendanceRoutes from './attendance.routes.js';
import { prisma } from '../../config/prisma.js';
import { signAccessToken } from '../../utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/sessions', sessionsRoutes);
app.use('/attendance', attendanceRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(prisma.user, 'findFirst');
jest.spyOn(prisma.studySession, 'create');
jest.spyOn(prisma.studySession, 'findFirst');
jest.spyOn(prisma.groupMember, 'findFirst');
jest.spyOn(prisma.attendance, 'upsert');

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = 'test_secret';
  process.env.JWT_ACCESS_EXPIRES_IN = '1h';
});

afterEach(() => {
  jest.clearAllMocks();
});

const generateTestToken = (userId) => signAccessToken({ userId, email: 'test@example.com' });

describe('E2E Flow: Create Session -> Attendance', () => {
  it('should complete the session lifecycle', async () => {
    const GROUP_UUID = '123e4567-e89b-12d3-a456-426614174000';
    const SESSION_UUID = '123e4567-e89b-12d3-a456-426614174001';
    const USER_UUID = '123e4567-e89b-12d3-a456-426614174002';

    prisma.user.findFirst.mockImplementation(async (args) => ({
      id: args.where.id, email: `user@test.com`, status: 'ACTIVE', roles: []
    }));

    // 1. Create Session
    prisma.groupMember.findFirst.mockResolvedValueOnce({ role: 'LEADER' }); // User is group member
    prisma.studySession.create.mockResolvedValueOnce({ id: SESSION_UUID, status: 'IN_PROGRESS' });
    
    const createRes = await request(app)
      .post('/sessions')
      .set('Authorization', `Bearer ${generateTestToken(USER_UUID)}`)
      .send({ groupId: GROUP_UUID, title: 'E2E Session', startNow: true });
      
    expect(createRes.status).toBe(201);
    expect(createRes.body.data.id).toBe(SESSION_UUID);

    // 2. Record Attendance (Join)
    prisma.studySession.findFirst.mockResolvedValueOnce({ id: SESSION_UUID, status: 'IN_PROGRESS', groupId: GROUP_UUID });
    prisma.groupMember.findFirst.mockResolvedValueOnce({ role: 'MEMBER' }); // Still member
    prisma.attendance.upsert.mockResolvedValueOnce({ sessionId: SESSION_UUID, userId: USER_UUID, status: 'PRESENT' });

    const joinRes = await request(app)
      .post(`/attendance/${SESSION_UUID}/join`)
      .set('Authorization', `Bearer ${generateTestToken(USER_UUID)}`);
      
    expect(joinRes.status).toBe(200);
    expect(joinRes.body.data.status).toBe('PRESENT');
  });
});
