import { jest } from '@jest/globals';
import crypto from 'crypto';
import { authService } from '../../../../src/modules/auth/auth.service.js';
import { authRepository } from '../../../../src/modules/auth/auth.repository.js';
import { ApiError } from '../../../../src/utils/ApiError.js';
import { signRefreshToken } from '../../../../src/utils/jwt.js';
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


describe('Auth Service', () => {
  describe('register', () => {
    /* UTCIDs: UTCID01, UTCID03, UTCID04, UTCID05 */

    it('UTCID01 - should register a new user successfully', async () => {
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

    it('UTCID03 - should throw conflict if email exists', async () => {
      authRepository.findByEmail.mockResolvedValue(mockUser);
      await expect(authService.register({ email: 'test@example.com', password: 'pw', fullName: 'Test' }))
        .rejects.toThrow(ApiError);
    });

    it('UTCID04 - should throw error if default role not found', async () => {
      authRepository.findByEmail.mockResolvedValue(null);
      authRepository.findRoleByName.mockResolvedValue(null);
      await expect(authService.register({ email: 'test@example.com', password: 'pw', fullName: 'Test' }))
        .rejects.toThrow(ApiError);
    });

    it('UTCID05 - should propagate error when createUser fails', async () => {
      authRepository.findByEmail.mockResolvedValue(null);
      authRepository.findRoleByName.mockResolvedValue({ id: 2, name: 'MEMBER' });
      authRepository.createUser.mockRejectedValue(new Error('DB connection lost'));

      await expect(
        authService.register({ email: 'new@example.com', password: 'Password1', fullName: 'New User' }),
      ).rejects.toThrow('DB connection lost');
    });
  });

  describe('login', () => {
    /* UTCIDs: UTCID01, UTCID03, UTCID04, UTCID06 */

    it('UTCID01 - should login successfully', async () => {
      authRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      authRepository.createRefreshToken.mockResolvedValue({});

      const result = await authService.login({ email: 'test@example.com', password: 'password123' });
      expect(result.user.email).toBe('test@example.com');
      expect(result.accessToken).toBeDefined();
    });

    it('UTCID03 - should throw unauthorized if user not found', async () => {
      authRepository.findByEmail.mockResolvedValue(null);
      await expect(authService.login({ email: 'test@example.com', password: 'pw' }))
        .rejects.toThrow('Invalid credentials');
    });

    it('UTCID04 - should throw forbidden if account suspended', async () => {
      authRepository.findByEmail.mockResolvedValue({ ...mockUser, status: 'SUSPENDED' });
      await expect(authService.login({ email: 'test@example.com', password: 'pw' }))
        .rejects.toThrow('Your account has been banned');
    });

    it('UTCID06 - should throw unauthorized if wrong password', async () => {
      authRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
      await expect(authService.login({ email: 'test@example.com', password: 'wrong' }))
        .rejects.toThrow('Invalid credentials');
    });
  });

  describe('getProfile', () => {
    /* UTCIDs: UTCID01, UTCID05 */

    it('UTCID01 - should return sanitized user profile', async () => {
      authRepository.findById.mockResolvedValue(mockUser);
      const result = await authService.getProfile(1);
      expect(result.email).toBe('test@example.com');
      expect(result.passwordHash).toBeUndefined(); // Should be sanitized out
    });

    it('UTCID05 - should throw not found if user does not exist', async () => {
      authRepository.findById.mockResolvedValue(null);
      await expect(authService.getProfile(999)).rejects.toThrow('User not found');
    });
  });

  describe('refresh', () => {
    /* UTCIDs: UTCID01, UTCID03, UTCID04, UTCID06 */

    it('UTCID01 - should issue new tokens when refresh token is valid', async () => {
      const refreshToken = signRefreshToken({ userId: 1, email: 'test@example.com' });
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      authRepository.findRefreshToken.mockResolvedValue({
        token: tokenHash,
        expiresAt: new Date(Date.now() + 86400000),
        user: mockUser,
      });
      authRepository.deleteRefreshToken.mockResolvedValue({});
      authRepository.createRefreshToken.mockResolvedValue({});

      const result = await authService.refresh(refreshToken);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(authRepository.deleteRefreshToken).toHaveBeenCalledWith(tokenHash);
    });

    it('UTCID03 - should throw unauthorized if no token', async () => {
      await expect(authService.refresh(null)).rejects.toThrow('Refresh token required');
    });

    it('UTCID04 - should throw unauthorized if invalid token signature', async () => {
      await expect(authService.refresh('invalid-token')).rejects.toThrow('Invalid refresh token');
    });

    it('UTCID06 - should throw when refresh token is expired or revoked', async () => {
      const refreshToken = signRefreshToken({ userId: 1, email: 'test@example.com' });
      authRepository.findRefreshToken.mockResolvedValue(null);
      await expect(authService.refresh(refreshToken)).rejects.toThrow(
        'Refresh token expired or revoked'
      );
    });
  });

  describe('logout', () => {
    /* UTCIDs: UTCID01, UTCID02 */

    it('UTCID01 - should delete token if refreshToken provided', async () => {
      authRepository.deleteRefreshToken.mockResolvedValue({});
      await authService.logout('some-token');
      expect(authRepository.deleteRefreshToken).toHaveBeenCalled();
    });

    it('UTCID02 - should delete all user tokens if userId provided', async () => {
      authRepository.deleteUserRefreshTokens.mockResolvedValue({});
      await authService.logout(null, 1);
      expect(authRepository.deleteUserRefreshTokens).toHaveBeenCalledWith(1);
    });
  });
});
