import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { cn } from '../../utils/cn';

export const ThemeToggle = ({ className }) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted transition hover:border-primary/30 hover:text-foreground hover:shadow-md hover:shadow-primary/10',
        className,
      )}
    >
      <Sun
        size={18}
        className={cn(
          'absolute transition-all duration-300',
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
        )}
      />
      <Moon
        size={18}
        className={cn(
          'absolute transition-all duration-300',
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
        )}
      />
    </button>
  );
};
