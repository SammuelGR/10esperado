import { ChevronDown as ChevronDownIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

export default function Select({ children, className, ...props }: ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select
        className={cn(
          `peer min-h-10 w-full appearance-none rounded-lg border border-border bg-input py-2 pr-10 pl-3 text-sm
          text-foreground transition-colors focus-visible:border-primary focus-visible:outline-hidden
          disabled:opacity-50 aria-invalid:border-error aria-invalid:bg-error/5 aria-invalid:focus-visible:border-error
          has-[option[value='']:checked]:text-muted-foreground [&>option]:text-foreground`,
          className,
        )}
        {...props}
      >
        {children}
      </select>

      <span
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground
          transition-colors peer-focus-visible:text-primary peer-disabled:opacity-50 peer-aria-invalid:text-error`}
      >
        <ChevronDownIcon className="size-4" />
      </span>
    </div>
  );
}
