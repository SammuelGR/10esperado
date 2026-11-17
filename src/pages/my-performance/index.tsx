import { useTranslation } from 'react-i18next';

import { useAuth } from '@/contexts/AuthContext/useAuth';
import { getAttemptsByUser } from '@/services/attempt';

import AttemptList from './AttemptList';
import Summary from './Summary';

export default function MyPerformancePage() {
  const { t } = useTranslation('myPerformance');
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const { attempts, summary } = getAttemptsByUser(user.id);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-7 sm:px-6 sm:py-9">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t(($) => $.content.title)}</h1>

        <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{t(($) => $.content.description)}</p>
      </header>

      <Summary summary={summary} />

      <AttemptList attempts={attempts} />
    </main>
  );
}
