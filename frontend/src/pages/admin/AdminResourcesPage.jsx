import { useQuery } from '@tanstack/react-query';
import { resourceApi } from '../../api/resourceApi';
import { Card } from '../../components/common/Card';
import { TableSkeleton } from '../../components/skeletons/LoadingSkeletons';
import { formatDate } from '../../utils/formatDate';

export const AdminResourcesPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-resources'],
    queryFn: () => resourceApi.list({ limit: 100 }).then((r) => r.data.data),
  });

  if (isLoading) return <TableSkeleton rows={8} cols={4} />;

  const resources = data?.items || [];

  return (
    <Card title={`All Resources (${resources.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="pb-2">Title</th>
              <th className="pb-2">Group</th>
              <th className="pb-2">Uploader</th>
              <th className="pb-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.id} className="border-b border-border">
                <td className="py-3 font-medium">{r.title}</td>
                <td>{r.group?.name}</td>
                <td>{r.uploader?.fullName}</td>
                <td>{formatDate(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
