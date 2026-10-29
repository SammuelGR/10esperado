import { describe, expect, it } from 'vitest';

import { STORAGE_KEYS } from '@/constants/storage';

import { createUser, findUserById, findUserByUsername } from './user';

const fakeCredentials = {
  username: 'fake_user',
  password: 'FakePassword123!',
};

const fakeStoredUsers = [
  {
    id: 'fake-user-id',
    username: 'fake_user',
    status: 'active',
    passwordHash: 'fake-password-hash',
  },
  {
    id: 'other-user-id',
    username: 'Other_User',
    status: 'inactive',
    passwordHash: 'other-password-hash',
  },
];

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

describe('findUserByUsername', () => {
  it('finds usernames case-insensitively and returns null when not found', () => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(fakeStoredUsers));

    expect(findUserByUsername('OTHER_USER')).toEqual(fakeStoredUsers[1]);
    expect(findUserByUsername('missing_user')).toBeNull();
  });
});

describe('findUserById', () => {
  it('finds a user by id and returns null when not found', () => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(fakeStoredUsers));

    expect(findUserById('other-user-id')).toEqual(fakeStoredUsers[1]);
    expect(findUserById('missing-user-id')).toBeNull();
  });
});
