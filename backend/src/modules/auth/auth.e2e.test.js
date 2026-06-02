import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import authRoutes from './auth.routes.js';
import { prisma } from '../../config/prisma.js';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

// Error handler to catch ApiErrors
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(prisma.user, 'findFirst');
jest.spyOn(prisma.role, 'findUnique');
jest.spyOn(prisma.user, 'create');
jest.spyOn(prisma.refreshToken, 'create');
jest.spyOn(bcrypt, 'compare');

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = 'test_secret';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
  process.env.JWT_ACCESS_EXPIRES_IN = '1h';
  process.env.JWT_REFRESH_EXPIRES_IN = '7d';
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('E2E Auth Flow: Register -> Login', () => {
  it('should register a new user and then log them in', async () => {
    // 1. Mock Register DB calls
    prisma.user.findFirst.mockResolvedValueOnce(null); // No existing email
    prisma.role.findUnique.mockResolvedValueOnce({ id: 2, name: 'MEMBER' }); // Role exists
    const mockUser = {
      id: 1,
      email: 'e2e@example.com',
      passwordHash: await bcrypt.hash('Password123!', 10),
      fullName: 'E2E User',
      status: 'ACTIVE',
      roles: [{ role: { name: 'MEMBER' } }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.user.create.mockResolvedValueOnce(mockUser);
    prisma.refreshToken.create.mockResolvedValueOnce({});

    // 2. Perform Register
    const registerRes = await request(app)
      .post('/auth/register')
      .send({ email: 'e2e@example.com', password: 'Password123!', fullName: 'E2E User' });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.data.accessToken).toBeDefined();

    // 3. Mock Login DB calls
    prisma.user.findFirst.mockResolvedValueOnce(mockUser); // Find the user created
    prisma.refreshToken.create.mockResolvedValueOnce({});

    // 4. Perform Login
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'e2e@example.com', password: 'Password123!' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.accessToken).toBeDefined();
    expect(loginRes.body.data.user.email).toBe('e2e@example.com');
  });
});
