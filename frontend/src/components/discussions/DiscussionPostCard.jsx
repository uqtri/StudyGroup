import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Paperclip, Pencil } from 'lucide-react';
import { postsApi } from '../../api/postsApi';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { VoteButtons } from './VoteButtons';
import { PostAttachments } from './PostAttachments';
import { formatDateTime } from '../../utils/formatDate';

export const DiscussionPostCard = ({ post, groupId, userId, isMember }) => {
  const qc = useQueryClient();
  const isAuthor = userId === post.authorId;
  const attachmentCount = post.attachments?.length || 0;

  const voteMutation = useMutation({
    mutationFn: (value) => postsApi.vote(post.id, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['group-posts', groupId] }),
  });

  const handleVote = (value) => {
    if (!isMember) return;
    voteMutation.mutate(value);
  };

  return (
    <Card className="overflow-hidden p-0">
      <article className="flex gap-3 p-4 sm:p-5">
        <VoteButtons
          voteScore={post.voteScore}
          userVote={post.userVote}
          disabled={!isMember || voteMutation.isPending}
          onUpvote={() => handleVote(1)}
          onDownvote={() => handleVote(-1)}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <Avatar src={post.author?.avatar} name={post.author?.fullName} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-foreground">{post.author?.fullName}</span>
                <span className="text-xs text-muted">{formatDateTime(post.createdAt)}</span>
                {post.isEdited && (
                  <span className="rounded bg-elevated px-1.5 py-0.5 text-[10px] font-medium text-muted">
                    Edited
                  </span>
                )}
              </div>
            </div>
          </div>

          <h3 className="mt-3 text-lg font-bold text-foreground">{post.title}</h3>
          <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">
            {post.content}
          </p>

          {attachmentCount > 0 && (
            <>
              <PostAttachments attachments={post.attachments} compact />
              <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                <Paperclip size={12} />
                {attachmentCount} attachment{attachmentCount !== 1 ? 's' : ''}
              </p>
            </>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted">
              <MessageSquare size={16} />
              {post.commentCount ?? 0} comments
            </span>

            <Link
              to={`/groups/${groupId}/discussions/${post.id}`}
              className="text-sm text-primary hover:underline"
            >
              View details →
            </Link>

            {isAuthor && (
              <Link
                to={`/groups/${groupId}/discussions/${post.id}`}
                className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary"
              >
                <Pencil size={12} /> Edit
              </Link>
            )}
          </div>
        </div>
      </article>
    </Card>
  );
};
