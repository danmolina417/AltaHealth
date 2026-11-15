'use client';

import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { paths } from '@/lib/paths';
import { useAuth } from './useAuth';

/**
 * Sends signed-out visitors to the login page. Auth state only lives in memory,
 * so a full page load (including the server render) always lands on login.
 */
export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    redirect(paths.login);
  }

  return children;
};
