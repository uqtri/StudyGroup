import { cn } from '../../utils/cn';

export const Input = ({ label, error, className, ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-foreground">{label}</label>}
    <input
      className={cn(
        'w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted',
        'focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
        error && 'border-danger focus:ring-danger/20',
        className,
      )}
      {...props}
    />
    {error && <p className="text-xs text-danger">{error}</p>}
  </div>
);
