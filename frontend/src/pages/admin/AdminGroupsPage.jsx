import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Users, Ban, ShieldCheck } from 'lucide-react';
import { groupApi } from '../../api/groupApi';
import { dashboardApi } from '../../api/dashboardApi';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import {
  AdminGroupsSkeleton,
  ChartGridSkeleton,
} from '../../components/skeletons/LoadingSkeletons';
import { BarChartCard } from '../../components/charts/BarChartCard';
import {
  StatusBadge,
  groupStatusLabel,
  groupStatusStyles,
} from '../../utils/statusStyles';

const GroupStatsPanel = ({ groupId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-group-stats', groupId],
    queryFn: () => dashboardApi.getGroupStats(groupId).then((r) => r.data.data),
    enabled: Boolean(groupId),
  });

  if (isLoading) return <ChartGridSkeleton />;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BarChartCard title="Session Statistics" data={data?.charts?.sessionStats || []} />
      <BarChartCard title="Member Growth" data={data?.charts?.memberGrowth || []} />
    </div>
  );
};

export const AdminGroupsPage = () => {
  const qc = useQueryClient();
  const [expandedId, setExpandedId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-groups'],
    queryFn: () => groupApi.list({ limit: 100 }).then((r) => r.data.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => groupApi.setStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-groups'] }),
  });

  if (isLoading) return <AdminGroupsSkeleton />;

  const groups = data?.items || [];

  const handleToggleBan = (group) => {
    const nextStatus = group.status === 'ARCHIVED' ? 'ACTIVE' : 'ARCHIVED';
    statusMutation.mutate({ id: group.id, status: nextStatus });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => {
          const isBanned = g.status === 'ARCHIVED';
          const isExpanded = expandedId === g.id;
          const isPending =
            statusMutation.isPending && statusMutation.variables?.id === g.id;

          return (
            <Card key={g.id} className="flex flex-col">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--radius-card)] bg-primary/10 text-xl font-bold text-primary">
                {g.name.charAt(0)}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-foreground">{g.name}</h3>
                <StatusBadge
                  status={g.status}
                  styles={groupStatusStyles}
                  label={groupStatusLabel(g.status)}
                />
              </div>
              <p className="text-sm text-primary">{g.subject}</p>
              <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{g.description}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                <Users size={14} />
                {g._count?.members || 0} members
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setExpandedId(isExpanded ? null : g.id)}
                >
                  {isExpanded ? 'Hide stats' : 'View more'}
                </Button>
                <Button
                  variant={isBanned ? 'outline' : 'danger'}
                  className="!p-2.5"
                  loading={isPending}
                  onClick={() => handleToggleBan(g)}
                  aria-label={isBanned ? 'Unban group' : 'Ban group'}
                  title={isBanned ? 'Unban' : 'Ban'}
                >
                  {isBanned ? (
                    <ShieldCheck size={16} strokeWidth={1.75} />
                  ) : (
                    <Ban size={16} strokeWidth={1.75} />
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {expandedId && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Analytics: {groups.find((g) => g.id === expandedId)?.name}
          </h2>
          <GroupStatsPanel groupId={expandedId} />
        </div>
      )}

      {!groups.length && (
        <p className="py-12 text-center text-muted">No study groups found.</p>
      )}
    </div>
  );
};
