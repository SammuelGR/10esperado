import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authenticateUser, endSession, restoreSession, startSession } from '@/services/auth';
import type { User } from '@/types/user';

import AuthProvider from './index';
import { useAuth } from './useAuth';

vi.mock('@/services/auth', () => ({
  authenticateUser: vi.fn(),
  endSession: vi.fn(),
  restoreSession: vi.fn(),
  startSession: vi.fn(),
}));

const fakeCredentials = {
  username: 'fake_user',
  password: 'FakePassword123!',
};

const fakeUser: User = {
  id: 'fake-user-id',
  username: fakeCredentials.username,
  status: 'active',
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.mocked(authenticateUser).mockReset();
    vi.mocked(authenticateUser).mockResolvedValue({ success: true, user: fakeUser });
    vi.mocked(endSession).mockReset();
    vi.mocked(restoreSession).mockReset();
    vi.mocked(restoreSession).mockReturnValue(null);
    vi.mocked(startSession).mockReset();
  });

  it('initializes the context with the restored user', () => {
    vi.mocked(restoreSession).mockReturnValue(fakeUser);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.user).toEqual(fakeUser);
  });

  it('persists the session and updates the user after login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login(fakeCredentials);
    });

    expect(authenticateUser).toHaveBeenCalledWith(fakeCredentials);
    expect(startSession).toHaveBeenCalledWith(fakeUser.id);
    expect(result.current.user).toEqual(fakeUser);
  });

  it('ends the session and clears the user after logout', () => {
    vi.mocked(restoreSession).mockReturnValue(fakeUser);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => {
      result.current.logout();
    });

    expect(endSession).toHaveBeenCalledOnce();
    expect(result.current.user).toBeNull();
  });
});
