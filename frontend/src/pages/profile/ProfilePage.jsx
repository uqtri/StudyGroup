import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../api/authApi';
import { userApi } from '../../api/userApi';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { getApiError } from '../../api/client';

export const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.me().then((r) => r.data.data),
    initialData: user,
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

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Profile</h2>
      <Card>
        <p className="mb-4 text-sm text-muted">{profile?.email}</p>
        <p className="mb-4 text-xs text-muted">Roles: {profile?.roles?.join(', ')}</p>
        <form
          className="space-y-4"
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
        >
          <Input label="Full name" {...register('fullName')} />
          <Input label="Avatar URL" {...register('avatar')} />
          <div>
            <label className="text-sm font-medium text-foreground">Bio</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
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
    </div>
  );
};
