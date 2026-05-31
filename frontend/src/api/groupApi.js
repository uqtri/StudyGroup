import { apiClient } from './client';

export const groupApi = {
  list: (params) => apiClient.get('/groups', { params }),
  getById: (id) => apiClient.get(`/groups/${id}`),
  create: (data) => apiClient.post('/groups', data),
  update: (id, data) => apiClient.patch(`/groups/${id}`, data),
  remove: (id) => apiClient.delete(`/groups/${id}`),
  requestJoin: (id) => apiClient.post(`/groups/${id}/join`),
};
