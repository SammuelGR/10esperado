import { EyeOff as EyeOffIcon, X as XIcon } from 'lucide-react';
import type { RefObject } from 'react';
import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components';
import { useQuiz } from '@/contexts/QuizContext/useQuiz';

interface UnpublishDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  quizId: string;
}

export default function UnpublishDialog({ dialogRef, quizId }: UnpublishDialogProps) {
  const { t } = useTranslation('myQuizzes');
  const { getQuizById, unpublishQuiz } = useQuiz();
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmationInProgress = useRef(false);
  const quiz = getQuizById(quizId);

  function onConfirm() {
    if (confirmationInProgress.current) {
      return;
    }

    confirmationInProgress.current = true;
    setIsUnpublishing(true);
    setError(null);

    try {
      const result = unpublishQuiz(quizId);

      if (!result.success) {
        setError(t(($) => $.content.list.unpublishDialog.errors.failed));
        return;
      }

      dialogRef.current?.close();
    } catch {
      setError(t(($) => $.content.list.unpublishDialog.errors.failed));
    } finally {
      confirmationInProgress.current = false;
      setIsUnpublishing(false);
    }
  }

  if (!quiz) {
    return null;
  }

  return (
    <dialog
      aria-busy={isUnpublishing || undefined}
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
      <header className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl border border-border bg-input">
          <EyeOffIcon aria-hidden className="size-7 text-foreground" />
        </span>

        <h2 className="text-lg font-semibold tracking-tight sm:text-xl" id={titleId}>
          {t(($) => $.content.list.unpublishDialog.title)}
        </h2>
      </header>

      <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground sm:text-sm" id={descriptionId}>
        {t(($) => $.content.list.unpublishDialog.description)}
      </p>

      {error && (
        <p className="mt-4 text-center text-xs text-error" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <form className="w-full" method="dialog">
          <Button autoFocus className="w-full" disabled={isUnpublishing} type="submit" variant="secondary">
            {t(($) => $.content.list.unpublishDialog.cancel)}
          </Button>
        </form>

        <Button
          className="w-full"
          loading={isUnpublishing}
          loadingText={t(($) => $.content.list.unpublishDialog.loading)}
          onClick={onConfirm}
          type="button"
          variant="primary"
        >
          {t(($) => $.content.list.unpublishDialog.confirm)}
        </Button>
      </div>

      <form className="absolute top-2 right-2" method="dialog">
        <button
          aria-label={t(($) => $.content.list.unpublishDialog.close)}
          className={`inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground
            transition-colors enabled:hover:bg-input enabled:hover:text-foreground focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50`}
          disabled={isUnpublishing}
          type="submit"
        >
          <XIcon aria-hidden className="size-5" />
        </button>
      </form>
    </dialog>
  );
}
