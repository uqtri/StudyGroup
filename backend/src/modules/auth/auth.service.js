import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { authRepository } from './auth.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getRefreshExpiry,
} from '../../utils/jwt.js';
import { ROLES } from '../../constants/roles.js';

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  avatar: user.avatar,
  bio: user.bio,
  status: user.status,
  roles: user.roles.map((ur) => ur.role.name),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const issueTokens = async (user) => {
  const payload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  await authRepository.createRefreshToken({
    userId: user.id,
    token: tokenHash,
    expiresAt: getRefreshExpiry(),
  });

  return { accessToken, refreshToken };
};

export const authService = {
  register: async ({ email, password, fullName }) => {
    const existing = await authRepository.findByEmail(email);
    if (existing) throw ApiError.conflict('Email already registered');

    const memberRole = await authRepository.findRoleByName(ROLES.MEMBER);
    if (!memberRole) throw ApiError.badRequest('Default role not configured');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await authRepository.createUser({
      email,
      passwordHash,
      fullName,
      roles: { create: { roleId: memberRole.id } },
    });

    const tokens = await issueTokens(user);
    return { user: sanitizeUser(user), ...tokens };
  },

  login: async ({ email, password }) => {
    const user = await authRepository.findByEmail(email);
    if (!user) throw ApiError.unauthorized('Invalid credentials');
    if (user.status !== 'ACTIVE') throw ApiError.forbidden('Account is not active');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw ApiError.unauthorized('Invalid credentials');

    const tokens = await issueTokens(user);
    return { user: sanitizeUser(user), ...tokens };
  },

  getProfile: async (userId) => {
    const user = await authRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return sanitizeUser(user);
  },

  refresh: async (refreshToken) => {
    if (!refreshToken) throw ApiError.unauthorized('Refresh token required');

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const stored = await authRepository.findRefreshToken(tokenHash);
    if (!stored || stored.expiresAt < new Date()) {
      throw ApiError.unauthorized('Refresh token expired or revoked');
    }

    await authRepository.deleteRefreshToken(tokenHash);
    const tokens = await issueTokens(stored.user);
    return { user: sanitizeUser(stored.user), ...tokens };
  },

  logout: async (refreshToken, userId) => {
    if (refreshToken) {
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await authRepository.deleteRefreshToken(tokenHash).catch(() => {});
    } else if (userId) {
      await authRepository.deleteUserRefreshTokens(userId);
    }
    return true;
  },
};
