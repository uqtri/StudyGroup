import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import { apiClient } from '../client';
import { groupApi } from '../groupApi';

describe('groupApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('list — calls GET /groups with params', async () => {
    apiClient.get.mockResolvedValue({ data: {} });
    await groupApi.list({ page: 1 });
    expect(apiClient.get).toHaveBeenCalledWith('/groups', { params: { page: 1 } });
  });

  it('getById — calls GET /groups/:id', async () => {
    apiClient.get.mockResolvedValue({ data: {} });
    await groupApi.getById('abc');
    expect(apiClient.get).toHaveBeenCalledWith('/groups/abc');
  });

  it('create — calls POST /groups', async () => {
    const data = { name: 'Test' };
    apiClient.post.mockResolvedValue({ data: {} });
    await groupApi.create(data);
    expect(apiClient.post).toHaveBeenCalledWith('/groups', data);
  });

  it('update — calls PATCH /groups/:id', async () => {
    apiClient.patch.mockResolvedValue({ data: {} });
    await groupApi.update('abc', { name: 'Updated' });
    expect(apiClient.patch).toHaveBeenCalledWith('/groups/abc', { name: 'Updated' });
  });

  it('remove — calls DELETE /groups/:id', async () => {
    apiClient.delete.mockResolvedValue({});
    await groupApi.remove('abc');
    expect(apiClient.delete).toHaveBeenCalledWith('/groups/abc');
  });

  it('requestJoin — calls POST /groups/:id/join', async () => {
    apiClient.post.mockResolvedValue({});
    await groupApi.requestJoin('abc');
    expect(apiClient.post).toHaveBeenCalledWith('/groups/abc/join');
  });

  it('cancelJoinRequest — calls DELETE /groups/:id/join', async () => {
    apiClient.delete.mockResolvedValue({});
    await groupApi.cancelJoinRequest('abc');
    expect(apiClient.delete).toHaveBeenCalledWith('/groups/abc/join');
  });

  it('approveJoinRequest — calls POST /groups/join-requests/:id/approve', async () => {
    apiClient.post.mockResolvedValue({});
    await groupApi.approveJoinRequest('req1');
    expect(apiClient.post).toHaveBeenCalledWith('/groups/join-requests/req1/approve');
  });

  it('rejectJoinRequest — calls POST /groups/join-requests/:id/reject', async () => {
    apiClient.post.mockResolvedValue({});
    await groupApi.rejectJoinRequest('req1');
    expect(apiClient.post).toHaveBeenCalledWith('/groups/join-requests/req1/reject');
  });

  it('setStatus — calls PATCH /groups/:id/status', async () => {
    apiClient.patch.mockResolvedValue({});
    await groupApi.setStatus('abc', 'INACTIVE');
    expect(apiClient.patch).toHaveBeenCalledWith('/groups/abc/status', { status: 'INACTIVE' });
  });
});
