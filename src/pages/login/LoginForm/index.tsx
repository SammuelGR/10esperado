import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert as CircleAlertIcon, User as UserIcon } from 'lucide-react';
import { type SubmitEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, FormField, Input, PasswordInput } from '@/components';
import { useAuth } from '@/contexts/AuthContext/useAuth';

import { createLoginSchema } from './schema';

export default function LoginForm() {
  const { t } = useTranslation('login');
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const submissionInProgress = useRef(false);

  const schema = createLoginSchema({
    username: {
      required: t(($) => $.form.username.errors.required),
    },
    password: {
      required: t(($) => $.form.password.errors.required),
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const submitForm = handleSubmit(async ({ username, password }) => {
    try {
      const result = await login({ username, password });

      if (!result.success) {
        setError('root.submit', {
          type: 'manual',
          message: t(($) => $.form.submit.errors[result.reason]),
        });
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
      <FormField error={errors.username?.message} htmlFor="username" label={t(($) => $.form.username.label)}>
        <Input
          {...register('username')}
          aria-describedby={errors.username ? 'username-message' : undefined}
          aria-invalid={Boolean(errors.username)}
          autoComplete="username"
          disabled={isSubmitting}
          icon={<UserIcon className="size-5" />}
          id="username"
          placeholder={t(($) => $.form.username.placeholder)}
          type="text"
        />
      </FormField>

      <FormField error={errors.password?.message} htmlFor="password" label={t(($) => $.form.password.label)}>
        <PasswordInput
          {...register('password')}
          aria-describedby={errors.password ? 'password-message' : undefined}
          aria-invalid={Boolean(errors.password)}
          autoComplete="current-password"
          disabled={isSubmitting}
          id="password"
          onToggleVisibility={togglePasswordVisibility}
          placeholder={t(($) => $.form.password.placeholder)}
          visible={showPassword}
        />
      </FormField>

      {errors.root?.submit?.message && (
        <div className="flex gap-3 rounded-lg border border-error/30 bg-error/10 p-4 text-sm text-error" role="alert">
          <CircleAlertIcon aria-hidden className="size-5 shrink-0" />

          <p>{errors.root.submit.message}</p>
        </div>
      )}

      <Button
        className="mt-2 w-full"
        loading={isSubmitting}
        loadingText={t(($) => $.form.submit.loading)}
        type="submit"
      >
        {t(($) => $.form.submit.label)}
      </Button>
    </form>
  );
}
