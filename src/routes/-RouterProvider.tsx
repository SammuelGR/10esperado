import { RouterProvider } from '@tanstack/react-router';
import { useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext/useAuth';

import { router } from './-router';

export default function AppRouterProvider() {
  const { user } = useAuth();

  useEffect(() => {
    void router.invalidate({ filter: (match) => match.context.user !== user });
  }, [user]);

  return <RouterProvider context={{ user }} router={router} />;
}
