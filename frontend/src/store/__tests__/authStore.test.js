import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';
import { UserFactory } from '../../test/factories';

const resetStore = () =>
  useAuthStore.setState({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  });

describe('authStore', () => {
  beforeEach(resetStore);

  describe('initial state', () => {
    it('starts unauthenticated', () => {
      const { isAuthenticated, user, accessToken } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
      expect(user).toBeNull();
      expect(accessToken).toBeNull();
    });
  });

  describe('setAuth', () => {
    it('sets user, tokens, and marks authenticated', () => {
      const user = UserFactory.build();
      useAuthStore.getState().setAuth(user, 'access-tok', 'refresh-tok');

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(user);
      expect(state.accessToken).toBe('access-tok');
      expect(state.refreshToken).toBe('refresh-tok');
    });
  });

  describe('setUser', () => {
    it('updates user without changing tokens', () => {
      const user = UserFactory.build();
      useAuthStore.getState().setAuth(user, 'access-tok', 'refresh-tok');

      const updatedUser = { ...user, fullName: 'Updated Name' };
      useAuthStore.getState().setUser(updatedUser);

      const state = useAuthStore.getState();
      expect(state.user.fullName).toBe('Updated Name');
      expect(state.accessToken).toBe('access-tok');
    });
  });

  describe('setTokens', () => {
    it('updates tokens and marks authenticated', () => {
      useAuthStore.getState().setTokens('new-access', 'new-refresh');

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe('new-access');
      expect(state.refreshToken).toBe('new-refresh');
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('logout', () => {
    it('clears all auth state', () => {
      const user = UserFactory.build();
      useAuthStore.getState().setAuth(user, 'tok', 'refresh');
      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
    });
  });
});
