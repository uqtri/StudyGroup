import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  getApiError: vi.fn((e) => ({ message: e.message || 'Error', errors: [] })),
}));

import { apiClient } from '../client';
import { authApi } from '../authApi';

describe('authApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('login — calls POST /auth/login with credentials', async () => {
    const payload = { email: 'a@b.com', password: 'Pass123!' };
    apiClient.post.mockResolvedValue({ data: { data: { user: {}, accessToken: 't' } } });

    await authApi.login(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', payload);
  });

  it('register — calls POST /auth/register', async () => {
    const payload = { fullName: 'Bob', email: 'b@c.com', password: 'Pass123!' };
    apiClient.post.mockResolvedValue({ data: { data: {} } });

    await authApi.register(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', payload);
  });

  it('me — calls GET /auth/me', async () => {
    apiClient.get.mockResolvedValue({ data: { data: {} } });
    await authApi.me();
    expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
  });

  it('refresh — calls POST /auth/refresh with refreshToken', async () => {
    apiClient.post.mockResolvedValue({ data: { data: {} } });
    await authApi.refresh('tok');
    expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken: 'tok' });
  });

  it('logout — calls POST /auth/logout with refreshToken', async () => {
    apiClient.post.mockResolvedValue({});
    await authApi.logout('tok');
    expect(apiClient.post).toHaveBeenCalledWith('/auth/logout', { refreshToken: 'tok' });
  });
});
