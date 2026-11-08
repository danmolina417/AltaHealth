import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider';
import { AppRoutes } from '../../routes/AppRoutes';

const loginAndOpenSkin = async () => {
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
  await userEvent.click(await screen.findByRole('link', { name: 'Skin Health' }));
};

describe('skin detail page', () => {
  it('opens from the landing page card and shows the skin metrics', async () => {
    await loginAndOpenSkin();

    expect(await screen.findByRole('heading', { name: 'Skin & Aesthetics' })).toBeInTheDocument();
    expect(screen.getByText('Hydration index')).toBeInTheDocument();
    expect(screen.getByText('+8 pts')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /Skin assessment trend: 1 70, 2 71/ }),
    ).toBeInTheDocument();
  });

  it('marks the current area in the areas menu', async () => {
    await loginAndOpenSkin();

    expect(await screen.findByRole('link', { name: 'Skin & aesthetics' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Preventive & longevity' })).toHaveAttribute(
      'href',
      '/areas/preventive',
    );
  });

  it('returns to the landing page from the header', async () => {
    await loginAndOpenSkin();

    await userEvent.click(await screen.findByRole('link', { name: 'Alta Health' }));

    expect(
      await screen.findByRole('heading', { name: /^Good (morning|afternoon|evening)$/ }),
    ).toBeInTheDocument();
  });
});
