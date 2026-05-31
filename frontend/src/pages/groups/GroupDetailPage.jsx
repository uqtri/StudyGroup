import { useParams, Link, useNavigate } from "react-router-dom";

import { useState, useMemo } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Settings, Plus } from "lucide-react";

import { groupApi } from "../../api/groupApi";

import { sessionApi } from "../../api/sessionApi";

import { postsApi } from "../../api/postsApi";

import { useAuthStore } from "../../store/authStore";

import { Card } from "../../components/common/Card";

import {
  GroupDetailSkeleton,
  GroupSessionsTabSkeleton,
} from "../../components/skeletons/LoadingSkeletons";

import { Button } from "../../components/common/Button";
import { Avatar } from "../../components/common/Avatar";

import { formatDate, formatDateTime } from "../../utils/formatDate";

import { CreateSessionForm } from "../../components/sessions/CreateSessionForm";
import { SessionCard } from "../../components/sessions/SessionCard";
import { GroupResourcesTab } from "../../components/resources/GroupResourcesTab";
import { cn } from "../../utils/cn";

const baseTabs = [
  "Overview",
  "Members",
  "Sessions",
  "Resources",
  "Discussions",
];

const formatBadgeCount = (count) => (count > 99 ? "99+" : String(count));

export const GroupDetailPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const qc = useQueryClient();

  const { isAuthenticated, user } = useAuthStore();

  const [activeTab, setActiveTab] = useState("Overview");
  const [showCreateSession, setShowCreateSession] = useState(false);

  const { data: group, isLoading } = useQuery({
    queryKey: ["group", id],

    queryFn: () => groupApi.getById(id).then((r) => r.data.data),
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["group-sessions", id],

    queryFn: () =>
      sessionApi.list({ groupId: id, limit: 20 }).then((r) => r.data.data),

    enabled: activeTab === "Sessions",
    refetchInterval: activeTab === "Sessions" ? 10000 : false,
  });

  const { data: posts } = useQuery({
    queryKey: ["group-posts", id],

    queryFn: () =>
      postsApi.list({ groupId: id, limit: 20 }).then((r) => r.data.data),

    enabled: activeTab === "Discussions",
  });

  const joinMutation = useMutation({
    mutationFn: () => groupApi.requestJoin(id),

    onSuccess: () => qc.invalidateQueries({ queryKey: ["group", id] }),
  });

  const cancelMutation = useMutation({
    mutationFn: () => groupApi.cancelJoinRequest(id),

    onSuccess: () => qc.invalidateQueries({ queryKey: ["group", id] }),
  });

  const approveMutation = useMutation({
    mutationFn: (requestId) => groupApi.approveJoinRequest(requestId),

    onSuccess: () => qc.invalidateQueries({ queryKey: ["group", id] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId) => groupApi.rejectJoinRequest(requestId),

    onSuccess: () => qc.invalidateQueries({ queryKey: ["group", id] }),
  });

  const createSessionMutation = useMutation({
    mutationFn: (data) => sessionApi.create({ ...data, groupId: id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["group-sessions", id] });
      qc.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      setShowCreateSession(false);
    },
  });

  const isMember = group?.members?.some((m) => m.userId === user?.id);

  const canManage =
    isAuthenticated &&
    (group?.createdBy === user?.id ||
      group?.members?.some(
        (m) => m.userId === user?.id && m.role === "LEADER",
      ));

  const hasPendingRequest = group?.myJoinRequest?.status === "PENDING";

  const pendingRequests = group?.joinRequests || [];

  const requestCount = pendingRequests.length;

  const tabs = useMemo(() => {
    if (!canManage) return baseTabs;

    const result = [...baseTabs];

    result.splice(2, 0, "Requests");

    return result;
  }, [canManage]);

  if (isLoading) return <GroupDetailSkeleton />;

  if (!group) return <p className="p-8 text-center">Group not found</p>;

  const handleJoin = () => {
    if (!isAuthenticated) {
      navigate("/login");

      return;
    }

    joinMutation.mutate();
  };

  const handleCancel = () => {
    if (!isAuthenticated) {
      navigate("/login");

      return;
    }

    cancelMutation.mutate();
  };

  const isRequestActionPending =
    approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">{group.subject}</p>

          <h1 className="text-3xl font-bold text-foreground">{group.name}</h1>

          <p className="mt-2 max-w-2xl text-muted">{group.description}</p>
        </div>

        <div className="flex gap-2">
          {canManage && (
            <Link to={`/groups/${id}/manage`}>
              <Button variant="outline" className="gap-2">
                <Settings size={16} /> Manage
              </Button>
            </Link>
          )}

          {!isMember && hasPendingRequest && (
            <Button
              variant="outline"
              onClick={handleCancel}
              loading={cancelMutation.isPending}
            >
              Cancel Request
            </Button>
          )}

          {!isMember && !hasPendingRequest && (
            <Button onClick={handleJoin} loading={joinMutation.isPending}>
              Join Group
            </Button>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",

              activeTab === tab
                ? "bg-primary text-white"
                : "text-muted hover:bg-elevated",
            )}
          >
            {tab}

            {tab === "Requests" && requestCount > 0 && (
              <span
                className={cn(
                  "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold",

                  activeTab === tab
                    ? "bg-white/20 text-white"
                    : "bg-primary/10 text-primary",
                )}
              >
                {formatBadgeCount(requestCount)}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="About">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Leader</dt>

                <dd>{group.creator?.fullName}</dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-muted">Members</dt>

                <dd>
                  {group.members?.length || 0} / {group.maxMembers}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-muted">Sessions</dt>

                <dd>{group._count?.sessions || 0}</dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-muted">Resources</dt>

                <dd>{group._count?.resources || 0}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Recent Members">
            <ul className="space-y-2">
              {group.members?.slice(0, 5).map((m) => (
                <li key={m.id} className="flex justify-between text-sm">
                  <span className="flex items-center gap-2.5">
                    <Avatar src={m.user.avatar} name={m.user.fullName} />
                    {m.user.fullName}
                  </span>

                  <span className="rounded bg-elevated px-2 py-1.5 text-xs self-center">
                    {m.role}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {activeTab === "Members" && (
        <Card title={`Members (${group.members?.length || 0})`}>
          <ul className="divide-y divide-border">
            {group.members?.map((m) => (
              <li key={m.id} className="flex justify-between py-3 text-sm">
                <span className="flex items-center gap-2.5">
                  <Avatar src={m.user.avatar} name={m.user.fullName} />
                  {m.user.fullName}
                </span>

                <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs text-primary self-center">
                  {m.role}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {activeTab === "Requests" && canManage && (
        <Card title="Pending Join Requests">
          {pendingRequests.length ? (
            <ul className="space-y-3">
              {pendingRequests.map((req) => (
                <li
                  key={req.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <span className="flex items-center gap-2.5">
                    <Avatar src={req.user?.avatar} name={req.user?.fullName} />
                    {req.user?.fullName}
                  </span>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="!py-1.5 !text-xs"
                      loading={approveMutation.isPending}
                      disabled={isRequestActionPending}
                      onClick={() => approveMutation.mutate(req.id)}
                    >
                      Approve
                    </Button>

                    <Button
                      variant="danger"
                      className="!py-1.5 !text-xs"
                      loading={rejectMutation.isPending}
                      disabled={isRequestActionPending}
                      onClick={() => rejectMutation.mutate(req.id)}
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

      {activeTab === "Sessions" && (
        <div className="space-y-3">
          {sessionsLoading ? (
            <GroupSessionsTabSkeleton canManage={canManage} />
          ) : (
            <>
              {canManage && !showCreateSession && (
                <div className="flex justify-end">
                  <Button
                    className="gap-2"
                    onClick={() => setShowCreateSession(true)}
                  >
                    <Plus size={16} /> Create new session
                  </Button>
                </div>
              )}

              {canManage && showCreateSession && (
                <CreateSessionForm
                  loading={createSessionMutation.isPending}
                  onCancel={() => setShowCreateSession(false)}
                  onSubmit={(data, reset) =>
                    createSessionMutation.mutate(data, { onSuccess: reset })
                  }
                />
              )}

              {(sessions?.items || []).map((s) => (
                <SessionCard
                  key={s.id}
                  session={s}
                  canManage={canManage}
                  groupId={id}
                  queryKey={["group-sessions", id]}
                />
              ))}

              {!sessions?.items?.length && !showCreateSession && (
                <p className="text-muted">No sessions scheduled.</p>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "Resources" && (
        <GroupResourcesTab
          groupId={id}
          isMember={isMember}
          canManage={canManage}
          userId={user?.id}
        />
      )}

      {activeTab === "Discussions" && (
        <div className="space-y-4">
          {(posts?.items || []).map((p) => (
            <Card key={p.id}>
              <h3 className="font-semibold">{p.title}</h3>

              <p className="mt-1 text-xs text-muted">
                {p.author?.fullName} · {formatDate(p.createdAt)}
              </p>

              <p className="mt-2 text-sm text-muted">{p.content}</p>
            </Card>
          ))}

          {!posts?.items?.length && (
            <p className="text-muted">No discussions yet.</p>
          )}
        </div>
      )}

      <Link
        to="/groups"
        className="mt-8 inline-block text-sm text-primary hover:underline"
      >
        ← Back to explore
      </Link>
    </div>
  );
};
