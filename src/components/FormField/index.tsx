import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface FormFieldProps {
  children: ReactNode;
  className?: string;
  error?: string;
  helper?: string;
  htmlFor: string;
  label: string;
  required?: boolean;
}

export default function FormField({ children, className, error, helper, htmlFor, label, required }: FormFieldProps) {
  const message = error || helper;

  return (
    <div className={cn('space-y-1', className)}>
      <label className="block text-xs font-medium" htmlFor={htmlFor}>
        {label}

        {required && (
          <span aria-hidden className="ml-0.5 text-primary">
            *
          </span>
        )}
      </label>

      {children}

      {message && (
        <p
          className={cn('text-[11px] text-muted-foreground', error && 'text-error')}
          id={`${htmlFor}-message`}
          role={error ? 'alert' : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
}
