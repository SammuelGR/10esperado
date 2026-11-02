import { zodResolver } from '@hookform/resolvers/zod';
import { Plus as PlusIcon, Trash2 as TrashIcon } from 'lucide-react';
import type { SubmitEvent } from 'react';
import { useEffect, useId, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, FormField, Input, Textarea } from '@/components';
import type { Question } from '@/types/quiz';
import { cn } from '@/utils/cn';

import { createQuestionSchema } from './schema';

export type QuestionFormValues = Pick<Question, 'statement' | 'alternatives' | 'correctAlternativeId'>;

type QuestionFormSubmitResult = { error: string } | void;

interface QuestionFormProps {
  defaultValues?: QuestionFormValues;
  mode?: 'new' | 'edit';
  questionNumber: number;
  onCancel: () => void;
  onSubmit: (values: QuestionFormValues) => QuestionFormSubmitResult | Promise<QuestionFormSubmitResult>;
}

export default function QuestionForm({
  defaultValues,
  mode = 'new',
  questionNumber,
  onCancel,
  onSubmit,
}: QuestionFormProps) {
  const { t } = useTranslation('myQuizzes');
  const formId = useId();
  const submissionInProgress = useRef(false);
  const schema = createQuestionSchema({
    statement: t(($) => $.questions.form.errors.statement),
    alternative: t(($) => $.questions.form.errors.alternative),
    minimumAlternatives: t(($) => $.questions.form.errors.minimumAlternatives),
    correctAlternative: t(($) => $.questions.form.errors.correctAlternative),
  });
  const {
    control,
    register,
    handleSubmit,
    setError,
    setFocus,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormValues>({
    defaultValues: defaultValues ?? {
      statement: '',
      alternatives: Array.from({ length: 2 }, () => ({ id: crypto.randomUUID(), text: '' })),
      correctAlternativeId: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'alternatives' });

  useEffect(() => {
    setFocus('statement');
  }, [setFocus]);

  function removeAlternative(index: number) {
    const alternative = getValues(`alternatives.${index}`);

    if (getValues('correctAlternativeId') === alternative.id) {
      setValue('correctAlternativeId', '', { shouldValidate: true });
    }

    remove(index);
  }

  const submitForm = handleSubmit(async (values) => {
    try {
      const result = await onSubmit(values);

      if (result?.error) {
        setError('root.submit', { type: 'manual', message: result.error });
      }
    } catch {
      setError('root.submit', { type: 'manual', message: t(($) => $.questions.form.errors.failed) });
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
      aria-label={mode === 'edit' ? t(($) => $.questions.edit, { number: questionNumber }) : undefined}
      aria-labelledby={mode === 'new' ? `${formId}-heading` : undefined}
      className={cn(
        'p-4 sm:p-6',
        mode === 'new' && 'rounded-2xl border border-border bg-linear-to-br from-card to-background',
      )}
      noValidate
      onSubmit={onFormSubmit}
    >
      {mode === 'new' && (
        <header className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold tracking-tight sm:text-lg" id={`${formId}-heading`}>
            {t(($) => $.questions.form.title)}
          </h2>

          <span className="rounded-full border border-border bg-input px-2.5 py-0.5 text-xs text-muted-foreground">
            {t(($) => $.questions.form.number, { number: questionNumber })}
          </span>
        </header>
      )}

      <div className={cn('space-y-4', mode === 'new' && 'mt-4')}>
        <FormField
          error={errors.statement?.message}
          htmlFor={`${formId}-statement`}
          label={t(($) => $.questions.form.statement.label)}
          required
        >
          <Textarea
            {...register('statement')}
            aria-describedby={errors.statement ? `${formId}-statement-message` : undefined}
            aria-invalid={Boolean(errors.statement)}
            aria-required
            disabled={isSubmitting}
            id={`${formId}-statement`}
            placeholder={t(($) => $.questions.form.statement.placeholder)}
          />
        </FormField>

        <fieldset
          aria-describedby={errors.correctAlternativeId ? `${formId}-correct-message` : undefined}
          aria-invalid={Boolean(errors.correctAlternativeId)}
          aria-labelledby={`${formId}-alternatives-legend`}
          className="space-y-3"
          disabled={isSubmitting}
          role="radiogroup"
        >
          <legend className="mb-2 text-xs font-medium" id={`${formId}-alternatives-legend`}>
            {t(($) => $.questions.form.alternatives.label)}
          </legend>

          {fields.map((field, index) => (
            <div className="flex items-start gap-3" key={field.id}>
              <input
                {...register('correctAlternativeId')}
                aria-label={t(($) => $.questions.form.alternatives.correct, { number: index + 1 })}
                className="mt-3 size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                type="radio"
                value={getValues(`alternatives.${index}.id`)}
              />

              <div className="min-w-0 flex-1">
                <Input
                  {...register(`alternatives.${index}.text`)}
                  aria-describedby={
                    errors.alternatives?.[index]?.text ? `${formId}-alternative-${index}-message` : undefined
                  }
                  aria-invalid={Boolean(errors.alternatives?.[index]?.text)}
                  aria-label={t(($) => $.questions.form.alternatives.placeholder, { number: index + 1 })}
                  placeholder={t(($) => $.questions.form.alternatives.placeholder, { number: index + 1 })}
                  type="text"
                />

                {errors.alternatives?.[index]?.text?.message && (
                  <p className="mt-1 text-[11px] text-error" id={`${formId}-alternative-${index}-message`} role="alert">
                    {errors.alternatives[index]?.text?.message}
                  </p>
                )}
              </div>

              <button
                aria-label={t(($) => $.questions.form.alternatives.remove, { number: index + 1 })}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors enabled:hover:bg-error/10 enabled:hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-40"
                disabled={fields.length <= 2}
                onClick={() => removeAlternative(index)}
                type="button"
              >
                <TrashIcon aria-hidden className="size-4" />
              </button>
            </div>
          ))}

          {(errors.alternatives?.root?.message || errors.alternatives?.message) && (
            <p className="text-xs text-error" role="alert">
              {errors.alternatives.root?.message ?? errors.alternatives.message}
            </p>
          )}

          {errors.correctAlternativeId?.message && (
            <p className="text-xs text-error" id={`${formId}-correct-message`} role="alert">
              {errors.correctAlternativeId.message}
            </p>
          )}
        </fieldset>

        <button
          className={`inline-flex min-h-10 items-center gap-2 rounded-lg text-xs font-medium text-primary
            transition-colors enabled:hover:text-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-primary disabled:opacity-50`}
          disabled={isSubmitting}
          onClick={() => append({ id: crypto.randomUUID(), text: '' })}
          type="button"
        >
          <PlusIcon aria-hidden className="size-4" />

          {t(($) => $.questions.form.alternatives.add)}
        </button>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button className="w-full sm:w-auto" disabled={isSubmitting} onClick={onCancel} variant="secondary">
          {t(($) => $.questions.form.cancel)}
        </Button>

        <Button
          className="w-full sm:w-auto"
          loading={isSubmitting}
          loadingText={t(($) => $.questions.form.saving)}
          type="submit"
        >
          {t(($) => $.questions.form.save)}
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
