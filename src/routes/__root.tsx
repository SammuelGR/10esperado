import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

import { Header } from '@/components';
import type { User } from '@/types/user';

interface RouterContext {
  user: User | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <Outlet />
    </div>
  ),
});
