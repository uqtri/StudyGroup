import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupApi } from '../../api/groupApi';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';

export const GroupDetailPage = () => {
  const { id } = useParams();
  const qc = useQueryClient();

  const { data: group, isLoading } = useQuery({
    queryKey: ['group', id],
    queryFn: () => groupApi.getById(id).then((r) => r.data.data),
  });

  const joinMutation = useMutation({
    mutationFn: () => groupApi.requestJoin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['group', id] }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!group) return <p>Group not found</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{group.name}</h2>
          <p className="text-muted">{group.subject}</p>
        </div>
        <Button variant="outline" onClick={() => joinMutation.mutate()} loading={joinMutation.isPending}>
          Request to Join
        </Button>
      </div>

      <p className="text-muted">{group.description}</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title={`Members (${group.members?.length || 0})`}>
          <ul className="space-y-2">
            {group.members?.map((m) => (
              <li key={m.id} className="flex justify-between text-sm">
                <span>{m.user.fullName}</span>
                <span className="rounded bg-elevated px-2 py-0.5 text-xs">{m.role}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Stats">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Sessions</dt>
              <dd>{group._count?.sessions || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Resources</dt>
              <dd>{group._count?.resources || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Posts</dt>
              <dd>{group._count?.posts || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Leader</dt>
              <dd>{group.creator?.fullName}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Link to="/groups" className="text-sm text-primary hover:underline">
        ← Back to groups
      </Link>
    </div>
  );
};
