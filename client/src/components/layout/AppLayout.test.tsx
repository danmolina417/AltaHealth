import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../routes/AppRoutes';
import { AuthProvider } from '../../features/auth/AuthProvider';

const loginToLanding = async () => {
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
};

describe('main navigation', () => {
  it('lists the destinations, with unbuilt ones disabled', async () => {
    await loginToLanding();

    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual([
      'Wellness Insights',
      'My Health',
      'Skin & Aesthetics',
      'Dental',
      'Medical',
      'Lifestyle',
      'Nutrition',
      'Preventive & Longevity',
      'Appointments',
    ]);
    expect(within(nav).getByRole('link', { name: 'Wellness Insights' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByText('Labs & Biomarkers').parentElement).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(within(nav).getByText('Wearables').parentElement).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(within(nav).getByText('Prescriptions').parentElement).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(within(nav).getByText('Settings').parentElement).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('highlights the current page and navigates between pages', async () => {
    await loginToLanding();

    const nav = screen.getByRole('navigation', { name: 'Main' });
    await userEvent.click(within(nav).getByRole('link', { name: 'Dental' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Dental Health' })).toBeVisible();
    expect(within(nav).getByRole('link', { name: 'Dental' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByRole('link', { name: 'Wellness Insights' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('collapses to icons only and expands again', async () => {
    await loginToLanding();

    const nav = screen.getByRole('navigation', { name: 'Main' });
    const collapse = screen.getByRole('button', { name: 'Collapse navigation' });
    expect(collapse).toHaveAttribute('aria-expanded', 'true');
    expect(within(nav).getByText('Dental')).not.toHaveClass('sr-only');

    await userEvent.click(collapse);

    const expand = screen.getByRole('button', { name: 'Expand navigation' });
    expect(expand).toHaveAttribute('aria-expanded', 'false');
    expect(within(nav).getByText('Dental')).toHaveClass('sr-only');
    expect(within(nav).getByRole('link', { name: 'Dental' })).toBeInTheDocument();

    await userEvent.click(expand);
    expect(within(nav).getByText('Dental')).not.toHaveClass('sr-only');
  });

  it('shows the signed-in user avatar in the header', async () => {
    await loginToLanding();

    expect(screen.getByRole('img', { name: 'Signed in as jane@example.com' })).toBeInTheDocument();
  });

  it('opens and closes the menu on small screens', async () => {
    await loginToLanding();

    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('navigation', { name: 'Main' })).toHaveLength(2);

    await userEvent.keyboard('{Escape}');
    expect(screen.getAllByRole('navigation', { name: 'Main' })).toHaveLength(1);
    expect(toggle).toHaveFocus();
  });

  it('closes the menu after choosing a destination', async () => {
    await loginToLanding();

    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const [, drawerNav] = screen.getAllByRole('navigation', { name: 'Main' });
    await userEvent.click(within(drawerNav!).getByRole('link', { name: 'Medical' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Medical Health' })).toBeVisible();
    expect(screen.getAllByRole('navigation', { name: 'Main' })).toHaveLength(1);
  });
});
