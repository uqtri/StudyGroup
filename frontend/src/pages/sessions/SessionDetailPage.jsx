import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { sessionApi } from '../../api/sessionApi';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { formatDateTime } from '../../utils/formatDate';

export const SessionDetailPage = () => {
  const { id } = useParams();

  const { data: session, isLoading } = useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionApi.getById(id).then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!session) return <p>Session not found</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text">{session.title}</h2>
      <p className="text-slate-500">{session.group?.name}</p>
      <p>{session.description}</p>

      <Card title="Schedule">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Start</dt>
            <dd>{formatDateTime(session.startTime)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">End</dt>
            <dd>{formatDateTime(session.endTime)}</dd>
          </div>
          {session.meetingLink && (
            <div className="flex justify-between">
              <dt className="text-slate-500">Meeting</dt>
              <dd>
                <a href={session.meetingLink} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                  Join link
                </a>
              </dd>
            </div>
          )}
        </dl>
      </Card>

      <Card title="Attendance">
        <ul className="space-y-2">
          {session.attendances?.map((a) => (
            <li key={a.id} className="flex justify-between text-sm">
              <span>{a.user.fullName}</span>
              <span className={a.status === 'PRESENT' ? 'text-success' : 'text-slate-500'}>
                {a.status}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Link to="/sessions" className="text-sm text-primary hover:underline">
        ← Back to sessions
      </Link>
    </div>
  );
};
