import { apiClient } from './client';

export const uploadApi = {
  getCloudinarySignature: () => apiClient.get('/upload/cloudinary-signature'),
};
