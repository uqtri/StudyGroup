import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authService } from '../../../src/modules/auth/auth.service.js';
import { authRepository } from '../../../src/modules/auth/auth.repository.js';
import { env } from '../../../src/config/env.js';

vi.mock('../../../src/modules/auth/auth.repository.js', () => ({
  authRepository: {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    findRoleByName: vi.fn(),
    createUser: vi.fn(),
    createRefreshToken: vi.fn(),
    findRefreshToken: vi.fn(),
    deleteRefreshToken: vi.fn(),
    deleteUserRefreshTokens: vi.fn(),
  },
}));

const mockUser = {
  id: 'user-1',
  email: 'alice@example.com',
  passwordHash: '$2b$12$hashed',
  fullName: 'Alice',
  avatar: null,
  bio: null,
  status: 'ACTIVE',
  roles: [{ role: { name: 'MEMBER' } }],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('Tài khoản (authService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Đăng ký tài khoản', () => {
    it('throws conflict when email already exists', async () => {
      authRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        authService.register({
          email: 'alice@example.com',
          password: 'password123',
          fullName: 'Alice',
        }),
      ).rejects.toMatchObject({ statusCode: 409, message: 'Email already registered' });
    });

    it('throws when default member role is missing', async () => {
      authRepository.findByEmail.mockResolvedValue(null);
      authRepository.findRoleByName.mockResolvedValue(null);

      await expect(
        authService.register({
          email: 'new@example.com',
          password: 'password123',
          fullName: 'New User',
        }),
      ).rejects.toMatchObject({ statusCode: 400, message: 'Default role not configured' });
    });

    it('creates user and returns tokens', async () => {
      authRepository.findByEmail.mockResolvedValue(null);
      authRepository.findRoleByName.mockResolvedValue({ id: 'role-member' });
      authRepository.createUser.mockResolvedValue(mockUser);
      authRepository.createRefreshToken.mockResolvedValue({});

      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');

      const result = await authService.register({
        email: 'new@example.com',
        password: 'password123',
        fullName: 'New User',
      });

      expect(authRepository.createUser).toHaveBeenCalled();
      expect(result.user.email).toBe('alice@example.com');
      expect(result.user.roles).toEqual(['MEMBER']);
      expect(result.accessToken).toBeTypeOf('string');
      expect(result.refreshToken).toBeTypeOf('string');
    });
  });

  describe('Đăng nhập', () => {
    it('throws unauthorized for unknown email', async () => {
      authRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'missing@example.com', password: 'x' }),
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it('throws forbidden for suspended account', async () => {
      authRepository.findByEmail.mockResolvedValue({ ...mockUser, status: 'SUSPENDED' });

      await expect(
        authService.login({ email: 'alice@example.com', password: 'password123' }),
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('throws unauthorized for wrong password', async () => {
      authRepository.findByEmail.mockResolvedValue(mockUser);
      vi.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        authService.login({ email: 'alice@example.com', password: 'wrong' }),
      ).rejects.toMatchObject({ statusCode: 401, message: 'Invalid credentials' });
    });

    it('returns user and tokens on success', async () => {
      authRepository.findByEmail.mockResolvedValue(mockUser);
      authRepository.createRefreshToken.mockResolvedValue({});
      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.login({
        email: 'alice@example.com',
        password: 'password123',
      });

      expect(result.user.fullName).toBe('Alice');
      expect(result.accessToken).toBeTypeOf('string');
    });
  });

  describe('Quản lí tài khoản – xem hồ sơ', () => {
    it('throws not found when user does not exist', async () => {
      authRepository.findById.mockResolvedValue(null);

      await expect(authService.getProfile('missing')).rejects.toMatchObject({ statusCode: 404 });
    });

    it('returns sanitized user', async () => {
      authRepository.findById.mockResolvedValue(mockUser);

      const profile = await authService.getProfile('user-1');

      expect(profile).toEqual({
        id: 'user-1',
        email: 'alice@example.com',
        fullName: 'Alice',
        avatar: null,
        bio: null,
        status: 'ACTIVE',
        roles: ['MEMBER'],
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });
  });

  describe('refresh', () => {
    it('throws when refresh token is missing', async () => {
      await expect(authService.refresh(null)).rejects.toMatchObject({
        statusCode: 401,
        message: 'Refresh token required',
      });
    });

    it('throws when refresh token is invalid', async () => {
      await expect(authService.refresh('not-a-valid-token')).rejects.toMatchObject({
        statusCode: 401,
        message: 'Invalid refresh token',
      });
    });

    it('rotates tokens when refresh token is valid', async () => {
      const refreshToken = jwt.sign(
        { userId: mockUser.id, email: mockUser.email },
        env.jwt.refreshSecret,
        { expiresIn: '7d' },
      );

      authRepository.findRefreshToken.mockResolvedValue({
        expiresAt: new Date(Date.now() + 60_000),
        user: mockUser,
      });
      authRepository.deleteRefreshToken.mockResolvedValue({});
      authRepository.createRefreshToken.mockResolvedValue({});

      const result = await authService.refresh(refreshToken);

      expect(authRepository.deleteRefreshToken).toHaveBeenCalled();
      expect(result.user.id).toBe('user-1');
      expect(result.accessToken).toBeTypeOf('string');
    });
  });

  describe('Đăng xuất', () => {
    it('deletes refresh token hash when token is provided', async () => {
      authRepository.deleteRefreshToken.mockResolvedValue({});

      await authService.logout('some-refresh-token');

      expect(authRepository.deleteRefreshToken).toHaveBeenCalled();
    });

    it('deletes all user refresh tokens when only userId is provided', async () => {
      authRepository.deleteUserRefreshTokens.mockResolvedValue({});

      await authService.logout(null, 'user-1');

      expect(authRepository.deleteUserRefreshTokens).toHaveBeenCalledWith('user-1');
    });
  });
});
