import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../client', () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

import { apiClient } from '../client';
import { sessionApi } from '../sessionApi';

describe('sessionApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('list — GET /sessions with params', async () => {
    apiClient.get.mockResolvedValue({ data: {} });
    await sessionApi.list({ upcoming: 'true' });
    expect(apiClient.get).toHaveBeenCalledWith('/sessions', { params: { upcoming: 'true' } });
  });

  it('getById — GET /sessions/:id', async () => {
    apiClient.get.mockResolvedValue({ data: {} });
    await sessionApi.getById('s1');
    expect(apiClient.get).toHaveBeenCalledWith('/sessions/s1');
  });

  it('create — POST /sessions', async () => {
    const payload = { title: 'Test session', groupId: 'g1' };
    apiClient.post.mockResolvedValue({ data: {} });
    await sessionApi.create(payload);
    expect(apiClient.post).toHaveBeenCalledWith('/sessions', payload);
  });

  it('update — PATCH /sessions/:id', async () => {
    apiClient.patch.mockResolvedValue({ data: {} });
    await sessionApi.update('s1', { title: 'Updated' });
    expect(apiClient.patch).toHaveBeenCalledWith('/sessions/s1', { title: 'Updated' });
  });

  it('remove — DELETE /sessions/:id', async () => {
    apiClient.delete.mockResolvedValue({});
    await sessionApi.remove('s1');
    expect(apiClient.delete).toHaveBeenCalledWith('/sessions/s1');
  });

  it('end — POST /sessions/:id/end', async () => {
    apiClient.post.mockResolvedValue({});
    await sessionApi.end('s1');
    expect(apiClient.post).toHaveBeenCalledWith('/sessions/s1/end');
  });

  it('getLiveKitToken — GET /sessions/:id/livekit-token', async () => {
    apiClient.get.mockResolvedValue({ data: {} });
    await sessionApi.getLiveKitToken('s1');
    expect(apiClient.get).toHaveBeenCalledWith('/sessions/s1/livekit-token');
  });
});
