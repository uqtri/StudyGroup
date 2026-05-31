const UPLOAD_URL = (cloudName, resourceType) =>
  `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

export const ACCEPTED_FILE_TYPES =
  '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.gif,.webp,.svg,.zip,.rar';

export const ACCEPTED_EXTENSIONS = new Set(
  ACCEPTED_FILE_TYPES.split(',').map((ext) => ext.trim().slice(1).toLowerCase()),
);

export const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/zip',
  'application/x-rar-compressed',
];

export const MAX_FILE_SIZE = 20 * 1024 * 1024;

export const isImageType = (type) => type?.startsWith('image/');

export const getCloudinaryResourceType = (file) =>
  isImageType(file.type) ? 'image' : 'raw';

export const titleFromFilename = (filename) =>
  filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');

export const uploadToCloudinary = (file, signature, { onProgress, signal } = {}) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    const resourceType = getCloudinaryResourceType(file);

    formData.append('file', file);
    formData.append('api_key', signature.apiKey);
    formData.append('timestamp', String(signature.timestamp));
    formData.append('signature', signature.signature);
    formData.append('folder', signature.folder);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 90));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error('Invalid upload response'));
        }
        return;
      }

      let message = 'Upload failed';
      try {
        const body = JSON.parse(xhr.responseText);
        message = body.error?.message || message;
      } catch {
        /* ignore */
      }
      reject(new Error(message));
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

    if (signal) {
      signal.addEventListener('abort', () => xhr.abort());
    }

    xhr.open('POST', UPLOAD_URL(signature.cloudName, resourceType));
    xhr.send(formData);

    return xhr;
  });

export const getResourceViewUrl = (fileUrl, fileType) => {
  if (!fileUrl) return fileUrl;

  if (fileUrl.includes('/raw/upload/')) return fileUrl;

  if (fileType?.includes('pdf') || fileUrl.toLowerCase().includes('.pdf')) {
    return fileUrl.replace('/image/upload/', '/raw/upload/');
  }

  return fileUrl;
};

export const resolveFileType = (file, cloudinaryResult) => {
  if (file?.type) return file.type;
  if (cloudinaryResult?.resource_type === 'raw' && cloudinaryResult?.format) {
    const format = cloudinaryResult.format.toLowerCase();
    if (format === 'pdf') return 'application/pdf';
    if (format === 'doc' || format === 'docx') {
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    return `application/${format}`;
  }
  return cloudinaryResult?.format || 'application/octet-stream';
};

export const getFileExtension = (title, fileType, fileUrl) => {
  const fromTitle = title?.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
  if (fromTitle) return fromTitle;
  if (fileType?.includes('pdf')) return 'pdf';
  if (fileType?.includes('word') || fileType?.includes('document')) return 'doc';
  if (fileType?.includes('sheet') || fileType?.includes('excel')) return 'xls';
  if (fileType?.includes('presentation') || fileType?.includes('powerpoint')) return 'ppt';
  if (isImageType(fileType)) return fileType.split('/')[1] || 'img';
  const fromUrl = fileUrl?.match(/\.([a-z0-9]+)(?:\?|$)/i)?.[1]?.toLowerCase();
  return fromUrl || 'file';
};

export const getFileCategory = (title, fileType, fileUrl) => {
  const ext = getFileExtension(title, fileType, fileUrl);
  if (ext === 'pdf' || fileType?.includes('pdf')) return 'pdf';
  if (['doc', 'docx'].includes(ext) || fileType?.includes('word')) return 'doc';
  if (['xls', 'xlsx'].includes(ext) || fileType?.includes('sheet') || fileType?.includes('excel')) {
    return 'sheet';
  }
  if (['ppt', 'pptx'].includes(ext) || fileType?.includes('presentation')) return 'slide';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext) || isImageType(fileType)) {
    return 'image';
  }
  if (['zip', 'rar', '7z'].includes(ext)) return 'archive';
  if (ext === 'txt' || fileType?.includes('text')) return 'text';
  return 'file';
};

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
