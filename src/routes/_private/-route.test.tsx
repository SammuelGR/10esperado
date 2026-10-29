import type * as RouterModule from '@tanstack/react-router';
import { redirect } from '@tanstack/react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { User } from '@/types/user';

import { Route } from './route';

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof RouterModule>()),
  redirect: vi.fn(() => new Error('Fake redirect')),
}));

const fakeUser: User = {
  id: 'fake-user-id',
  username: 'fake_user',
  status: 'active',
};

const beforeLoad = Route.options.beforeLoad as (options: { context: { user: User | null } }) => void;

describe('private route access', () => {
  beforeEach(() => {
    vi.mocked(redirect).mockClear();
  });

  it('allows authenticated users', () => {
    expect(beforeLoad({ context: { user: fakeUser } })).toBeUndefined();
  });

  it('redirects unauthenticated users to the login route', () => {
    expect(() => beforeLoad({ context: { user: null } })).toThrow('Fake redirect');
    expect(redirect).toHaveBeenCalledWith(expect.objectContaining({ to: '/login' }));
  });
});
