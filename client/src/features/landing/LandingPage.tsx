import { useAuth } from '../auth/useAuth';
import { getGreeting } from './greeting';
import { mockSnapshot } from './mockData';
import { NextStepCard } from './NextStepCard';
import { TrendChart } from '../../components/TrendChart';
import { ScoreCard } from '../../components/ScoreCard';
import { WellnessGauge } from './WellnessGauge';

export const LandingPage = () => {
  const { user } = useAuth();
  const { overallScore, scores, trend, nextStep } = mockSnapshot;
  const greeting = user?.name ? `${getGreeting()}, ${user.name}` : getGreeting();

  return (
    <section
      aria-labelledby="landing-heading"
      className="rounded-panel border border-line bg-surface p-5 shadow-card sm:p-8"
    >
      <h1 id="landing-heading" className="text-2xl font-bold sm:text-3xl">
        {greeting}
      </h1>
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
