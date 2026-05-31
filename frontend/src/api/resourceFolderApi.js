import { apiClient } from './client';

export const resourceFolderApi = {
  list: (params) => apiClient.get('/resource-folders', { params }),
  getById: (id) => apiClient.get(`/resource-folders/${id}`),
  create: (data) => apiClient.post('/resource-folders', data),
  update: (id, data) => apiClient.patch(`/resource-folders/${id}`, data),
};
