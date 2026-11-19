'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { authClient } from '@/lib/authClient';
import { paths } from '@/lib/paths';
import { signupErrorMessage } from './authErrors';
import { FormError } from './FormError';
import { signupSchema, type SignupValues } from './schemas';

export const SignupForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  // Better Auth signs the new user in, so a successful sign-up lands on home.
  const onSubmit = async ({ name, email, password }: SignupValues) => {
    const { error } = await authClient.signUp.email({ name, email, password });
    if (error) {
      setError('root', { message: signupErrorMessage(error) });
      return;
    }
    router.replace(paths.home);
    router.refresh();
  };

  return (
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
        placeholder="you@example.com"
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
      <FormError message={errors.root?.message} />
      <Button type="submit" fullWidth disabled={isSubmitting}>
        Create account
      </Button>
    </form>
  );
};
