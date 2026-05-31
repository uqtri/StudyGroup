import { cn } from '../../utils/cn';

const variants = {
  primary:
    'bg-primary text-white shadow-soft hover:bg-[var(--brand-600)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  secondary:
    'bg-elevated text-foreground border border-border hover:border-primary/30 hover:bg-surface active:scale-[0.98]',
  outline:
    'border border-border bg-surface text-foreground hover:border-primary/40 hover:bg-elevated active:scale-[0.98]',
  danger:
    'bg-danger text-white hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger',
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
      'inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] px-4 py-2.5 text-sm font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50',
      variants[variant],
      className,
    )}
    {...props}
  >
    {loading ? 'Loading...' : children}
  </button>
);
