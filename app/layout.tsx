import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Alta Health', template: '%s · Alta Health' },
};

export const viewport: Viewport = {
  themeColor: '#566f5e',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
