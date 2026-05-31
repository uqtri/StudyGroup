import { useQuery } from '@tanstack/react-query';
import { Users, FolderOpen, TrendingUp } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import { StatCard } from '../../components/common/StatCard';
import { AdminDashboardSkeleton } from '../../components/skeletons/LoadingSkeletons';
import { BarChartCard } from '../../components/charts/BarChartCard';
import { PieChartCard } from '../../components/charts/PieChartCard';
import { Card } from '../../components/common/Card';

export const AdminDashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
  });

  if (isLoading) return <AdminDashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Users" value={data?.totalUsers || 0} icon={Users} />
        <StatCard label="Active Groups" value={data?.activeGroups || 0} icon={FolderOpen} />
        <StatCard label="Platform Health" value="Good" icon={TrendingUp} trend="Operational" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PieChartCard title="Users by Status" data={data?.charts?.usersByStatus || []} />
        <BarChartCard title="Groups by Subject" data={data?.charts?.groupsBySubject || []} />
      </div>

      <BarChartCard title="Members per Group" data={data?.charts?.membersPerGroup || []} />

      <Card title="Platform Summary">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">Total Users</dt>
            <dd className="text-2xl font-bold">{data?.totalUsers || 0}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Active Groups</dt>
            <dd className="text-2xl font-bold">{data?.activeGroups || 0}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
};
