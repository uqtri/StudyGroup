import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionApi } from '../../api/sessionApi';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { formatDateTime } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

const statusStyles = {
  SCHEDULED: 'bg-blue-500/10 text-blue-600',
  IN_PROGRESS: 'bg-success/10 text-success',
  COMPLETED: 'bg-muted/20 text-muted',
  CANCELLED: 'bg-danger/10 text-danger',
};

export const SessionCard = ({ session, canManage, groupId, queryKey }) => {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey });
    if (groupId) qc.invalidateQueries({ queryKey: ['group', groupId] });
    qc.invalidateQueries({ queryKey: ['session', session.id] });
  };

  const endMutation = useMutation({
    mutationFn: () => sessionApi.end(session.id),
    onSuccess: invalidate,
  });

  const notifyMutation = useMutation({
    mutationFn: () => sessionApi.notifyMembers(session.id),
    onSuccess: () => {
      invalidate();
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });

  const isLive = session.status === 'IN_PROGRESS';
  const canEnd = canManage && session.status !== 'COMPLETED' && session.status !== 'CANCELLED';
  const canJoin = isLive;

  return (
    <Card className="!p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{session.title}</p>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                statusStyles[session.status] || statusStyles.SCHEDULED,
              )}
            >
              {session.status.replace('_', ' ')}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            {formatDateTime(session.startTime)}
            {session.endTime ? ` – ${formatDateTime(session.endTime)}` : ' – Ongoing'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {canJoin && (
            <Button
              className="!py-1.5 !text-xs"
              onClick={() => navigate(`/sessions/${session.id}/meeting`)}
            >
              Join now
            </Button>
          )}

          {canManage && (
            <Button
              variant="outline"
              className="!py-1.5 !text-xs"
              loading={notifyMutation.isPending}
              onClick={() => notifyMutation.mutate()}
            >
              Notify members
            </Button>
          )}

          {canEnd && (
            <Button
              variant="danger"
              className="!py-1.5 !text-xs"
              loading={endMutation.isPending}
              onClick={() => endMutation.mutate()}
            >
              End now
            </Button>
          )}

          <Button
            variant="outline"
            className="!py-1.5 !text-xs"
            onClick={() => navigate(`/sessions/${session.id}`)}
          >
            Details
          </Button>
        </div>
      </div>
    </Card>
  );
};
