import { cn } from '../../utils/cn';

export const Card = ({ children, className, title, action }) => (
  <div className={cn('rounded-xl border border-slate-200 bg-white p-5 shadow-sm', className)}>
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between">
        {title && <h3 className="text-lg font-semibold text-text">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);
