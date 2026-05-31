import { useEffect, useState } from 'react';
import { useThemeStore } from '../store/themeStore';

const readColors = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    grid: style.getPropertyValue('--chart-grid').trim() || '#e4e4e7',
    bar: style.getPropertyValue('--chart-bar').trim() || '#0d9488',
    accent: style.getPropertyValue('--brand-500').trim() || '#0d9488',
    secondary: style.getPropertyValue('--brand-300').trim() || '#5eead4',
    tooltipBg: style.getPropertyValue('--bg-surface').trim() || '#fff',
    tooltipText: style.getPropertyValue('--text-primary').trim() || '#18181b',
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
  'var(--brand-500)',
  'var(--brand-300)',
  '#16a34a',
  '#d97706',
  '#6366f1',
];
