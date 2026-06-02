import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import authRoutes from './auth.routes.js';
import { authService } from './auth.service.js';
import { prisma } from '../../config/prisma.js';
import { signAccessToken } from '../../utils/jwt.js';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

// Error handler to catch ApiErrors
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(authService, 'register');
jest.spyOn(authService, 'login');
jest.spyOn(authService, 'getProfile');
jest.spyOn(authService, 'refresh');
jest.spyOn(authService, 'logout');
jest.spyOn(prisma.user, 'findFirst');

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = 'test_secret';
  process.env.JWT_ACCESS_EXPIRES_IN = '1h';
});

afterEach(() => {
  jest.clearAllMocks();
});

const generateTestToken = () => signAccessToken({ userId: 1, email: 'test@example.com' });

describe('Auth Controller', () => {
  describe('POST /auth/register', () => {
    it('should validate request body and call register', async () => {
      authService.register.mockResolvedValue({ id: 1, email: 'test@test.com' });
      
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@test.com', password: 'Password123!', fullName: 'Test User' });
        
      expect(res.status).toBe(201);
      expect(res.body.data.email).toBe('test@test.com');
      expect(authService.register).toHaveBeenCalled();
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'invalid', password: 'Password123!', fullName: 'Test' });
        
      expect(res.status).toBe(400); // Because of validation
      expect(authService.register).not.toHaveBeenCalled();
    });
  });

  describe('POST /auth/login', () => {
    it('should call login and return data', async () => {
      authService.login.mockResolvedValue({ accessToken: 'token' });
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'Password123!' });
        
      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBe('token');
    });
  });

  describe('GET /auth/me', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/auth/me');
      expect(res.status).toBe(401);
    });

    it('should return user profile if authenticated', async () => {
      prisma.user.findFirst.mockResolvedValue({
        id: 1, email: 'test@test.com', status: 'ACTIVE', roles: []
      });
      authService.getProfile.mockResolvedValue({ id: 1, email: 'test@test.com' });
      
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('test@test.com');
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout user', async () => {
      prisma.user.findFirst.mockResolvedValue({
        id: 1, email: 'test@test.com', status: 'ACTIVE', roles: []
      });
      authService.logout.mockResolvedValue(true);
      
      const res = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully');
    });
  });
});
