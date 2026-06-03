import { describe, it, expect } from 'vitest';
import {
  parsePagination,
  buildPaginatedResult,
  parseSort,
} from '../../../src/utils/pagination.js';

describe('parsePagination', () => {
  it('uses defaults when query is empty', () => {
    expect(parsePagination({})).toEqual({ page: 1, limit: 10, skip: 0 });
  });

  it('parses page and limit from query', () => {
    expect(parsePagination({ page: '3', limit: '25' })).toEqual({
      page: 3,
      limit: 25,
      skip: 50,
    });
  });

  it('clamps page to at least 1', () => {
    expect(parsePagination({ page: '-2' }).page).toBe(1);
  });

  it('clamps limit between 1 and 100', () => {
    expect(parsePagination({ limit: '0' }).limit).toBe(1);
    expect(parsePagination({ limit: '500' }).limit).toBe(100);
  });
});

describe('buildPaginatedResult', () => {
  it('builds pagination metadata', () => {
    const result = buildPaginatedResult(['a', 'b'], 25, { page: 2, limit: 10 });

    expect(result.items).toEqual(['a', 'b']);
    expect(result.pagination).toEqual({
      page: 2,
      limit: 10,
      total: 25,
      totalPages: 3,
    });
  });

  it('defaults totalPages to 1 when total is 0', () => {
    const result = buildPaginatedResult([], 0, { page: 1, limit: 10 });
    expect(result.pagination.totalPages).toBe(1);
  });
});

describe('parseSort', () => {
  const allowed = ['createdAt', 'title'];

  it('uses default field when sortBy is not allowed', () => {
    expect(parseSort({ sortBy: 'invalid' }, allowed)).toEqual({ createdAt: 'desc' });
  });

  it('uses allowed sortBy field', () => {
    expect(parseSort({ sortBy: 'title' }, allowed)).toEqual({ title: 'desc' });
  });

  it('respects asc sort order', () => {
    expect(parseSort({ sortBy: 'title', sortOrder: 'asc' }, allowed)).toEqual({
      title: 'asc',
    });
  });

  it('defaults to desc for non-asc sortOrder', () => {
    expect(parseSort({ sortOrder: 'invalid' }, allowed)).toEqual({ createdAt: 'desc' });
  });
});
