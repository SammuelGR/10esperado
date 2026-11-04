import { useTranslation } from 'react-i18next';

import type { Quiz } from '@/types/quiz';

import QuizListItem from './QuizListItem';

interface QuizListProps {
  quizzes: { quiz: Quiz; username: string }[];
}

export default function QuizList({ quizzes }: QuizListProps) {
  const { t } = useTranslation('home');

  return (
    <ul aria-label={t(($) => $.content.list.label)} className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2">
      {quizzes.map(({ quiz, username }) => (
        <QuizListItem key={quiz.id} quiz={quiz} username={username} />
      ))}
    </ul>
  );
}
