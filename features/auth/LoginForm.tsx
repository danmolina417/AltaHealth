'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { authClient } from '@/lib/authClient';
import { paths } from '@/lib/paths';
import { loginErrorMessage } from './authErrors';
import { FormError } from './FormError';
import { loginSchema, type LoginValues } from './schemas';

export const LoginForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async ({ email, password }: LoginValues) => {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      setError('root', { message: loginErrorMessage(error) });
      return;
    }
    router.replace(paths.home);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
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
      <FormError message={errors.root?.message} />
      {/* After a successful login it stays disabled until the home page replaces this one;
          setError makes the submit unsuccessful, so it's enabled again after an error. */}
      <Button type="submit" fullWidth disabled={isSubmitting || isSubmitSuccessful}>
        Log in
      </Button>
    </form>
  );
};
