import { RouterProvider } from '@tanstack/react-router';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/contexts/AuthContext/useAuth';
import type { User } from '@/types/user';

import AppRouterProvider from './-RouterProvider';
import { router } from './-router';

vi.mock('@/contexts/AuthContext/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  RouterProvider: vi.fn(() => null),
}));

vi.mock('./-router', () => ({
  router: { invalidate: vi.fn().mockResolvedValue(undefined) },
}));

const fakeUser: User = {
  id: 'fake-user-id',
  username: 'fake_user',
  status: 'active',
};

describe('AppRouterProvider', () => {
  it('updates the router context and requests reevaluation when the user changes', () => {
    const fakeActions = {
      login: vi.fn(),
      logout: vi.fn(),
    };

    vi.mocked(useAuth).mockReturnValue({ ...fakeActions, user: null });

    const { rerender } = render(<AppRouterProvider />);

    expect(vi.mocked(RouterProvider).mock.lastCall?.[0].context).toEqual({ user: null });

    vi.mocked(router.invalidate).mockClear();
    vi.mocked(useAuth).mockReturnValue({ ...fakeActions, user: fakeUser });

    rerender(<AppRouterProvider />);

    expect(vi.mocked(RouterProvider).mock.lastCall?.[0].context).toEqual({ user: fakeUser });
    expect(router.invalidate).toHaveBeenCalled();
  });
});
