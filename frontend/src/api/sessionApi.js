import { apiClient } from './client';

export const sessionApi = {
  list: (params) => apiClient.get('/sessions', { params }),
  getById: (id) => apiClient.get(`/sessions/${id}`),
  create: (data) => apiClient.post('/sessions', data),
  update: (id, data) => apiClient.patch(`/sessions/${id}`, data),
  remove: (id) => apiClient.delete(`/sessions/${id}`),
};
