import type { ReactNode } from 'react';
import { NavLink } from '@/components/NavLink';
import { wellnessAreas } from './areas';

const itemBase = 'block whitespace-nowrap rounded-xl px-4 py-3 text-base';

export const AreasLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
    <nav
      aria-label="Wellness areas"
      className="rounded-panel bg-charcoal p-4 shadow-card lg:sticky lg:top-20 lg:w-64 lg:shrink-0 lg:p-6"
    >
      <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-wide text-gold">
        Wellness areas
      </p>
      <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {wellnessAreas.map(({ id, label, to }) => (
          <li key={id}>
            {to ? (
              <NavLink
                href={to}
                className={`${itemBase} focus-visible:outline-2 focus-visible:outline-gold`}
                activeClassName="bg-charcoal-active text-white shadow-card"
                inactiveClassName="text-white/80 hover:bg-charcoal-active/60"
              >
                {label}
              </NavLink>
            ) : (
              <span
                aria-disabled="true"
                title="Coming soon"
                className={`${itemBase} cursor-not-allowed text-white/50`}
              >
                {label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);
