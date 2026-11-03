import { Link } from '@tanstack/react-router';
import {
  CircleAlert as CircleAlertIcon,
  SquareArrowOutUpRight as SquareArrowOutUpRightIcon,
  TriangleAlert as TriangleAlertIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components';
import type { PublishQuizErrorReason } from '@/contexts/QuizContext/context';

interface ActionableErrorConfig {
  actionKey: 'editQuiz' | 'manageQuestions';
  messageKey: Extract<PublishQuizErrorReason, 'invalidTitle' | 'missingDifficulty' | 'noValidQuestions'>;
  to: '/my-quizzes/$quizId/edit' | '/my-quizzes/$quizId/questions';
}

const ACTIONABLE_ERRORS: Record<
  Extract<PublishQuizErrorReason, 'invalidTitle' | 'missingDifficulty' | 'noValidQuestions'>,
  ActionableErrorConfig
> = {
  invalidTitle: {
    messageKey: 'invalidTitle',
    actionKey: 'editQuiz',
    to: '/my-quizzes/$quizId/edit',
  },
  missingDifficulty: {
    messageKey: 'missingDifficulty',
    actionKey: 'editQuiz',
    to: '/my-quizzes/$quizId/edit',
  },
  noValidQuestions: {
    messageKey: 'noValidQuestions',
    actionKey: 'manageQuestions',
    to: '/my-quizzes/$quizId/questions',
  },
};

interface ValidationErrorViewProps {
  descriptionId: string;
  error: PublishQuizErrorReason;
  quizId: string;
  titleId: string;
}

export default function ValidationErrorView({ descriptionId, error, quizId, titleId }: ValidationErrorViewProps) {
  const { t } = useTranslation('myQuizzes');
  const isActionable = error in ACTIONABLE_ERRORS;
  const actionableConfig = isActionable ? ACTIONABLE_ERRORS[error as keyof typeof ACTIONABLE_ERRORS] : null;

  return (
    <>
      <header className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl border border-error/30 bg-error/10">
          <TriangleAlertIcon aria-hidden className="size-7 text-error" />
        </span>

        <h2 className="text-lg font-semibold tracking-tight sm:text-xl" id={titleId}>
          {t(($) => $.content.list.publishDialog.errorTitle)}
        </h2>
      </header>

      <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground sm:text-sm" id={descriptionId}>
        {t(($) => $.content.list.publishDialog.errorDescription)}
      </p>

      <div className="mt-5 flex items-center gap-3 rounded-xl border border-error/30 bg-error/10 p-4">
        <CircleAlertIcon aria-hidden className="size-5 shrink-0 text-error" />

        <p className="text-xs leading-relaxed text-foreground sm:text-sm">
          {actionableConfig
            ? t(($) => $.content.list.publishDialog.errors[actionableConfig.messageKey])
            : t(($) => $.content.list.publishDialog.errors.failed)}
        </p>
      </div>

      {actionableConfig && (
        <Link
          className={`mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border
            border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors
            hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-primary`}
          params={{ quizId }}
          to={actionableConfig.to}
        >
          <SquareArrowOutUpRightIcon aria-hidden className="size-4 shrink-0" />

          {t(($) => $.content.list.publishDialog.actions[actionableConfig.actionKey])}
        </Link>
      )}

      <div className="mt-6 flex justify-end">
        <form method="dialog">
          <Button type="submit" variant="secondary">
            {t(($) => $.content.list.publishDialog.dismiss)}
          </Button>
        </form>
      </div>
    </>
  );
}
