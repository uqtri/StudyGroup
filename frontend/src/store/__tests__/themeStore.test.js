import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useThemeStore } from '../themeStore';

const resetStore = () => useThemeStore.setState({ theme: 'light' });

describe('themeStore', () => {
  beforeEach(() => {
    resetStore();
    document.documentElement.classList.remove('dark');
  });

  it('initial theme is light', () => {
    expect(useThemeStore.getState().theme).toBe('light');
  });

  describe('setTheme', () => {
    it('sets theme to dark and applies .dark class', () => {
      useThemeStore.getState().setTheme('dark');
      expect(useThemeStore.getState().theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('sets theme to light and removes .dark class', () => {
      document.documentElement.classList.add('dark');
      useThemeStore.getState().setTheme('light');
      expect(useThemeStore.getState().theme).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('toggleTheme', () => {
    it('switches from light to dark', () => {
      useThemeStore.setState({ theme: 'light' });
      useThemeStore.getState().toggleTheme();
      expect(useThemeStore.getState().theme).toBe('dark');
    });

    it('switches from dark to light', () => {
      useThemeStore.setState({ theme: 'dark' });
      useThemeStore.getState().toggleTheme();
      expect(useThemeStore.getState().theme).toBe('light');
    });
  });
});
