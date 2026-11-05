import { createFileRoute } from '@tanstack/react-router';

import ResolutionPage from '@/pages/resolution';

export const Route = createFileRoute('/_shared/resolution/$quizId/')({
  component: function ResolutionRoute() {
    const { quizId } = Route.useParams();

    return <ResolutionPage key={quizId} quizId={quizId} />;
  },
});
