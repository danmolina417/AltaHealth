import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem<Id extends string> {
  id: Id;
  label: string;
  /** Disabled tabs are shown but cannot be opened yet. */
  disabled?: boolean;
}

interface SectionTabsProps<Id extends string> {
  label: string;
  tabs: TabItem<Id>[];
  selected: Id;
  onSelect: (id: Id) => void;
}

const tabId = (id: string) => `tab-${id}`;
const panelId = (id: string) => `panel-${id}`;

export const SectionTabs = <Id extends string>({
  label,
  tabs,
  selected,
  onSelect,
}: SectionTabsProps<Id>) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const available = tabs.filter((tab) => !tab.disabled);
    const current = available.findIndex((tab) => tab.id === selected);
    const lastIndex = available.length - 1;
    const nextIndex = {
      ArrowRight: current === lastIndex ? 0 : current + 1,
      ArrowLeft: current === 0 ? lastIndex : current - 1,
      Home: 0,
      End: lastIndex,
    }[event.key];

    const next = nextIndex === undefined ? undefined : available[nextIndex];
    if (!next) return;

    event.preventDefault();
    onSelect(next.id);
    document.getElementById(tabId(next.id))?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="-mb-px flex gap-6 overflow-x-auto border-b border-line sm:gap-8"
    >
      {tabs.map(({ id, label: tabLabel, disabled }) => {
        const isSelected = id === selected;
        return (
          <button
            key={id}
            id={tabId(id)}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls={disabled ? undefined : panelId(id)}
            disabled={disabled}
            title={disabled ? 'Coming soon' : undefined}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(id)}
            className={`-mb-px border-b-2 px-1 py-3 text-sm focus-visible:outline-2 focus-visible:outline-brand-600 ${
              isSelected
                ? 'border-accent-bronze font-medium text-ink'
                : disabled
                  ? 'cursor-not-allowed border-transparent text-ink-muted/60'
                  : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {tabLabel}
          </button>
        );
      })}
    </div>
  );
};

export const TabPanel = ({ id, children }: { id: string; children: ReactNode }) => (
  <div
    role="tabpanel"
    id={panelId(id)}
    aria-labelledby={tabId(id)}
    tabIndex={0}
    className="flex flex-col gap-6 outline-none focus-visible:outline-2 focus-visible:outline-brand-600"
  >
    {children}
  </div>
);
