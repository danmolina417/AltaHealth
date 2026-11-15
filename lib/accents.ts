export type Accent = 'sage' | 'tan' | 'slate' | 'bronze' | 'forest' | 'rose' | 'sky';

interface AccentStyle {
  bar: string;
  text: string;
  stroke: string;
  /** Card classes: the shared card surface plus this accent's palette tint. */
  card: string;
}

/** Tailwind classes per accent. Full class names are listed so Tailwind can detect them. */
export const accentStyles: Record<Accent, AccentStyle> = {
  sage: {
    bar: 'bg-brand-600',
    text: 'text-brand-600',
    stroke: 'stroke-brand-600',
    card: 'card card-sage',
  },
  tan: {
    bar: 'bg-accent-tan',
    text: 'text-accent-tan',
    stroke: 'stroke-accent-tan',
    card: 'card card-coral',
  },
  slate: {
    bar: 'bg-accent-slate',
    text: 'text-accent-slate',
    stroke: 'stroke-accent-slate',
    card: 'card card-plum',
  },
  bronze: {
    bar: 'bg-accent-bronze',
    text: 'text-accent-bronze',
    stroke: 'stroke-accent-bronze',
    card: 'card card-sunshine',
  },
  forest: {
    bar: 'bg-accent-forest',
    text: 'text-accent-forest',
    stroke: 'stroke-accent-forest',
    card: 'card card-sage',
  },
  rose: {
    bar: 'bg-accent-rose',
    text: 'text-accent-rose',
    stroke: 'stroke-accent-rose',
    card: 'card card-coral',
  },
  sky: {
    bar: 'bg-accent-sky',
    text: 'text-accent-sky',
    stroke: 'stroke-accent-sky',
    card: 'card card-sunshine',
  },
};
