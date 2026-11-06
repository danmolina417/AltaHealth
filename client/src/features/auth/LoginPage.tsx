import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { paths } from '../../routes/paths';
import { AuthLayout } from './AuthLayout';
import { OrDivider } from './OrDivider';
import { loginSchema, type LoginValues } from './schemas';
import { SocialButtons } from './SocialButtons';
import { useAuth } from './useAuth';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = ({ email }: LoginValues) => {
    login({ email });
    navigate(paths.home, { replace: true });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your Alta Health account."
      footer={
        <>
          New here?{' '}
          <Link to={paths.signup} className="font-semibold text-brand-700 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <SocialButtons />
      <OrDivider />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" fullWidth>
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
};
