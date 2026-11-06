import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../routes/AppRoutes';
import { AuthProvider } from '../auth/AuthProvider';

const loginAndOpenMyHealth = async () => {
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
  await userEvent.click(within(nav).getByRole('link', { name: 'My Health' }));
  await screen.findByRole('heading', { level: 1, name: 'Your Wellness Snapshot' });
};

describe('my health page', () => {
  it('shows the four score cards', async () => {
    await loginAndOpenMyHealth();

    expect(screen.getByRole('img', { name: 'Skin Health 88 out of 100' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Medical Health 76 out of 100' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Overall Wellness 82 out of 100' })).toBeInTheDocument();
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('summarises the three pillars with key metrics and links to their pages', async () => {
    await loginAndOpenMyHealth();

    expect(screen.getByRole('heading', { name: 'Your 3 Pillars of Wellness' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Details' })).toBeDisabled();

    const panel = within(screen.getByRole('tabpanel'));
    const pillars = panel.getAllByRole('article');
    expect(pillars).toHaveLength(3);
    expect(within(pillars[1]!).getByText('Key Metrics')).toBeInTheDocument();
    expect(within(pillars[1]!).getByText('Deepest probing depth')).toBeInTheDocument();
    expect(within(pillars[2]!).getByText('HbA1c')).toBeInTheDocument();
    expect(within(pillars[2]!).getByText('6.1%')).toBeInTheDocument();

    await userEvent.click(panel.getByRole('link', { name: 'Dental Health' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Dental Health' })).toBeVisible();
  });

  it('charts progress over time and narrows it by period', async () => {
    await loginAndOpenMyHealth();

    expect(
      screen.getByRole('img', {
        name: 'Your Progress Over Time: Skin Health, Dental Health, Medical Health, Overall Wellness',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('May 2026')).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('Time period'), 'Last 3 months');

    expect(screen.queryByText('May 2026')).not.toBeInTheDocument();
    expect(screen.getByText('Aug 2026')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Skin Health trend: 85, 86, 88' })).toBeInTheDocument();
  });
});
