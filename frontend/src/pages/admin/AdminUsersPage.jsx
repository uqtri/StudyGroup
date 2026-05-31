import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ban, ShieldCheck } from 'lucide-react';
import { userApi } from '../../api/userApi';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { TableSkeleton } from '../../components/skeletons/LoadingSkeletons';
import {
  StatusBadge,
  userStatusLabel,
  userStatusStyles,
} from '../../utils/statusStyles';

export const AdminUsersPage = () => {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => userApi.list({ limit: 50 }).then((r) => r.data.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => userApi.setStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  if (isLoading) return <TableSkeleton rows={8} cols={5} />;

  const users = data?.items || [];

  const handleToggleBan = (user) => {
    const nextStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    statusMutation.mutate({ id: user.id, status: nextStatus });
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Roles</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isBanned = u.status === 'SUSPENDED';
                const isAdmin = u.roles?.includes('ADMIN');
                const isPending =
                  statusMutation.isPending && statusMutation.variables?.id === u.id;

                return (
                  <tr key={u.id} className="border-b border-border">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={u.avatar} name={u.fullName} />
                        <span className="font-medium text-foreground">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td>{u.roles?.join(', ')}</td>
                    <td>
                      <StatusBadge
                        status={u.status}
                        styles={userStatusStyles}
                        label={userStatusLabel(u.status)}
                      />
                    </td>
                    <td>
                      {!isAdmin && (
                        <Button
                          variant={isBanned ? 'outline' : 'danger'}
                          className="!p-2"
                          loading={isPending}
                          onClick={() => handleToggleBan(u)}
                          aria-label={isBanned ? 'Unban user' : 'Ban user'}
                          title={isBanned ? 'Unban' : 'Ban'}
                        >
                          {isBanned ? (
                            <ShieldCheck size={16} strokeWidth={1.75} />
                          ) : (
                            <Ban size={16} strokeWidth={1.75} />
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
