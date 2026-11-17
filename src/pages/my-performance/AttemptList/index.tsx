import { useTranslation } from 'react-i18next';

import type { Attempt } from '@/types/attempt';

import AttemptItem from './AttemptItem';
import EmptyState from './EmptyState';

interface AttemptListProps {
  attempts: Attempt[];
}

export default function AttemptList({ attempts }: AttemptListProps) {
  const { t } = useTranslation('myPerformance');

  return (
    <section aria-label={t(($) => $.content.list.title)} className="mt-8 sm:mt-10">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{t(($) => $.content.list.title)}</h2>

        <p className="hidden text-xs text-muted-foreground md:block">{t(($) => $.content.list.order)}</p>
      </header>

      {attempts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="md:rounded-2xl md:border md:border-border md:bg-linear-to-br md:from-card md:to-background">
          <div
            aria-hidden
            className={`hidden grid-cols-[minmax(0,1fr)_5rem_5rem_5rem_8rem] items-center gap-x-4
              px-5 py-4 text-xs text-muted-foreground md:grid`}
          >
            <span>{t(($) => $.content.list.columns.title)}</span>

            <span className="text-center">{t(($) => $.content.list.columns.correct)}</span>

            <span className="text-center">{t(($) => $.content.list.columns.incorrect)}</span>

            <span className="text-center">{t(($) => $.content.list.columns.unanswered)}</span>

            <span className="text-center">{t(($) => $.content.list.columns.completedAt)}</span>
          </div>

          <ul className="space-y-3 md:space-y-0">
            {attempts.map((attempt) => (
              <AttemptItem attempt={attempt} key={attempt.id} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
