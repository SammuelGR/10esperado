import { Link, useNavigate } from '@tanstack/react-router';
import { ChevronLeft as ChevronLeftIcon, List as ListIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components';
import { useQuiz } from '@/contexts/QuizContext/useQuiz';
import { findUserById } from '@/services/user';
import type { Alternative, Question } from '@/types/quiz';
import { cn } from '@/utils/cn';

import QuizDetails from './QuizDetails';
import QuestionList from './QuestionList';
import ResultDialog from './ResultDialog';
import UnavailableState from './UnavailableState';

const DIFFICULTY_CLASSES = {
  easy: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  medium: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  hard: 'border-error/30 bg-error/10 text-error',
} as const;

interface ResolutionPageProps {
  quizId: string;
}

export type SelectedAlternatives = Partial<Record<Question['id'], Alternative['id']>>;

export interface QuizResult {
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
}

export default function ResolutionPage({ quizId }: ResolutionPageProps) {
  const { t } = useTranslation('resolution');
  const navigate = useNavigate();
  const { getQuizById } = useQuiz();
  const resultDialogRef = useRef<HTMLDialogElement>(null);
  const questionListRef = useRef<HTMLOListElement>(null);
  const [selectedAlternatives, setSelectedAlternatives] = useState<SelectedAlternatives>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const isSubmitted = quizResult !== null;
  const quiz = getQuizById(quizId);

  if (quiz?.status !== 'published') {
    return <UnavailableState />;
  }

  const username = findUserById(quiz.authorId)?.username ?? t(($) => $.details.unknownAuthor);
  const { difficulty, questions = [] } = quiz;

  function selectAlternativeChangeHandler(questionId: Question['id'], alternativeId: Alternative['id']) {
    if (isSubmitted) {
      return;
    }

    setSelectedAlternatives((current) => {
      const next = { ...current };

      if (current[questionId] === alternativeId) {
        delete next[questionId];
      } else {
        next[questionId] = alternativeId;
      }

      return next;
    });
  }

  function finishQuizClickHandler() {
    if (isSubmitted) {
      return;
    }

    const result: QuizResult = { correctCount: 0, incorrectCount: 0, unansweredCount: 0 };

    for (const question of questions) {
      const selectedAlternativeId = selectedAlternatives[question.id];

      if (selectedAlternativeId === undefined) {
        result.unansweredCount += 1;
      } else if (selectedAlternativeId === question.correctAlternativeId) {
        result.correctCount += 1;
      } else {
        result.incorrectCount += 1;
      }
    }

    setQuizResult(result);
    resultDialogRef.current?.showModal();
  }

  function resultDialogCloseHandler() {
    const list = questionListRef.current;

    list?.focus({ preventScroll: true });
    list?.scrollIntoView({ block: 'start' });
  }

  function concludeQuizClickHandler() {
    return navigate({ to: '/' });
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-7 sm:px-6 sm:py-9">
      <header>
        <Link
          className={`inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors
            hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
          to="/"
        >
          <ChevronLeftIcon aria-hidden className="size-4" />

          {t(($) => $.back)}
        </Link>

        <h1 className="mt-3 text-2xl font-bold tracking-tight wrap-anywhere sm:text-3xl">{quiz.title}</h1>

        <QuizDetails description={quiz.description} key={quiz.id} username={username} />

        <div className="mt-4 flex flex-wrap items-center gap-4">
          {difficulty && (
            <span className="border-r border-border pr-4">
              <span
                className={cn(
                  'inline-flex rounded-full border px-2 py-0.5 text-[11px]',
                  DIFFICULTY_CLASSES[difficulty],
                )}
              >
                {t(($) => $.metadata.difficulty[difficulty])}
              </span>
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground">
            <ListIcon aria-hidden className="size-4 shrink-0" />

            {t(($) => $.metadata.questions, { count: questions.length })}
          </span>
        </div>
      </header>

      <QuestionList
        isSubmitted={isSubmitted}
        key={quiz.id}
        listRef={questionListRef}
        onSelectAlternative={selectAlternativeChangeHandler}
        questions={questions}
        selectedAlternatives={selectedAlternatives}
      />

      <div className="mt-6 flex gap-3 sm:justify-end">
        {isSubmitted ? (
          <>
            <Button
              aria-haspopup="dialog"
              className="flex-1 sm:flex-none"
              onClick={() => resultDialogRef.current?.showModal()}
              variant="secondary"
            >
              {t(($) => $.viewResult)}
            </Button>

            <Button className="flex-1 sm:flex-none" onClick={concludeQuizClickHandler}>
              {t(($) => $.conclude)}
            </Button>
          </>
        ) : (
          <Button aria-haspopup="dialog" className="w-full sm:w-auto" onClick={finishQuizClickHandler}>
            {t(($) => $.finish)}
          </Button>
        )}
      </div>

      <ResultDialog
        dialogRef={resultDialogRef}
        onClose={resultDialogCloseHandler}
        onConclude={concludeQuizClickHandler}
        result={quizResult}
      />
    </main>
  );
}
