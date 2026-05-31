const STORAGE_KEY = 'studyhub-theme';

export const initTheme = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const stored = parsed?.state?.theme;

    if (stored === 'light' || stored === 'dark') {
      document.documentElement.classList.toggle('dark', stored === 'dark');
      return;
    }
  } catch {
    /* use system preference */
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', prefersDark);
};
