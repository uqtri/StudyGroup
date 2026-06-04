import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../client', () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

import { apiClient } from '../client';
import { userApi } from '../userApi';

describe('userApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('list — GET /users with params', async () => {
    apiClient.get.mockResolvedValue({ data: {} });
    await userApi.list({ limit: 20 });
    expect(apiClient.get).toHaveBeenCalledWith('/users', { params: { limit: 20 } });
  });

  it('getById — GET /users/:id', async () => {
    apiClient.get.mockResolvedValue({ data: {} });
    await userApi.getById('u1');
    expect(apiClient.get).toHaveBeenCalledWith('/users/u1');
  });

  it('update — PATCH /users/:id', async () => {
    apiClient.patch.mockResolvedValue({ data: {} });
    await userApi.update('u1', { fullName: 'Bob' });
    expect(apiClient.patch).toHaveBeenCalledWith('/users/u1', { fullName: 'Bob' });
  });

  it('setStatus — PATCH /users/:id/status', async () => {
    apiClient.patch.mockResolvedValue({ data: {} });
    await userApi.setStatus('u1', 'SUSPENDED');
    expect(apiClient.patch).toHaveBeenCalledWith('/users/u1/status', { status: 'SUSPENDED' });
  });
});
