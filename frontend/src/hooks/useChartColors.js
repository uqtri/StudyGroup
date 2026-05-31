import { useEffect, useState } from 'react';
import { useThemeStore } from '../store/themeStore';

const readColors = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    grid: style.getPropertyValue('--chart-grid').trim() || '#e2e8f0',
    bar: style.getPropertyValue('--chart-bar').trim() || '#2563eb',
    accent: style.getPropertyValue('--gradient-from').trim() || '#2563eb',
    secondary: style.getPropertyValue('--gradient-to').trim() || '#06b6d4',
    tooltipBg: style.getPropertyValue('--bg-surface').trim() || '#fff',
    tooltipText: style.getPropertyValue('--text-primary').trim() || '#0f172a',
  };
};

export const useChartColors = () => {
  const theme = useThemeStore((s) => s.theme);
  const [colors, setColors] = useState(readColors);

  useEffect(() => {
    const id = requestAnimationFrame(() => setColors(readColors()));
    return () => cancelAnimationFrame(id);
  }, [theme]);

  return colors;
};

export const CHART_PALETTE = [
  'var(--gradient-from)',
  'var(--gradient-via)',
  'var(--gradient-to)',
  '#22c55e',
  '#f59e0b',
];
