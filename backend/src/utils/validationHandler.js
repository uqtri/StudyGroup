import { validationResult } from 'express-validator';
import { ApiError } from './ApiError.js';

export const validate = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.badRequest(
      'Validation error',
      errors.array().map((e) => ({ field: e.path, message: e.msg })),
    );
  }
};
