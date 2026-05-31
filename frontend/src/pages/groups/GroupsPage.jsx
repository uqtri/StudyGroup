import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Users } from 'lucide-react';
import { groupApi } from '../../api/groupApi';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';

export const GroupsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupApi.list({ limit: 50 }).then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const groups = data?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-text">Study Groups</h2>
        <Link to="/groups/create">
          <Button>
            <Plus size={16} /> Create Group
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <Link key={group.id} to={`/groups/${group.id}`}>
            <Card className="transition hover:border-primary/40 hover:shadow-md">
              <h3 className="font-semibold text-text">{group.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{group.subject}</p>
              <p className="mt-3 line-clamp-2 text-sm text-slate-600">{group.description}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Users size={14} />
                {group._count?.members || 0} members · {group._count?.sessions || 0} sessions
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {!groups.length && (
        <p className="text-center text-slate-500">No groups yet. Create one to get started.</p>
      )}
    </div>
  );
};
