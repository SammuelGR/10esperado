import { ChartColumn as ChartColumnIcon, Layers as LayersIcon, Upload as UploadIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components';
import type { Quiz } from '@/types/quiz';

interface ConfirmationViewProps {
  descriptionId: string;
  isPublishing: boolean;
  onConfirm: () => void;
  quiz: Quiz;
  titleId: string;
}

export default function ConfirmationView({
  descriptionId,
  isPublishing,
  onConfirm,
  quiz,
  titleId,
}: ConfirmationViewProps) {
  const { t } = useTranslation('myQuizzes');
  const { difficulty } = quiz;
  const questionsCount = quiz.questions?.length ?? 0;

  return (
    <>
      <header className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10">
          <UploadIcon aria-hidden className="size-7 text-primary" />
        </span>

        <h2 className="text-lg font-semibold tracking-tight sm:text-xl" id={titleId}>
          {t(($) => $.content.list.publishDialog.title)}
        </h2>
      </header>

      <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground sm:text-sm" id={descriptionId}>
        {t(($) => $.content.list.publishDialog.description)}
      </p>

      <div className="mt-5 rounded-xl border border-border bg-card/60 p-4">
        <h3 className="truncate text-sm font-semibold sm:text-base">{quiz.title}</h3>

        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <LayersIcon aria-hidden className="size-3.5" />

            {t(($) => $.questions.count, { count: questionsCount })}
          </span>

          <span aria-hidden>•</span>

          <span className="inline-flex items-center gap-1.5">
            <ChartColumnIcon aria-hidden className="size-3.5" />

            {difficulty ? t(($) => $.content.list.difficulty[difficulty]) : '—'}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <form className="w-full" method="dialog">
          <Button autoFocus className="w-full" disabled={isPublishing} type="submit" variant="secondary">
            {t(($) => $.content.list.publishDialog.cancel)}
          </Button>
        </form>

        <Button
          className="w-full"
          loading={isPublishing}
          loadingText={t(($) => $.content.list.publishDialog.loading)}
          onClick={onConfirm}
          type="button"
          variant="primary"
        >
          {t(($) => $.content.list.publishDialog.confirm)}
        </Button>
      </div>
    </>
  );
}
