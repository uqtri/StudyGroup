import { describe, it, expect, vi } from 'vitest';
import { ApiResponse } from '../../../src/utils/ApiResponse.js';

const createMockRes = () => {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
};

describe('ApiResponse', () => {
  it('success sends a success payload with defaults', () => {
    const res = createMockRes();

    ApiResponse.success(res, {});

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: 'Operation successful',
      data: null,
    });
  });

  it('success allows custom message, data, and status code', () => {
    const res = createMockRes();

    ApiResponse.success(res, {
      message: 'Created',
      data: { id: 1 },
      statusCode: 201,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      success: true,
      message: 'Created',
      data: { id: 1 },
    });
  });

  it('error sends an error payload with defaults', () => {
    const res = createMockRes();

    ApiResponse.error(res, {});

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      success: false,
      message: 'Something went wrong',
      errors: [],
    });
  });

  it('error allows custom fields', () => {
    const res = createMockRes();

    ApiResponse.error(res, {
      statusCode: 400,
      message: 'Validation error',
      errors: [{ field: 'email', message: 'Invalid' }],
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toHaveLength(1);
  });
});
