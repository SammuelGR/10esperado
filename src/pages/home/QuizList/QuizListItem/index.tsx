import { Link } from '@tanstack/react-router';
import { List as ListIcon } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

import type { Quiz } from '@/types/quiz';
import { cn } from '@/utils/cn';

const DIFFICULTY_CLASSES = {
  easy: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  medium: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  hard: 'border-error/30 bg-error/10 text-error',
} as const;

interface QuizListItemProps {
  quiz: Quiz;
  username: string;
}

export default function QuizListItem({ quiz, username }: QuizListItemProps) {
  const { t } = useTranslation('home');
  const { difficulty } = quiz;

  return (
    <li className="flex min-w-0">
      <Link
        className={`flex min-w-0 flex-1 flex-col rounded-2xl border border-border bg-linear-to-br from-card
          to-background p-4 transition-colors hover:border-primary/50 focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-primary`}
        params={{ quizId: quiz.id }}
        to="/resolution/$quizId"
      >
        <h2 className="text-sm font-semibold wrap-anywhere">{quiz.title}</h2>

        {quiz.description && (
          <p className="mt-1 line-clamp-2 text-xs wrap-anywhere text-muted-foreground">{quiz.description}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-4">
          <p className="min-w-0 text-[11px] wrap-anywhere text-muted-foreground">
            <Trans
              components={{ username: <span className="text-foreground" /> }}
              i18nKey={($) => $.content.list.author}
              ns="home"
              values={{ username }}
            />
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {difficulty && (
              <span
                className={cn(
                  'inline-flex rounded-full border px-2 py-0.5 text-[11px]',
                  DIFFICULTY_CLASSES[difficulty],
                )}
              >
                {t(($) => $.content.list.difficulty[difficulty])}
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground">
              <ListIcon aria-hidden className="size-4 shrink-0" />

              {t(($) => $.content.list.questions, { count: quiz.questions?.length ?? 0 })}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
