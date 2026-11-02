import { Link, useNavigate } from '@tanstack/react-router';
import { ChevronLeft as ChevronLeftIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/contexts/AuthContext/useAuth';
import { useQuiz } from '@/contexts/QuizContext/useQuiz';

import QuizForm from '../QuizForm';
import type { QuizFormSubmitValues } from '../QuizForm';
import UnavailableState from '../UnavailableState';
import { isEditableBy } from '../UnavailableState/isEditableBy';

interface EditQuizPageProps {
  quizId: string;
}

export default function EditQuizPage({ quizId }: EditQuizPageProps) {
  const { t } = useTranslation('myQuizzes');
  const { user } = useAuth();
  const { editQuiz, getQuizById } = useQuiz();
  const navigate = useNavigate();

  const quiz = getQuizById(quizId);

  async function onSubmit(values: QuizFormSubmitValues) {
    const result = editQuiz(quizId, values);

    if (!result.success) {
      return { error: t(($) => $.edit.form.submit.errors[result.reason]) };
    }

    await navigate({ to: '/my-quizzes', replace: true });
  }

  if (!isEditableBy(quiz, user?.id)) {
    return <UnavailableState />;
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

          {t(($) => $.edit.back)}
        </Link>

        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{t(($) => $.edit.title)}</h1>

        <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{t(($) => $.edit.description)}</p>
      </header>

      <QuizForm
        defaultValues={{
          title: quiz.title,
          description: quiz.description ?? '',
          difficulty: quiz.difficulty ?? '',
        }}
        key={quiz.id}
        mode="edit"
        onCancel={() => navigate({ to: '/my-quizzes', replace: true })}
        onSubmit={onSubmit}
        status={quiz.status}
      />

      <p className="mt-4 text-xs text-muted-foreground">{t(($) => $.edit.note)}</p>
    </main>
  );
}
