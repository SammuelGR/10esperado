import { Link, useNavigate } from '@tanstack/react-router';
import { ChevronLeft as ChevronLeftIcon } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

import { useQuiz } from '@/contexts/QuizContext/useQuiz';

import QuizForm from '../QuizForm';
import type { QuizFormSubmitValues } from '../QuizForm';

export default function NewQuizPage() {
  const { t } = useTranslation('myQuizzes');
  const { createQuiz } = useQuiz();
  const navigate = useNavigate();

  async function onSubmit(values: QuizFormSubmitValues) {
    const result = createQuiz(values);

    if (result.success) {
      await navigate({ to: '/my-quizzes', replace: true });
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-7 sm:px-6 sm:py-9">
      <header className="mb-5">
        <Link
          className={`inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors
            hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
          to="/my-quizzes"
        >
          <ChevronLeftIcon aria-hidden className="size-4" />

          {t(($) => $.new.back)}
        </Link>

        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{t(($) => $.new.title)}</h1>

        <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{t(($) => $.new.description)}</p>
      </header>

      <QuizForm
        mode="new"
        onCancel={() => navigate({ to: '/my-quizzes', replace: true })}
        onSubmit={onSubmit}
        status="draft"
      />

      <p className="mt-4 text-xs text-muted-foreground">
        <Trans
          components={{ strong: <strong className="font-semibold text-foreground" /> }}
          i18nKey={($) => $.new.note}
          ns="myQuizzes"
        />
      </p>
    </main>
  );
}
