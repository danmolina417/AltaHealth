import type { ReactNode } from 'react';
import logo from '../../assets/alta-logo.png';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => (
  <div className="flex min-h-dvh items-center justify-center px-4 py-8">
    <div className="w-full max-w-sm">
      <img
        src={logo}
        alt="Alta Holistic Health & Wellness"
        className="mx-auto mb-6 w-full max-w-72 mix-blend-multiply"
      />
      <div className="rounded-card border border-line bg-surface p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
      <p className="mt-6 text-center text-sm text-ink-muted">{footer}</p>
    </div>
  </div>
);
