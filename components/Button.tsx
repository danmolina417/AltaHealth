import type { ComponentProps } from 'react';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 px-4 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-tan disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  primary:
    'rounded-full bg-accent-tan text-white shadow-[0_8px_20px_rgb(207_110_83/0.28)] hover:bg-accent-bronze',
  secondary:
    'rounded-[14px] border border-alta-plum/15 bg-surface text-[15px] font-medium text-alta-plum hover:bg-alta-cream',
};

export const Button = ({
  variant = 'primary',
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`.trim()}
    {...props}
  />
);
