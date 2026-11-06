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
    await within(await screen.findByRole('main')).findByRole('link', {
      name: 'Lifestyle & Nutrition',
    }),
  );
  await screen.findByRole('heading', { level: 1, name: 'Lifestyle & Nutrition' });
};

const openTab = (name: string) => userEvent.click(screen.getByRole('tab', { name }));

describe('lifestyle and nutrition page', () => {
  it('opens from the landing card on the Overview tab with the score', async () => {
    await loginAndOpenLifestyle();

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('img', { name: 'Lifestyle Score 78 out of 100' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Lifestyle & nutrition' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('lists the metrics with results and units', async () => {
    await loginAndOpenLifestyle();
    await openTab('Metrics');

    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(7);

    const nicotine = within(table).getByRole('row', { name: /Nicotine status/ });
    expect(within(nicotine).getByText('Quit')).toBeInTheDocument();
    expect(within(nicotine).getByText('None / Quit / Current')).toBeInTheDocument();

    const water = within(table).getByRole('row', { name: /Water/ });
    expect(within(water).getByText('1.7')).toBeInTheDocument();
    expect(within(water).getByText('liters/day')).toBeInTheDocument();
  });

  it('charts the numeric metrics on the Progress tab', async () => {
    await loginAndOpenLifestyle();
    await openTab('Progress');

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(5);
    expect(
      screen.getByRole('img', {
        name: 'Water over time, range 0 to 5: 1 1, 2 1.2, 3 1.4, 4 1.5, 5 1.7',
      }),
    ).toBeInTheDocument();
  });
});
