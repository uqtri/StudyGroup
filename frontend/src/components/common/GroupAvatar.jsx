import { cn } from '../../utils/cn';

export const GroupAvatar = ({ name, className }) => (
  <div
    className={cn(
      'flex shrink-0 items-center justify-center rounded-[var(--radius-card)] bg-primary/10 font-bold text-primary',
      className,
    )}
    aria-hidden
  >
    {name?.charAt(0)?.toUpperCase() || '?'}
  </div>
);
