import { getUploadSignature, isCloudinaryConfigured } from '../../utils/cloudinary.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const uploadController = {
  getCloudinarySignature: (_req, res) => {
    if (!isCloudinaryConfigured()) {
      throw ApiError.serviceUnavailable('Cloudinary is not configured');
    }

    const data = getUploadSignature();
    ApiResponse.success(res, { message: 'Upload signature generated', data });
  },
};
