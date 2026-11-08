import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../routes/AppRoutes';
import { AuthProvider } from '../auth/AuthProvider';

const loginAndOpenLifestyle = async () => {
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
  await userEvent.click(
    await within(await screen.findByRole('main')).findByRole('link', { name: 'Lifestyle' }),
  );
  await screen.findByRole('heading', { level: 1, name: 'Lifestyle' });
};

const openTab = (name: string) => userEvent.click(screen.getByRole('tab', { name }));

describe('lifestyle page', () => {
  it('opens from the landing card on the Overview tab with the score', async () => {
    await loginAndOpenLifestyle();

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('img', { name: 'Lifestyle Score 78 out of 100' })).toBeInTheDocument();
    const areas = within(screen.getByRole('navigation', { name: 'Wellness areas' }));
    expect(areas.getByRole('link', { name: 'Lifestyle' })).toHaveAttribute('aria-current', 'page');
  });

  it('lists the metrics with results, units and sources', async () => {
    await loginAndOpenLifestyle();
    await openTab('Metrics');

    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(21);

    const steps = within(table).getByRole('row', { name: /^Daily steps/ });
    expect(within(steps).getByText('7,400')).toBeInTheDocument();
    expect(within(steps).getByText('steps/day')).toBeInTheDocument();
    expect(within(steps).getByText('Wearable')).toBeInTheDocument();

    const nicotine = within(table).getByRole('row', { name: /^Tobacco/ });
    expect(within(nicotine).getByText('Quit')).toBeInTheDocument();
    expect(within(nicotine).getByText('Frequency')).toBeInTheDocument();
  });

  it('charts the numeric metrics on the Progress tab', async () => {
    await loginAndOpenLifestyle();
    await openTab('Progress');

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(19);
    expect(
      screen.getByRole('img', {
        name: 'Daily steps over time, range 0 to 20000: 1 5200, 2 6080, 3 6520, 4 7070, 5 7400',
      }),
    ).toBeInTheDocument();
  });
});
