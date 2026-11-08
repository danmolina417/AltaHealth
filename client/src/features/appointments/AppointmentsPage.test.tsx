import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider';
import { AppRoutes } from '../../routes/AppRoutes';

const loginAndOpenAppointments = async () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MemoryRouter>,
  );

  await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'anything');
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
  await screen.findByRole('heading', { level: 1, name: /^Good (morning|afternoon|evening)/ });

  const nav = screen.getByRole('navigation', { name: 'Main' });
  await userEvent.click(within(nav).getByRole('link', { name: 'Appointments' }));
  await screen.findByRole('heading', { level: 1, name: 'Recommended Next Steps' });
};

const stepTitles = () =>
  within(screen.getByRole('tabpanel'))
    .getAllByRole('heading', { level: 2 })
    .map((heading) => heading.textContent);

describe('appointments page', () => {
  it('is reached from the main navigation', async () => {
    await loginAndOpenAppointments();

    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Appointments' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('lists every recommended step on the All tab', async () => {
    await loginAndOpenAppointments();

    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
    expect(stepTitles()).toEqual([
      'Professional Cleaning & Exam',
      'Follow-Up Blood Work',
      'Monthly Skin Assessment',
      'Annual Health Check-Up',
    ]);
    const panel = within(screen.getByRole('tabpanel'));
    expect(panel.getByText('Every 6 months • Due now')).toBeInTheDocument();
    expect(panel.getByRole('button', { name: 'Schedule Appointment' })).toBeEnabled();
  });

  it('filters the steps by tab', async () => {
    await loginAndOpenAppointments();

    await userEvent.click(screen.getByRole('tab', { name: 'Upcoming' }));
    expect(stepTitles()).toEqual(['Professional Cleaning & Exam', 'Monthly Skin Assessment']);

    await userEvent.click(screen.getByRole('tab', { name: 'Recommended' }));
    expect(stepTitles()).toEqual(['Follow-Up Blood Work', 'Annual Health Check-Up']);
  });

  it('marks a step as requested after its action is chosen', async () => {
    await loginAndOpenAppointments();

    await userEvent.click(screen.getByRole('button', { name: 'Book Lab Work' }));

    expect(screen.getByRole('button', { name: 'Requested' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Schedule Visit' })).toBeEnabled();
  });
});
