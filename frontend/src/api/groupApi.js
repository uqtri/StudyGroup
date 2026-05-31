import { apiClient } from './client';

export const groupApi = {
  list: (params) => apiClient.get('/groups', { params }),
  getById: (id) => apiClient.get(`/groups/${id}`),
  create: (data) => apiClient.post('/groups', data),
  update: (id, data) => apiClient.patch(`/groups/${id}`, data),
  remove: (id) => apiClient.delete(`/groups/${id}`),
  requestJoin: (id) => apiClient.post(`/groups/${id}/join`),
  cancelJoinRequest: (id) => apiClient.delete(`/groups/${id}/join`),
  approveJoinRequest: (requestId) =>
    apiClient.post(`/groups/join-requests/${requestId}/approve`),
  rejectJoinRequest: (requestId) =>
    apiClient.post(`/groups/join-requests/${requestId}/reject`),
  handleJoinRequest: (requestId, status) =>
    apiClient.patch(`/groups/join-requests/${requestId}`, { status }),
  setStatus: (id, status) => apiClient.patch(`/groups/${id}/status`, { status }),
};
