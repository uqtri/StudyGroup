import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, List } from 'lucide-react';
import { sessionApi } from '../../api/sessionApi';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { Spinner } from '../../components/common/Spinner';
import { formatDateTime, formatDate } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

export const SessionsPage = () => {
  const [view, setView] = useState('list');

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

  const byDate = sessions.reduce((acc, s) => {
    const key = formatDate(s.startTime);
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Study sessions"
        description="Your scheduled study meetups"
        action={
          <div className="flex rounded-[var(--radius-control)] border border-border p-1">
            <button
              type="button"
              onClick={() => setView('list')}
              className={cn(
                'flex items-center gap-2 rounded-[calc(var(--radius-control)-2px)] px-3 py-2 text-sm font-medium transition',
                view === 'list' ? 'bg-primary text-white' : 'text-muted hover:text-foreground',
              )}
            >
              <List size={16} strokeWidth={1.75} /> List
            </button>
            <button
              type="button"
              onClick={() => setView('calendar')}
              className={cn(
                'flex items-center gap-2 rounded-[calc(var(--radius-control)-2px)] px-3 py-2 text-sm font-medium transition',
                view === 'calendar' ? 'bg-primary text-white' : 'text-muted hover:text-foreground',
              )}
            >
              <Calendar size={16} strokeWidth={1.75} /> Calendar
            </button>
          </div>
        }
      />

      {view === 'list' ? (
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
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {session.status}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
          {!sessions.length && <p className="text-muted">No sessions found.</p>}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(byDate).map(([date, daySessions]) => (
            <Card key={date} title={date}>
              {daySessions.map((s) => (
                <Link
                  key={s.id}
                  to={`/sessions/${s.id}`}
                  className="flex justify-between border-b border-border py-3 last:border-0 hover:text-primary"
                >
                  <span className="font-medium">{s.title}</span>
                  <span className="text-sm text-muted">{formatDateTime(s.startTime)}</span>
                </Link>
              ))}
            </Card>
          ))}
          {!sessions.length && <p className="text-muted">No sessions on calendar.</p>}
        </div>
      )}
    </div>
  );
};
