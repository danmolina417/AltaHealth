import { AreaSections } from './AreaSections';
import type { HealthAreaDetail } from './types';

export const HealthAreaPage = ({ detail }: { detail: HealthAreaDetail }) => (
  <section aria-labelledby="area-heading" className="flex flex-col gap-6">
    <header>
      <h1 id="area-heading" className="font-serif text-4xl">
        {detail.title}
      </h1>
      <p className="mt-2 text-lg text-ink-muted">{detail.tagline}</p>
    </header>

    <AreaSections detail={detail} />
  </section>
);
