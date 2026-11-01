import { useTranslation } from 'react-i18next';

import { cn } from '@/utils/cn';
import { dateFormatter, timeFormatter } from '@/utils/formatters/date';

import type { QuizListEntry } from '../types';
import ActionsMenu from './ActionsMenu';

const DIFFICULTY_CLASSES = {
  easy: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  medium: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  hard: 'border-error/30 bg-error/10 text-error',
} as const;

interface QuizItemProps {
  quiz: QuizListEntry;
}

export default function QuizItem({ quiz }: QuizItemProps) {
  const { t } = useTranslation('myQuizzes');
  const { difficulty } = quiz;
  const updatedAt = new Date(quiz.updatedAt);

  return (
    <li
      className={`grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-4 rounded-2xl border border-border
        bg-linear-to-br from-card to-background p-4 md:grid-cols-[minmax(0,1fr)_6rem_6rem_8rem_2.5rem]
        md:items-center md:gap-x-4 md:gap-y-0 md:rounded-none md:border-0 md:border-t md:bg-none md:px-5 md:py-5`}
    >
      <div className="col-start-1 row-start-1 min-w-0">
        <h2 className="truncate text-sm font-semibold">{quiz.title}</h2>

        {quiz.description && (
          <p className="mt-1 line-clamp-2 text-xs wrap-anywhere text-muted-foreground">{quiz.description}</p>
        )}
      </div>

      <div className="col-start-1 row-start-2 flex flex-wrap items-center gap-2 md:contents">
        <div className="md:col-start-2 md:row-start-1">
          {difficulty ? (
            <span
              className={cn(
                'inline-flex rounded-full border px-2 py-0.5 text-[11px] md:min-w-16 md:justify-center',
                DIFFICULTY_CLASSES[difficulty],
              )}
            >
              {t(($) => $.content.list.difficulty[difficulty])}
            </span>
          ) : (
            <span className="inline-flex text-xs text-muted-foreground md:min-w-16 md:justify-center">—</span>
          )}
        </div>

        <div className="md:col-start-3 md:row-start-1">
          <span
            className={cn(
              'inline-flex rounded-full border px-2 py-0.5 text-[11px]',
              quiz.status === 'published'
                ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
                : 'border-border bg-input text-muted-foreground',
            )}
          >
            {t(($) => $.content.list.status[quiz.status])}
          </span>
        </div>
      </div>

      <time
        className={`col-start-2 row-start-2 text-right text-[10px] leading-relaxed text-muted-foreground
          md:col-start-4 md:row-start-1 md:text-left md:text-xs`}
        dateTime={quiz.updatedAt}
      >
        <span className="block">{dateFormatter.format(updatedAt)}</span>

        <span className="block">{timeFormatter.format(updatedAt)}</span>
      </time>

      <ActionsMenu title={quiz.title} />
    </li>
  );
}
