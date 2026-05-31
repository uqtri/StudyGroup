import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
import { postsApi } from '../../api/postsApi';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { DiscussionsPageSkeleton } from '../../components/skeletons/LoadingSkeletons';
import { formatDate } from '../../utils/formatDate';

export const DiscussionsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['discussions'],
    queryFn: () =>
      postsApi
        .list({ limit: 30, myGroups: 'true', sortBy: 'createdAt', sortOrder: 'desc' })
        .then((r) => r.data.data),
  });

  const posts = data?.items || [];

  if (isLoading) return <DiscussionsPageSkeleton />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Discussions"
        description="Forum-style conversations across your groups"
      />

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <MessageSquare size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {post.group?.name}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {post.author?.fullName} · {formatDate(post.createdAt)}
                </p>
                <p className="mt-3 line-clamp-3 text-sm text-muted">{post.content}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3">
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                    <MessageSquare size={16} />
                    {post.commentCount ?? post._count?.comments ?? 0} comments
                  </span>
                  <Link
                    to={`/groups/${post.group?.id}/discussions/${post.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {!posts.length && (
          <Card>
            <p className="text-center text-muted">
              No discussions yet. Start a conversation in one of your groups.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
