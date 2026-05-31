import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionApi } from "../../api/sessionApi";
import { groupApi } from "../../api/groupApi";
import { useAuthStore } from "../../store/authStore";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Avatar } from "../../components/common/Avatar";
import { SessionDetailSkeleton } from "../../components/skeletons/LoadingSkeletons";
import { formatDateTime } from "../../utils/formatDate";
import { cn } from "../../utils/cn";

const statusStyles = {
  SCHEDULED: "bg-blue-500/10 text-blue-600",
  IN_PROGRESS: "bg-success/10 text-success",
  COMPLETED: "bg-muted/20 text-muted",
  CANCELLED: "bg-danger/10 text-danger",
};

export const SessionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  const { data: session, isLoading } = useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getById(id).then((r) => r.data.data),
    refetchInterval: 10000,
  });

  const { data: group } = useQuery({
    queryKey: ["group", session?.groupId],
    queryFn: () => groupApi.getById(session.groupId).then((r) => r.data.data),
    enabled: Boolean(session?.groupId),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["session", id] });
    qc.invalidateQueries({ queryKey: ["group-sessions"] });
    qc.invalidateQueries({ queryKey: ["manage-sessions"] });
  };

  const endMutation = useMutation({
    mutationFn: () => sessionApi.end(id),
    onSuccess: invalidate,
  });

  const notifyMutation = useMutation({
    mutationFn: () => sessionApi.notifyMembers(id),
    onSuccess: () => {
      invalidate();
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });

  if (isLoading) return <SessionDetailSkeleton />;

  if (!session) return <p>Session not found</p>;

  const canManage =
    isAuthenticated &&
    (session.createdBy === user?.id ||
      group?.members?.some(
        (m) => m.userId === user?.id && m.role === "LEADER",
      ));

  const isLive = session.status === "IN_PROGRESS";

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {session.title}
            </h1>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                statusStyles[session.status] || statusStyles.SCHEDULED,
              )}
            >
              {session.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-muted">{session.group?.name}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isLive && (
            <Button onClick={() => navigate(`/sessions/${id}/meeting`)}>
              Join now
            </Button>
          )}
          {canManage &&
            session.status !== "COMPLETED" &&
            session.status !== "CANCELLED" && (
              <Button
                variant="danger"
                loading={endMutation.isPending}
                onClick={() => endMutation.mutate()}
              >
                End now
              </Button>
            )}
          {canManage && (
            <Button
              variant="outline"
              loading={notifyMutation.isPending}
              onClick={() => notifyMutation.mutate()}
            >
              Notify members
            </Button>
          )}
        </div>
      </div>

      {session.description && <p>{session.description}</p>}

      <Card title="Schedule">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Start</dt>
            <dd>{formatDateTime(session.startTime)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">End</dt>
            <dd>
              {session.endTime ? formatDateTime(session.endTime) : "Ongoing"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card title="Attendance">
        <ul className="space-y-2">
          {session.attendances?.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2.5">
                <Avatar src={a.user.avatar} name={a.user.fullName} />
                {a.user.fullName}
              </span>
              {/* <span className={a.status === 'PRESENT' ? 'text-success' : 'text-muted'}>
                {a.status}
              </span> */}
            </li>
          ))}
          {!session.attendances?.length && (
            <li className="text-sm text-muted">No attendance records yet.</li>
          )}
        </ul>
      </Card>

      <Link to="/sessions" className="text-sm text-primary hover:underline">
        ← Back to sessions
      </Link>
    </div>
  );
};
