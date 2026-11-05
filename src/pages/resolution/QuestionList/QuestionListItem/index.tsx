import { Check as CheckIcon, TriangleAlert as TriangleAlertIcon, X as XIcon } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import type { Alternative, Question } from '@/types/quiz';
import { cn } from '@/utils/cn';

interface QuestionListItemProps {
  isSubmitted: boolean;
  onSelectAlternative: (alternativeId: Alternative['id']) => void;
  question: Question;
  questionNumber: number;
  selectedAlternativeId: Alternative['id'] | undefined;
  totalQuestions: number;
}

export default function QuestionListItem({
  isSubmitted,
  onSelectAlternative,
  question,
  questionNumber,
  selectedAlternativeId,
  totalQuestions,
}: QuestionListItemProps) {
  const { t } = useTranslation('resolution');
  const itemId = useId();
  const statementId = `${itemId}-statement`;
  const unansweredId = `${itemId}-unanswered`;
  const isUnanswered = isSubmitted && selectedAlternativeId === undefined;

  return (
    <li className="rounded-xl border border-border bg-linear-to-br from-card to-background p-4">
      <p className="text-xs text-muted-foreground">
        {t(($) => $.questions.number, { number: questionNumber, total: totalQuestions })}
      </p>

      <h2 className="mt-1 text-sm font-semibold wrap-anywhere whitespace-pre-wrap" id={statementId}>
        {question.statement}
      </h2>

      {isUnanswered && (
        <p
          className={`mt-3 flex items-start gap-2 rounded-lg border border-amber-400/25 bg-amber-400/10
            px-2 py-1.5 text-xs text-amber-300`}
          id={unansweredId}
        >
          <TriangleAlertIcon aria-hidden className="size-4 shrink-0" />

          {t(($) => $.questions.feedback.unanswered)}
        </p>
      )}

      <fieldset
        aria-describedby={isUnanswered ? unansweredId : undefined}
        aria-labelledby={statementId}
        className="mt-3 min-w-0 space-y-1"
        disabled={isSubmitted}
      >
        {question.alternatives.map((alternative) => {
          const isCorrect = isSubmitted && alternative.id === question.correctAlternativeId;
          const isIncorrect =
            isSubmitted && alternative.id === selectedAlternativeId && alternative.id !== question.correctAlternativeId;

          return (
            <label
              className={cn(
                'flex items-start gap-3 rounded-lg border border-transparent px-2 py-1 text-muted-foreground',
                !isSubmitted && 'cursor-pointer has-checked:text-foreground',
                isCorrect && 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
                isIncorrect && 'border-error/30 bg-error/10 text-error',
              )}
              key={alternative.id}
            >
              <input
                checked={selectedAlternativeId === alternative.id}
                className={`mt-0.5 size-4 shrink-0 accent-primary focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-primary`}
                name={itemId}
                onChange={() => onSelectAlternative(alternative.id)}
                onClick={() => {
                  // Native radios do not emit change when the checked alternative is clicked again.
                  if (selectedAlternativeId === alternative.id) {
                    onSelectAlternative(alternative.id);
                  }
                }}
                type="radio"
                value={alternative.id}
              />

              <span className="min-w-0 text-xs leading-relaxed wrap-anywhere whitespace-pre-wrap sm:text-sm">
                {alternative.text}
              </span>

              {isCorrect && (
                <>
                  <CheckIcon aria-hidden className="mt-0.5 ml-auto size-4 shrink-0" />

                  <span className="sr-only">{t(($) => $.questions.feedback.correctAlternative)}</span>
                </>
              )}

              {isIncorrect && (
                <>
                  <XIcon aria-hidden className="mt-0.5 ml-auto size-4 shrink-0" />

                  <span className="sr-only">{t(($) => $.questions.feedback.incorrectSelection)}</span>
                </>
              )}
            </label>
          );
        })}
      </fieldset>
    </li>
  );
}
