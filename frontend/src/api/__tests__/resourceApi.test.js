import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../client', () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

import { apiClient } from '../client';
import { resourceApi } from '../resourceApi';

describe('resourceApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('list — GET /resources with params', async () => {
    apiClient.get.mockResolvedValue({ data: {} });
    await resourceApi.list({ groupId: 'g1' });
    expect(apiClient.get).toHaveBeenCalledWith('/resources', { params: { groupId: 'g1' } });
  });

  it('getById — GET /resources/:id', async () => {
    apiClient.get.mockResolvedValue({ data: {} });
    await resourceApi.getById('r1');
    expect(apiClient.get).toHaveBeenCalledWith('/resources/r1');
  });

  it('create — POST /resources', async () => {
    const payload = { title: 'Notes.pdf', fileUrl: 'http://example.com/notes.pdf' };
    apiClient.post.mockResolvedValue({ data: {} });
    await resourceApi.create(payload);
    expect(apiClient.post).toHaveBeenCalledWith('/resources', payload);
  });

  it('remove — DELETE /resources/:id', async () => {
    apiClient.delete.mockResolvedValue({});
    await resourceApi.remove('r1');
    expect(apiClient.delete).toHaveBeenCalledWith('/resources/r1');
  });

  it('toggleStar — POST /resources/:id/star', async () => {
    apiClient.post.mockResolvedValue({});
    await resourceApi.toggleStar('r1');
    expect(apiClient.post).toHaveBeenCalledWith('/resources/r1/star');
  });
});
