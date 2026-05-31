import { apiClient } from './client';

export const sessionApi = {
  list: (params) => apiClient.get('/sessions', { params }),
  getById: (id) => apiClient.get(`/sessions/${id}`),
  create: (data) => apiClient.post('/sessions', data),
  update: (id, data) => apiClient.patch(`/sessions/${id}`, data),
  remove: (id) => apiClient.delete(`/sessions/${id}`),
  end: (id) => apiClient.post(`/sessions/${id}/end`),
  notifyMembers: (id) => apiClient.post(`/sessions/${id}/notify`),
  getLiveKitToken: (id) => apiClient.get(`/sessions/${id}/livekit-token`),
};
