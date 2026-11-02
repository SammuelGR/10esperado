import { Layers as LayersIcon, Plus as PlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components';

interface EmptyStateProps {
  onAdd: () => void;
}

export default function EmptyState({ onAdd }: EmptyStateProps) {
  const { t } = useTranslation('myQuizzes');

  return (
    <div
      className={`flex min-h-80 flex-col items-center justify-center rounded-2xl border border-border
        bg-linear-to-br from-card to-background px-4 py-10 text-center sm:px-6 sm:py-12`}
    >
      <span className="mb-5 inline-flex size-16 items-center justify-center rounded-2xl border border-primary/25 bg-primary/5 text-primary">
        <LayersIcon aria-hidden className="size-7" />
      </span>

      <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{t(($) => $.questions.empty.title)}</h2>

      <p className="mt-2 max-w-xs text-xs text-muted-foreground sm:text-sm">
        {t(($) => $.questions.empty.description)}
      </p>

      <Button className="mt-6" onClick={onAdd}>
        <PlusIcon aria-hidden className="size-4" />

        {t(($) => $.questions.add)}
      </Button>
    </div>
  );
}
