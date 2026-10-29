import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitEvent } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, FormField, PasswordInput } from '@/components';

import { createPasswordSchema } from '../schema';

export default function PasswordForm() {
  const { t } = useTranslation('account');

  const [showPassword, setShowPassword] = useState(false);

  const schema = createPasswordSchema({
    currentPassword: {
      required: t(($) => $.password.current.errors.required),
    },
    newPassword: {
      required: t(($) => $.password.next.errors.required),
      length: t(($) => $.password.next.errors.length),
      invalidCharacters: t(($) => $.password.next.errors.invalidCharacters),
    },
    confirmPassword: {
      required: t(($) => $.password.confirm.errors.required),
      mismatch: t(($) => $.password.confirm.errors.mismatch),
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, touchedFields },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const submitForm = handleSubmit(() => undefined);

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitForm();
  }

  function togglePasswordVisibility() {
    setShowPassword((visible) => !visible);
  }

  return (
    <form
      aria-labelledby="account-password-title"
      className="rounded-2xl border border-border bg-linear-to-br from-card to-background p-4 sm:p-6"
      noValidate
      onSubmit={onSubmit}
    >
      <h2 className="text-base font-semibold tracking-tight sm:text-lg" id="account-password-title">
        {t(($) => $.password.title)}
      </h2>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <FormField
          error={errors.currentPassword?.message}
          htmlFor="account-current-password"
          label={t(($) => $.password.current.label)}
        >
          <PasswordInput
            {...register('currentPassword')}
            aria-describedby={errors.currentPassword ? 'account-current-password-message' : undefined}
            aria-invalid={Boolean(errors.currentPassword)}
            autoComplete="current-password"
            id="account-current-password"
            onToggleVisibility={togglePasswordVisibility}
            placeholder={t(($) => $.password.current.placeholder)}
            visible={showPassword}
          />
        </FormField>

        <FormField
          error={errors.newPassword?.message}
          helper={t(($) => $.password.next.helper)}
          htmlFor="account-new-password"
          label={t(($) => $.password.next.label)}
        >
          <PasswordInput
            {...register('newPassword', {
              deps: touchedFields.confirmPassword || isSubmitted ? 'confirmPassword' : undefined,
            })}
            aria-describedby="account-new-password-message"
            aria-invalid={Boolean(errors.newPassword)}
            autoComplete="new-password"
            id="account-new-password"
            onToggleVisibility={togglePasswordVisibility}
            placeholder={t(($) => $.password.next.placeholder)}
            visible={showPassword}
          />
        </FormField>

        <FormField
          error={errors.confirmPassword?.message}
          htmlFor="account-confirm-password"
          label={t(($) => $.password.confirm.label)}
        >
          <PasswordInput
            {...register('confirmPassword')}
            aria-describedby={errors.confirmPassword ? 'account-confirm-password-message' : undefined}
            aria-invalid={Boolean(errors.confirmPassword)}
            autoComplete="new-password"
            id="account-confirm-password"
            onToggleVisibility={togglePasswordVisibility}
            placeholder={t(($) => $.password.confirm.placeholder)}
            visible={showPassword}
          />
        </FormField>
      </div>

      <div className="mt-5 flex sm:justify-end">
        <Button className="w-full sm:w-40" type="submit">
          {t(($) => $.password.action)}
        </Button>
      </div>
    </form>
  );
}
