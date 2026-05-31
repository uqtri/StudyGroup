import { cn } from '../../utils/cn';

export const Card = ({ children, className, title, action }) => (
  <div
    className={cn(
      'rounded-2xl border border-border bg-surface/90 p-5 shadow-sm backdrop-blur-sm transition-colors dark:bg-surface/80',
      'hover:border-primary/20 hover:shadow-md hover:shadow-primary/5',
      className,
    )}
  >
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between">
        {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);
