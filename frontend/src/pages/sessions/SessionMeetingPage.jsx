import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { sessionApi } from '../../api/sessionApi';
import { attendanceApi } from '../../api/attendanceApi';
import { Button } from '../../components/common/Button';
import { MeetingRoomSkeleton } from '../../components/skeletons/LoadingSkeletons';

const SESSION_POLL_INTERVAL = 5000;

export const SessionMeetingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [connection, setConnection] = useState(null);
  const hasRecordedJoin = useRef(false);

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionApi.getById(id).then((r) => r.data.data),
    refetchInterval: SESSION_POLL_INTERVAL,
  });

  const { data: livekit, isLoading: tokenLoading, error: tokenError } = useQuery({
    queryKey: ['session-livekit', id],
    queryFn: () => sessionApi.getLiveKitToken(id).then((r) => r.data.data),
    enabled: session?.status === 'IN_PROGRESS',
    retry: false,
  });

  const recordJoinMutation = useMutation({
    mutationFn: () => attendanceApi.recordJoin(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session', id] });
    },
  });

  useEffect(() => {
    if (session && session.status !== 'IN_PROGRESS') {
      setConnection(null);
      if (connection) {
        navigate(`/sessions/${id}`, { replace: true });
      }
    }
  }, [session?.status, connection, id, navigate]);

  if (sessionLoading || tokenLoading) {
    return <MeetingRoomSkeleton />;
  }

  if (!session) {
    return <p className="p-8 text-center">Session not found</p>;
  }

  if (session.status !== 'IN_PROGRESS') {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Session not active</h1>
        <p className="mt-2 text-muted">
          This meeting room is only available while the session is in progress.
        </p>
        <Link to={`/sessions/${id}`} className="mt-6 inline-block text-primary hover:underline">
          ← Back to session
        </Link>
      </div>
    );
  }

  if (tokenError || !livekit) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Unable to join meeting</h1>
        <p className="mt-2 text-muted">
          LiveKit may not be configured. Check server environment variables.
        </p>
        <Link to={`/sessions/${id}`} className="mt-6 inline-block text-primary hover:underline">
          ← Back to session
        </Link>
      </div>
    );
  }

  const handleDisconnected = () => {
    navigate(`/sessions/${id}`);
  };

  const handleConnected = () => {
    setConnection('connected');
    if (!hasRecordedJoin.current) {
      hasRecordedJoin.current = true;
      recordJoinMutation.mutate();
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <div>
          <h1 className="font-semibold">{session.title}</h1>
          <p className="text-xs text-muted">{session.group?.name}</p>
        </div>
        <Button variant="outline" className="!py-1.5 !text-xs" onClick={handleDisconnected}>
          Leave room
        </Button>
      </div>

      <div className="flex-1">
        <LiveKitRoom
          video
          audio
          token={livekit.token}
          serverUrl={livekit.serverUrl}
          connect={session.status === 'IN_PROGRESS'}
          onDisconnected={handleDisconnected}
          onConnected={handleConnected}
          data-lk-theme="default"
          style={{ height: '100%' }}
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>

      {session.status !== 'IN_PROGRESS' && connection && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <p className="rounded-lg bg-surface px-6 py-4 text-foreground">
            The host has ended this session.
          </p>
        </div>
      )}
    </div>
  );
};
