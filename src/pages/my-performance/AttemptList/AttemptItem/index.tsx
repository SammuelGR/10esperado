import { useTranslation } from 'react-i18next';

import { useQuiz } from '@/contexts/QuizContext/useQuiz';
import type { Attempt } from '@/types/attempt';
import { dateFormatter, timeFormatter } from '@/utils/formatters/date';

interface AttemptItemProps {
  attempt: Attempt;
}

export default function AttemptItem({ attempt }: AttemptItemProps) {
  const { t } = useTranslation('myPerformance');
  const { getQuizById } = useQuiz();
  const quiz = getQuizById(attempt.quizId);
  const completedAt = new Date(attempt.completedAt);

  return (
    <li
      className={`grid gap-y-3 rounded-2xl border border-border bg-linear-to-br from-card to-background p-4
        md:grid-cols-[minmax(0,1fr)_5rem_5rem_5rem_8rem] md:items-center md:gap-x-4 md:gap-y-0
        md:rounded-none md:border-0 md:border-t md:bg-none md:px-5 md:py-5`}
    >
      <h3 className="min-w-0 text-sm font-semibold wrap-anywhere md:col-start-1 md:row-start-1">
        {quiz?.title ?? t(($) => $.content.list.unknownQuiz)}
      </h3>

      <time
        className="text-[11px] leading-relaxed text-muted-foreground md:col-start-5 md:row-start-1 md:text-center md:text-xs"
        dateTime={attempt.completedAt}
      >
        <span>{dateFormatter.format(completedAt)}</span>

        <span aria-hidden className="md:hidden">
          {' '}
          ·{' '}
        </span>

        <span className="md:block">{timeFormatter.format(completedAt)}</span>
      </time>

      <dl className="grid grid-cols-3 gap-3 border-t border-border pt-3 md:contents">
        <div className="flex flex-col-reverse gap-1 md:col-start-2 md:row-start-1 md:items-center">
          <dt className="text-[11px] text-muted-foreground md:sr-only">{t(($) => $.content.list.columns.correct)}</dt>

          <dd className="text-sm font-semibold text-emerald-300 tabular-nums">{attempt.correct}</dd>
        </div>

        <div className="flex flex-col-reverse gap-1 md:col-start-3 md:row-start-1 md:items-center">
          <dt className="text-[11px] text-muted-foreground md:sr-only">{t(($) => $.content.list.columns.incorrect)}</dt>

          <dd className="text-sm font-semibold text-error tabular-nums">{attempt.incorrect}</dd>
        </div>

        <div className="flex flex-col-reverse gap-1 md:col-start-4 md:row-start-1 md:items-center">
          <dt className="text-[11px] text-muted-foreground md:sr-only">
            {t(($) => $.content.list.columns.unanswered)}
          </dt>

          <dd className="text-sm font-semibold tabular-nums">{attempt.unanswered}</dd>
        </div>
      </dl>
    </li>
  );
}
