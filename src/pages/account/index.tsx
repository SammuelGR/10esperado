import { useTranslation } from 'react-i18next';

import { useAuth } from '@/contexts/AuthContext/useAuth';

import DeactivateAccountSection from './DeactivateAccountSection';
import PasswordForm from './PasswordForm';
import UsernameForm from './UsernameForm';

export default function AccountPage() {
  const { t } = useTranslation('account');
  const { user } = useAuth();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-7 sm:px-6 sm:py-9">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t(($) => $.content.header.title)}</h1>

        <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{t(($) => $.content.header.description)}</p>
      </header>

      <div className="space-y-4">
        <UsernameForm username={user?.username ?? ''} />

        <PasswordForm />

        <DeactivateAccountSection />
      </div>
    </main>
  );
}
