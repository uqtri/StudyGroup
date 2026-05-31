import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Pencil } from 'lucide-react';
import { commentsApi } from '../../api/commentsApi';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { VoteButtons } from './VoteButtons';
import { MentionTextarea } from './MentionTextarea';
import { formatDateTime } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

const renderContent = (content, mentionedUsers = []) => {
  if (!mentionedUsers.length) return content;

  let rendered = content;
  mentionedUsers.forEach((user) => {
    const pattern = new RegExp(`@${user.fullName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    rendered = rendered.replace(
      pattern,
      `<span class="font-medium text-primary">@${user.fullName}</span>`,
    );
  });
  return rendered;
};

export const DiscussionComment = ({
  comment,
  postId,
  groupId,
  members,
  userId,
  isMember,
  depth = 0,
  highlightCommentId,
  onHighlightDone,
}) => {
  const qc = useQueryClient();
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);
  const [mentionedIds, setMentionedIds] = useState([]);

  const isHighlighted = highlightCommentId === comment.id;
  const isAuthor = userId === comment.authorId;

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['post-comments', postId] });
    qc.invalidateQueries({ queryKey: ['group-posts', groupId] });
  };

  const voteMutation = useMutation({
    mutationFn: (value) => commentsApi.vote(comment.id, value),
    onSuccess: invalidate,
  });

  const closeReply = () => {
    setReplying(false);
    setReplyContent('');
    setMentionedIds([]);
  };

  const replyMutation = useMutation({
    mutationFn: (payload) => commentsApi.create(payload),
    onSuccess: () => {
      invalidate();
      qc.invalidateQueries({ queryKey: ['notifications-unread-count'] });
      closeReply();
    },
  });

  const editMutation = useMutation({
    mutationFn: (content) => commentsApi.update(comment.id, { content }),
    onSuccess: () => {
      invalidate();
      setEditing(false);
    },
  });

  const handleVote = (value) => {
    if (!isMember) return;
    voteMutation.mutate(value);
  };

  const parentAuthorId = comment.authorId;
  const parentAuthorName = comment.author?.fullName;

  const handleReplyToggle = () => {
    if (replying) {
      closeReply();
      return;
    }

    if (parentAuthorId && parentAuthorId !== userId && parentAuthorName) {
      setReplyContent(`@${parentAuthorName} `);
      setMentionedIds([parentAuthorId]);
    } else {
      setReplyContent('');
      setMentionedIds([]);
    }
    setReplying(true);
  };

  const handleSubmitReply = () => {
    const trimmed = replyContent.trim();
    if (!trimmed || replyMutation.isPending) return;

    const mentionIds = [
      ...new Set([
        ...mentionedIds,
        ...(parentAuthorId && parentAuthorId !== userId ? [parentAuthorId] : []),
      ]),
    ];

    replyMutation.mutate({
      postId,
      parentCommentId: comment.id,
      content: trimmed,
      mentionedUserIds: mentionIds,
    });
  };

  useEffect(() => {
    if (!isHighlighted) return;
    const el = document.getElementById(`comment-${comment.id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    onHighlightDone?.();
  }, [isHighlighted, comment.id, onHighlightDone]);

  return (
    <div
      id={`comment-${comment.id}`}
      className={cn(
        'flex gap-3',
        depth > 0 && 'ml-8 border-l-2 border-border pl-4',
        isHighlighted && 'rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-surface',
      )}
    >
      <VoteButtons
        size="sm"
        voteScore={comment.voteScore}
        userVote={comment.userVote}
        disabled={!isMember || voteMutation.isPending}
        onUpvote={() => handleVote(1)}
        onDownvote={() => handleVote(-1)}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Avatar src={comment.author?.avatar} name={comment.author?.fullName} size="sm" />
          <span className="text-sm font-semibold text-foreground">{comment.author?.fullName}</span>
          <span className="text-xs text-muted">{formatDateTime(comment.createdAt)}</span>
          {comment.isEdited && (
            <span className="rounded bg-elevated px-1.5 py-0.5 text-[10px] font-medium text-muted">
              Edited
            </span>
          )}
        </div>

        {editing ? (
          <div className="mt-2 space-y-2">
            <textarea
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
              rows={2}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                className="!py-1.5 !text-xs"
                loading={editMutation.isPending}
                onClick={() => editMutation.mutate(editContent.trim())}
              >
                Save
              </Button>
              <Button variant="outline" className="!py-1.5 !text-xs" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : comment.mentionedUsers?.length ? (
          <p
            className="mt-1 whitespace-pre-wrap text-sm text-foreground"
            dangerouslySetInnerHTML={{
              __html: renderContent(comment.content, comment.mentionedUsers),
            }}
          />
        ) : (
          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{comment.content}</p>
        )}

        {isMember && !editing && (
          <div className="mt-2 flex gap-3 text-xs">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-muted hover:text-primary"
              onClick={handleReplyToggle}
            >
              <MessageCircle size={12} /> Reply
            </button>
            {isAuthor && (
              <button
                type="button"
                className="inline-flex items-center gap-1 text-muted hover:text-primary"
                onClick={() => {
                  setEditing(true);
                  setEditContent(comment.content);
                }}
              >
                <Pencil size={12} /> Edit
              </button>
            )}
          </div>
        )}

        {replying && (
          <div className="mt-3 space-y-2">
            <MentionTextarea
              value={replyContent}
              onChange={setReplyContent}
              mentionedUserIds={mentionedIds}
              onMentionsChange={setMentionedIds}
              members={members}
              placeholder="Write a reply... Use @ to mention"
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                className="!py-1.5 !text-xs"
                loading={replyMutation.isPending}
                disabled={!replyContent.trim()}
                onClick={handleSubmitReply}
              >
                Reply
              </Button>
              <Button
                variant="outline"
                className="!py-1.5 !text-xs"
                disabled={replyMutation.isPending}
                onClick={closeReply}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {(comment.replies || []).map((reply) => (
          <div key={reply.id} className="mt-4">
            <DiscussionComment
              comment={reply}
              postId={postId}
              groupId={groupId}
              members={members}
              userId={userId}
              isMember={isMember}
              depth={depth + 1}
              highlightCommentId={highlightCommentId}
              onHighlightDone={onHighlightDone}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
