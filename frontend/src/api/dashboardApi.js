import { apiClient } from './client';

export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getGroupStats: (groupId) => apiClient.get(`/dashboard/groups/${groupId}/stats`),
};
