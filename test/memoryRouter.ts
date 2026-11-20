type Listener = () => void;

let pathname = '/';
// Bumped on every navigation/refresh so the route tree (and its server layouts) re-resolves.
let version = 0;
const listeners = new Set<Listener>();

const notify = () => {
  version += 1;
  listeners.forEach((listener) => listener());
};

/** In-memory stand-in for the Next.js App Router location, shared by the navigation mocks. */
export const memoryRouter = {
  getPathname: () => pathname,
  getVersion: () => version,
  navigate: (href: string) => {
    pathname = new URL(href, 'http://localhost').pathname;
    notify();
  },
  /** Like `router.refresh()`: re-renders the current route's server components. */
  refresh: () => notify(),
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  reset: (path = '/') => {
    pathname = path;
    version += 1;
  },
};

/** Thrown by the mocked `redirect()`, like Next's NEXT_REDIRECT error. */
export class RedirectError extends Error {
  constructor(readonly href: string) {
    super(`NEXT_REDIRECT ${href}`);
  }
}
