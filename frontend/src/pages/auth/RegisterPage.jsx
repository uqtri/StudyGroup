import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { registerSchema } from '../../schemas/authSchemas';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { getApiError } from '../../api/client';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: (data) => authApi.register(data),
    onSuccess: ({ data }) => {
      const { user, accessToken, refreshToken } = data.data;
      setAuth(user, accessToken, refreshToken);
      navigate('/dashboard');
    },
    onError: (err) => {
      const { message } = getApiError(err);
      setError('root', { message });
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-gradient-brand">Create account</h2>
      <p className="mt-1 text-sm text-muted">Join StudyHub and start learning together</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <Input
          label="Full name"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        {errors.root && <p className="text-sm text-danger">{errors.root.message}</p>}
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Register
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};
