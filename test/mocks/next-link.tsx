import type { AnchorHTMLAttributes } from 'react';
import { memoryRouter } from '../memoryRouter';

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean | null;
};

/** A plain anchor that moves the in-memory router on click. */
const Link = ({ href, replace, scroll, prefetch, onClick, ...props }: LinkProps) => (
  <a
    href={href}
    {...props}
    onClick={(event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      memoryRouter.navigate(href);
    }}
  />
);

export default Link;
