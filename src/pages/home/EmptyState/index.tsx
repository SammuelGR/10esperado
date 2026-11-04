import { Link } from '@tanstack/react-router';
import { FileText as FileTextIcon, Search as SearchIcon, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components';

const VARIANT_CONFIG = {
  visitor: { icon: UserIcon, to: '/register' },
  authenticated: { icon: FileTextIcon, to: '/my-quizzes' },
  noResults: { icon: SearchIcon, to: null },
} as const;

export type EmptyStateVariant = 'visitor' | 'authenticated' | 'noResults';

interface EmptyStateProps {
  variant: EmptyStateVariant;
  onClearFilters: () => void;
}

export default function EmptyState({ variant, onClearFilters }: EmptyStateProps) {
  const { t } = useTranslation('home');
  const { icon: Icon, to } = VARIANT_CONFIG[variant];

  return (
    <div
      className={`mt-4 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-border
        bg-linear-to-br from-card to-background px-4 py-10 text-center sm:mt-5 sm:min-h-88 sm:px-6 sm:py-12`}
    >
      <span className="mb-5 inline-flex size-16 items-center justify-center rounded-2xl border border-primary/25 bg-primary/5 text-primary">
        <Icon aria-hidden className="size-7" />
      </span>

      <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
        {t(($) => $.content.emptyStates[variant].title)}
      </h2>

      <p className="mt-2 max-w-xs text-xs text-muted-foreground sm:text-sm">
        {t(($) => $.content.emptyStates[variant].description)}
      </p>

      {to === null ? (
        <Button className="mt-6" onClick={onClearFilters}>
          {t(($) => $.content.emptyStates[variant].action)}
        </Button>
      ) : (
        <Link
          className={`mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 py-2
            text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
          to={to}
        >
          {t(($) => $.content.emptyStates[variant].action)}
        </Link>
      )}
    </div>
  );
}
