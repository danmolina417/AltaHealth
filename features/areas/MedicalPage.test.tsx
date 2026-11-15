import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '@/test/renderApp';

const loginAndOpenMedical = async () => {
  renderApp('/login');

  await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'anything');
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
  await userEvent.click(await screen.findByRole('link', { name: 'Medical Health' }));
  await screen.findByRole('heading', { level: 1, name: 'Medical Health' });
};

const openTab = (name: string) => userEvent.click(screen.getByRole('tab', { name }));

describe('medical health page', () => {
  it('opens from the landing card on the Overview tab with the score', async () => {
    await loginAndOpenMedical();

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByRole('img', { name: 'Medical Health Score 76 out of 100' }),
    ).toBeInTheDocument();
    expect(screen.getByText('+3 since last visit')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Medical metrics' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('lists all metrics with results and reference ranges', async () => {
    await loginAndOpenMedical();
    await openTab('Metrics');

    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(19);
    expect(within(table).getByRole('columnheader', { name: 'Reference / Goal' })).toBeVisible();

    const a1c = within(table).getByRole('row', { name: /HbA1c/ });
    expect(within(a1c).getByText('6.1%')).toBeInTheDocument();
    expect(within(a1c).getByText('Normal: below 5.7%')).toBeInTheDocument();

    const sleep = within(table).getByRole('row', { name: /Sleep duration/ });
    expect(within(sleep).getByText('6.5 hr')).toBeInTheDocument();
  });

  it('shows a trend chart for every metric on the Progress tab', async () => {
    await loginAndOpenMedical();
    await openTab('Progress');

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(18);
    expect(
      screen.getByRole('img', {
        name: 'Systolic BP over time, range 80 to 200: 1 158, 2 154, 3 151, 4 148, 5 145',
      }),
    ).toBeInTheDocument();
  });

  it('shows notes with the author and time', async () => {
    await loginAndOpenMedical();
    await openTab('Notes');

    const notes = within(screen.getByRole('tabpanel')).getAllByRole('listitem');
    expect(notes).toHaveLength(3);
    expect(within(notes[0]!).getByText('Dr. Rivera')).toBeInTheDocument();
  });
});
