import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { LandingPage } from './LandingPage';

const renderLanding = (name?: string) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          user: { email: 'edgard@example.com', ...(name && { name }) },
          isAuthenticated: true,
          login: () => undefined,
          logout: () => undefined,
        }}
      >
        <LandingPage />
      </AuthContext.Provider>
    </MemoryRouter>,
  );

describe('LandingPage', () => {
  it('greets the user by name', () => {
    renderLanding('Edgard');

    expect(
      screen.getByRole('heading', { level: 1, name: /^Good (morning|afternoon|evening), Edgard$/ }),
    ).toBeInTheDocument();
  });

  it('shows the four score cards with gauges', () => {
    renderLanding('Edgard');

    const cards = screen.getAllByRole('article').slice(0, 4);
    expect(cards).toHaveLength(4);
    expect(within(cards[0]!).getByText('Skin Health')).toBeInTheDocument();
    expect(within(cards[0]!).getByText('+ 4')).toBeInTheDocument();
    expect(within(cards[0]!).getByText('Great progress')).toBeInTheDocument();
    expect(within(cards[1]!).getByText('On track')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Medical Health 76 out of 100' })).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Lifestyle & Nutrition 78 out of 100' }),
    ).toBeInTheDocument();
  });

  it('shows the Wellness Quotient gauge', () => {
    renderLanding('Edgard');

    expect(screen.getByText('Wellness Quotient')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Wellness Quotient 82 out of 100' }),
    ).toBeInTheDocument();
  });

  it('renders the trend and the next step', () => {
    renderLanding('Edgard');

    expect(screen.getByRole('img', { name: /Overall wellness trend: May 74/ })).toBeInTheDocument();
    expect(screen.getByText('A useful next step')).toBeInTheDocument();
  });
});
