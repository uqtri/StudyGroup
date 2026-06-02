import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import attendanceRoutes from './attendance.routes.js';
import { attendanceService } from './attendance.service.js';
import { prisma } from '../../config/prisma.js';
import { signAccessToken } from '../../utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/attendance', attendanceRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(attendanceService, 'mark');
jest.spyOn(attendanceService, 'recordJoin');
jest.spyOn(attendanceService, 'listBySession');
jest.spyOn(prisma.user, 'findFirst');

const TEST_UUID = '123e4567-e89b-12d3-a456-426614174000';
const SESSION_UUID = '123e4567-e89b-12d3-a456-426614174001';
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

describe('Attendance Controller', () => {
  describe('POST /attendance/:sessionId', () => {
    /* UTCIDs: UTCID01, UTCID02 */

    it('UTCID01 - should mark attendance', async () => {
      mockAuth();
      attendanceService.mark.mockResolvedValue({ status: 'PRESENT' });
      const res = await request(app)
        .post(`/attendance/${SESSION_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ status: 'PRESENT' });
        
      expect(res.status).toBe(200);
      expect(attendanceService.mark).toHaveBeenCalled();
    });

    it('UTCID02 - should return 400 for invalid status', async () => {
      mockAuth();
      const res = await request(app)
        .post(`/attendance/${SESSION_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`)
        .send({ status: 'INVALID' });

      expect(res.status).toBe(400);
      expect(attendanceService.mark).not.toHaveBeenCalled();
    });
  });

  describe('POST /attendance/:sessionId/join', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should record join', async () => {
      mockAuth();
      attendanceService.recordJoin.mockResolvedValue({ status: 'PRESENT' });
      const res = await request(app)
        .post(`/attendance/${SESSION_UUID}/join`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(attendanceService.recordJoin).toHaveBeenCalled();
    });
  });

  describe('GET /attendance/:sessionId', () => {
    /* UTCIDs: UTCID01 */

    it('UTCID01 - should list attendance', async () => {
      mockAuth();
      attendanceService.listBySession.mockResolvedValue([{ userId: TEST_UUID, status: 'PRESENT' }]);
      const res = await request(app)
        .get(`/attendance/${SESSION_UUID}`)
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(attendanceService.listBySession).toHaveBeenCalled();
    });
  });
});
