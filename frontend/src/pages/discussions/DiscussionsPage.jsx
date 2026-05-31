import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Plus } from 'lucide-react';
import { postsApi } from '../../api/postsApi';
import { commentsApi } from '../../api/commentsApi';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { Input } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';
import { formatDate } from '../../utils/formatDate';

export const DiscussionsPage = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [groupId, setGroupId] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['discussions'],
    queryFn: () => postsApi.list({ limit: 30 }).then((r) => r.data.data),
  });

  const createPost = useMutation({
    mutationFn: (payload) => postsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['discussions'] });
      setShowForm(false);
      setTitle('');
      setContent('');
      setGroupId('');
    },
  });

  const addComment = useMutation({
    mutationFn: (payload) => commentsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['discussions'] });
      setReplyTo(null);
      setReplyContent('');
    },
  });

  const posts = data?.items || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Discussions"
        description="Forum-style conversations across your groups"
        action={
          <Button onClick={() => setShowForm((s) => !s)} className="gap-2">
            <Plus size={16} strokeWidth={1.75} /> New post
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <h3 className="mb-4 font-semibold">Create Post</h3>
          <div className="space-y-3">
            <Input
              label="Group ID"
              placeholder="Paste group UUID"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            />
            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div>
              <label className="text-sm font-medium">Content</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <Button
              loading={createPost.isPending}
              onClick={() => createPost.mutate({ groupId, title, content })}
            >
              Publish
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <MessageSquare size={18} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="mt-1 text-xs text-muted">
                  {post.author?.fullName} · {formatDate(post.createdAt)} ·{' '}
                  {post._count?.comments || 0} comments
                </p>
                <p className="mt-3 text-sm text-muted">{post.content}</p>
                <button
                  type="button"
                  className="mt-3 text-sm text-primary hover:underline"
                  onClick={() => setReplyTo(replyTo === post.id ? null : post.id)}
                >
                  Reply
                </button>
                {replyTo === post.id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      className="flex-1 rounded-lg border border-border px-3 py-2 text-sm"
                      placeholder="Write a comment..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <Button
                      onClick={() =>
                        addComment.mutate({ postId: post.id, content: replyContent })
                      }
                      loading={addComment.isPending}
                    >
                      Post
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
        {!posts.length && (
          <Card>
            <p className="text-center text-muted">No discussions yet. Start the conversation!</p>
          </Card>
        )}
      </div>
    </div>
  );
};
