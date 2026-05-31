import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboardApi';
import { groupApi } from '../../api/groupApi';
import { Spinner } from '../../components/common/Spinner';
import { BarChartCard } from '../../components/charts/BarChartCard';
import { PieChartCard } from '../../components/charts/PieChartCard';
import { Card } from '../../components/common/Card';

export const AdminAnalyticsPage = () => {
  const { data: platform, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
  });

  const { data: groupsData } = useQuery({
    queryKey: ['admin-analytics-groups'],
    queryFn: () => groupApi.list({ limit: 100 }).then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const memberStats =
    groupsData?.items?.map((g) => ({
      name: g.name.slice(0, 12),
      value: g._count?.members || 0,
    })) || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <PieChartCard title="User Status Distribution" data={platform?.charts?.usersByStatus || []} />
        <BarChartCard title="Groups by Subject" data={platform?.charts?.groupsBySubject || []} />
      </div>
      <BarChartCard title="Members per Group" data={memberStats} />
      <Card title="Platform Summary">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-muted">Total Users</dt>
            <dd className="text-2xl font-bold">{platform?.totalUsers || 0}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Active Groups</dt>
            <dd className="text-2xl font-bold">{platform?.activeGroups || 0}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Pending Reports</dt>
            <dd className="text-2xl font-bold">{platform?.pendingReports || 0}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
};
