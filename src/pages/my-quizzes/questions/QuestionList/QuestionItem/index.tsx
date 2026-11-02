import {
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  Pencil as PencilIcon,
  Trash2 as TrashIcon,
} from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useQuiz } from '@/contexts/QuizContext/useQuiz';
import type { Question } from '@/types/quiz';
import { cn } from '@/utils/cn';

import QuestionForm from '../../QuestionForm';
import type { QuestionFormValues } from '../../QuestionForm';
import DeleteDialog from './DeleteDialog';

interface QuestionItemProps {
  quizId: string;
  question: Question;
  questionNumber: number;
}

export default function QuestionItem({ quizId, question, questionNumber }: QuestionItemProps) {
  const { t } = useTranslation('myQuizzes');
  const { editQuestion } = useQuiz();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const editorId = useId();

  function handleEditQuestion(values: QuestionFormValues) {
    const result = editQuestion(quizId, question.id, values);

    if (!result.success) {
      return { error: t(($) => $.questions.editErrors[result.reason]) };
    }

    setIsEditing(false);
  }

  return (
    <li className="rounded-xl border border-border bg-linear-to-br from-card to-background">
      <header className={cn('flex items-center gap-3', isEditing && 'border-b border-border/50')}>
        <button
          aria-controls={editorId}
          aria-expanded={isEditing}
          aria-label={t(($) => (isEditing ? $.questions.collapse : $.questions.edit), { number: questionNumber })}
          className={`inline-flex min-h-14 w-12 shrink-0 self-stretch items-center justify-center rounded-l-xl
            border-r border-border/50 text-muted-foreground transition-colors hover:bg-input hover:text-primary
            focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary`}
          onClick={() => setIsEditing((current) => !current)}
          type="button"
        >
          {isEditing ? (
            <ChevronDownIcon aria-hidden className="size-4" />
          ) : (
            <ChevronRightIcon aria-hidden className="size-4" />
          )}
        </button>

        <span className="shrink-0 rounded-full border border-border bg-input px-2.5 py-0.5 text-xs text-muted-foreground">
          {t(($) => $.questions.form.number, { number: questionNumber })}
        </span>

        <h2 className="min-w-0 flex-1 py-3 text-sm font-medium wrap-anywhere">{question.statement}</h2>

        <div className="flex shrink-0 items-center pr-2">
          <button
            aria-controls={editorId}
            aria-expanded={isEditing}
            aria-label={t(($) => $.questions.edit, { number: questionNumber })}
            className={`inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground
              transition-colors hover:bg-input hover:text-primary focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-primary`}
            onClick={() => setIsEditing(true)}
            type="button"
          >
            <PencilIcon aria-hidden className="size-4" />
          </button>

          <button
            aria-haspopup="dialog"
            aria-label={t(($) => $.questions.delete, { number: questionNumber })}
            className={`inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground
              transition-colors hover:bg-error/10 hover:text-error focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-error`}
            onClick={() => dialogRef.current?.showModal()}
            type="button"
          >
            <TrashIcon aria-hidden className="size-4" />
          </button>
        </div>
      </header>

      <div hidden={!isEditing} id={editorId}>
        {isEditing && (
          <QuestionForm
            defaultValues={{
              statement: question.statement,
              alternatives: question.alternatives,
              correctAlternativeId: question.correctAlternativeId,
            }}
            mode="edit"
            onCancel={() => setIsEditing(false)}
            onSubmit={handleEditQuestion}
            questionNumber={questionNumber}
          />
        )}
      </div>

      <DeleteDialog dialogRef={dialogRef} questionId={question.id} quizId={quizId} />
    </li>
  );
}
