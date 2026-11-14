/// <reference types="vite/client" />
import { render } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { Component, type ComponentType, type ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/AuthProvider';
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

const RouteTree = () => {
  const pathname = usePathname();
  const route = routes.find(({ regex }) => regex.test(pathname));
  if (!route) throw new Error(`No page matches ${pathname}`);

  const { Page, layouts } = route;
  return layouts.reduceRight<ReactNode>(
    (children, Layout) => <Layout>{children}</Layout>,
    <Page />,
  );
};

/** Follows `redirect()` calls, like the App Router's own redirect boundary. */
class RedirectBoundary extends Component<{ children: ReactNode }, { error: unknown }> {
  override state = { error: null as unknown };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  override componentDidCatch(error: unknown) {
    if (error instanceof RedirectError) {
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

/** Renders the whole app at `path`, with the same providers as the root layout. */
export const renderApp = (path: string) => {
  memoryRouter.reset(path);

  return render(
    <AuthProvider>
      <RedirectBoundary>
        <RouteTree />
      </RedirectBoundary>
    </AuthProvider>,
    {
      onCaughtError: (error, { componentStack }) => {
        if (!(error instanceof RedirectError)) console.error(error, componentStack);
      },
    },
  );
};
