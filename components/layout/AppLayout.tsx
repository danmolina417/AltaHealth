'use client';

import { CaretLeft, CaretRight, List, X } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import icon from '@/assets/alta-icon.png';
import { paths } from '@/lib/paths';
import { Button } from '@/components/Button';
import { UserAvatar } from '@/components/UserAvatar';
import { MainNav } from './MainNav';

const iconButton =
  'inline-flex size-11 items-center justify-center rounded-xl text-ink hover:bg-canvas focus-visible:outline-2 focus-visible:outline-brand-600';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    closeButton.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        openButton.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-sand">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              ref={openButton}
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(true)}
              className={`${iconButton} -ml-2 lg:hidden`}
            >
              <List size={24} aria-hidden="true" />
            </button>
            <Link
              href={paths.home}
              className="flex items-center gap-2 text-lg font-bold text-brand-700"
            >
              <Image src={icon} alt="" width={32} height={32} className="size-8 rounded-lg" />
              Alta Health
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={logout}>
              Log out
            </Button>
            {user && <UserAvatar label={`Signed in as ${user.name ?? user.email}`} />}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          className={`hidden shrink-0 border-r border-line bg-canvas lg:block ${collapsed ? 'w-20' : 'w-64'}`}
        >
          <div className="sticky top-14 flex max-h-[calc(100dvh-3.5rem)] flex-col gap-2 overflow-y-auto p-4">
            <button
              type="button"
              aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              aria-expanded={!collapsed}
              onClick={() => setCollapsed((value) => !value)}
              className={`${iconButton} ${collapsed ? 'self-center' : 'self-end'}`}
            >
              {collapsed ? (
                <CaretRight size={20} aria-hidden="true" />
              ) : (
                <CaretLeft size={20} aria-hidden="true" />
              )}
            </button>
            <MainNav collapsed={collapsed} />
          </div>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>

      {menuOpen && (
        <div id="mobile-nav" className="fixed inset-0 z-30 flex lg:hidden">
          <div className="flex w-72 max-w-[85vw] flex-col gap-4 overflow-y-auto bg-canvas p-4 shadow-card">
            <div className="flex items-center justify-between">
              <span className="px-2 text-lg font-bold text-brand-700">Alta Health</span>
              <button
                ref={closeButton}
                type="button"
                aria-label="Close menu"
                onClick={() => {
                  setMenuOpen(false);
                  openButton.current?.focus();
                }}
                className={iconButton}
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            <MainNav onNavigate={() => setMenuOpen(false)} />
          </div>
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setMenuOpen(false)}
            className="flex-1 bg-ink/40"
          />
        </div>
      )}
    </div>
  );
};
