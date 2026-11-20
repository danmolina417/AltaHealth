import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { paths } from '@/lib/paths';
import { fakeAuthClient, seededUser } from '@/test/fakeAuth';
import { memoryRouter } from '@/test/memoryRouter';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

// Rendered on their own, the forms stay mounted after they navigate away, as they do in the real
// app while the next page loads.

/** Lets a finished submit settle, so the test sees the button's final state. */
const settle = () => act(() => new Promise((resolve) => setTimeout(resolve)));

afterEach(() => vi.restoreAllMocks());

describe('LoginForm', () => {
  const logIn = async (password: string) => {
    await userEvent.type(screen.getByLabelText('Email'), seededUser.email);
    await userEvent.type(screen.getByLabelText('Password'), password);
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
  };

  it('disables the button while logging in and keeps it disabled while home loads', async () => {
    const response = Promise.withResolvers<void>();
    const signIn = fakeAuthClient.signIn.email;
    vi.spyOn(fakeAuthClient.signIn, 'email').mockImplementation(async (credentials) => {
      await response.promise;
      return signIn(credentials);
    });
    memoryRouter.reset(paths.login);
    render(<LoginForm />);
    const button = screen.getByRole('button', { name: 'Log in' });

    await logIn(seededUser.password);
    await waitFor(() => expect(button).toBeDisabled());

    response.resolve();
    await waitFor(() => expect(memoryRouter.getPathname()).toBe(paths.home));
    await settle();
    expect(button).toBeDisabled();
  });

  it('enables the button again after a failed login', async () => {
    render(<LoginForm />);

    await logIn('wrong-password');

    expect(await screen.findByText('Email or password is incorrect.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeEnabled();
  });
});

describe('SignupForm', () => {
  it('keeps the button disabled while home loads after signing up', async () => {
    memoryRouter.reset(paths.signup);
    render(<SignupForm />);
    const button = screen.getByRole('button', { name: 'Create account' });

    await userEvent.type(screen.getByLabelText('Name'), 'Alex');
    await userEvent.type(screen.getByLabelText('Email'), 'alex@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(button);

    await waitFor(() => expect(memoryRouter.getPathname()).toBe(paths.home));
    await settle();
    expect(button).toBeDisabled();
  });
});
