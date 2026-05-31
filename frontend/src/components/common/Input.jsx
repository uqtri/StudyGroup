import { cn } from '../../utils/cn';

export const Input = ({ label, error, helper, className, id, ...props }) => {
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition',
          'placeholder:text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/15',
          error && 'border-danger focus:ring-danger/15',
          className,
        )}
        {...props}
      />
      {helper && !error && <p className="text-xs text-muted">{helper}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
};
