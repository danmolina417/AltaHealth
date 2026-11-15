import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/AuthProvider';
import './globals.css';

const serif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--next-font-serif',
  display: 'swap',
});
const inter = Inter({ subsets: ['latin'], variable: '--next-font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Alta Health', template: '%s · Alta Health' },
};

export const viewport: Viewport = {
  themeColor: '#5c6b55',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${inter.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
