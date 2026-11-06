import type { ComponentProps } from 'react';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-900',
  secondary: 'border border-line bg-surface text-ink hover:bg-canvas',
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
