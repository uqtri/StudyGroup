import { useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupApi } from '../../api/groupApi';
import { sessionApi } from '../../api/sessionApi';
import { resourceApi } from '../../api/resourceApi';
import { dashboardApi } from '../../api/dashboardApi';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { Spinner } from '../../components/common/Spinner';
import { Input } from '../../components/common/Input';
import { BarChartCard } from '../../components/charts/BarChartCard';
import { cn } from '../../utils/cn';
import { formatDateTime } from '../../utils/formatDate';

const tabs = ['Overview', 'Members', 'Requests', 'Sessions', 'Resources', 'Analytics'];

const formatBadgeCount = (count) => (count > 99 ? '99+' : String(count));

export const GroupManagePage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('Overview');
  const [sessionForm, setSessionForm] = useState({
    title: '',
    startTime: '',
    endTime: '',
    meetingLink: '',
  });

  const { data: group, isLoading } = useQuery({
    queryKey: ['group', id],
    queryFn: () => groupApi.getById(id).then((r) => r.data.data),
  });

  const { data: sessions } = useQuery({
    queryKey: ['manage-sessions', id],
    queryFn: () => sessionApi.list({ groupId: id }).then((r) => r.data.data),
  });

  const { data: resources } = useQuery({
    queryKey: ['manage-resources', id],
    queryFn: () => resourceApi.list({ groupId: id }).then((r) => r.data.data),
  });

  const { data: stats } = useQuery({
    queryKey: ['leader-stats'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
    enabled: activeTab === 'Analytics',
  });

  const createSession = useMutation({
    mutationFn: (data) => sessionApi.create({ ...data, groupId: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['manage-sessions', id] }),
  });

  const approveJoinRequest = useMutation({
    mutationFn: (requestId) => groupApi.approveJoinRequest(requestId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['group', id] }),
  });

  const rejectJoinRequest = useMutation({
    mutationFn: (requestId) => groupApi.rejectJoinRequest(requestId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['group', id] }),
  });

  const isLeader = group?.members?.some(
    (m) => m.userId === user?.id && m.role === 'LEADER',
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!isLeader) return <Navigate to={`/groups/${id}`} replace />;

  const pendingRequests = group?.joinRequests || [];
  const requestCount = pendingRequests.length;
  const isRequestActionPending = approveJoinRequest.isPending || rejectJoinRequest.isPending;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Manage: {group.name}</h1>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
              activeTab === tab ? 'bg-primary text-white' : 'text-muted hover:bg-elevated',
            )}
          >
            {tab}
            {tab === 'Requests' && requestCount > 0 && (
              <span
                className={cn(
                  'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold',
                  activeTab === tab
                    ? 'bg-white/20 text-white'
                    : 'bg-primary/10 text-primary',
                )}
              >
                {formatBadgeCount(requestCount)}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <Card className="mt-6" title="Group Overview">
          <p className="text-muted">{group.description}</p>
          <p className="mt-4 text-sm">
            {group.members?.length} members · {group._count?.sessions} sessions
          </p>
        </Card>
      )}

      {activeTab === 'Members' && (
        <Card className="mt-6" title="Members">
          <ul className="divide-y divide-border">
            {group.members?.map((m) => (
              <li key={m.id} className="flex justify-between py-3 text-sm">
                <span className="flex items-center gap-2.5">
                  <Avatar src={m.user.avatar} name={m.user.fullName} />
                  {m.user.fullName}
                </span>
                <span className="text-muted">{m.role}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {activeTab === 'Requests' && (
        <Card className="mt-6" title="Pending Join Requests">
          {pendingRequests.length ? (
            <ul className="space-y-3">
              {pendingRequests.map((req) => (
                <li key={req.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="flex items-center gap-2.5">
                    <Avatar src={req.user?.avatar} name={req.user?.fullName} />
                    {req.user?.fullName}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="!py-1.5 !text-xs"
                      loading={approveJoinRequest.isPending}
                      disabled={isRequestActionPending}
                      onClick={() => approveJoinRequest.mutate(req.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      className="!py-1.5 !text-xs"
                      loading={rejectJoinRequest.isPending}
                      disabled={isRequestActionPending}
                      onClick={() => rejectJoinRequest.mutate(req.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No pending requests.</p>
          )}
        </Card>
      )}

      {activeTab === 'Sessions' && (
        <div className="mt-6 space-y-6">
          <Card title="Create Session">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Title"
                value={sessionForm.title}
                onChange={(e) => setSessionForm((f) => ({ ...f, title: e.target.value }))}
              />
              <Input
                label="Meeting Link"
                value={sessionForm.meetingLink}
                onChange={(e) => setSessionForm((f) => ({ ...f, meetingLink: e.target.value }))}
              />
              <Input
                label="Start"
                type="datetime-local"
                value={sessionForm.startTime}
                onChange={(e) => setSessionForm((f) => ({ ...f, startTime: e.target.value }))}
              />
              <Input
                label="End"
                type="datetime-local"
                value={sessionForm.endTime}
                onChange={(e) => setSessionForm((f) => ({ ...f, endTime: e.target.value }))}
              />
            </div>
            <Button
              className="mt-4"
              loading={createSession.isPending}
              onClick={() =>
                createSession.mutate({
                  ...sessionForm,
                  startTime: new Date(sessionForm.startTime).toISOString(),
                  endTime: new Date(sessionForm.endTime).toISOString(),
                })
              }
            >
              Create Session
            </Button>
          </Card>
          <Card title="Scheduled Sessions">
            {(sessions?.items || []).map((s) => (
              <div key={s.id} className="border-b border-border py-3 last:border-0">
                <p className="font-medium">{s.title}</p>
                <p className="text-xs text-muted">{formatDateTime(s.startTime)} · {s.status}</p>
              </div>
            ))}
          </Card>
        </div>
      )}

      {activeTab === 'Resources' && (
        <Card className="mt-6" title="Group Resources">
          {(resources?.items || []).map((r) => (
            <div key={r.id} className="border-b border-border py-3">
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-muted">{r.uploader?.fullName}</p>
            </div>
          ))}
        </Card>
      )}

      {activeTab === 'Analytics' && stats && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <BarChartCard title="Session Statistics" data={stats.charts?.sessionStats || []} />
          <BarChartCard title="Member Growth" data={stats.charts?.memberGrowth || []} />
        </div>
      )}
    </div>
  );
};
