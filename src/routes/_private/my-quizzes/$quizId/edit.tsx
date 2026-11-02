import { createFileRoute } from '@tanstack/react-router';

import EditQuizPage from '@/pages/my-quizzes/edit';

export const Route = createFileRoute('/_private/my-quizzes/$quizId/edit')({
  component: function EditQuizRoute() {
    const { quizId } = Route.useParams();

    return <EditQuizPage quizId={quizId} />;
  },
});
