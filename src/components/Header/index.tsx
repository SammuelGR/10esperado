import { Link, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/contexts/AuthContext/useAuth';

import UserMenu from './UserMenu';

export default function Header() {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const showLoginLink = !user && pathname !== '/login';
  const showRegisterLink = !user && pathname !== '/register';

  return (
    <header className="shrink-0 border-b border-border">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:min-h-20 sm:px-6">
        <Link
          className={`rounded-sm text-2xl font-bold tracking-tighter focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-3xl`}
          to="/"
        >
          <span className="text-primary">{t(($) => $.content.header.logo.prefix)}</span>

          <span>{t(($) => $.content.header.logo.name)}</span>
        </Link>

        {user && <UserMenu />}

        {!user && (
          <nav className="flex items-center gap-4">
            {showLoginLink && (
              <Link
                className={`inline-flex min-h-10 items-center justify-center rounded-lg px-2 py-2 text-sm
                  font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-primary`}
                to="/login"
              >
                {t(($) => $.content.header.actions.login)}
              </Link>
            )}

            {showRegisterLink && (
              <Link
                className={`inline-flex min-h-10 items-center justify-center rounded-lg border border-primary px-4 py-2
                  text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-primary`}
                to="/register"
              >
                {t(($) => $.content.header.actions.register)}
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
