import { describe, it, expect, vi } from 'vitest';
import { validationResult } from 'express-validator';
import { validate } from '../../src/utils/validationHandler.js';
import { ApiError } from '../../src/utils/ApiError.js';

vi.mock('express-validator', () => ({
  validationResult: vi.fn(),
}));

describe('validate', () => {
  it('does nothing when there are no validation errors', () => {
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });

    expect(() => validate({})).not.toThrow();
  });

  it('throws ApiError.badRequest when validation fails', () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ path: 'email', msg: 'Invalid email' }],
    });

    expect(() => validate({})).toThrow(ApiError);
    try {
      validate({});
    } catch (err) {
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe('Validation error');
      expect(err.errors).toEqual([{ field: 'email', message: 'Invalid email' }]);
    }
  });
});
