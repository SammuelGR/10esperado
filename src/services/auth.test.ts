import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEYS } from '@/constants/storage';
import type { User } from '@/types/user';

import { authenticateUser, endSession, restoreSession, startSession } from './auth';
import { findUserById, findUserByUsername } from './user';

vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
}));

vi.mock('./user', () => ({
  findUserById: vi.fn(),
  findUserByUsername: vi.fn(),
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

const fakeStoredUser = {
  ...fakeUser,
  passwordHash: 'fake-password-hash',
};

beforeEach(() => {
  vi.mocked(compare).mockReset();
  vi.mocked(findUserById).mockReset();
  vi.mocked(findUserByUsername).mockReset();
});

describe('authenticateUser', () => {
  beforeEach(() => {
    vi.mocked(findUserByUsername).mockReturnValue(fakeStoredUser);
    vi.mocked(compare).mockImplementation(async () => true);
  });

  it('authenticates an active account with valid credentials', async () => {
    const result = await authenticateUser(fakeCredentials);

    expect(findUserByUsername).toHaveBeenCalledWith(fakeCredentials.username);
    expect(compare).toHaveBeenCalledWith(fakeCredentials.password, fakeStoredUser.passwordHash);
    expect(result).toEqual({ success: true, user: fakeUser });
  });

  it('rejects an unknown username', async () => {
    vi.mocked(findUserByUsername).mockReturnValue(null);

    const result = await authenticateUser(fakeCredentials);

    expect(result).toEqual({ success: false, reason: 'invalidCredentials' });
  });

  it('rejects an incorrect password', async () => {
    vi.mocked(compare).mockImplementation(async () => false);

    const result = await authenticateUser(fakeCredentials);

    expect(result).toEqual({ success: false, reason: 'invalidCredentials' });
  });

  it('rejects an inactive account even when the password matches', async () => {
    vi.mocked(findUserByUsername).mockReturnValue({ ...fakeStoredUser, status: 'inactive' });

    const result = await authenticateUser(fakeCredentials);

    expect(result).toEqual({ success: false, reason: 'inactiveAccount' });
  });
});

describe('startSession', () => {
  it('creates and persists a session', () => {
    startSession(fakeUser.id);

    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.session) ?? 'null')).toEqual({ userId: fakeUser.id });
  });
});

describe('endSession', () => {
  it('removes the session', () => {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ userId: fakeUser.id }));

    endSession();

    expect(localStorage.getItem(STORAGE_KEYS.session)).toBeNull();
  });
});

describe('restoreSession', () => {
  beforeEach(() => {
    vi.mocked(findUserById).mockReturnValue(fakeStoredUser);
  });

  it('returns null when no session is stored', () => {
    expect(restoreSession()).toBeNull();
  });

  it('restores an active account', () => {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ userId: fakeUser.id }));

    const result = restoreSession();

    expect(findUserById).toHaveBeenCalledWith(fakeUser.id);
    expect(result).toEqual(fakeUser);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.session) ?? 'null')).toEqual({ userId: fakeUser.id });
  });

  it('removes the session and returns null when the account no longer exists', () => {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ userId: fakeUser.id }));
    vi.mocked(findUserById).mockReturnValue(null);

    expect(restoreSession()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.session)).toBeNull();
  });

  it('removes the session and returns null when the account is inactive', () => {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ userId: fakeUser.id }));
    vi.mocked(findUserById).mockReturnValue({ ...fakeStoredUser, status: 'inactive' });

    expect(restoreSession()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.session)).toBeNull();
  });
});
