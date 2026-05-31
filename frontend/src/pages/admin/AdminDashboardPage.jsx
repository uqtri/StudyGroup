import { useQuery } from '@tanstack/react-query';
import { Users, FolderOpen, Flag, TrendingUp } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import { StatCard } from '../../components/common/StatCard';
import { Spinner } from '../../components/common/Spinner';
import { BarChartCard } from '../../components/charts/BarChartCard';
import { PieChartCard } from '../../components/charts/PieChartCard';
import { Card } from '../../components/common/Card';

export const AdminDashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={data?.totalUsers || 0} icon={Users} />
        <StatCard label="Active Groups" value={data?.activeGroups || 0} icon={FolderOpen} />
        <StatCard label="Pending Reports" value={data?.pendingReports || 0} icon={Flag} />
        <StatCard label="Platform Health" value="Good" icon={TrendingUp} trend="Operational" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PieChartCard title="Users by Status" data={data?.charts?.usersByStatus || []} />
        <BarChartCard title="Groups by Subject" data={data?.charts?.groupsBySubject || []} />
      </div>

      <Card title="Recent Reports">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="pb-2">Type</th>
                <th className="pb-2">Reason</th>
                <th className="pb-2">Reporter</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentReports?.map((r) => (
                <tr key={r.id} className="border-b border-border">
                  <td className="py-3">{r.reportedType}</td>
                  <td className="max-w-xs truncate">{r.reason}</td>
                  <td>{r.reporter?.fullName}</td>
                  <td>
                    <span className="rounded-full bg-elevated px-2 py-0.5 text-xs">{r.status}</span>
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
