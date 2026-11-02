import { useTranslation } from 'react-i18next';

import type { Question } from '@/types/quiz';

import QuestionItem from './QuestionItem';

interface QuestionListProps {
  quizId: string;
  questions: Question[];
}

export default function QuestionList({ quizId, questions }: QuestionListProps) {
  const { t } = useTranslation('myQuizzes');

  return (
    <ol aria-label={t(($) => $.questions.list)} className="space-y-3">
      {questions.map((question, index) => (
        <QuestionItem key={question.id} question={question} questionNumber={index + 1} quizId={quizId} />
      ))}
    </ol>
  );
}
