import { createFileRoute } from '@tanstack/react-router';

import NewQuizPage from '@/pages/my-quizzes/new';

export const Route = createFileRoute('/_private/my-quizzes/new')({ component: NewQuizPage });
