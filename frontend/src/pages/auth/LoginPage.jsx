import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { loginSchema } from '../../schemas/authSchemas';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { getApiError } from '../../api/client';
import { getHomePath } from '../../utils/authRedirect';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: ({ data }) => {
      const { user, accessToken, refreshToken } = data.data;
      setAuth(user, accessToken, refreshToken);
      navigate(getHomePath(user));
    },
    onError: (err) => {
      const { message } = getApiError(err);
      setError('root', { message });
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h2>
      <p className="mt-1 text-sm text-muted">Sign in to your StudyHub account</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        {errors.root && <p className="text-sm text-danger">{errors.root.message}</p>}
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Sign in
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        No account?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Register
        </Link>
      </p>

      <p className="mt-6 rounded-xl border border-border bg-elevated/80 p-3 text-xs text-muted">
        Demo: admin@studyhub.com / leader@studyhub.com / student@studyhub.com — Password123!
      </p>
    </div>
  );
};
