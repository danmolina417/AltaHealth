import Link from 'next/link';
import { paths } from '@/lib/paths';
import { AuthLayout } from './AuthLayout';
import { OrDivider } from './OrDivider';
import { SignupForm } from './SignupForm';
import { SocialButtons } from './SocialButtons';

export const SignupPage = () => (
  <AuthLayout
    title="Create your account"
    subtitle="Start your journey with Alta Health."
    footer={
      <>
        Already have an account?{' '}
        <Link href={paths.login} className="font-semibold text-brand-700 hover:underline">
          Log in
        </Link>
      </>
    }
  >
    <SocialButtons />
    <OrDivider />
    <SignupForm />
  </AuthLayout>
);
