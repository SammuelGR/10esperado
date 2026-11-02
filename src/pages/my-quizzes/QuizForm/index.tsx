import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitEvent } from 'react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, FormField, Input, Select, Textarea } from '@/components';
import type { ActiveQuiz } from '@/types/quiz';

import { createQuizSchema } from './schema';

export interface QuizFormDefaultValues {
  title: string;
  description: string;
  difficulty: '' | NonNullable<ActiveQuiz['difficulty']>;
}

export interface QuizFormSubmitValues {
  title: string;
  description?: string;
  difficulty?: ActiveQuiz['difficulty'];
}

type QuizFormSubmitResult = { error: string } | void;

interface QuizFormProps {
  defaultValues?: QuizFormDefaultValues;
  mode: 'new' | 'edit';
  onCancel: () => void;
  onSubmit: (values: QuizFormSubmitValues) => QuizFormSubmitResult | Promise<QuizFormSubmitResult>;
  status: ActiveQuiz['status'];
}

const EMPTY_DEFAULT_VALUES: QuizFormDefaultValues = {
  title: '',
  description: '',
  difficulty: '',
};

export default function QuizForm({
  defaultValues = EMPTY_DEFAULT_VALUES,
  mode,
  onCancel,
  onSubmit,
  status,
}: QuizFormProps) {
  const { t } = useTranslation('myQuizzes');

  const submissionInProgress = useRef(false);

  const schema = createQuizSchema(
    {
      title: {
        required: t(($) => $.form.quizTitle.errors.required),
        length: t(($) => $.form.quizTitle.errors.length),
      },
      description: {
        length: t(($) => $.form.description.errors.length),
      },
      difficulty: {
        required: t(($) => $.form.difficulty.errors.required),
      },
    },
    status,
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const submitForm = handleSubmit(async ({ title, description, difficulty }) => {
    try {
      const result = await onSubmit({
        title,
        description,
        difficulty: difficulty || undefined,
      });

      if (result?.error) {
        setError('root.submit', { type: 'manual', message: result.error });
      }
    } catch {
      setError('root.submit', {
        type: 'manual',
        message: t(($) => $[mode].form.submit.errors.failed),
      });
    }
  });

  async function onFormSubmit(event: SubmitEvent<HTMLFormElement>) {
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
      aria-labelledby="quiz-form-heading"
      className="rounded-2xl border border-border bg-linear-to-br from-card to-background p-4 sm:p-6"
      noValidate
      onSubmit={onFormSubmit}
    >
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight sm:text-lg" id="quiz-form-heading">
          {t(($) => $.form.title)}
        </h2>

        <span className="rounded-full border border-border bg-input px-2.5 py-0.5 text-xs text-muted-foreground">
          {t(($) => $.content.list.status[status])}
        </span>
      </header>

      <div className="mt-4 space-y-4">
        <FormField
          error={errors.title?.message}
          helper={t(($) => $.form.quizTitle.helper)}
          htmlFor="quiz-form-title"
          label={t(($) => $.form.quizTitle.label)}
          required
        >
          <Input
            {...register('title')}
            aria-describedby="quiz-form-title-message"
            aria-invalid={Boolean(errors.title)}
            aria-required
            disabled={isSubmitting}
            id="quiz-form-title"
            placeholder={t(($) => $.form.quizTitle.placeholder)}
            type="text"
          />
        </FormField>

        <FormField
          error={errors.description?.message}
          helper={t(($) => $.form.description.helper)}
          htmlFor="quiz-form-description"
          label={t(($) => $.form.description.label)}
        >
          <Textarea
            {...register('description')}
            aria-describedby="quiz-form-description-message"
            aria-invalid={Boolean(errors.description)}
            disabled={isSubmitting}
            id="quiz-form-description"
            placeholder={t(($) => $.form.description.placeholder)}
          />
        </FormField>

        <FormField
          error={errors.difficulty?.message}
          helper={t(($) => $.form.difficulty.helper)}
          htmlFor="quiz-form-difficulty"
          label={t(($) => $.form.difficulty.label)}
          required={status === 'published'}
        >
          <Select
            {...register('difficulty')}
            aria-describedby="quiz-form-difficulty-message"
            aria-invalid={Boolean(errors.difficulty)}
            aria-required={status === 'published'}
            disabled={isSubmitting}
            id="quiz-form-difficulty"
          >
            <option value="">{t(($) => $.form.difficulty.placeholder)}</option>

            <option value="easy">{t(($) => $.form.difficulty.options.easy)}</option>

            <option value="medium">{t(($) => $.form.difficulty.options.medium)}</option>

            <option value="hard">{t(($) => $.form.difficulty.options.hard)}</option>
          </Select>
        </FormField>
      </div>

      <hr className="mt-6 border-border/50" />

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button className="w-full sm:w-auto" disabled={isSubmitting} onClick={onCancel} variant="secondary">
          {t(($) => $.form.actions.cancel)}
        </Button>

        <Button
          className="w-full sm:w-auto"
          loading={isSubmitting}
          loadingText={t(($) => $[mode].form.submit.loading)}
          type="submit"
        >
          {t(($) => $[mode].form.submit.label)}
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
