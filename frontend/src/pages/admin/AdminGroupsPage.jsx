import { useQuery } from '@tanstack/react-query';
import { groupApi } from '../../api/groupApi';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';

export const AdminGroupsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-groups'],
    queryFn: () => groupApi.list({ limit: 100 }).then((r) => r.data.data),
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
      <h2 className="text-2xl font-bold text-text">All Groups</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <Card key={g.id}>
            <h3 className="font-semibold">{g.name}</h3>
            <p className="text-sm text-slate-500">{g.subject}</p>
            <p className="mt-2 text-xs text-slate-400">
              {g._count?.members} members · Status: {g.status}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};
