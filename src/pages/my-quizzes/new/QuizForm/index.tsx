import { useTranslation } from 'react-i18next';

import { Button, FormField, Input, Select, Textarea } from '@/components';

export default function QuizForm() {
  const { t } = useTranslation('myQuizzes');

  return (
    <form
      aria-labelledby="new-quiz-form-title"
      className="rounded-2xl border border-border bg-linear-to-br from-card to-background p-4 sm:p-6"
      noValidate
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
          helper={t(($) => $.new.form.quizTitle.helper)}
          htmlFor="new-quiz-title"
          label={t(($) => $.new.form.quizTitle.label)}
          required
        >
          <Input
            aria-describedby="new-quiz-title-message"
            aria-required
            id="new-quiz-title"
            placeholder={t(($) => $.new.form.quizTitle.placeholder)}
            type="text"
          />
        </FormField>

        <FormField
          helper={t(($) => $.new.form.description.helper)}
          htmlFor="new-quiz-description"
          label={t(($) => $.new.form.description.label)}
        >
          <Textarea
            aria-describedby="new-quiz-description-message"
            id="new-quiz-description"
            placeholder={t(($) => $.new.form.description.placeholder)}
          />
        </FormField>

        <FormField
          helper={t(($) => $.new.form.difficulty.helper)}
          htmlFor="new-quiz-difficulty"
          label={t(($) => $.new.form.difficulty.label)}
        >
          <Select aria-describedby="new-quiz-difficulty-message" defaultValue="" id="new-quiz-difficulty">
            <option value="">{t(($) => $.new.form.difficulty.placeholder)}</option>

            <option value="easy">{t(($) => $.new.form.difficulty.options.easy)}</option>

            <option value="medium">{t(($) => $.new.form.difficulty.options.medium)}</option>

            <option value="hard">{t(($) => $.new.form.difficulty.options.hard)}</option>
          </Select>
        </FormField>
      </div>

      <hr className="mt-6 border-border/50" />

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button className="w-full sm:w-auto" variant="secondary">
          {t(($) => $.new.form.actions.cancel)}
        </Button>

        <Button className="w-full sm:w-auto">{t(($) => $.new.form.actions.submit)}</Button>
      </div>
    </form>
  );
}
