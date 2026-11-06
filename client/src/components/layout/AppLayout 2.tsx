import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { paths } from '../../routes/paths';
import { Button } from '../Button';

export const AppLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-sand">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to={paths.home} className="text-lg font-bold text-brand-700">
            Alta Health
          </Link>
          <Button variant="secondary" onClick={logout}>
            Log out
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
};
