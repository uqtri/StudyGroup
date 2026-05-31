import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { sessionApi } from '../../api/sessionApi';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { formatDateTime } from '../../utils/formatDate';

export const SessionsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => sessionApi.list({ limit: 50, mySessions: 'true' }).then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const sessions = data?.items || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Study Sessions</h2>
      <div className="space-y-3">
        {sessions.map((session) => (
          <Link key={session.id} to={`/sessions/${session.id}`}>
            <Card className="transition hover:border-primary/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{session.title}</h3>
                  <p className="text-sm text-muted">
                    {session.group?.name} · {formatDateTime(session.startTime)}
                  </p>
                </div>
                <span className="rounded-full bg-gradient-brand/15 px-3 py-1 text-xs font-semibold text-primary">
                  {session.status}
                </span>
              </div>
            </Card>
          </Link>
        ))}
        {!sessions.length && <p className="text-muted">No sessions found.</p>}
      </div>
    </div>
  );
};
