import { cn } from '../../utils/cn';

export const Input = ({ label, error, className, ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <input
      className={cn(
        'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
        error && 'border-danger',
        className,
      )}
      {...props}
    />
    {error && <p className="text-xs text-danger">{error}</p>}
  </div>
);
