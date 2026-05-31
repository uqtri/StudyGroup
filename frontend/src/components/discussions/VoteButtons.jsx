import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../utils/cn';

export const VoteButtons = ({
  voteScore = 0,
  userVote,
  onUpvote,
  onDownvote,
  disabled,
  size = 'md',
}) => {
  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        type="button"
        disabled={disabled}
        onClick={onUpvote}
        aria-label="Upvote"
        className={cn(
          'rounded-md p-1 transition hover:bg-elevated disabled:opacity-50',
          userVote === 1 ? 'text-primary' : 'text-muted',
        )}
      >
        <ChevronUp size={iconSize} strokeWidth={2} />
      </button>
      <span
        className={cn(
          'text-xs font-semibold tabular-nums',
          voteScore > 0 && 'text-primary',
          voteScore < 0 && 'text-danger',
          voteScore === 0 && 'text-muted',
        )}
      >
        {voteScore}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={onDownvote}
        aria-label="Downvote"
        className={cn(
          'rounded-md p-1 transition hover:bg-elevated disabled:opacity-50',
          userVote === -1 ? 'text-danger' : 'text-muted',
        )}
      >
        <ChevronDown size={iconSize} strokeWidth={2} />
      </button>
    </div>
  );
};
