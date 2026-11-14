import { accentStyles, type Accent } from '@/lib/accents';

interface MetricCardProps {
  label: string;
  value: number;
  change: string;
  accent: Accent;
}

export const MetricCard = ({ label, value, change, accent }: MetricCardProps) => (
  <article className="rounded-card border border-line bg-canvas p-5 shadow-card">
    <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</h3>
    <div className="mt-3 flex items-baseline justify-between gap-4">
      <span className={`text-4xl font-semibold ${accentStyles[accent].text}`}>{value}</span>
      <span className="text-sm text-brand-600">{change}</span>
    </div>
  </article>
);
