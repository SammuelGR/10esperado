import { LoaderCircle as LoaderCircleIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

const VARIANT_CLASSES = {
  primary: {
    base: `bg-primary text-primary-foreground enabled:hover:bg-primary/90 focus-visible:outline-primary`,
    disabled: 'bg-border text-muted-foreground',
  },
  secondary: {
    base: `border border-border bg-input text-foreground enabled:hover:bg-card focus-visible:outline-primary`,
    disabled: 'opacity-50',
  },
  danger: {
    base: `bg-error text-background enabled:hover:bg-error/90 focus-visible:outline-error`,
    disabled: 'opacity-50',
  },
} as const;

type ButtonProps = ComponentProps<'button'> & {
  loading?: boolean;
  loadingText?: string;
  variant?: keyof typeof VARIANT_CLASSES;
};

export default function Button({
  children,
  className,
  disabled = false,
  loading = false,
  loadingText,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={cn(
        `inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold
        transition-colors focus-visible:outline-2 focus-visible:outline-offset-2`,
        VARIANT_CLASSES[variant].base,
        disabled && !loading && VARIANT_CLASSES[variant].disabled,
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
