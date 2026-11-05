import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

import type { Alternative, Question } from '@/types/quiz';

import type { SelectedAlternatives } from '..';
import QuestionListItem from './QuestionListItem';

interface QuestionListProps {
  isSubmitted: boolean;
  listRef: RefObject<HTMLOListElement | null>;
  onSelectAlternative: (questionId: Question['id'], alternativeId: Alternative['id']) => void;
  questions: Question[];
  selectedAlternatives: SelectedAlternatives;
}

export default function QuestionList({
  isSubmitted,
  listRef,
  onSelectAlternative,
  questions,
  selectedAlternatives,
}: QuestionListProps) {
  const { t } = useTranslation('resolution');

  return (
    <ol
      aria-label={t(($) => $.questions.list)}
      className="mt-4 scroll-mt-4 space-y-3 sm:mt-5"
      ref={listRef}
      tabIndex={-1}
    >
      {questions.map((question, index) => (
        <QuestionListItem
          isSubmitted={isSubmitted}
          key={question.id}
          onSelectAlternative={(alternativeId) => onSelectAlternative(question.id, alternativeId)}
          question={question}
          questionNumber={index + 1}
          selectedAlternativeId={selectedAlternatives[question.id]}
          totalQuestions={questions.length}
        />
      ))}
    </ol>
  );
}
