import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, TrendingUp, FileText, Shield, Flag } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import { StatCard } from '../../components/common/StatCard';
import { Spinner } from '../../components/common/Spinner';
import { BarChartCard } from '../../components/charts/BarChartCard';
import { PieChartCard } from '../../components/charts/PieChartCard';
import { Card } from '../../components/common/Card';
import { formatDateTime } from '../../utils/formatDate';
import { ROLES } from '../../constants/roles';

export const DashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (data?.role === ROLES.ADMIN) return <AdminDashboard data={data} />;
  if (data?.role === ROLES.LEADER) return <LeaderDashboard data={data} />;
  return <StudentDashboard data={data} />;
};

const StudentDashboard = ({ data }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-text">Student Dashboard</h2>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="My Groups" value={data.totalGroups} icon={Users} />
      <StatCard label="Upcoming Sessions" value={data.upcomingSessions?.length || 0} icon={Calendar} />
      <StatCard label="Attendance Rate" value={`${data.attendanceRate}%`} icon={TrendingUp} />
      <StatCard label="Recent Resources" value={data.recentResources?.length || 0} icon={FileText} />
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <PieChartCard title="Attendance Breakdown" data={data.charts?.attendanceBreakdown || []} />
      <BarChartCard title="Sessions by Month" data={data.charts?.sessionsByMonth || []} />
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Upcoming Sessions">
        <ul className="space-y-3">
          {data.upcomingSessions?.map((s) => (
            <li key={s.id} className="rounded-lg border border-slate-100 p-3">
              <p className="font-medium">{s.title}</p>
              <p className="text-xs text-slate-500">
                {s.group?.name} · {formatDateTime(s.startTime)}
              </p>
            </li>
          ))}
          {!data.upcomingSessions?.length && (
            <p className="text-sm text-slate-500">No upcoming sessions</p>
          )}
        </ul>
      </Card>
      <Card title="Recent Resources">
        <ul className="space-y-3">
          {data.recentResources?.map((r) => (
            <li key={r.id} className="rounded-lg border border-slate-100 p-3">
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-slate-500">{r.group?.name}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </div>
);

const LeaderDashboard = ({ data }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-text">Leader Dashboard</h2>
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="My Groups" value={data.groupCount} icon={Users} />
      <StatCard label="Total Members" value={data.totalMembers} icon={Users} />
      <StatCard label="Groups Managed" value={data.groups?.length || 0} icon={Calendar} />
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <PieChartCard title="Session Statistics" data={data.charts?.sessionStats || []} />
      <BarChartCard
        title="Members per Group"
        data={data.charts?.memberGrowth || []}
        dataKey="members"
      />
    </div>
    <Card title="Your Groups">
      <div className="grid gap-3 sm:grid-cols-2">
        {data.groups?.map((g) => (
          <div key={g.id} className="rounded-lg border border-slate-100 p-4">
            <p className="font-semibold">{g.name}</p>
            <p className="text-sm text-slate-500">
              {g.members} members · {g.sessions} sessions
            </p>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const AdminDashboard = ({ data }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-text">Admin Dashboard</h2>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Users" value={data.totalUsers} icon={Users} />
      <StatCard label="Active Groups" value={data.activeGroups} icon={Shield} />
      <StatCard label="Pending Reports" value={data.pendingReports} icon={Flag} />
      <StatCard label="Platform Health" value="Good" icon={TrendingUp} trend="All systems operational" />
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <PieChartCard title="Users by Status" data={data.charts?.usersByStatus || []} />
      <BarChartCard title="Groups by Subject" data={data.charts?.groupsBySubject || []} />
    </div>
    <Card title="Recent Reports">
      <ul className="space-y-2">
        {data.recentReports?.map((r) => (
          <li key={r.id} className="flex justify-between rounded-lg border border-slate-100 p-3 text-sm">
            <span>
              {r.reportedType} — {r.reason.slice(0, 50)}...
            </span>
            <span className="text-slate-500">{r.status}</span>
          </li>
        ))}
      </ul>
    </Card>
  </div>
);
