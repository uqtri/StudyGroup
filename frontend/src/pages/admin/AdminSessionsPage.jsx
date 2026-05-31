import { useQuery } from '@tanstack/react-query';
import { sessionApi } from '../../api/sessionApi';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { formatDateTime } from '../../utils/formatDate';

export const AdminSessionsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: () => sessionApi.list({ limit: 100 }).then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

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
                <td>{s.group?.name}</td>
                <td>{formatDateTime(s.startTime)}</td>
                <td>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
