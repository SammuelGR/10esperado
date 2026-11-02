import { TriangleAlert as TriangleAlertIcon } from 'lucide-react';
import type { RefObject } from 'react';
import { useId, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@/components';
import { useQuiz } from '@/contexts/QuizContext/useQuiz';

interface DeleteDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  quizId: string;
}

export default function DeleteDialog({ dialogRef, quizId }: DeleteDialogProps) {
  const { t } = useTranslation('myQuizzes');
  const { deleteQuiz, getQuizById } = useQuiz();
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmationInProgress = useRef(false);
  const quiz = getQuizById(quizId);

  function onConfirm() {
    if (confirmationInProgress.current) {
      return;
    }

    confirmationInProgress.current = true;
    setIsDeleting(true);
    setError(null);

    try {
      const result = deleteQuiz(quizId);

      if (!result.success) {
        setError(t(($) => $.content.list.deleteDialog.errors[result.reason]));
        return;
      }

      dialogRef.current?.close();
    } catch {
      setError(t(($) => $.content.list.deleteDialog.errors.failed));
    } finally {
      confirmationInProgress.current = false;
      setIsDeleting(false);
    }
  }

  if (!quiz) {
    return null;
  }

  return (
    <dialog
      aria-busy={isDeleting || undefined}
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className={`fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto
        rounded-2xl border border-border bg-linear-to-br from-card to-background p-5 text-foreground shadow-2xl
        backdrop:bg-background/80 backdrop:backdrop-blur-sm sm:p-6`}
      onCancel={(event) => {
        if (confirmationInProgress.current) {
          event.preventDefault();
        }
      }}
      onClose={() => setError(null)}
      ref={dialogRef}
    >
      <header className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-error/50 bg-error/10">
          <TriangleAlertIcon aria-hidden className="size-5 text-error" />
        </span>

        <h2 className="text-lg font-semibold tracking-tight sm:text-xl" id={titleId}>
          {t(($) => $.content.list.deleteDialog.title)}
        </h2>
      </header>

      <p className="mt-5 text-xs leading-relaxed wrap-anywhere text-muted-foreground sm:text-sm" id={descriptionId}>
        <Trans
          components={{ strong: <strong className="font-semibold text-foreground" /> }}
          i18nKey={($) => $.content.list.deleteDialog.description}
          ns="myQuizzes"
          values={{ title: quiz.title }}
        />
      </p>

      {error && (
        <p className="mt-4 text-xs text-error" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <form className="w-full sm:w-auto" method="dialog">
          <Button autoFocus className="w-full" disabled={isDeleting} type="submit" variant="secondary">
            {t(($) => $.content.list.deleteDialog.cancel)}
          </Button>
        </form>

        <Button
          className="w-full sm:w-auto"
          loading={isDeleting}
          loadingText={t(($) => $.content.list.deleteDialog.loading)}
          onClick={onConfirm}
          type="button"
          variant="danger"
        >
          {t(($) => $.content.list.deleteDialog.confirm)}
        </Button>
      </div>
    </dialog>
  );
}
