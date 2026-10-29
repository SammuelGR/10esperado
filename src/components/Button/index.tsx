import { LoaderCircle as LoaderCircleIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

type ButtonProps = ComponentProps<'button'> & {
  loading?: boolean;
  loadingText?: string;
};

export default function Button({
  children,
  className,
  disabled = false,
  loading = false,
  loadingText,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={cn(
        `inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold
        text-primary-foreground transition-colors
        enabled:hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-primary`,
        disabled && !loading && 'bg-border text-muted-foreground',
        loading && 'cursor-wait',
        className,
      )}
      disabled={disabled || loading}
      type={type}
    >
      {loading && <LoaderCircleIcon aria-hidden className="size-4 shrink-0 motion-safe:animate-spin" />}

      {loading ? (loadingText ?? children) : children}
    </button>
  );
}
