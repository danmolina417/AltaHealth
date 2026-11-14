type Listener = () => void;

let pathname = '/';
const listeners = new Set<Listener>();

/** In-memory stand-in for the Next.js App Router location, shared by the navigation mocks. */
export const memoryRouter = {
  getPathname: () => pathname,
  navigate: (href: string) => {
    pathname = new URL(href, 'http://localhost').pathname;
    listeners.forEach((listener) => listener());
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  reset: (path = '/') => {
    pathname = path;
  },
};

/** Thrown by the mocked `redirect()`, like Next's NEXT_REDIRECT error. */
export class RedirectError extends Error {
  constructor(readonly href: string) {
    super(`NEXT_REDIRECT ${href}`);
  }
}
