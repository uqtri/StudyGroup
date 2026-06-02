import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorHandler, notFoundHandler } from '../../src/middlewares/error.middleware.js';
import { ApiError } from '../../src/utils/ApiError.js';
import { env } from '../../src/config/env.js';

const createMockRes = () => {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
};

describe('notFoundHandler', () => {
  it('returns 404 with route info', () => {
    const res = createMockRes();
    const req = { method: 'GET', originalUrl: '/api/missing' };

    notFoundHandler(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Route GET /api/missing not found');
    expect(res.body.success).toBe(false);
  });
});

describe('errorHandler', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('handles ApiError instances', () => {
    const res = createMockRes();
    const err = ApiError.badRequest('Invalid', [{ field: 'x' }]);

    errorHandler(err, {}, res, vi.fn());

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: 'Invalid',
      errors: [{ field: 'x' }],
    });
  });

  it('handles Prisma unique constraint errors', () => {
    const res = createMockRes();
    const err = { code: 'P2002', meta: { target: ['email'] } };

    errorHandler(err, {}, res, vi.fn());

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Duplicate record');
  });

  it('returns generic message in production', () => {
    const res = createMockRes();
    const originalIsDev = env.isDev;
    env.isDev = false;

    errorHandler(new Error('secret details'), {}, res, vi.fn());

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Internal server error');
    expect(res.body.errors).toEqual([]);

    env.isDev = originalIsDev;
  });

  it('returns error details in development', () => {
    const res = createMockRes();
    const originalIsDev = env.isDev;
    env.isDev = true;

    const err = new Error('debug info');
    errorHandler(err, {}, res, vi.fn());

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('debug info');
    expect(res.body.errors[0].message).toContain('Error: debug info');

    env.isDev = originalIsDev;
  });
});
