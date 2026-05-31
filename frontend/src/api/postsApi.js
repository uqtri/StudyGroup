import { apiClient } from './client';

export const postsApi = {
  list: (params) => apiClient.get('/posts', { params }),
  getById: (id) => apiClient.get(`/posts/${id}`),
  create: (data) => apiClient.post('/posts', data),
  remove: (id) => apiClient.delete(`/posts/${id}`),
};
