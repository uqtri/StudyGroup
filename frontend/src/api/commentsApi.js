import { apiClient } from './client';

export const commentsApi = {
  listByPost: (postId, params) => apiClient.get(`/comments/post/${postId}`, { params }),
  create: (data) => apiClient.post('/comments', data),
  update: (id, data) => apiClient.patch(`/comments/${id}`, data),
  vote: (id, value) => apiClient.post(`/comments/${id}/vote`, { value }),
  remove: (id) => apiClient.delete(`/comments/${id}`),
};
