'use client';

import { useAuth } from '@/features/auth/useAuth';
import { getGreeting } from './greeting';

/** Time-of-day greeting with the signed-in user's name, worked out in the browser. */
export const Greeting = ({ id }: { id: string }) => {
  const { user } = useAuth();
  const greeting = user?.name ? `${getGreeting()}, ${user.name}` : getGreeting();

  return (
    <h1 id={id} className="text-2xl font-bold sm:text-3xl">
      {greeting}
    </h1>
  );
};
