import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { groupSchema } from '../../schemas/groupSchemas';
import { groupApi } from '../../api/groupApi';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { getApiError } from '../../api/client';

export const CreateGroupPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(groupSchema), defaultValues: { maxMembers: 20 } });

  const mutation = useMutation({
    mutationFn: (data) => groupApi.create(data),
    onSuccess: ({ data }) => navigate(`/groups/${data.data.id}`),
    onError: (err) => setError('root', { message: getApiError(err).message }),
  });

  return (
    <Card title="Create Study Group">
      <form className="space-y-4" onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input label="Subject" error={errors.subject?.message} {...register('subject')} />
        <div>
          <label className="text-sm font-medium text-foreground">Description</label>
          <textarea
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            rows={4}
            {...register('description')}
          />
        </div>
        <Input
          label="Max members"
          type="number"
          error={errors.maxMembers?.message}
          {...register('maxMembers')}
        />
        {errors.root && <p className="text-sm text-danger">{errors.root.message}</p>}
        <Button type="submit" loading={mutation.isPending}>
          Create Group
        </Button>
      </form>
    </Card>
  );
};
