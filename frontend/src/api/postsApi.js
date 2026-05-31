import { apiClient } from './client';

export const postsApi = {
  list: (params) => apiClient.get('/posts', { params }),
  getById: (id) => apiClient.get(`/posts/${id}`),
  create: (data) => apiClient.post('/posts', data),
  update: (id, data) => apiClient.patch(`/posts/${id}`, data),
  vote: (id, value) => apiClient.post(`/posts/${id}/vote`, { value }),
  remove: (id) => apiClient.delete(`/posts/${id}`),
};
