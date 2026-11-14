import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '@/test/renderApp';

const loginAndOpenNutrition = async () => {
  renderApp('/login');

  await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'anything');
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
  await userEvent.click(
    await within(await screen.findByRole('main')).findByRole('link', { name: 'Nutrition' }),
  );
  await screen.findByRole('heading', { level: 1, name: 'Nutrition' });
};

const openTab = (name: string) => userEvent.click(screen.getByRole('tab', { name }));

describe('nutrition page', () => {
  it('opens from the landing card on the Overview tab with the score', async () => {
    await loginAndOpenNutrition();

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('img', { name: 'Nutrition Score 74 out of 100' })).toBeInTheDocument();
    const areas = within(screen.getByRole('navigation', { name: 'Wellness areas' }));
    expect(areas.getByRole('link', { name: 'Nutrition' })).toHaveAttribute('aria-current', 'page');
  });

  it('lists the metrics with results, units and sources', async () => {
    await loginAndOpenNutrition();
    await openTab('Metrics');

    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(29);

    const water = within(table).getByRole('row', { name: /^Water 1\.7/ });
    expect(within(water).getByText('liters/day')).toBeInTheDocument();
    expect(within(water).getByText('Food logging')).toBeInTheDocument();

    const vitaminD = within(table).getByRole('row', { name: /^Vitamin D/ });
    expect(within(vitaminD).getByText('ng/mL')).toBeInTheDocument();
    expect(within(vitaminD).getByText('Laboratory')).toBeInTheDocument();
  });

  it('charts the numeric metrics on the Progress tab', async () => {
    await loginAndOpenNutrition();
    await openTab('Progress');

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(26);
    expect(
      screen.getByRole('img', {
        name: 'Water over time, range 0 to 5: 1 1, 2 1.3, 3 1.4, 4 1.6, 5 1.7',
      }),
    ).toBeInTheDocument();
  });
});
