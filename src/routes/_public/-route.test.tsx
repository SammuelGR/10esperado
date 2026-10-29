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

describe('public route access', () => {
  beforeEach(() => {
    vi.mocked(redirect).mockClear();
  });

  it('allows unauthenticated users', () => {
    expect(beforeLoad({ context: { user: null } })).toBeUndefined();
  });

  it('redirects authenticated users to the root route', () => {
    expect(() => beforeLoad({ context: { user: fakeUser } })).toThrow('Fake redirect');
    expect(redirect).toHaveBeenCalledWith(expect.objectContaining({ to: '/' }));
  });
});
