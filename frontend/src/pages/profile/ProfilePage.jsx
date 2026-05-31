import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { userApi } from '../../api/userApi';
import { groupApi } from '../../api/groupApi';
import { resourceApi } from '../../api/resourceApi';
import { dashboardApi } from '../../api/dashboardApi';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { getApiError } from '../../api/client';
import { Users, TrendingUp, FileText } from 'lucide-react';

export const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.me().then((r) => r.data.data),
    initialData: user,
  });

  const { data: stats } = useQuery({
    queryKey: ['profile-stats'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
  });

  const { data: groups } = useQuery({
    queryKey: ['profile-groups'],
    queryFn: () => groupApi.list({ myGroups: 'true', limit: 10 }).then((r) => r.data.data),
  });

  const { data: resources } = useQuery({
    queryKey: ['profile-resources'],
    queryFn: () => resourceApi.list({ limit: 10 }).then((r) => r.data.data),
  });

  const { register, handleSubmit } = useForm({
    values: {
      fullName: profile?.fullName || '',
      bio: profile?.bio || '',
      avatar: profile?.avatar || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => userApi.update(user.id, data),
    onSuccess: ({ data }) => {
      setUser(data.data);
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const myResources = (resources?.items || []).filter((r) => r.uploadedBy === user?.id);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title="Profile" description="Your account, stats, and activity" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="My Groups" value={groups?.items?.length || 0} icon={Users} />
        <StatCard label="Attendance Rate" value={`${stats?.attendanceRate ?? 0}%`} icon={TrendingUp} />
        <StatCard label="Resources Uploaded" value={myResources.length} icon={FileText} />
      </div>

      <Card title="Personal Information">
        <p className="mb-4 text-sm text-muted">{profile?.email}</p>
        <p className="mb-4 text-xs text-muted">Roles: {profile?.roles?.join(', ')}</p>
        <form className="space-y-4" onSubmit={handleSubmit((d) => mutation.mutate(d))}>
          <Input label="Full name" {...register('fullName')} />
          <Input label="Avatar URL" {...register('avatar')} />
          <div>
            <label className="text-sm font-medium text-foreground">Bio</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm"
              rows={3}
              {...register('bio')}
            />
          </div>
          {mutation.isError && (
            <p className="text-sm text-danger">{getApiError(mutation.error).message}</p>
          )}
          {mutation.isSuccess && <p className="text-sm text-success">Profile updated!</p>}
          <Button type="submit" loading={mutation.isPending}>
            Save changes
          </Button>
        </form>
      </Card>

      <Card title="Joined Groups">
        <ul className="space-y-2">
          {(groups?.items || []).map((g) => (
            <li key={g.id}>
              <Link to={`/groups/${g.id}`} className="text-sm text-primary hover:underline">
                {g.name} — {g.subject}
              </Link>
            </li>
          ))}
          {!groups?.items?.length && <p className="text-sm text-muted">No groups joined.</p>}
        </ul>
      </Card>

      <Card title="Uploaded Resources">
        <ul className="space-y-2">
          {myResources.map((r) => (
            <li key={r.id} className="text-sm">
              {r.title}
            </li>
          ))}
          {!myResources.length && <p className="text-sm text-muted">No uploads yet.</p>}
        </ul>
      </Card>
    </div>
  );
};
