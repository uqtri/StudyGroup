import { describe, it, expect, vi } from 'vitest';
import { asyncHandler } from '../../../src/utils/asyncHandler.js';

describe('asyncHandler', () => {
  it('calls the handler and passes through resolved values', async () => {
    const handler = vi.fn(async (req, res) => {
      res.sent = true;
    });
    const wrapped = asyncHandler(handler);
    const req = {};
    const res = {};
    const next = vi.fn();

    await wrapped(req, res, next);

    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards rejected promises to next', async () => {
    const error = new Error('boom');
    const handler = vi.fn(async () => {
      throw error;
    });
    const wrapped = asyncHandler(handler);
    const next = vi.fn();

    await wrapped({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
