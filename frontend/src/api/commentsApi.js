import { apiClient } from './client';

export const commentsApi = {
  create: (data) => apiClient.post('/comments', data),
  remove: (id) => apiClient.delete(`/comments/${id}`),
};
