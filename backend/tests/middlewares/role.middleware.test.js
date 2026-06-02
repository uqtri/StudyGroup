import { describe, it, expect, vi } from 'vitest';
import { authorize } from '../../src/middlewares/role.middleware.js';
import { ApiError } from '../../src/utils/ApiError.js';
import { ROLES } from '../../src/constants/roles.js';

describe('authorize middleware', () => {
  it('calls next with unauthorized when user is missing', () => {
    const middleware = authorize(ROLES.ADMIN);
    const next = vi.fn();

    middleware({ user: null }, {}, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  it('calls next with forbidden when role is not allowed', () => {
    const middleware = authorize(ROLES.ADMIN);
    const next = vi.fn();
    const req = { user: { roles: [ROLES.MEMBER] } };

    middleware(req, {}, next);

    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  it('calls next without error when user has allowed role', () => {
    const middleware = authorize(ROLES.ADMIN, ROLES.LEADER);
    const next = vi.fn();
    const req = { user: { roles: [ROLES.MEMBER, ROLES.LEADER] } };

    middleware(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });
});
