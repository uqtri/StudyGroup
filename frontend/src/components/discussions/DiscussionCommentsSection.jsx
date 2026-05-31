import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../../api/commentsApi';
import { Button } from '../common/Button';
import { MentionTextarea } from './MentionTextarea';
import { DiscussionComment } from './DiscussionComment';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '../../utils/cn';

export const DiscussionCommentsSection = ({
  postId,
  groupId,
  members,
  userId,
  isMember,
  highlightCommentId,
  onHighlightDone,
}) => {
  const qc = useQueryClient();
  const [commentSort, setCommentSort] = useState('newest');
  const [commentContent, setCommentContent] = useState('');
  const [mentionedIds, setMentionedIds] = useState([]);

  const { data: comments, isLoading } = useQuery({
    queryKey: ['post-comments', postId, commentSort],
    queryFn: () =>
      commentsApi.listByPost(postId, { sort: commentSort }).then((r) => r.data.data),
    enabled: isMember,
  });

  const commentMutation = useMutation({
    mutationFn: (payload) => commentsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post-comments', postId] });
      qc.invalidateQueries({ queryKey: ['group-posts', groupId] });
      qc.invalidateQueries({ queryKey: ['post', postId] });
      qc.invalidateQueries({ queryKey: ['notifications-unread-count'] });
      setCommentContent('');
      setMentionedIds([]);
    },
  });

  if (!isMember) {
    return (
      <p className="text-sm text-muted">Join this group to read and add comments.</p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Comments</h2>

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-4 flex gap-2">
          {[
            { id: 'newest', label: 'Newest' },
            { id: 'votes', label: 'Top' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setCommentSort(opt.id)}
              className={cn(
                'rounded-lg px-3 py-1 text-xs font-medium transition',
                commentSort === opt.id
                  ? 'bg-primary text-white'
                  : 'bg-elevated text-muted hover:text-foreground',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <MentionTextarea
          value={commentContent}
          onChange={setCommentContent}
          mentionedUserIds={mentionedIds}
          onMentionsChange={setMentionedIds}
          members={members}
          placeholder="Write a comment... Use @ to tag members"
          rows={3}
        />
        <Button
          className="mt-3"
          loading={commentMutation.isPending}
          disabled={!commentContent.trim()}
          onClick={() =>
            commentMutation.mutate({
              postId,
              content: commentContent.trim(),
              mentionedUserIds: mentionedIds,
            })
          }
        >
          Post comment
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-3 w-5" />
                <Skeleton className="h-5 w-5 rounded-md" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {(comments || []).map((c) => (
            <DiscussionComment
              key={c.id}
              comment={c}
              postId={postId}
              groupId={groupId}
              members={members}
              userId={userId}
              isMember={isMember}
              highlightCommentId={highlightCommentId}
              onHighlightDone={onHighlightDone}
            />
          ))}
          {!comments?.length && (
            <p className="text-sm text-muted">No comments yet. Be the first to reply.</p>
          )}
        </div>
      )}
    </div>
  );
};
