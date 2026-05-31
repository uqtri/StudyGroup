import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Pencil } from 'lucide-react';
import { postsApi } from '../../api/postsApi';
import { groupApi } from '../../api/groupApi';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { VoteButtons } from '../../components/discussions/VoteButtons';
import { PostAttachments } from '../../components/discussions/PostAttachments';
import { DiscussionCommentsSection } from '../../components/discussions/DiscussionCommentsSection';
import {
  DiscussionDetailSkeleton,
} from '../../components/skeletons/LoadingSkeletons';
import { formatDateTime } from '../../utils/formatDate';

export const DiscussionDetailPage = () => {
  const { id: groupId, postId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightCommentId = searchParams.get('comment');
  const qc = useQueryClient();
  const { user } = useAuthStore();

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const { data: group } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => groupApi.getById(groupId).then((r) => r.data.data),
  });

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postsApi.getById(postId).then((r) => r.data.data),
    enabled: !!postId,
  });

  const isMember = group?.members?.some((m) => m.userId === user?.id);
  const isAuthor = user?.id === post?.authorId;

  const voteMutation = useMutation({
    mutationFn: (value) => postsApi.vote(postId, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['post', postId] }),
  });

  const editMutation = useMutation({
    mutationFn: (data) => postsApi.update(postId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', postId] });
      qc.invalidateQueries({ queryKey: ['group-posts', groupId] });
      setEditing(false);
    },
  });

  const clearHighlight = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('comment');
    setSearchParams(next, { replace: true });
  };

  if (isLoading) return <DiscussionDetailSkeleton />;

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-muted">Discussion not found.</p>
        <Link to={`/groups/${groupId}?tab=Discussions`} className="mt-4 inline-block text-primary">
          ← Back to discussions
        </Link>
      </div>
    );
  }

  const startEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditing(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to={`/groups/${groupId}?tab=Discussions`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
      >
        <ArrowLeft size={16} /> Back to discussions
      </Link>

      <Card className="overflow-hidden p-0">
        <article className="flex gap-3 p-4 sm:p-6">
          <VoteButtons
            voteScore={post.voteScore}
            userVote={post.userVote}
            disabled={!isMember || voteMutation.isPending}
            onUpvote={() => isMember && voteMutation.mutate(1)}
            onDownvote={() => isMember && voteMutation.mutate(-1)}
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <Avatar src={post.author?.avatar} name={post.author?.fullName} />
              <div className="flex-1">
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
              {isAuthor && !editing && (
                <button
                  type="button"
                  onClick={startEdit}
                  className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary"
                >
                  <Pencil size={14} /> Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="mt-4 space-y-3">
                <input
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
                  rows={6}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    loading={editMutation.isPending}
                    onClick={() =>
                      editMutation.mutate({
                        title: editTitle.trim(),
                        content: editContent.trim(),
                      })
                    }
                  >
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="mt-4 text-2xl font-bold text-foreground">{post.title}</h1>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {post.content}
                </p>
                <PostAttachments attachments={post.attachments} />
              </>
            )}
          </div>
        </article>
      </Card>

      <div className="mt-8">
        <DiscussionCommentsSection
          postId={postId}
          groupId={groupId}
          members={group?.members || []}
          userId={user?.id}
          isMember={isMember}
          highlightCommentId={highlightCommentId}
          onHighlightDone={clearHighlight}
        />
      </div>
    </div>
  );
};
