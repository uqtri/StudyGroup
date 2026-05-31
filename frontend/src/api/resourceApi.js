import { apiClient } from './client';

export const resourceApi = {
  list: (params) => apiClient.get('/resources', { params }),
  getById: (id) => apiClient.get(`/resources/${id}`),
  create: (data) => apiClient.post('/resources', data),
  remove: (id) => apiClient.delete(`/resources/${id}`),
  toggleStar: (id) => apiClient.post(`/resources/${id}/star`),
};
