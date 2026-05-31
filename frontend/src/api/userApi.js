import { apiClient } from './client';

export const userApi = {
  list: (params) => apiClient.get('/users', { params }),
  getById: (id) => apiClient.get(`/users/${id}`),
  update: (id, data) => apiClient.patch(`/users/${id}`, data),
  setStatus: (id, status) => apiClient.patch(`/users/${id}/status`, { status }),
};
