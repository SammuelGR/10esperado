import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login', replace: true });
    }
  },
  component: Outlet,
});
