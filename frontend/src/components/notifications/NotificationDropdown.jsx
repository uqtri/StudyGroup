import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { notificationApi } from '../../api/notificationApi';
import { cn } from '../../utils/cn';
import { formatDateTime } from '../../utils/formatDate';
import { NotificationListSkeleton } from '../skeletons/LoadingSkeletons';

const POLL_INTERVAL = 30000;

export const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: unreadData } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: () => notificationApi.unreadCount().then((r) => r.data.data),
    refetchInterval: POLL_INTERVAL,
  });

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () =>
      notificationApi.list({ limit: 20 }).then((r) => r.data.data),
    enabled: open,
    refetchInterval: open ? POLL_INTERVAL : false,
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => notificationApi.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });

  const unreadCount = unreadData?.count || 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }

    if (notification.link) {
      setOpen(false);
      navigate(notification.link);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-[var(--radius-control)] p-2 text-muted transition hover:bg-elevated hover:text-foreground active:scale-[0.98]"
      >
        <Bell size={20} strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllReadMutation.mutate()}
                className="text-xs text-primary hover:underline"
                disabled={markAllReadMutation.isPending}
              >
                Mark all read
              </button>
            )}
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {notificationsLoading ? (
              <NotificationListSkeleton count={5} />
            ) : (notifications?.items || []).length ? (
              notifications.items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => handleNotificationClick(n)}
                    className={cn(
                      'w-full px-4 py-3 text-left transition hover:bg-elevated',
                      !n.isRead && 'bg-primary/5',
                      n.link && 'cursor-pointer',
                    )}
                  >
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted line-clamp-2">{n.message}</p>
                    <p className="mt-1 text-[10px] text-muted">{formatDateTime(n.createdAt)}</p>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-sm text-muted">No notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
