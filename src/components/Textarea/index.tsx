import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

export default function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        `min-h-28 w-full resize-y rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground
        transition-colors placeholder:text-muted-foreground focus-visible:border-primary
        focus-visible:outline-hidden disabled:opacity-50 aria-invalid:border-error aria-invalid:bg-error/5
        aria-invalid:focus-visible:border-error`,
        className,
      )}
      {...props}
    />
  );
}
