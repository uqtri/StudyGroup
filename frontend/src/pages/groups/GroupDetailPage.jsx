import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import { groupApi } from '../../api/groupApi';
import { sessionApi } from '../../api/sessionApi';
import { resourceApi } from '../../api/resourceApi';
import { postsApi } from '../../api/postsApi';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

const tabs = ['Overview', 'Members', 'Sessions', 'Resources', 'Discussions'];

export const GroupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Overview');

  const { data: group, isLoading } = useQuery({
    queryKey: ['group', id],
    queryFn: () => groupApi.getById(id).then((r) => r.data.data),
  });

  const { data: sessions } = useQuery({
    queryKey: ['group-sessions', id],
    queryFn: () => sessionApi.list({ groupId: id, limit: 20 }).then((r) => r.data.data),
    enabled: activeTab === 'Sessions',
  });

  const { data: resources } = useQuery({
    queryKey: ['group-resources', id],
    queryFn: () => resourceApi.list({ groupId: id, limit: 20 }).then((r) => r.data.data),
    enabled: activeTab === 'Resources',
  });

  const { data: posts } = useQuery({
    queryKey: ['group-posts', id],
    queryFn: () => postsApi.list({ groupId: id, limit: 20 }).then((r) => r.data.data),
    enabled: activeTab === 'Discussions',
  });

  const joinMutation = useMutation({
    mutationFn: () => groupApi.requestJoin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['group', id] }),
  });

  const isMember = group?.members?.some((m) => m.userId === user?.id);
  const canManage =
    isAuthenticated &&
    (group?.createdBy === user?.id ||
      group?.members?.some((m) => m.userId === user?.id && m.role === 'LEADER'));

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!group) return <p className="p-8 text-center">Group not found</p>;

  const handleJoin = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    joinMutation.mutate();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">{group.subject}</p>
          <h1 className="text-3xl font-bold text-foreground">{group.name}</h1>
          <p className="mt-2 max-w-2xl text-muted">{group.description}</p>
        </div>
        <div className="flex gap-2">
          {canManage && (
            <Link to={`/groups/${id}/manage`}>
              <Button variant="outline" className="gap-2">
                <Settings size={16} /> Manage
              </Button>
            </Link>
          )}
          {!isMember && (
            <Button onClick={handleJoin} loading={joinMutation.isPending}>
              Join Group
            </Button>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition',
              activeTab === tab
                ? 'bg-primary text-white'
                : 'text-muted hover:bg-elevated',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="About">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Leader</dt>
                <dd>{group.creator?.fullName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Members</dt>
                <dd>{group.members?.length || 0} / {group.maxMembers}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Sessions</dt>
                <dd>{group._count?.sessions || 0}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Resources</dt>
                <dd>{group._count?.resources || 0}</dd>
              </div>
            </dl>
          </Card>
          <Card title="Recent Members">
            <ul className="space-y-2">
              {group.members?.slice(0, 5).map((m) => (
                <li key={m.id} className="flex justify-between text-sm">
                  <span>{m.user.fullName}</span>
                  <span className="rounded bg-elevated px-2 py-0.5 text-xs">{m.role}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {activeTab === 'Members' && (
        <Card title={`Members (${group.members?.length || 0})`}>
          <ul className="divide-y divide-border">
            {group.members?.map((m) => (
              <li key={m.id} className="flex justify-between py-3 text-sm">
                <span>{m.user.fullName}</span>
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs text-primary">
                  {m.role}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {activeTab === 'Sessions' && (
        <div className="space-y-3">
          {(sessions?.items || []).map((s) => (
            <Link key={s.id} to={`/sessions/${s.id}`}>
              <Card className="!p-4 transition hover:border-primary/30">
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-muted">{formatDateTime(s.startTime)}</p>
              </Card>
            </Link>
          ))}
          {!sessions?.items?.length && <p className="text-muted">No sessions scheduled.</p>}
        </div>
      )}

      {activeTab === 'Resources' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {(resources?.items || []).map((r) => (
            <Card key={r.id}>
              <h3 className="font-medium">{r.title}</h3>
              <p className="mt-1 text-xs text-muted">{formatDate(r.createdAt)}</p>
              <a href={r.fileUrl} target="_blank" rel="noreferrer" className="mt-3 text-sm text-primary hover:underline">
                Download
              </a>
            </Card>
          ))}
          {!resources?.items?.length && <p className="text-muted">No resources shared yet.</p>}
        </div>
      )}

      {activeTab === 'Discussions' && (
        <div className="space-y-4">
          {(posts?.items || []).map((p) => (
            <Card key={p.id}>
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-1 text-xs text-muted">
                {p.author?.fullName} · {formatDate(p.createdAt)}
              </p>
              <p className="mt-2 text-sm text-muted">{p.content}</p>
            </Card>
          ))}
          {!posts?.items?.length && <p className="text-muted">No discussions yet.</p>}
        </div>
      )}

      <Link to="/groups" className="mt-8 inline-block text-sm text-primary hover:underline">
        ← Back to explore
      </Link>
    </div>
  );
};
