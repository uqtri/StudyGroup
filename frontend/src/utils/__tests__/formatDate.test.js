import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime } from '../formatDate';

describe('formatDate', () => {
  it('returns a non-empty string for a valid ISO date', () => {
    const result = formatDate('2024-06-01T00:00:00.000Z');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the year', () => {
    const result = formatDate('2024-06-01T00:00:00.000Z');
    expect(result).toContain('2024');
  });

  it('handles Date objects', () => {
    const result = formatDate(new Date('2024-12-25'));
    expect(result).toContain('2024');
  });
});

describe('formatDateTime', () => {
  it('returns a non-empty string', () => {
    const result = formatDateTime('2024-06-01T14:30:00.000Z');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the year', () => {
    const result = formatDateTime('2024-06-01T14:30:00.000Z');
    expect(result).toContain('2024');
  });
});
