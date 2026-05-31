import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshExpiry,
} from '../../src/utils/jwt.js';
import { env } from '../../src/config/env.js';

describe('jwt utils', () => {
  const payload = { userId: 'user-1', email: 'test@example.com' };

  it('signs and verifies access token', () => {
    const token = signAccessToken(payload);
    const decoded = verifyAccessToken(token);

    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
  });

  it('signs and verifies refresh token', () => {
    const token = signRefreshToken(payload);
    const decoded = verifyRefreshToken(token);

    expect(decoded.userId).toBe(payload.userId);
  });

  it('rejects access token signed with wrong secret', () => {
    const token = jwt.sign(payload, 'wrong-secret');
    expect(() => verifyAccessToken(token)).toThrow();
  });

  describe('getRefreshExpiry', () => {
    it('parses day-based expiry', () => {
      const before = Date.now();
      const expiry = getRefreshExpiry();
      const expectedMs = 7 * 24 * 60 * 60 * 1000;

      expect(expiry.getTime()).toBeGreaterThanOrEqual(before + expectedMs - 1000);
      expect(expiry.getTime()).toBeLessThanOrEqual(Date.now() + expectedMs + 1000);
    });

    it('falls back to 7 days for invalid format', () => {
      const original = env.jwt.refreshExpiresIn;
      env.jwt.refreshExpiresIn = 'invalid';

      const before = Date.now();
      const expiry = getRefreshExpiry();
      const expectedMs = 7 * 24 * 60 * 60 * 1000;

      expect(expiry.getTime()).toBeGreaterThanOrEqual(before + expectedMs - 1000);

      env.jwt.refreshExpiresIn = original;
    });
  });
});
