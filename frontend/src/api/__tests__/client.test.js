import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getApiError } from '../client';

describe('getApiError', () => {
  it('extracts message from response data', () => {
    const error = { response: { data: { message: 'Unauthorized' } }, message: 'Request failed' };
    expect(getApiError(error).message).toBe('Unauthorized');
  });

  it('falls back to error.message when no response data', () => {
    const error = { message: 'Network Error' };
    expect(getApiError(error).message).toBe('Network Error');
  });

  it('falls back to default message when no message at all', () => {
    expect(getApiError({}).message).toBe('Request failed');
  });

  it('extracts errors array from response data', () => {
    const error = {
      response: { data: { message: 'Validation failed', errors: ['email is required'] } },
    };
    expect(getApiError(error).errors).toEqual(['email is required']);
  });

  it('returns empty errors array when none present', () => {
    const error = { response: { data: { message: 'Bad Request' } } };
    expect(getApiError(error).errors).toEqual([]);
  });
});
