import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { paths } from '@/lib/paths';
import { fakeAuthClient } from '@/test/fakeAuth';
import { memoryRouter } from '@/test/memoryRouter';
import { renderApp } from '@/test/renderApp';
import { AppLayout } from './AppLayout';

const loginToHome = async () => {
  await renderApp('/login');

  await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'password123');
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
  await screen.findByRole('heading', { level: 1, name: 'Your Wellness Snapshot' });
};

describe('main navigation', () => {
  it('lists the destinations, with unbuilt ones disabled', async () => {
    await loginToHome();

    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual([
      'My Health',
      'Skin & Aesthetics',
      'Dental',
      'Medical',
      'Lifestyle',
      'Nutrition',
      'Preventive & Longevity',
      'Appointments',
    ]);
    expect(within(nav).getByRole('link', { name: 'My Health' })).toHaveAttribute(
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
    await loginToHome();

    const nav = screen.getByRole('navigation', { name: 'Main' });
    await userEvent.click(within(nav).getByRole('link', { name: 'Dental' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Dental Health' })).toBeVisible();
    expect(within(nav).getByRole('link', { name: 'Dental' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByRole('link', { name: 'My Health' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('collapses to icons only and expands again', async () => {
    await loginToHome();

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
    await loginToHome();

    expect(screen.getByRole('img', { name: 'Signed in as Jane' })).toBeInTheDocument();
  });

  it('opens and closes the menu on small screens', async () => {
    await loginToHome();

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
    await loginToHome();

    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const [, drawerNav] = screen.getAllByRole('navigation', { name: 'Main' });
    await userEvent.click(within(drawerNav!).getByRole('link', { name: 'Medical' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Medical Health' })).toBeVisible();
    expect(screen.getAllByRole('navigation', { name: 'Main' })).toHaveLength(1);
  });
});

// Rendered on its own, the layout stays mounted after logging out navigates away, as it does in
// the real app while the login page loads.
describe('logout button', () => {
  const user = { name: 'Jane', email: 'jane@example.com' };

  afterEach(() => vi.restoreAllMocks());

  it('is disabled while logging out and stays disabled while the login page loads', async () => {
    const response = Promise.withResolvers<void>();
    const signOut = fakeAuthClient.signOut;
    vi.spyOn(fakeAuthClient, 'signOut').mockImplementation(async () => {
      await response.promise;
      return signOut();
    });
    render(<AppLayout user={user}>Page</AppLayout>);
    const button = screen.getByRole('button', { name: 'Log out' });

    await userEvent.click(button);
    expect(button).toBeDisabled();

    response.resolve();
    await waitFor(() => expect(memoryRouter.getPathname()).toBe(paths.login));
    await act(() => new Promise((resolve) => setTimeout(resolve)));
    expect(button).toBeDisabled();
  });

  it('is enabled again when logging out fails', async () => {
    vi.spyOn(fakeAuthClient, 'signOut').mockRejectedValue(new Error('offline'));
    render(<AppLayout user={user}>Page</AppLayout>);
    const button = screen.getByRole('button', { name: 'Log out' });

    await userEvent.click(button);

    await waitFor(() => expect(button).toBeEnabled());
    expect(memoryRouter.getPathname()).toBe(paths.home);
  });
});
