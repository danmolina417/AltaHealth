import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '@/test/renderApp';

const loginAndOpenPreventive = async () => {
  renderApp('/login');

  await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'anything');
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
  await userEvent.click(
    await within(await screen.findByRole('main')).findByRole('link', {
      name: 'Preventive & Longevity',
    }),
  );
  await screen.findByRole('heading', { level: 1, name: 'Preventive & Longevity' });
};

describe('preventive and longevity page', () => {
  it('opens from the landing card with the score and lists its metrics', async () => {
    await loginAndOpenPreventive();

    expect(
      screen.getByRole('img', { name: 'Preventive & Longevity Score 80 out of 100' }),
    ).toBeInTheDocument();
    const areas = within(screen.getByRole('navigation', { name: 'Wellness areas' }));
    expect(areas.getByRole('link', { name: 'Preventive & longevity' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await userEvent.click(screen.getByRole('tab', { name: 'Metrics' }));
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(7);
    expect(within(table).getByRole('row', { name: /^Biological age/ })).toBeInTheDocument();
  });
});
