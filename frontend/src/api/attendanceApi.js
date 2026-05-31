import { apiClient } from './client';

export const attendanceApi = {
  recordJoin: (sessionId) => apiClient.post(`/attendance/${sessionId}/join`),
  mark: (sessionId, data) => apiClient.post(`/attendance/${sessionId}`, data),
  list: (sessionId) => apiClient.get(`/attendance/${sessionId}`),
};
