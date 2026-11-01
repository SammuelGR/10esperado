import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import type { SubmitEvent } from 'react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, FormField, Input, Select, Textarea } from '@/components';
import { useAuth } from '@/contexts/AuthContext/useAuth';
import { createQuiz } from '@/services/quiz';

import { createQuizSchema } from './schema';

export default function QuizForm() {
  const { t } = useTranslation('myQuizzes');
  const { user } = useAuth();
  const navigate = useNavigate();

  const submissionInProgress = useRef(false);

  const schema = createQuizSchema({
    title: {
      required: t(($) => $.new.form.quizTitle.errors.required),
      length: t(($) => $.new.form.quizTitle.errors.length),
    },
    description: {
      length: t(($) => $.new.form.description.errors.length),
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      difficulty: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const submitForm = handleSubmit(async ({ title, description, difficulty }) => {
    if (!user) {
      return;
    }

    try {
      const result = createQuiz({
        authorId: user.id,
        title,
        description,
        difficulty: difficulty || undefined,
      });

      if (result.success) {
        await navigate({ to: '/my-quizzes', replace: true });
      }
    } catch {
      setError('root.submit', {
        type: 'manual',
        message: t(($) => $.new.form.submit.errors.failed),
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
      await submitForm();
    } finally {
      submissionInProgress.current = false;
    }
  }

  return (
    <form
      aria-labelledby="new-quiz-form-title"
      className="rounded-2xl border border-border bg-linear-to-br from-card to-background p-4 sm:p-6"
      noValidate
      onSubmit={onSubmit}
    >
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight sm:text-lg" id="new-quiz-form-title">
          {t(($) => $.new.form.title)}
        </h2>

        <span className="rounded-full border border-border bg-input px-2.5 py-0.5 text-xs text-muted-foreground">
          {t(($) => $.new.form.status)}
        </span>
      </header>

      <div className="mt-4 space-y-4">
        <FormField
          error={errors.title?.message}
          helper={t(($) => $.new.form.quizTitle.helper)}
          htmlFor="new-quiz-title"
          label={t(($) => $.new.form.quizTitle.label)}
          required
        >
          <Input
            {...register('title')}
            aria-describedby="new-quiz-title-message"
            aria-invalid={Boolean(errors.title)}
            aria-required
            disabled={isSubmitting}
            id="new-quiz-title"
            placeholder={t(($) => $.new.form.quizTitle.placeholder)}
            type="text"
          />
        </FormField>

        <FormField
          error={errors.description?.message}
          helper={t(($) => $.new.form.description.helper)}
          htmlFor="new-quiz-description"
          label={t(($) => $.new.form.description.label)}
        >
          <Textarea
            {...register('description')}
            aria-describedby="new-quiz-description-message"
            aria-invalid={Boolean(errors.description)}
            disabled={isSubmitting}
            id="new-quiz-description"
            placeholder={t(($) => $.new.form.description.placeholder)}
          />
        </FormField>

        <FormField
          helper={t(($) => $.new.form.difficulty.helper)}
          htmlFor="new-quiz-difficulty"
          label={t(($) => $.new.form.difficulty.label)}
        >
          <Select
            {...register('difficulty')}
            aria-describedby="new-quiz-difficulty-message"
            disabled={isSubmitting}
            id="new-quiz-difficulty"
          >
            <option value="">{t(($) => $.new.form.difficulty.placeholder)}</option>

            <option value="easy">{t(($) => $.new.form.difficulty.options.easy)}</option>

            <option value="medium">{t(($) => $.new.form.difficulty.options.medium)}</option>

            <option value="hard">{t(($) => $.new.form.difficulty.options.hard)}</option>
          </Select>
        </FormField>
      </div>

      <hr className="mt-6 border-border/50" />

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          className="w-full sm:w-auto"
          disabled={isSubmitting}
          onClick={() => navigate({ to: '/my-quizzes', replace: true })}
          variant="secondary"
        >
          {t(($) => $.new.form.actions.cancel)}
        </Button>

        <Button
          className="w-full sm:w-auto"
          loading={isSubmitting}
          loadingText={t(($) => $.new.form.submit.loading)}
          type="submit"
        >
          {t(($) => $.new.form.actions.submit)}
        </Button>
      </div>

      {errors.root?.submit?.message && (
        <p className="mt-4 text-xs text-error" role="alert">
          {errors.root.submit.message}
        </p>
      )}
    </form>
  );
}
