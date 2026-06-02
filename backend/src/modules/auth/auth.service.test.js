import { jest } from '@jest/globals';
import { authService } from './auth.service.js';
import { authRepository } from './auth.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import bcrypt from 'bcrypt';

jest.spyOn(authRepository, 'findByEmail');
jest.spyOn(authRepository, 'findRoleByName');
jest.spyOn(authRepository, 'createUser');
jest.spyOn(authRepository, 'createRefreshToken');
jest.spyOn(authRepository, 'findRefreshToken');
jest.spyOn(authRepository, 'deleteRefreshToken');
jest.spyOn(authRepository, 'deleteUserRefreshTokens');
jest.spyOn(authRepository, 'findById');

const mockUser = {
  id: 1,
  email: 'test@example.com',
  passwordHash: '$2b$12$somehashedpassword',
  fullName: 'Test User',
  status: 'ACTIVE',
  roles: [{ role: { name: 'MEMBER' } }],
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeAll(async () => {
  // Override process.env for jwt
  process.env.JWT_ACCESS_SECRET = 'access_secret';
  process.env.JWT_REFRESH_SECRET = 'refresh_secret';
  process.env.JWT_ACCESS_EXPIRES_IN = '15m';
  process.env.JWT_REFRESH_EXPIRES_IN = '7d';
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Auth Service', () => {
  describe('register', () => {
    it('should register a new user successfully', async () => {
      authRepository.findByEmail.mockResolvedValue(null);
      authRepository.findRoleByName.mockResolvedValue({ id: 2, name: 'MEMBER' });
      authRepository.createUser.mockResolvedValue(mockUser);
      authRepository.createRefreshToken.mockResolvedValue({});

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(authRepository.createUser).toHaveBeenCalled();
    });

    it('should throw conflict if email exists', async () => {
      authRepository.findByEmail.mockResolvedValue(mockUser);
      await expect(authService.register({ email: 'test@example.com', password: 'pw', fullName: 'Test' }))
        .rejects.toThrow(ApiError);
    });

    it('should throw error if default role not found', async () => {
      authRepository.findByEmail.mockResolvedValue(null);
      authRepository.findRoleByName.mockResolvedValue(null);
      await expect(authService.register({ email: 'test@example.com', password: 'pw', fullName: 'Test' }))
        .rejects.toThrow(ApiError);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      authRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      authRepository.createRefreshToken.mockResolvedValue({});

      const result = await authService.login({ email: 'test@example.com', password: 'password123' });
      expect(result.user.email).toBe('test@example.com');
      expect(result.accessToken).toBeDefined();
    });

    it('should throw unauthorized if user not found', async () => {
      authRepository.findByEmail.mockResolvedValue(null);
      await expect(authService.login({ email: 'test@example.com', password: 'pw' }))
        .rejects.toThrow('Invalid credentials');
    });

    it('should throw forbidden if account suspended', async () => {
      authRepository.findByEmail.mockResolvedValue({ ...mockUser, status: 'SUSPENDED' });
      await expect(authService.login({ email: 'test@example.com', password: 'pw' }))
        .rejects.toThrow('Your account has been banned');
    });

    it('should throw unauthorized if wrong password', async () => {
      authRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
      await expect(authService.login({ email: 'test@example.com', password: 'wrong' }))
        .rejects.toThrow('Invalid credentials');
    });
  });

  describe('getProfile', () => {
    it('should return sanitized user profile', async () => {
      authRepository.findById.mockResolvedValue(mockUser);
      const result = await authService.getProfile(1);
      expect(result.email).toBe('test@example.com');
      expect(result.passwordHash).toBeUndefined(); // Should be sanitized out
    });

    it('should throw not found if user does not exist', async () => {
      authRepository.findById.mockResolvedValue(null);
      await expect(authService.getProfile(999)).rejects.toThrow('User not found');
    });
  });

  describe('refresh', () => {
    // Note: this uses real jwt.verify and jwt.sign, which relies on the mock environment variables
    it('should throw unauthorized if no token', async () => {
      await expect(authService.refresh(null)).rejects.toThrow('Refresh token required');
    });

    it('should throw unauthorized if invalid token signature', async () => {
      await expect(authService.refresh('invalid-token')).rejects.toThrow('Invalid refresh token');
    });

    // We skip the full success path of refresh because we'd need to mock jwt or generate a valid token
  });

  describe('logout', () => {
    it('should delete token if refreshToken provided', async () => {
      authRepository.deleteRefreshToken.mockResolvedValue({});
      await authService.logout('some-token');
      expect(authRepository.deleteRefreshToken).toHaveBeenCalled();
    });

    it('should delete all user tokens if userId provided', async () => {
      authRepository.deleteUserRefreshTokens.mockResolvedValue({});
      await authService.logout(null, 1);
      expect(authRepository.deleteUserRefreshTokens).toHaveBeenCalledWith(1);
    });
  });
});
