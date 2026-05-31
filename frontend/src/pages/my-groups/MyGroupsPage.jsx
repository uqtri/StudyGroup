import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, ArrowRight } from 'lucide-react';
import { groupApi } from '../../api/groupApi';
import { sessionApi } from '../../api/sessionApi';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { Spinner } from '../../components/common/Spinner';
import { formatDateTime } from '../../utils/formatDate';

export const MyGroupsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-groups'],
    queryFn: () => groupApi.list({ myGroups: 'true', limit: 50 }).then((r) => r.data.data),
  });

  const { data: sessionsData } = useQuery({
    queryKey: ['my-upcoming-sessions'],
    queryFn: () =>
      sessionApi.list({ mySessions: 'true', upcoming: 'true', limit: 5 }).then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const groups = data?.items || [];
  const sessions = sessionsData?.items || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="My groups"
        description="Your joined groups and upcoming activity"
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Joined Groups ({groups.length})</h2>
          {groups.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {groups.map((g) => (
                <Link key={g.id} to={`/groups/${g.id}`}>
                  <Card className="h-full transition hover:border-primary/30">
                    <h3 className="font-semibold">{g.name}</h3>
                    <p className="text-sm text-muted">{g.subject}</p>
                    <div className="mt-4 flex gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {g._count?.members || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {g._count?.sessions || 0} sessions
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-muted">You haven&apos;t joined any groups yet.</p>
              <Link to="/groups" className="mt-4 inline-block text-primary hover:underline">
                Explore groups →
              </Link>
            </Card>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Upcoming Sessions</h2>
          <div className="space-y-3">
            {sessions.map((s) => (
              <Link key={s.id} to={`/sessions/${s.id}`}>
                <Card className="!p-4">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-xs text-muted">{s.group?.name}</p>
                  <p className="mt-1 text-xs text-primary">{formatDateTime(s.startTime)}</p>
                </Card>
              </Link>
            ))}
            {!sessions.length && (
              <p className="text-sm text-muted">No upcoming sessions.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
