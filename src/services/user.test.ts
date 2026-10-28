import { describe, expect, it } from 'vitest';

import { STORAGE_KEYS } from '@/constants/storage';

import { createUser } from './user';

const fakeCredentials = {
  username: 'fake_user',
  password: 'FakePassword123!',
};

describe('createUser', () => {
  it('creates and persists a user', async () => {
    const expectedUser = {
      id: expect.any(String),
      username: fakeCredentials.username,
      status: 'active',
    };

    const result = await createUser(fakeCredentials);

    expect(result).toEqual({ success: true, user: expectedUser });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.users) ?? 'null')).toEqual([
      { ...expectedUser, passwordHash: expect.any(String) },
    ]);
  });

  it('rejects duplicate usernames', async () => {
    const fakeStoredUser = {
      id: 'fake-user-id',
      username: fakeCredentials.username,
      status: 'active',
      passwordHash: 'fake-password-hash',
    };

    const storedUsers = JSON.stringify([fakeStoredUser]);

    localStorage.setItem(STORAGE_KEYS.users, storedUsers);

    const result = await createUser(fakeCredentials);

    expect(result).toEqual({ success: false, reason: 'usernameTaken' });
    expect(localStorage.getItem(STORAGE_KEYS.users)).toBe(storedUsers);
  });
});
