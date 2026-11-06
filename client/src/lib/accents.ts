export type Accent = 'sage' | 'tan' | 'slate' | 'bronze' | 'forest' | 'rose' | 'sky';

/** Tailwind classes per accent. Full class names are listed so Tailwind can detect them. */
export const accentStyles: Record<Accent, { bar: string; text: string; stroke: string }> = {
  sage: { bar: 'bg-brand-600', text: 'text-brand-600', stroke: 'stroke-brand-600' },
  tan: { bar: 'bg-accent-tan', text: 'text-accent-tan', stroke: 'stroke-accent-tan' },
  slate: { bar: 'bg-accent-slate', text: 'text-accent-slate', stroke: 'stroke-accent-slate' },
  bronze: { bar: 'bg-accent-bronze', text: 'text-accent-bronze', stroke: 'stroke-accent-bronze' },
  forest: { bar: 'bg-accent-forest', text: 'text-accent-forest', stroke: 'stroke-accent-forest' },
  rose: { bar: 'bg-accent-rose', text: 'text-accent-rose', stroke: 'stroke-accent-rose' },
  sky: { bar: 'bg-accent-sky', text: 'text-accent-sky', stroke: 'stroke-accent-sky' },
};
