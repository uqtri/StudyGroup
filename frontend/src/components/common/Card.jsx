import { cn } from '../../utils/cn';

export const Card = ({ children, className, title, action }) => (
  <div
    className={cn(
      'rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-soft transition-colors',
      'hover:border-primary/15',
      className,
    )}
  >
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between gap-3">
        {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);
