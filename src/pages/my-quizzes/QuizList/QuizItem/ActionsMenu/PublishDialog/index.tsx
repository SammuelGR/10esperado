import { X as XIcon } from 'lucide-react';
import type { RefObject } from 'react';
import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { PublishQuizErrorReason } from '@/contexts/QuizContext/context';
import { useQuiz } from '@/contexts/QuizContext/useQuiz';

import ConfirmationView from './ConfirmationView';
import ValidationErrorView from './ValidationErrorView';

interface PublishDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  quizId: string;
}

export default function PublishDialog({ dialogRef, quizId }: PublishDialogProps) {
  const { t } = useTranslation('myQuizzes');
  const { getQuizById, publishQuiz } = useQuiz();
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<PublishQuizErrorReason | null>(null);
  const confirmationInProgress = useRef(false);
  const quiz = getQuizById(quizId);

  function onConfirm() {
    if (confirmationInProgress.current) {
      return;
    }

    confirmationInProgress.current = true;
    setIsPublishing(true);
    setPublishError(null);

    try {
      const result = publishQuiz(quizId);

      if (!result.success) {
        setPublishError(result.reason);
        return;
      }

      dialogRef.current?.close();
    } finally {
      confirmationInProgress.current = false;
      setIsPublishing(false);
    }
  }

  if (!quiz) {
    return null;
  }

  return (
    <dialog
      aria-busy={isPublishing || undefined}
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
      onClose={() => setPublishError(null)}
      ref={dialogRef}
    >
      {publishError ? (
        <ValidationErrorView descriptionId={descriptionId} error={publishError} quizId={quiz.id} titleId={titleId} />
      ) : (
        <ConfirmationView
          descriptionId={descriptionId}
          isPublishing={isPublishing}
          onConfirm={onConfirm}
          quiz={quiz}
          titleId={titleId}
        />
      )}

      <form className="absolute top-2 right-2" method="dialog">
        <button
          aria-label={t(($) => $.content.list.publishDialog.close)}
          className={`inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground
            transition-colors enabled:hover:bg-input enabled:hover:text-foreground focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50`}
          disabled={isPublishing}
          type="submit"
        >
          <XIcon aria-hidden className="size-5" />
        </button>
      </form>
    </dialog>
  );
}
