import { createFileRoute } from '@tanstack/react-router';

import MyQuizzesPage from '@/pages/my-quizzes';

export const Route = createFileRoute('/_private/my-quizzes/')({ component: MyQuizzesPage });
