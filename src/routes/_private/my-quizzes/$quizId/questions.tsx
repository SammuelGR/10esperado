import { createFileRoute } from '@tanstack/react-router';

import QuizQuestionsPage from '@/pages/my-quizzes/questions';

export const Route = createFileRoute('/_private/my-quizzes/$quizId/questions')({
  component: function QuizQuestionsRoute() {
    const { quizId } = Route.useParams();

    return <QuizQuestionsPage quizId={quizId} />;
  },
});
