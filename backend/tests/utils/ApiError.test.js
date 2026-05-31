import { describe, it, expect } from 'vitest';
import { ApiError } from '../../src/utils/ApiError.js';

describe('ApiError', () => {
  it('creates an error with statusCode, message, and errors', () => {
    const err = new ApiError(422, 'Validation failed', [{ field: 'email' }]);

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.statusCode).toBe(422);
    expect(err.message).toBe('Validation failed');
    expect(err.errors).toEqual([{ field: 'email' }]);
    expect(err.isOperational).toBe(true);
  });

  it('defaults errors to an empty array', () => {
    const err = new ApiError(400, 'Bad request');
    expect(err.errors).toEqual([]);
  });

  it.each([
    ['badRequest', 400, 'Invalid input'],
    ['unauthorized', 401, 'Unauthorized'],
    ['forbidden', 403, 'Forbidden'],
    ['notFound', 404, 'Resource not found'],
    ['conflict', 409, 'Duplicate'],
    ['internal', 500, 'Internal server error'],
    ['serviceUnavailable', 503, 'Service unavailable'],
  ])('static %s returns correct status', (factory, statusCode, message) => {
    const err = ApiError[factory](message);
    expect(err.statusCode).toBe(statusCode);
    expect(err.message).toBe(message);
  });
});
