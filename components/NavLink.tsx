'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';

interface NavLinkProps extends Omit<ComponentProps<typeof Link>, 'href' | 'className'> {
  href: string;
  /** Match only the exact path, so a parent route is not active on every child page. */
  end?: boolean;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

const isActivePath = (pathname: string, href: string, end: boolean) =>
  pathname === href || (!end && pathname.startsWith(href.endsWith('/') ? href : `${href}/`));

/** A link that knows whether it points at the current page, like React Router's NavLink. */
export const NavLink = ({
  href,
  end = false,
  className = '',
  activeClassName = '',
  inactiveClassName = '',
  ...props
}: NavLinkProps) => {
  const isActive = isActivePath(usePathname(), href, end);

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`${className} ${isActive ? activeClassName : inactiveClassName}`.trim()}
      {...props}
    />
  );
};
