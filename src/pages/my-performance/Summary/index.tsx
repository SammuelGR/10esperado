import {
  CircleCheck as CircleCheckIcon,
  ClipboardList as ClipboardListIcon,
  List as ListIcon,
  Target as TargetIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { AttemptSummary } from '@/services/attempt';
import { cn } from '@/utils/cn';
import { percentFormatter } from '@/utils/formatters/number';

interface SummaryProps {
  summary: AttemptSummary;
}

export default function Summary({ summary }: SummaryProps) {
  const { t } = useTranslation('myPerformance');
  const indicators = [
    {
      key: 'completedQuizzes',
      label: t(($) => $.content.summary.completedQuizzes),
      value: summary.completedQuizzes,
      icon: ClipboardListIcon,
      iconClassName: 'bg-primary/10 text-primary',
    },
    {
      key: 'answeredQuestions',
      label: t(($) => $.content.summary.answeredQuestions),
      value: summary.answeredQuestions,
      icon: ListIcon,
      iconClassName: 'bg-primary/10 text-primary',
    },
    {
      key: 'correctAnswers',
      label: t(($) => $.content.summary.correctAnswers),
      value: summary.correctAnswers,
      icon: CircleCheckIcon,
      iconClassName: 'bg-emerald-400/10 text-emerald-300',
    },
    {
      key: 'accuracyRate',
      label: t(($) => $.content.summary.accuracyRate),
      value: percentFormatter.format(summary.accuracyRate),
      icon: TargetIcon,
      iconClassName: 'bg-amber-400/10 text-amber-300',
    },
  ];

  return (
    <dl className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {indicators.map(({ key, label, value, icon: Icon, iconClassName }) => (
        <div
          className={`flex min-w-0 flex-col justify-between gap-6 rounded-2xl border border-border
            bg-linear-to-br from-card to-background p-4 sm:p-5`}
          key={key}
        >
          <dt className="flex items-start justify-between gap-2 text-xs text-muted-foreground">
            <span>{label}</span>

            <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', iconClassName)}>
              <Icon aria-hidden className="size-4" />
            </span>
          </dt>

          <dd className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
