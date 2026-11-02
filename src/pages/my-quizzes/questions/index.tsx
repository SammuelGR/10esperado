import { Link } from '@tanstack/react-router';
import { ChevronLeft as ChevronLeftIcon, Layers as LayersIcon, Plus as PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components';
import { useAuth } from '@/contexts/AuthContext/useAuth';
import { useQuiz } from '@/contexts/QuizContext/useQuiz';

import UnavailableState from '../UnavailableState';
import { isEditableBy } from '../UnavailableState/isEditableBy';
import EmptyState from './EmptyState';
import QuestionForm from './QuestionForm';
import type { QuestionFormValues } from './QuestionForm';
import QuestionList from './QuestionList';

interface QuizQuestionsPageProps {
  quizId: string;
}

export default function QuizQuestionsPage({ quizId }: QuizQuestionsPageProps) {
  const { t } = useTranslation('myQuizzes');
  const { user } = useAuth();
  const { addQuestion, getQuizById } = useQuiz();
  const [isCreating, setIsCreating] = useState(false);
  const quiz = getQuizById(quizId);

  function handleCreateQuestion(values: QuestionFormValues) {
    const result = addQuestion(quizId, values);

    if (!result.success) {
      return { error: t(($) => $.questions.form.errors[result.reason]) };
    }

    setIsCreating(false);
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

          {t(($) => $.questions.back)}
        </Link>

        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{t(($) => $.questions.title)}</h1>

        <div className="mt-1.5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 text-xs wrap-anywhere text-muted-foreground sm:text-sm">{quiz.title}</p>

          <span
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/20
              bg-primary/10 px-3 py-1.5 text-xs`}
          >
            <LayersIcon aria-hidden className="size-4 text-primary" />

            {t(($) => $.questions.count, { count: quiz.questions?.length ?? 0 })}
          </span>
        </div>
      </header>

      <div className="space-y-5">
        {Boolean(quiz.questions?.length) && <QuestionList questions={quiz.questions ?? []} quizId={quizId} />}

        {isCreating ? (
          <QuestionForm
            key={quiz.id}
            onCancel={() => setIsCreating(false)}
            onSubmit={handleCreateQuestion}
            questionNumber={(quiz.questions?.length ?? 0) + 1}
          />
        ) : !quiz.questions?.length ? (
          <EmptyState onAdd={() => setIsCreating(true)} />
        ) : (
          <Button className="w-full text-primary" onClick={() => setIsCreating(true)} variant="secondary">
            <PlusIcon aria-hidden className="size-4" />

            {t(($) => $.questions.add)}
          </Button>
        )}
      </div>
    </main>
  );
}
