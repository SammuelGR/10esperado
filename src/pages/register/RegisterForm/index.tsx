import { zodResolver } from '@hookform/resolvers/zod';
import { User as UserIcon } from 'lucide-react';
import { type SubmitEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, FormField, Input, PasswordInput } from '@/components';
import { createUser } from '@/services/user';

import { createRegisterSchema } from './schema';

export default function RegisterForm() {
  const { t } = useTranslation('register');

  const [showPassword, setShowPassword] = useState(false);

  const submissionInProgress = useRef(false);

  const schema = createRegisterSchema({
    username: {
      required: t(($) => $.form.username.errors.required),
      length: t(($) => $.form.username.errors.length),
      invalidCharacters: t(($) => $.form.username.errors.invalidCharacters),
    },
    password: {
      required: t(($) => $.form.password.errors.required),
      length: t(($) => $.form.password.errors.length),
      invalidCharacters: t(($) => $.form.password.errors.invalidCharacters),
    },
    confirmPassword: {
      required: t(($) => $.form.confirmPassword.errors.required),
      mismatch: t(($) => $.form.confirmPassword.errors.mismatch),
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitted, isSubmitting, touchedFields },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const submitForm = handleSubmit(async ({ username, password }) => {
    try {
      const result = await createUser({ username, password });

      if (!result.success && result.reason === 'usernameTaken') {
        setError('username', {
          type: 'manual',
          message: t(($) => $.form.username.errors.duplicate),
        });

        return;
      }
    } catch {
      setError('root.submit', {
        type: 'manual',
        message: t(($) => $.form.submit.errors.failed),
      });
    }
  });

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInProgress.current) {
      return;
    }

    submissionInProgress.current = true;

    try {
      await submitForm(event);
    } finally {
      submissionInProgress.current = false;
    }
  }

  function togglePasswordVisibility() {
    setShowPassword((visible) => !visible);
  }

  return (
    <form className="space-y-6" noValidate onSubmit={onSubmit}>
      <FormField
        error={errors.username?.message}
        helper={t(($) => $.form.username.helper)}
        htmlFor="username"
        label={t(($) => $.form.username.label)}
      >
        <Input
          {...register('username')}
          aria-describedby="username-message"
          aria-invalid={Boolean(errors.username)}
          autoComplete="username"
          disabled={isSubmitting}
          icon={<UserIcon className="size-5" />}
          id="username"
          placeholder={t(($) => $.form.username.placeholder)}
          type="text"
        />
      </FormField>

      <FormField
        error={errors.password?.message}
        helper={t(($) => $.form.password.helper)}
        htmlFor="password"
        label={t(($) => $.form.password.label)}
      >
        <PasswordInput
          {...register('password', {
            deps: touchedFields.confirmPassword || isSubmitted ? 'confirmPassword' : undefined,
          })}
          aria-describedby="password-message"
          aria-invalid={Boolean(errors.password)}
          autoComplete="new-password"
          disabled={isSubmitting}
          id="password"
          onToggleVisibility={togglePasswordVisibility}
          placeholder={t(($) => $.form.password.placeholder)}
          visible={showPassword}
        />
      </FormField>

      <FormField
        error={errors.confirmPassword?.message}
        htmlFor="confirm-password"
        label={t(($) => $.form.confirmPassword.label)}
      >
        <PasswordInput
          {...register('confirmPassword')}
          aria-describedby={errors.confirmPassword ? 'confirm-password-message' : undefined}
          aria-invalid={Boolean(errors.confirmPassword)}
          autoComplete="new-password"
          disabled={isSubmitting}
          id="confirm-password"
          onToggleVisibility={togglePasswordVisibility}
          placeholder={t(($) => $.form.confirmPassword.placeholder)}
          visible={showPassword}
        />
      </FormField>

      <Button
        className="mt-2 w-full"
        loading={isSubmitting}
        loadingText={t(($) => $.form.submit.loading)}
        type="submit"
      >
        {t(($) => $.form.submit.label)}
      </Button>

      {errors.root?.submit?.message && (
        <p className="text-sm text-error" role="alert">
          {errors.root.submit.message}
        </p>
      )}
    </form>
  );
}
