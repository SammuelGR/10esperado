import { Link } from '@tanstack/react-router';
import {
  Ellipsis as EllipsisIcon,
  EyeOff as EyeOffIcon,
  ListChecks as ListChecksIcon,
  Pencil as PencilIcon,
  Trash2 as TrashIcon,
  Upload as UploadIcon,
} from 'lucide-react';
import { useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useQuiz } from '@/contexts/QuizContext/useQuiz';

import DeleteDialog from './DeleteDialog';
import PublishDialog from './PublishDialog';
import UnpublishDialog from './UnpublishDialog';

interface ActionsMenuProps {
  quizId: string;
}

export default function ActionsMenu({ quizId }: ActionsMenuProps) {
  const { t } = useTranslation('myQuizzes');
  const { getQuizById } = useQuiz();
  const popoverId = useId();
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const publishDialogRef = useRef<HTMLDialogElement>(null);
  const unpublishDialogRef = useRef<HTMLDialogElement>(null);
  const quiz = getQuizById(quizId);

  function openDeleteDialog() {
    deleteDialogRef.current?.showModal();
  }

  function openPublishDialog() {
    publishDialogRef.current?.showModal();
  }

  function openUnpublishDialog() {
    unpublishDialogRef.current?.showModal();
  }

  if (!quiz) {
    return null;
  }

  return (
    <div className="col-start-2 row-start-1 -mt-2 -mr-2 justify-self-end md:col-start-5 md:m-0">
      <button
        aria-label={t(($) => $.content.list.actions.label, { title: quiz.title })}
        className={`inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground
          transition-colors hover:bg-input hover:text-foreground focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-primary`}
        popoverTarget={popoverId}
        type="button"
      >
        <EllipsisIcon aria-hidden className="size-5" />
      </button>

      <div
        className={`fixed inset-auto top-[anchor(bottom)] right-[anchor(right)] m-0 mt-1 w-44
          max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-card p-1.5 text-foreground shadow-xl
          [position-anchor:auto]`}
        id={popoverId}
        popover="auto"
      >
        <Link
          className={`flex min-h-10 w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs
            transition-colors hover:bg-input focus-visible:outline-2 focus-visible:-outline-offset-2
            focus-visible:outline-primary`}
          params={{ quizId }}
          to="/my-quizzes/$quizId/edit"
        >
          <PencilIcon aria-hidden className="size-3.5 shrink-0" />

          {t(($) => $.content.list.actions.edit)}
        </Link>

        <Link
          className={`flex min-h-10 w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs
            transition-colors hover:bg-input focus-visible:outline-2 focus-visible:-outline-offset-2
            focus-visible:outline-primary`}
          params={{ quizId }}
          to="/my-quizzes/$quizId/questions"
        >
          <ListChecksIcon aria-hidden className="size-3.5 shrink-0" />

          {t(($) => $.content.list.actions.manageQuestions)}
        </Link>

        {quiz.status === 'draft' ? (
          <button
            aria-haspopup="dialog"
            className={`flex min-h-10 w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs
              transition-colors hover:bg-input focus-visible:outline-2 focus-visible:-outline-offset-2
              focus-visible:outline-primary`}
            onClick={openPublishDialog}
            type="button"
          >
            <UploadIcon aria-hidden className="size-3.5 shrink-0" />

            {t(($) => $.content.list.actions.publish)}
          </button>
        ) : (
          <button
            aria-haspopup="dialog"
            className={`flex min-h-10 w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs
              transition-colors hover:bg-input focus-visible:outline-2 focus-visible:-outline-offset-2
              focus-visible:outline-primary`}
            onClick={openUnpublishDialog}
            type="button"
          >
            <EyeOffIcon aria-hidden className="size-3.5 shrink-0" />

            {t(($) => $.content.list.actions.unpublish)}
          </button>
        )}

        <hr className="my-0.5 border-border" />

        <button
          aria-haspopup="dialog"
          className={`flex min-h-10 w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs text-error
            transition-colors hover:bg-error/10 focus-visible:outline-2 focus-visible:-outline-offset-2
            focus-visible:outline-error`}
          onClick={openDeleteDialog}
          type="button"
        >
          <TrashIcon aria-hidden className="size-3.5 shrink-0" />

          {t(($) => $.content.list.actions.delete)}
        </button>
      </div>

      <PublishDialog dialogRef={publishDialogRef} quizId={quizId} />

      <UnpublishDialog dialogRef={unpublishDialogRef} quizId={quizId} />

      <DeleteDialog dialogRef={deleteDialogRef} quizId={quizId} />
    </div>
  );
}
