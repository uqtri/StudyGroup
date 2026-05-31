import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { env } from '../config/env.js';

export const notFoundHandler = (req, res) => {
  ApiResponse.error(res, {
    statusCode: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return ApiResponse.error(res, {
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err.code === 'P2002') {
    return ApiResponse.error(res, {
      statusCode: 409,
      message: 'Duplicate record',
      errors: [{ field: err.meta?.target, message: 'Already exists' }],
    });
  }

  console.error(err);
  return ApiResponse.error(res, {
    statusCode: 500,
    message: env.isDev ? err.message : 'Internal server error',
    errors: env.isDev ? [{ message: err.stack }] : [],
  });
};
