import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportApi } from '../../api/reportApi';
import { Card } from '../../components/common/Card';
import { TableSkeleton } from '../../components/skeletons/LoadingSkeletons';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';

export const AdminReportsPage = () => {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: () => reportApi.list({ limit: 50 }).then((r) => r.data.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => reportApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-reports'] }),
  });

  if (isLoading) return <TableSkeleton rows={8} cols={5} />;

  const reports = data?.items || [];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {reports.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium">
                  {r.reportedType} · {r.status}
                </p>
                <p className="mt-1 text-sm text-muted">{r.reason}</p>
                <p className="mt-2 text-xs text-muted">
                  By {r.reporter?.fullName} · {formatDate(r.createdAt)}
                </p>
              </div>
              {r.status === 'PENDING' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => updateMutation.mutate({ id: r.id, status: 'RESOLVED' })}
                  >
                    Resolve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => updateMutation.mutate({ id: r.id, status: 'DISMISSED' })}
                  >
                    Dismiss
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
        {!reports.length && <p className="text-muted">No reports.</p>}
      </div>
    </div>
  );
};
