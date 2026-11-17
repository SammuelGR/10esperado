import { ClipboardList as ClipboardListIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function EmptyState() {
  const { t } = useTranslation('myPerformance');

  return (
    <div
      className={`flex min-h-80 flex-col items-center justify-center rounded-2xl border border-border
        bg-linear-to-br from-card to-background px-4 py-10 text-center sm:min-h-88 sm:px-6 sm:py-12`}
    >
      <span
        className={`mb-5 inline-flex size-16 items-center justify-center rounded-2xl border border-primary/25
          bg-primary/5 text-primary`}
      >
        <ClipboardListIcon aria-hidden className="size-7" />
      </span>

      <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{t(($) => $.content.list.empty.title)}</h3>

      <p className="mt-2 max-w-xs text-xs text-muted-foreground sm:text-sm">
        {t(($) => $.content.list.empty.description)}
      </p>
    </div>
  );
}
