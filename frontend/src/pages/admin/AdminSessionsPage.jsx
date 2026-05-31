import { useQuery } from '@tanstack/react-query';
import { sessionApi } from '../../api/sessionApi';
import { Card } from '../../components/common/Card';
import { GroupAvatar } from '../../components/common/GroupAvatar';
import { TableSkeleton } from '../../components/skeletons/LoadingSkeletons';
import { formatDateTime } from '../../utils/formatDate';
import { StatusBadge, sessionStatusStyles } from '../../utils/statusStyles';

export const AdminSessionsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: () => sessionApi.list({ limit: 100 }).then((r) => r.data.data),
  });

  if (isLoading) return <TableSkeleton rows={8} cols={5} />;

  const sessions = data?.items || [];

  return (
    <Card title={`All Sessions (${sessions.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="pb-2">Title</th>
              <th className="pb-2">Group</th>
              <th className="pb-2">Start</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-b border-border">
                <td className="py-3 font-medium">{s.title}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <GroupAvatar name={s.group?.name} className="h-8 w-8 text-sm" />
                    <span>{s.group?.name}</span>
                  </div>
                </td>
                <td className="text-muted">{formatDateTime(s.startTime)}</td>
                <td>
                  <StatusBadge status={s.status} styles={sessionStatusStyles} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
