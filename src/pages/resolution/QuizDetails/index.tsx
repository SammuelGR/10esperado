import { ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/utils/cn';

interface QuizDetailsProps {
  description?: string;
  username: string;
}

export default function QuizDetails({ description, username }: QuizDetailsProps) {
  const { t } = useTranslation('resolution');
  const descriptionId = useId();
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const paragraph = descriptionRef.current;

    if (!paragraph || isExpanded) {
      return;
    }

    function measureOverflow() {
      if (paragraph) {
        setHasOverflow(paragraph.scrollHeight > paragraph.clientHeight);
      }
    }

    measureOverflow();

    const observer = new ResizeObserver(measureOverflow);
    observer.observe(paragraph);

    return () => observer.disconnect();
  }, [isExpanded]);

  return (
    <div className="mt-3 rounded-2xl border border-border bg-linear-to-br from-card to-background p-4">
      {description && (
        <p
          className={cn(
            'text-xs leading-relaxed wrap-anywhere whitespace-pre-wrap sm:text-sm',
            !isExpanded && 'line-clamp-6 sm:line-clamp-2',
          )}
          id={descriptionId}
          ref={descriptionRef}
        >
          {description}
        </p>
      )}

      <div className={cn('flex flex-wrap items-center justify-between gap-x-4 gap-y-2', description && 'mt-3')}>
        <p className="min-w-0 text-xs wrap-anywhere text-muted-foreground">
          {t(($) => $.details.author, { username })}
        </p>

        {description && hasOverflow && (
          <button
            aria-controls={descriptionId}
            aria-expanded={isExpanded}
            className={`inline-flex shrink-0 items-center gap-1 rounded-sm text-xs text-muted-foreground
              transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-primary`}
            onClick={() => setIsExpanded((current) => !current)}
            type="button"
          >
            {t(($) => (isExpanded ? $.details.showLess : $.details.showMore))}

            {isExpanded ? (
              <ChevronUpIcon aria-hidden className="size-4" />
            ) : (
              <ChevronDownIcon aria-hidden className="size-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
