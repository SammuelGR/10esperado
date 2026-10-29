import { createFileRoute } from '@tanstack/react-router';

import AccountPage from '@/pages/account';

export const Route = createFileRoute('/_private/account')({ component: AccountPage });
