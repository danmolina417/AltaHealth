import { NavLink } from '@/components/NavLink';
import { primaryNav, secondaryNav, type NavItem } from './navItems';

const itemBase = 'flex items-center gap-4 rounded-xl px-4 py-3 text-base';

const NavEntry = ({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: (() => void) | undefined;
}) => {
  const { label, icon: Icon, to, end } = item;
  const layout = `${itemBase} ${collapsed ? 'justify-center px-0' : ''}`;
  // Keeps the label available to screen readers when only the icon is shown.
  const text = <span className={collapsed ? 'sr-only' : ''}>{label}</span>;

  if (!to) {
    return (
      <span
        aria-disabled="true"
        title={collapsed ? `${label} (coming soon)` : 'Coming soon'}
        className={`${layout} cursor-not-allowed text-ink-muted/60`}
      >
        <Icon size={24} weight="light" aria-hidden="true" />
        {text}
      </span>
    );
  }

  return (
    <NavLink
      href={to}
      end={end ?? false}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={`${layout} focus-visible:outline-2 focus-visible:outline-brand-600`}
      activeClassName="bg-sand font-medium text-ink"
      inactiveClassName="text-ink-muted hover:bg-sand/60"
    >
      <Icon size={24} weight="light" aria-hidden="true" />
      {text}
    </NavLink>
  );
};

const NavGroup = ({
  items,
  collapsed,
  onNavigate,
}: {
  items: NavItem[];
  collapsed: boolean;
  onNavigate?: (() => void) | undefined;
}) => (
  <ul className="flex flex-col gap-1">
    {items.map((item) => (
      <li key={item.id}>
        <NavEntry item={item} collapsed={collapsed} onNavigate={onNavigate} />
      </li>
    ))}
  </ul>
);

export const MainNav = ({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) => (
  <nav aria-label="Main" className="flex flex-col gap-4">
    <NavGroup items={primaryNav} collapsed={collapsed} onNavigate={onNavigate} />
    <hr className="border-line" />
    <NavGroup items={secondaryNav} collapsed={collapsed} onNavigate={onNavigate} />
  </nav>
);
