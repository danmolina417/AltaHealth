import Link from 'next/link';
import { paths } from '@/lib/paths';
import { AuthLayout } from './AuthLayout';
import { LoginForm } from './LoginForm';
import { OrDivider } from './OrDivider';
import { SocialButtons } from './SocialButtons';

export const LoginPage = () => (
  <AuthLayout
    title="Welcome back"
    subtitle="Log in to your Alta Health account."
    footer={
      <>
        New here?{' '}
        <Link href={paths.signup} className="font-semibold text-brand-700 hover:underline">
          Create an account
        </Link>
      </>
    }
  >
    <SocialButtons />
    <OrDivider />
    <LoginForm />
  </AuthLayout>
);
