import { describe, it, expect } from 'vitest';
import {
  computeVoteScore,
  getUserVote,
  attachVoteMeta,
  sortByVoteScore,
} from '../../src/utils/voteHelpers.js';

describe('computeVoteScore', () => {
  it('sums vote values', () => {
    expect(computeVoteScore([{ value: 1 }, { value: -1 }, { value: 2 }])).toBe(2);
  });

  it('returns 0 for empty votes', () => {
    expect(computeVoteScore()).toBe(0);
  });
});

describe('getUserVote', () => {
  const votes = [
    { userId: 'u1', value: 1 },
    { userId: 'u2', value: -1 },
  ];

  it('returns the user vote value', () => {
    expect(getUserVote(votes, 'u2')).toBe(-1);
  });

  it('returns null when user has not voted', () => {
    expect(getUserVote(votes, 'u3')).toBeNull();
  });

  it('returns null when userId is missing', () => {
    expect(getUserVote(votes, null)).toBeNull();
  });
});

describe('attachVoteMeta', () => {
  it('strips votes and adds voteScore and userVote', () => {
    const entity = {
      id: 'p1',
      title: 'Hello',
      votes: [
        { userId: 'u1', value: 1 },
        { userId: 'u2', value: 1 },
      ],
    };

    const result = attachVoteMeta(entity, 'u1');

    expect(result).toEqual({
      id: 'p1',
      title: 'Hello',
      voteScore: 2,
      userVote: 1,
    });
    expect(result.votes).toBeUndefined();
  });
});

describe('sortByVoteScore', () => {
  const items = [
    { id: 'a', voteScore: 2, createdAt: '2026-01-02T00:00:00.000Z' },
    { id: 'b', voteScore: 5, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'c', voteScore: 5, createdAt: '2026-01-03T00:00:00.000Z' },
  ];

  it('sorts by voteScore with tie-break on createdAt (desc)', () => {
    const sorted = sortByVoteScore(items);
    expect(sorted.map((i) => i.id)).toEqual(['a', 'c', 'b']);
  });

  it('sorts by voteScore with tie-break on createdAt (asc)', () => {
    const sorted = sortByVoteScore(items, 'asc');
    expect(sorted.map((i) => i.id)).toEqual(['c', 'b', 'a']);
  });

  it('does not mutate the original array', () => {
    const copy = [...items];
    sortByVoteScore(items);
    expect(items).toEqual(copy);
  });
});
