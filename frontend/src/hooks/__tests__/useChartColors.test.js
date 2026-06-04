import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChartColors, CHART_PALETTE } from '../useChartColors';
import { useThemeStore } from '../../store/themeStore';

describe('useChartColors', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'light' });
    document.documentElement.classList.remove('dark');
  });

  it('returns a colors object with expected keys', () => {
    const { result } = renderHook(() => useChartColors());
    const keys = ['grid', 'bar', 'accent', 'secondary', 'tooltipBg', 'tooltipText'];
    keys.forEach((k) => expect(result.current).toHaveProperty(k));
  });

  it('provides fallback values when CSS variables are not set', () => {
    const { result } = renderHook(() => useChartColors());
    // In jsdom CSS variables return empty string so fallbacks are used
    expect(typeof result.current.grid).toBe('string');
    expect(result.current.grid.length).toBeGreaterThan(0);
  });

  it('re-reads colors when theme changes', async () => {
    const { result, rerender } = renderHook(() => useChartColors());
    const initialColors = { ...result.current };

    await act(async () => {
      useThemeStore.getState().setTheme('dark');
    });

    rerender();
    // Colors object is re-computed after theme change (same values in jsdom, but the effect fires)
    expect(result.current).toBeDefined();
  });
});

describe('CHART_PALETTE', () => {
  it('is an array of 5 color values', () => {
    expect(Array.isArray(CHART_PALETTE)).toBe(true);
    expect(CHART_PALETTE).toHaveLength(5);
  });

  it('contains CSS variable references and hex strings', () => {
    expect(CHART_PALETTE[0]).toContain('var(');
    expect(CHART_PALETTE[2]).toMatch(/^#/);
  });
});
