import { appointmentsSnapshot } from './mockData';
import { NextSteps } from './NextSteps';

export const AppointmentsPage = () => {
  const { steps, closing } = appointmentsSnapshot;

  return (
    <section aria-labelledby="appointments-heading" className="flex flex-col gap-6">
      <header>
        <h1 id="appointments-heading" className="font-serif text-4xl">
          Recommended Next Steps
        </h1>
        <p className="mt-2 text-lg text-ink-muted">
          Personalized recommendations to keep you on track.
        </p>
      </header>

      <NextSteps steps={steps} />

      <aside className="rounded-card bg-gradient-to-r from-sand to-canvas p-8 sm:p-10">
        <div className="sm:ml-auto sm:max-w-sm">
          <p className="font-serif text-2xl">{closing.title}</p>
          <p className="mt-2 text-ink-muted">{closing.message}</p>
        </div>
      </aside>
    </section>
  );
};
