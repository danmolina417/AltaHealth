import type { HealthAreaDetail, HealthMetric } from './types';

const detailHeadings = { unit: 'Unit', reference: 'Reference / Goal' } as const;

interface MetricsTableProps {
  title: string;
  metrics: HealthMetric[];
  detail: HealthAreaDetail['tableDetail'];
}

export const MetricsTable = ({ title, metrics, detail }: MetricsTableProps) => (
  <article className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
    <h2 className="font-serif text-xl sm:text-2xl">{title}</h2>
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[24rem] text-left text-sm">
        <thead>
          <tr className="bg-canvas text-ink">
            <th scope="col" className="rounded-l-xl px-4 py-3 font-medium">
              Metric
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Your Result
            </th>
            <th scope="col" className="rounded-r-xl px-4 py-3 font-medium">
              {detailHeadings[detail]}
            </th>
          </tr>
        </thead>
        <tbody>
          {metrics.map(({ id, label, value, ...rest }) => (
            <tr key={id} className="border-b border-line last:border-b-0">
              <th scope="row" className="px-4 py-4 font-normal">
                {label}
              </th>
              <td className="px-4 py-4 font-medium">{value}</td>
              <td className="px-4 py-4">{rest[detail] ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </article>
);
