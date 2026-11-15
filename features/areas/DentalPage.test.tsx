import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '@/test/renderApp';

const loginAndOpenDental = async () => {
  renderApp('/login');

  await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'anything');
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
  await userEvent.click(await screen.findByRole('link', { name: 'Dental Health' }));
  await screen.findByRole('heading', { level: 1, name: 'Dental Health' });
};

const openTab = (name: string) => userEvent.click(screen.getByRole('tab', { name }));

describe('dental health page', () => {
  it('opens on the Overview tab with the score card', async () => {
    await loginAndOpenDental();

    expect(screen.getByText('Healthy smiles. Lasting wellness.')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByRole('img', { name: 'Dental Health Score 82 out of 100' }),
    ).toBeInTheDocument();
    expect(screen.getByText('+6 since last visit')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('lists the key dental metrics on the Metrics tab', async () => {
    await loginAndOpenDental();
    await openTab('Metrics');

    expect(screen.getByRole('tab', { name: 'Metrics' })).toHaveAttribute('aria-selected', 'true');
    const table = screen.getByRole('table');
    const plaque = within(table).getByRole('row', { name: /Plaque index/ });
    expect(within(plaque).getByText('10')).toBeInTheDocument();
    expect(within(plaque).getByText('% surfaces')).toBeInTheDocument();
    const caries = within(table).getByRole('row', { name: /Caries risk/ });
    expect(within(caries).getByText('Low')).toBeInTheDocument();
    expect(within(table).getAllByRole('row')).toHaveLength(7);
    expect(screen.queryByRole('img', { name: /Dental Health Score/ })).not.toBeInTheDocument();
  });

  it('shows the trend charts on the Progress tab', async () => {
    await loginAndOpenDental();
    await openTab('Progress');

    expect(screen.getByRole('heading', { name: 'Metric Progress Over Time' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
    expect(
      screen.getByRole('img', {
        name: "Plaque index (O'Leary) over time, range 0 to 80: 1 34, 2 24, 3 17, 4 13, 5 10",
      }),
    ).toBeInTheDocument();
  });

  it('shows notes with author and time, and lets the user add one', async () => {
    await loginAndOpenDental();
    await openTab('Notes');

    const panel = within(screen.getByRole('tabpanel'));
    const notes = panel.getAllByRole('listitem');
    expect(notes).toHaveLength(3);
    expect(within(notes[0]!).getByText('Dr. El Chaar')).toBeInTheDocument();
    expect(within(notes[0]!).getByText(/Oct 14, 2026/)).toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: 'Add note' });
    expect(addButton).toBeDisabled();

    await userEvent.type(screen.getByLabelText('Add a note'), 'Sensitive on the lower left.');
    await userEvent.click(addButton);

    const updated = panel.getAllByRole('listitem');
    expect(updated).toHaveLength(4);
    expect(within(updated[3]!).getByText('Me')).toBeInTheDocument();
    expect(within(updated[3]!).getByText('Sensitive on the lower left.')).toBeInTheDocument();
    expect(screen.getByLabelText('Add a note')).toHaveValue('');
  });

  it('supports arrow-key navigation between tabs', async () => {
    await loginAndOpenDental();

    screen.getByRole('tab', { name: 'Overview' }).focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Metrics' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Metrics' })).toHaveFocus();
  });

  it('marks the dental area as active in the sidebar', async () => {
    await loginAndOpenDental();

    expect(screen.getByRole('link', { name: 'Dental & oral health' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
