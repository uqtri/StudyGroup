import { cn } from '../../utils/cn';

const variants = {
  primary:
    'bg-gradient-brand text-white shadow-md shadow-primary/25 hover:opacity-95 hover:shadow-lg hover:shadow-primary/30',
  secondary:
    'bg-elevated text-foreground border border-border hover:border-primary/30 hover:bg-surface',
  outline:
    'border border-border bg-surface text-foreground hover:border-primary/40 hover:bg-elevated',
  danger: 'bg-danger text-white hover:opacity-90 shadow-md shadow-danger/20',
};

export const Button = ({
  children,
  variant = 'primary',
  className,
  loading,
  disabled,
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50',
      variants[variant],
      className,
    )}
    {...props}
  >
    {loading ? 'Loading...' : children}
  </button>
);
