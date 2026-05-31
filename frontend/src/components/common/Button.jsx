import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-secondary text-white hover:bg-secondary/90',
  outline: 'border border-slate-300 bg-white text-text hover:bg-slate-50',
  danger: 'bg-danger text-white hover:bg-danger/90',
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
      'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50',
      variants[variant],
      className,
    )}
    {...props}
  >
    {loading ? 'Loading...' : children}
  </button>
);
