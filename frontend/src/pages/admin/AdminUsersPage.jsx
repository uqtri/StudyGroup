import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../api/userApi';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';

export const AdminUsersPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => userApi.list({ limit: 50 }).then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const users = data?.items || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Manage Users</h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-muted">
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Roles</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border">
                  <td className="py-3">{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.roles?.join(', ')}</td>
                  <td>
                    <span className="rounded-full bg-elevated px-2 py-0.5 text-xs">{u.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
