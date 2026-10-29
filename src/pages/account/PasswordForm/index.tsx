import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitEvent } from 'react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, FormField, PasswordInput } from '@/components';
import { useAuth } from '@/contexts/AuthContext/useAuth';

import { createPasswordSchema } from '../schema';

export default function PasswordForm() {
  const { t } = useTranslation('account');
  const { updatePassword } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const submissionInProgress = useRef(false);

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
    reset,
    setError,
    formState: { errors, isSubmitted, isSubmitting, touchedFields },
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

  const submitForm = handleSubmit(async ({ currentPassword, newPassword }) => {
    try {
      const result = await updatePassword({ currentPassword, newPassword });

      if (!result.success) {
        setError(result.reason === 'incorrectCurrentPassword' ? 'currentPassword' : 'root.submit', {
          type: 'manual',
          message: t(($) => $.password.errors[result.reason]),
        });

        return;
      }

      reset();
      setShowPassword(false);
      setPasswordSaved(true);
    } catch {
      setError('root.submit', {
        type: 'manual',
        message: t(($) => $.password.errors.failed),
      });
    }
  });

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInProgress.current) {
      return;
    }

    submissionInProgress.current = true;
    setPasswordSaved(false);

    try {
      await submitForm();
    } finally {
      submissionInProgress.current = false;
    }
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
            {...register('currentPassword', { onChange: () => setPasswordSaved(false) })}
            aria-describedby={errors.currentPassword ? 'account-current-password-message' : undefined}
            aria-invalid={Boolean(errors.currentPassword)}
            autoComplete="current-password"
            disabled={isSubmitting}
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
              onChange: () => setPasswordSaved(false),
            })}
            aria-describedby="account-new-password-message"
            aria-invalid={Boolean(errors.newPassword)}
            autoComplete="new-password"
            disabled={isSubmitting}
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
            {...register('confirmPassword', { onChange: () => setPasswordSaved(false) })}
            aria-describedby={errors.confirmPassword ? 'account-confirm-password-message' : undefined}
            aria-invalid={Boolean(errors.confirmPassword)}
            autoComplete="new-password"
            disabled={isSubmitting}
            id="account-confirm-password"
            onToggleVisibility={togglePasswordVisibility}
            placeholder={t(($) => $.password.confirm.placeholder)}
            visible={showPassword}
          />
        </FormField>
      </div>

      <div className="mt-5 flex sm:justify-end">
        <Button
          className="w-full sm:w-40"
          loading={isSubmitting}
          loadingText={t(($) => $.password.loading)}
          type="submit"
        >
          {t(($) => $.password.action)}
        </Button>
      </div>

      {errors.root?.submit?.message && (
        <p className="mt-4 text-xs text-error" role="alert">
          {errors.root.submit.message}
        </p>
      )}

      {passwordSaved && <output className="mt-4 block text-xs text-primary">{t(($) => $.password.success)}</output>}
    </form>
  );
}
