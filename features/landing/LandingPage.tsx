import { Greeting } from './Greeting';
import { mockSnapshot } from './mockData';
import { NextStepCard } from './NextStepCard';
import { TrendChart } from '@/components/TrendChart';
import { ScoreCard } from '@/components/ScoreCard';
import { WellnessGauge } from './WellnessGauge';

export const LandingPage = () => {
  const { overallScore, scores, trend, nextStep } = mockSnapshot;

  return (
    <section
      aria-labelledby="landing-heading"
      className="rounded-panel border border-line bg-surface p-5 shadow-card sm:p-8"
    >
      <Greeting id="landing-heading" />
      <p className="mt-1 text-ink-muted">Your progress, in context.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
        <WellnessGauge score={overallScore} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {scores.map(({ id, ...score }) => (
            <ScoreCard key={id} {...score} />
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <TrendChart title="Overall wellness trend" points={trend} />
        <NextStepCard message={nextStep} />
      </div>
    </section>
  );
};
