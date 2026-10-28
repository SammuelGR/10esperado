import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/utils/cn';

type InputProps = ComponentProps<'input'> & {
  icon?: ReactNode;
};

export default function Input({ className, icon, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        className={cn(
          `peer min-h-12 w-full rounded-lg border border-border bg-input px-4 py-3 text-base text-foreground
          transition-colors placeholder:text-muted-foreground focus-visible:border-primary
          focus-visible:outline-hidden disabled:opacity-50 aria-invalid:border-error aria-invalid:bg-error/5
          aria-invalid:focus-visible:border-error`,
          icon && 'pl-11',
          className,
        )}
        {...props}
      />

      {icon && (
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground
            transition-colors peer-focus-visible:text-primary peer-disabled:opacity-50 peer-aria-invalid:text-error`}
        >
          {icon}
        </span>
      )}
    </div>
  );
}
