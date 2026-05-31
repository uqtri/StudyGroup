import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

export const ResourceStarRating = ({ starCount = 0, starredByMe = false, onToggle, loading }) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={loading}
    className={cn(
      'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition',
      starredByMe
        ? 'bg-warning/10 text-warning hover:bg-warning/15'
        : 'text-muted hover:bg-elevated hover:text-foreground',
      loading && 'opacity-50',
    )}
    title={starredByMe ? 'Remove star' : 'Mark as useful'}
  >
    <Star
      size={14}
      className={cn(starredByMe && 'fill-warning text-warning')}
      strokeWidth={1.75}
    />
    {starCount}
  </button>
);
