import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { seededUser } from '@/test/fakeAuth';
import { renderApp } from '@/test/renderApp';

const logIn = async (email: string, password: string) => {
  await userEvent.type(screen.getByLabelText('Email'), email);
  await userEvent.type(screen.getByLabelText('Password'), password);
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
};

describe('app routing and auth', () => {
  it('redirects unauthenticated users from the home page to login', async () => {
    await renderApp('/');

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });

  it('sends unknown URLs home, which redirects signed-out users to login', async () => {
    await renderApp('/does-not-exist');

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });

  it('shows validation errors and stays on login when the form is invalid', async () => {
    await renderApp('/login');

    await userEvent.type(screen.getByLabelText('Email'), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });

  it('rejects a wrong password and stays on login', async () => {
    await renderApp('/login');

    await logIn(seededUser.email, 'wrong-password');

    expect(await screen.findByText('Email or password is incorrect.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });

  it('logs in, lands on My Health, and logs out', async () => {
    await renderApp('/login');

    await logIn(seededUser.email, seededUser.password);

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Your Wellness Snapshot' }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Log out' }));

    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });

  it('sends signed-in users away from the login page', async () => {
    await renderApp('/login');
    await logIn(seededUser.email, seededUser.password);
    await screen.findByRole('heading', { level: 1, name: 'Your Wellness Snapshot' });

    await renderApp('/login');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Your Wellness Snapshot' }),
    ).toBeInTheDocument();
  });

  it('signs up with a name and shows it on the signed-in avatar', async () => {
    await renderApp('/signup');

    await userEvent.type(screen.getByLabelText('Name'), 'Alex');
    await userEvent.type(screen.getByLabelText('Email'), 'alex@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByRole('img', { name: 'Signed in as Alex' })).toBeInTheDocument();
  });

  it('refuses to sign up with an email that already has an account', async () => {
    await renderApp('/signup');

    await userEvent.type(screen.getByLabelText('Name'), 'Jane again');
    await userEvent.type(screen.getByLabelText('Email'), seededUser.email);
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(
      await screen.findByText('An account with this email already exists.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
  });
});
