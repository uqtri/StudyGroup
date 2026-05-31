import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { groupApi } from '../../api/groupApi';
import { dashboardApi } from '../../api/dashboardApi';
import { useAuthStore } from '../../store/authStore';
import {
  GroupManageSkeleton,
  ChartGridSkeleton,
} from '../../components/skeletons/LoadingSkeletons';
import { BarChartCard } from '../../components/charts/BarChartCard';

export const GroupManagePage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();

  const { data: group, isLoading: groupLoading } = useQuery({
    queryKey: ['group', id],
    queryFn: () => groupApi.getById(id).then((r) => r.data.data),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['leader-stats'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
  });

  const canManage =
    group?.createdBy === user?.id ||
    group?.members?.some((m) => m.userId === user?.id && m.role === 'LEADER');

  if (groupLoading) return <GroupManageSkeleton />;

  if (!group || !canManage) return <Navigate to={`/groups/${id}`} replace />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Analytics: {group.name}
        </h1>
        <Link
          to={`/groups/${id}`}
          className="text-sm text-primary hover:underline"
        >
          ← Back to group
        </Link>
      </div>

      {statsLoading ? (
        <ChartGridSkeleton />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <BarChartCard
            title="Session Statistics"
            data={stats?.charts?.sessionStats || []}
          />
          <BarChartCard title="Member Growth" data={stats?.charts?.memberGrowth || []} />
        </div>
      )}
    </div>
  );
};
