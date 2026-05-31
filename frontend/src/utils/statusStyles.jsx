import { cn } from './cn';

export const userStatusStyles = {
  ACTIVE: 'bg-success/10 text-success',
  INACTIVE: 'bg-muted/20 text-muted',
  SUSPENDED: 'bg-danger/10 text-danger',
};

export const sessionStatusStyles = {
  SCHEDULED: 'bg-blue-500/10 text-blue-600',
  IN_PROGRESS: 'bg-success/10 text-success',
  COMPLETED: 'bg-muted/20 text-muted',
  CANCELLED: 'bg-danger/10 text-danger',
};

export const groupStatusStyles = {
  ACTIVE: 'bg-success/10 text-success',
  ARCHIVED: 'bg-danger/10 text-danger',
  DELETED: 'bg-muted/20 text-muted',
};

export const userStatusLabel = (status) => {
  if (status === 'SUSPENDED') return 'Banned';
  return status;
};

export const groupStatusLabel = (status) => {
  if (status === 'ARCHIVED') return 'Banned';
  return status;
};

export const StatusBadge = ({ status, styles, label }) => (
  <span
    className={cn(
      'inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize',
      styles[status] || 'bg-elevated text-muted',
    )}
  >
    {label ?? status?.replace(/_/g, ' ').toLowerCase()}
  </span>
);
