import { apiClient } from './client';

export const reportApi = {
  list: (params) => apiClient.get('/reports', { params }),
  updateStatus: (id, status) => apiClient.patch(`/reports/${id}`, { status }),
};
