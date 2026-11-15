import Image from 'next/image';
import type { ReactNode } from 'react';
import hero from '@/assets/login-hero.webp';
import { AltaWordmark } from './AltaWordmark';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

/**
 * Mobile: hero image and tagline on top, form in a bottom sheet.
 * Desktop: hero panel on the left, form card on the right.
 */
export const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => (
  <div className="flex min-h-dvh flex-col bg-alta-cream bg-[linear-gradient(180deg,var(--color-alta-cream)_0%,var(--color-alta-peach)_30%)] font-inter text-alta-plum lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-3 lg:bg-none lg:p-3">
    <section className="relative h-80 shrink-0 lg:h-auto lg:overflow-hidden lg:rounded-[28px] lg:bg-[linear-gradient(180deg,var(--color-alta-cream),var(--color-alta-peach)_55%)] lg:px-16 lg:py-14">
      <Image
        src={hero}
        alt="A woman smiling with her face turned up to the warm sunrise"
        width={618}
        height={435}
        sizes="(min-width: 1024px) 45vw, 100vw"
        preload
        className="absolute inset-x-0 top-24 h-[274px] w-full object-cover object-[55%_100%] [mask-image:linear-gradient(to_bottom,transparent,black_30%)] lg:bottom-0 lg:top-auto lg:h-3/5 lg:object-[60%_100%]"
      />
      <div className="relative flex flex-col items-center pt-9 lg:items-start lg:pt-0">
        <AltaWordmark />
        <p className="mt-6 self-start pl-6 font-serif text-[30px] leading-[1.15] text-alta-plum-deep lg:mt-24 lg:pl-0 lg:text-[52px] lg:leading-[1.08]">
          <span className="block">Live well.</span>
          <span className="block">Feel good.</span>
          <span className="hidden lg:block">Stay healthy.</span>
          <span className="hidden lg:block">Live longer.</span>
        </p>
        <p className="mt-6 hidden max-w-xs text-lg text-alta-plum-muted lg:block">
          A simple, personalized path to a longer, happier life.
        </p>
      </div>
    </section>

    <main className="relative z-10 flex flex-1 flex-col rounded-t-[28px] bg-alta-sheet px-6 pb-8 pt-6 shadow-[0_-10px_30px_rgb(86_59_75/0.10)] lg:items-center lg:justify-center lg:rounded-[28px] lg:bg-transparent lg:bg-[radial-gradient(ellipse_60%_35%_at_100%_0%,rgb(245_226_215),transparent_70%),linear-gradient(0deg,rgb(247_241_218),transparent_40%)] lg:p-8 lg:shadow-none">
      <div className="w-full lg:max-w-sm lg:rounded-[28px] lg:bg-surface lg:p-9 lg:shadow-card">
        <h1 className="font-serif text-[28px] font-medium text-alta-plum-deep">{title}</h1>
        <p className="mt-1 text-[15px] text-alta-plum-muted">{subtitle}</p>
        <div className="mt-5 lg:mt-6">{children}</div>
      </div>
      <p className="mt-5 text-center text-[15px] text-alta-plum-muted lg:mt-8">{footer}</p>
    </main>
  </div>
);
