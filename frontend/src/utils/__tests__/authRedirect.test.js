import { describe, it, expect } from 'vitest';
import { getHomePath, isAdmin, isLeader } from '../authRedirect';
import { ROLES } from '../../constants/roles';
import { UserFactory } from '../../test/factories';

describe('getHomePath', () => {
  it('returns /admin/dashboard for admin users', () => {
    const admin = UserFactory.buildAdmin();
    expect(getHomePath(admin)).toBe('/admin/dashboard');
  });

  it('returns / for regular member users', () => {
    const member = UserFactory.build();
    expect(getHomePath(member)).toBe('/');
  });

  it('returns / for leader users (not admin)', () => {
    const leader = UserFactory.buildLeader();
    expect(getHomePath(leader)).toBe('/');
  });

  it('returns / when user is null', () => {
    expect(getHomePath(null)).toBe('/');
  });

  it('returns / when user has no roles', () => {
    expect(getHomePath({ roles: [] })).toBe('/');
  });
});

describe('isAdmin', () => {
  it('returns true for admin users', () => {
    expect(isAdmin(UserFactory.buildAdmin())).toBe(true);
  });

  it('returns false for non-admin users', () => {
    expect(isAdmin(UserFactory.build())).toBeFalsy();
  });

  it('returns falsy for null user', () => {
    expect(isAdmin(null)).toBeFalsy();
  });
});

describe('isLeader', () => {
  it('returns true for leader users', () => {
    expect(isLeader(UserFactory.buildLeader())).toBe(true);
  });

  it('returns false for regular members', () => {
    expect(isLeader(UserFactory.build())).toBeFalsy();
  });

  it('returns false for admin (unless they also have LEADER role)', () => {
    expect(isLeader(UserFactory.buildAdmin())).toBeFalsy();
  });
});
