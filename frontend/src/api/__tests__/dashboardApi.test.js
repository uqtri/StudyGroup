import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../client', () => ({
  apiClient: { get: vi.fn() },
}));

import { apiClient } from '../client';
import { dashboardApi } from '../dashboardApi';

describe('dashboardApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getStats — GET /dashboard/stats', async () => {
    apiClient.get.mockResolvedValue({ data: {} });
    await dashboardApi.getStats();
    expect(apiClient.get).toHaveBeenCalledWith('/dashboard/stats');
  });

  it('getGroupStats — GET /dashboard/groups/:id/stats', async () => {
    apiClient.get.mockResolvedValue({ data: {} });
    await dashboardApi.getGroupStats('g1');
    expect(apiClient.get).toHaveBeenCalledWith('/dashboard/groups/g1/stats');
  });
});
