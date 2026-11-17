import { createFileRoute } from '@tanstack/react-router';

import MyPerformancePage from '@/pages/my-performance';

export const Route = createFileRoute('/_private/my-performance')({ component: MyPerformancePage });
