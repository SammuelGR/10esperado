import { Trash2 as TrashIcon, X as XIcon } from 'lucide-react';
import type { RefObject } from 'react';
import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components';
import { useQuiz } from '@/contexts/QuizContext/useQuiz';

interface DeleteDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  quizId: string;
  questionId: string;
}

export default function DeleteDialog({ dialogRef, quizId, questionId }: DeleteDialogProps) {
  const { t } = useTranslation('myQuizzes');
  const { deleteQuestion } = useQuiz();
  const dialogId = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmationInProgress = useRef(false);

  function onConfirm() {
    if (confirmationInProgress.current) {
      return;
    }

    confirmationInProgress.current = true;
    setIsDeleting(true);
    setError(null);

    try {
      const result = deleteQuestion(quizId, questionId);

      if (!result.success) {
        setError(t(($) => $.questions.deleteDialog.errors[result.reason]));
        return;
      }

      dialogRef.current?.close();
    } catch {
      setError(t(($) => $.questions.deleteDialog.errors.failed));
    } finally {
      confirmationInProgress.current = false;
      setIsDeleting(false);
    }
  }

  return (
    <dialog
      aria-busy={isDeleting || undefined}
      aria-describedby={`${dialogId}-description`}
      aria-labelledby={`${dialogId}-title`}
      className={`fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto
        rounded-2xl border border-border bg-linear-to-br from-card to-background p-6 text-foreground shadow-2xl
        backdrop:bg-background/80 backdrop:backdrop-blur-sm`}
      onCancel={(event) => {
        if (confirmationInProgress.current) {
          event.preventDefault();
        }
      }}
      onClose={() => setError(null)}
      ref={dialogRef}
    >
      <header className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-xl border border-error/30 bg-error/10">
          <TrashIcon aria-hidden className="size-7 text-error" />
        </span>

        <h2 className="text-lg font-semibold tracking-tight sm:text-xl" id={`${dialogId}-title`}>
          {t(($) => $.questions.deleteDialog.title)}
        </h2>
      </header>

      <p
        className="mt-3 text-center text-xs leading-relaxed text-muted-foreground sm:text-sm"
        id={`${dialogId}-description`}
      >
        {t(($) => $.questions.deleteDialog.description)}
      </p>

      {error && (
        <p className="mt-4 text-left text-xs leading-relaxed text-error" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:grid sm:grid-cols-2">
        <form className="w-full" method="dialog">
          <Button autoFocus className="w-full" disabled={isDeleting} type="submit" variant="secondary">
            {t(($) => $.questions.deleteDialog.cancel)}
          </Button>
        </form>

        <Button
          className="w-full"
          loading={isDeleting}
          loadingText={t(($) => $.questions.deleteDialog.loading)}
          onClick={onConfirm}
          variant="danger"
        >
          {t(($) => $.questions.deleteDialog.confirm)}
        </Button>
      </div>

      <form className="absolute top-2 right-2" method="dialog">
        <button
          aria-label={t(($) => $.questions.deleteDialog.close)}
          className={`inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground
            transition-colors enabled:hover:bg-input enabled:hover:text-foreground focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50`}
          disabled={isDeleting}
          type="submit"
        >
          <XIcon aria-hidden className="size-5" />
        </button>
      </form>
    </dialog>
  );
}
