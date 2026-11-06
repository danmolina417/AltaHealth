import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { paths } from '../../routes/paths';
import { AuthLayout } from './AuthLayout';
import { OrDivider } from './OrDivider';
import { signupSchema, type SignupValues } from './schemas';
import { SocialButtons } from './SocialButtons';
import { useAuth } from './useAuth';

export const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = ({ name, email }: SignupValues) => {
    login({ name, email });
    navigate(paths.home, { replace: true });
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your journey with Alta Health."
      footer={
        <>
          Already have an account?{' '}
          <Link to={paths.login} className="font-semibold text-brand-700 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <SocialButtons />
      <OrDivider />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <TextField
          label="Name"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" fullWidth>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
};
