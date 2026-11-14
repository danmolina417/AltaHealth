import type { AppointmentsSnapshot } from './types';

/** Placeholder data until appointments come from the API. */
export const appointmentsSnapshot: AppointmentsSnapshot = {
  steps: [
    {
      id: 'dental-cleaning',
      category: 'dental',
      title: 'Professional Cleaning & Exam',
      description: 'Your last cleaning was 6 months ago. We recommend scheduling your next visit.',
      schedule: 'Every 6 months • Due now',
      actionLabel: 'Schedule Appointment',
      status: 'upcoming',
    },
    {
      id: 'blood-work',
      category: 'medical',
      title: 'Follow-Up Blood Work',
      description: 'Your Vitamin D levels are below optimal range. Consider retesting in 3 months.',
      schedule: 'Vitamin D, Lipid Panel, CRP • Due in 3 months',
      actionLabel: 'Book Lab Work',
      status: 'recommended',
    },
    {
      id: 'skin-assessment',
      category: 'skin',
      title: 'Monthly Skin Assessment',
      description:
        'Your skin hydration and elasticity show great progress. Keep up with your current routine and schedule your next skin analysis.',
      schedule: 'Due in 1 month',
      actionLabel: 'Book Skin Consultation',
      status: 'upcoming',
    },
    {
      id: 'annual-checkup',
      category: 'wellness',
      title: 'Annual Health Check-Up',
      description: 'Time for your annual physical and wellness review.',
      schedule: 'Due in 2 months',
      actionLabel: 'Schedule Visit',
      status: 'recommended',
    },
  ],
  closing: {
    title: 'Small steps create lasting change.',
    message: "Your health journey is a partnership. We're here to support you.",
  },
};
