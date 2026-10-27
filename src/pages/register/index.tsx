import { useTranslation } from 'react-i18next';

import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  const { t } = useTranslation('register');

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-8 sm:px-6 sm:py-12">
      <section
        aria-labelledby="register-title"
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8"
      >
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl" id="register-title">
            {t(($) => $.content.header.title)}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(($) => $.content.header.description)}</p>
        </header>

        <RegisterForm />
      </section>
    </main>
  );
}
