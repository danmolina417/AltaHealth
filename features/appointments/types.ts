export type StepCategory = 'dental' | 'medical' | 'skin' | 'wellness';

export interface NextStep {
  id: string;
  category: StepCategory;
  title: string;
  description: string;
  /** Cadence and timing, e.g. "Every 6 months • Due now". */
  schedule: string;
  actionLabel: string;
  /** Upcoming steps are due soon; recommended ones are suggestions for later. */
  status: 'upcoming' | 'recommended';
}

export interface AppointmentsSnapshot {
  steps: NextStep[];
  closing: { title: string; message: string };
}
