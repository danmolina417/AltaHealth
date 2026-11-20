/// <reference types="vite/client" />
import { act, cleanup, render } from '@testing-library/react';
import { Component, useSyncExternalStore, type ComponentType, type ReactNode } from 'react';
import { memoryRouter, RedirectError } from './memoryRouter';

type Layout = ComponentType<{ children: ReactNode }>;

// Routes are read from app/ the way Next's file-system router reads them, so tests
// render the real pages and layouts. The root layout (<html>/<body>) is left out.
const pageModules = import.meta.glob<{ default: ComponentType }>('/app/**/page.tsx', {
  eager: true,
});
const layoutModules = import.meta.glob<{ default: Layout }>('/app/*/**/layout.tsx', {
  eager: true,
});

const isGroup = (segment: string) => /^\(.+\)$/.test(segment);
const isDynamic = (segment: string) => /^\[.+\]$/.test(segment);
const toPattern = (segment: string) =>
  segment.startsWith('[...')
    ? '.+'
    : isDynamic(segment)
      ? '[^/]+'
      : segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const routes = Object.entries(pageModules)
  .map(([file, module]) => {
    const segments = file.split('/').slice(2, -1);
    const urlSegments = segments.filter((segment) => !isGroup(segment));
    const layouts = segments
      .map((_, i) => layoutModules[`/app/${segments.slice(0, i + 1).join('/')}/layout.tsx`])
      .flatMap((layout) => (layout ? [layout.default] : []));

    return {
      regex: new RegExp(`^/${urlSegments.map(toPattern).join('/')}$`),
      dynamic: urlSegments.some(isDynamic),
      Page: module.default,
      layouts,
    };
  })
  .sort((a, b) => Number(a.dynamic) - Number(b.dynamic));

type ServerComponent<P> = (props: P) => Promise<ReactNode>;

const isAsync = <P,>(
  component: ComponentType<P>,
): component is ComponentType<P> & ServerComponent<P> =>
  component.constructor.name === 'AsyncFunction';

/**
 * Async (server) components can't render on the client, so call them directly and
 * await their output, like the RSC renderer does. Sync components render as usual.
 */
const renderComponent = async <P extends object>(component: ComponentType<P>, props: P) => {
  if (isAsync(component)) return component(props);
  const Sync = component;
  return <Sync {...props} />;
};

const resolveRoute = async (pathname: string): Promise<ReactNode> => {
  const route = routes.find(({ regex }) => regex.test(pathname));
  if (!route) throw new Error(`No page matches ${pathname}`);

  let tree = await renderComponent(route.Page, {});
  for (const Layout of [...route.layouts].reverse()) {
    tree = await renderComponent(Layout, { children: tree });
  }
  return tree;
};

/**
 * The resolved tree for the current location. Server components are resolved
 * outside React (no Suspense) and the finished tree is handed to React, like the
 * App Router does with the RSC payload.
 */
type RouteState = { tree: ReactNode } | { error: unknown } | null;

let routeState: RouteState = null;
let inflight: Promise<void> | null = null;
const routeListeners = new Set<() => void>();

const loadRoute = () => {
  const version = memoryRouter.getVersion();
  const task = resolveRoute(memoryRouter.getPathname()).then(
    (tree) => ({ tree }),
    (error: unknown) => ({ error }),
  );

  inflight = task.then((next) => {
    if (version !== memoryRouter.getVersion()) return; // a newer navigation won
    if ('error' in next && next.error instanceof RedirectError) {
      memoryRouter.navigate(next.error.href); // starts the next load
      return;
    }
    routeState = next;
    routeListeners.forEach((listener) => listener());
  });
};

memoryRouter.subscribe(loadRoute);

/** Waits until the current navigation (and any redirects it causes) has rendered. */
const routeSettled = async () => {
  while (inflight) {
    const current = inflight;
    await current;
    if (inflight === current) inflight = null;
  }
};

const subscribeRoute = (listener: () => void) => {
  routeListeners.add(listener);
  return () => {
    routeListeners.delete(listener);
  };
};

const RouteTree = () => {
  const state = useSyncExternalStore(subscribeRoute, () => routeState);
  if (!state) return null;
  if ('error' in state) throw state.error;
  return state.tree;
};

/** Follows `redirect()` calls made while rendering, like the App Router's redirect boundary. */
class RedirectBoundary extends Component<{ children: ReactNode }, { error: unknown }> {
  override state = { error: null as unknown };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  override componentDidCatch(error: unknown) {
    if (error instanceof RedirectError) {
      routeState = null; // drop the redirecting page while the target loads
      memoryRouter.navigate(error.href);
      this.setState({ error: null });
    }
  }

  override render() {
    const { error } = this.state;
    if (error === null) return this.props.children;
    if (error instanceof RedirectError) return null;
    throw error;
  }
}

/**
 * Loads the whole app at `path`, like a full page load: any previously rendered app
 * is unmounted, and this waits for server layouts and redirects to finish.
 */
export const renderApp = async (path: string) => {
  cleanup();
  memoryRouter.reset(path);
  routeState = null;
  loadRoute();

  let result!: ReturnType<typeof render>;
  await act(async () => {
    result = render(
      <RedirectBoundary>
        <RouteTree />
      </RedirectBoundary>,
      {
        onCaughtError: (error, { componentStack }) => {
          if (!(error instanceof RedirectError)) console.error(error, componentStack);
        },
      },
    );
    await routeSettled();
  });
  return result;
};
