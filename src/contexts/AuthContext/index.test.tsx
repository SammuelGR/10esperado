import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authenticateUser, endSession, restoreSession, startSession } from '@/services/auth';
import { deactivateUser, updatePassword, updateUsername } from '@/services/user';
import type { User } from '@/types/user';

import AuthProvider from './index';
import { useAuth } from './useAuth';

vi.mock('@/services/auth', () => ({
  authenticateUser: vi.fn(),
  endSession: vi.fn(),
  restoreSession: vi.fn(),
  startSession: vi.fn(),
}));

vi.mock('@/services/user', () => ({
  updateUsername: vi.fn(),
  updatePassword: vi.fn(),
  deactivateUser: vi.fn(),
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

const fakePasswordChange = {
  currentPassword: fakeCredentials.password,
  newPassword: 'NewFakePassword123!',
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.mocked(authenticateUser).mockReset();
    vi.mocked(authenticateUser).mockResolvedValue({ success: true, user: fakeUser });
    vi.mocked(endSession).mockReset();
    vi.mocked(restoreSession).mockReset();
    vi.mocked(restoreSession).mockReturnValue(null);
    vi.mocked(startSession).mockReset();
    vi.mocked(updateUsername).mockReset();
    vi.mocked(updatePassword).mockReset();
    vi.mocked(deactivateUser).mockReset();
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

  it('updates the username', () => {
    const updatedUser: User = { ...fakeUser, username: 'updated_user' };

    vi.mocked(restoreSession).mockReturnValue(fakeUser);
    vi.mocked(updateUsername).mockReturnValue({ success: true, user: updatedUser });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => {
      expect(result.current.updateUsername(updatedUser.username)).toEqual({ success: true, user: updatedUser });
    });

    expect(updateUsername).toHaveBeenCalledWith({ userId: fakeUser.id, username: updatedUser.username });
    expect(result.current.user).toEqual(updatedUser);
  });

  it('returns an error when the username is taken', () => {
    vi.mocked(restoreSession).mockReturnValue(fakeUser);
    vi.mocked(updateUsername).mockReturnValue({ success: false, reason: 'usernameTaken' });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => {
      expect(result.current.updateUsername('taken_user')).toEqual({ success: false, reason: 'usernameTaken' });
    });
  });

  it('updates the password', async () => {
    vi.mocked(restoreSession).mockReturnValue(fakeUser);
    vi.mocked(updatePassword).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      expect(await result.current.updatePassword(fakePasswordChange)).toEqual({ success: true });
    });

    expect(updatePassword).toHaveBeenCalledWith({ ...fakePasswordChange, userId: fakeUser.id });
  });

  it('returns an error when the current password is incorrect', async () => {
    vi.mocked(restoreSession).mockReturnValue(fakeUser);
    vi.mocked(updatePassword).mockResolvedValue({ success: false, reason: 'incorrectCurrentPassword' });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      expect(await result.current.updatePassword(fakePasswordChange)).toEqual({
        success: false,
        reason: 'incorrectCurrentPassword',
      });
    });
  });

  it('deactivates the account and ends the session', () => {
    vi.mocked(restoreSession).mockReturnValue(fakeUser);
    vi.mocked(deactivateUser).mockReturnValue({ success: true });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => {
      expect(result.current.deactivateAccount()).toEqual({ success: true });
    });

    expect(deactivateUser).toHaveBeenCalledWith(fakeUser.id);
    expect(endSession).toHaveBeenCalledOnce();
    expect(result.current.user).toBeNull();
  });

  it('returns an error when the account is not found', () => {
    vi.mocked(restoreSession).mockReturnValue(fakeUser);
    vi.mocked(deactivateUser).mockReturnValue({ success: false, reason: 'userNotFound' });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => {
      expect(result.current.deactivateAccount()).toEqual({ success: false, reason: 'userNotFound' });
    });
  });

  it('rejects username changes without authentication', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.updateUsername('updated_user')).toEqual({ success: false, reason: 'unauthenticated' });
    expect(updateUsername).not.toHaveBeenCalled();
  });

  it('rejects password changes without authentication', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(await result.current.updatePassword(fakePasswordChange)).toEqual({
      success: false,
      reason: 'unauthenticated',
    });
    expect(updatePassword).not.toHaveBeenCalled();
  });

  it('rejects account deactivation without authentication', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.deactivateAccount()).toEqual({ success: false, reason: 'unauthenticated' });
    expect(deactivateUser).not.toHaveBeenCalled();
  });
});
