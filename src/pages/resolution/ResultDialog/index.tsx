import type { RefObject } from 'react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components';

import type { QuizResult } from '..';

interface ResultDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  onClose: () => void;
  onConclude: () => void;
  result: QuizResult | null;
}

export default function ResultDialog({ dialogRef, onClose, onConclude, result }: ResultDialogProps) {
  const { t } = useTranslation('resolution');
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;

  return (
    <dialog
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className={`fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto
        rounded-2xl border border-border bg-linear-to-br from-card to-background p-5 text-foreground shadow-2xl
        backdrop:bg-background/80 backdrop:backdrop-blur-sm sm:p-6`}
      onClose={onClose}
      ref={dialogRef}
    >
      <header className="text-center">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl" id={titleId}>
          {t(($) => $.resultDialog.title)}
        </h2>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm" id={descriptionId}>
          {t(($) => $.resultDialog.description)}
        </p>
      </header>

      {result && (
        <dl className="mt-6 grid grid-cols-3 gap-2 text-center sm:gap-3">
          <div
            className={`flex min-w-0 flex-col-reverse items-center gap-1 rounded-xl border border-emerald-400/25
              bg-emerald-400/10 px-1 py-3 sm:px-2`}
          >
            <dt className="text-xs">{t(($) => $.resultDialog.correct)}</dt>

            <dd className="text-2xl font-semibold text-emerald-300 tabular-nums">{result.correctCount}</dd>
          </div>

          <div
            className={`flex min-w-0 flex-col-reverse items-center gap-1 rounded-xl border border-error/30
              bg-error/10 px-1 py-3 sm:px-2`}
          >
            <dt className="text-xs">{t(($) => $.resultDialog.incorrect)}</dt>

            <dd className="text-2xl font-semibold text-error tabular-nums">{result.incorrectCount}</dd>
          </div>

          <div
            className={`flex min-w-0 flex-col-reverse items-center gap-1 rounded-xl border border-amber-400/25
              bg-amber-400/10 px-1 py-3 sm:px-2`}
          >
            <dt className="text-xs">{t(($) => $.resultDialog.unanswered)}</dt>

            <dd className="text-2xl font-semibold text-amber-300 tabular-nums">{result.unansweredCount}</dd>
          </div>
        </dl>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <form className="w-full" method="dialog">
          <Button autoFocus className="w-full" type="submit" variant="secondary">
            {t(($) => $.resultDialog.reviewAnswers)}
          </Button>
        </form>

        <Button className="w-full" onClick={onConclude}>
          {t(($) => $.conclude)}
        </Button>
      </div>
    </dialog>
  );
}
