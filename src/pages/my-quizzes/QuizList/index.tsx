import { ArrowDown as ArrowDownIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { ActiveQuiz } from '@/types/quiz';

import EmptyState from './EmptyState';
import QuizItem from './QuizItem';

interface QuizListProps {
  quizzes: ActiveQuiz[];
  totalCount?: number;
  emptyState?: 'empty' | 'noResults';
  onClearFilters?: () => void;
}

export default function QuizList({
  quizzes,
  totalCount = quizzes.length,
  emptyState = 'empty',
  onClearFilters,
}: QuizListProps) {
  const { t } = useTranslation('myQuizzes');

  return (
    <section aria-label={t(($) => $.content.list.label)} className="mt-4 sm:mt-5">
      {quizzes.length === 0 ? (
        <EmptyState onClearFilters={onClearFilters} variant={emptyState} />
      ) : (
        <>
          <div className="md:rounded-2xl md:border md:border-border md:bg-linear-to-br md:from-card md:to-background">
            <div
              aria-hidden
              className={`hidden grid-cols-[minmax(0,1fr)_6rem_6rem_8rem_2.5rem] items-center gap-x-4
                px-5 py-4 text-xs text-muted-foreground md:grid`}
            >
              <span>{t(($) => $.content.list.columns.title)}</span>

              <span>{t(($) => $.content.list.columns.difficulty)}</span>

              <span>{t(($) => $.content.list.columns.status)}</span>

              <span className="inline-flex items-center gap-1">
                {t(($) => $.content.list.columns.updatedAt)}

                <ArrowDownIcon className="size-3 shrink-0" />
              </span>
            </div>

            <ul className="space-y-3 md:space-y-0">
              {quizzes.map((quiz) => (
                <QuizItem key={quiz.id} quiz={quiz} />
              ))}
            </ul>
          </div>

          <footer className="mt-5 flex items-start justify-between gap-5 text-[11px] text-muted-foreground">
            <p>{t(($) => $.content.list.count, { shown: quizzes.length, total: totalCount })}</p>

            <p className="max-w-48 text-right sm:max-w-none">{t(($) => $.content.list.order)}</p>
          </footer>
        </>
      )}
    </section>
  );
}
