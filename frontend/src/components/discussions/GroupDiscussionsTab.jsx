import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { postsApi } from '../../api/postsApi';
import { Button } from '../common/Button';
import { CreateDiscussionForm } from './CreateDiscussionForm';
import { DiscussionPostCard } from './DiscussionPostCard';
import { GroupDiscussionsTabSkeleton } from '../skeletons/LoadingSkeletons';
import { cn } from '../../utils/cn';

export const GroupDiscussionsTab = ({
  groupId,
  members = [],
  userId,
  isMember,
  highlightPostId,
  highlightCommentId,
  onHighlightDone,
}) => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [sortBy, setSortBy] = useState('votes');

  useEffect(() => {
    if (!highlightPostId || !isMember) return;
    const suffix = highlightCommentId ? `?comment=${highlightCommentId}` : '';
    navigate(`/groups/${groupId}/discussions/${highlightPostId}${suffix}`, { replace: true });
    onHighlightDone?.();
  }, [highlightPostId, highlightCommentId, groupId, isMember, navigate, onHighlightDone]);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['group-posts', groupId, sortBy],
    queryFn: () =>
      postsApi
        .list({ groupId, limit: 30, sortBy, sortOrder: 'desc' })
        .then((r) => r.data.data),
    enabled: isMember,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => postsApi.create({ ...payload, groupId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['group-posts', groupId] });
      setShowCreate(false);
    },
  });

  if (!isMember) {
    return (
      <p className="text-muted">Join this group to view and join discussions.</p>
    );
  }

  if (isLoading) {
    return <GroupDiscussionsTabSkeleton count={3} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {[
            { id: 'votes', label: 'Top' },
            { id: 'createdAt', label: 'Recent' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSortBy(opt.id)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                sortBy === opt.id
                  ? 'bg-primary text-white'
                  : 'bg-elevated text-muted hover:text-foreground',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {!showCreate && (
          <Button className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> Create new Discussion
          </Button>
        )}
      </div>

      {showCreate && (
        <CreateDiscussionForm
          loading={createMutation.isPending}
          onCancel={() => setShowCreate(false)}
          onSubmit={(data, reset) =>
            createMutation.mutate(data, { onSuccess: reset })
          }
        />
      )}

      {(posts?.items || []).map((post) => (
        <DiscussionPostCard
          key={post.id}
          post={post}
          groupId={groupId}
          userId={userId}
          isMember={isMember}
        />
      ))}

      {!posts?.items?.length && !showCreate && (
        <p className="text-muted">No discussions yet. Start the conversation!</p>
      )}
    </div>
  );
};
