import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import LoginForm from './LoginForm';

export default function LoginPage() {
  const { t } = useTranslation('login');

  return (
    <main className="grid flex-1 place-items-center px-4 py-8 sm:px-6 sm:py-12 lg:pb-36">
      <section
        aria-labelledby="login-title"
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8"
      >
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl" id="login-title">
            {t(($) => $.content.header.title)}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(($) => $.content.header.description)}</p>
        </header>

        <LoginForm />

        <footer className="mt-8 border-t border-border pt-6 text-center text-sm">
          <p className="text-muted-foreground">
            {t(($) => $.content.footer.description)}{' '}
            <Link
              className={`font-semibold text-primary transition-colors hover:text-primary/80
                focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-primary`}
              to="/register"
            >
              {t(($) => $.content.footer.register)}
            </Link>
          </p>
        </footer>
      </section>
    </main>
  );
}
