import { User } from '@phosphor-icons/react';

/** Placeholder avatar until users can upload a photo. */
export const UserAvatar = ({ label }: { label: string }) => (
  <span
    role="img"
    aria-label={label}
    title={label}
    className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-sand text-brand-700"
  >
    <User size={22} weight="fill" aria-hidden="true" />
  </span>
);
