import { Eye as EyeIcon, EyeOff as EyeOffIcon, Lock as LockIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/utils/cn';

import Input from '../Input';

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'icon' | 'type'> & {
  onToggleVisibility: () => void;
  visible: boolean;
};

export default function PasswordInput({ className, id, onToggleVisibility, visible, ...props }: PasswordInputProps) {
  const { t } = useTranslation('common');
  const VisibilityIcon = visible ? EyeOffIcon : EyeIcon;
  const isInvalid = props['aria-invalid'] === true || props['aria-invalid'] === 'true';

  return (
    <div className="relative">
      <Input
        {...props}
        className={cn('pr-14', className)}
        icon={<LockIcon className="size-5" />}
        id={id}
        type={visible ? 'text' : 'password'}
      />

      <button
        aria-controls={id}
        aria-label={visible ? t(($) => $.form.password.visibility.hide) : t(($) => $.form.password.visibility.show)}
        className={cn(
          `absolute inset-y-0 right-1 flex w-11 items-center justify-center rounded-md transition-colors
          focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary`,
          isInvalid ? 'text-error' : 'text-muted-foreground hover:text-foreground',
        )}
        onClick={onToggleVisibility}
        type="button"
      >
        <VisibilityIcon aria-hidden className="size-5" />
      </button>
    </div>
  );
}
