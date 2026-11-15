import { useSyncExternalStore } from 'react';
import { memoryRouter, RedirectError } from '../memoryRouter';

const router = {
  push: (href: string) => memoryRouter.navigate(href),
  replace: (href: string) => memoryRouter.navigate(href),
  back: () => undefined,
  forward: () => undefined,
  refresh: () => undefined,
  prefetch: () => undefined,
};

export const usePathname = () =>
  useSyncExternalStore(memoryRouter.subscribe, memoryRouter.getPathname, memoryRouter.getPathname);

export const useRouter = () => router;

export const redirect = (href: string): never => {
  throw new RedirectError(href);
};
