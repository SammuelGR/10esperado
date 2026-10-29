import { compare, hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { STORAGE_KEYS } from '@/constants/storage';

import { createUser, deactivateUser, findUserById, findUserByUsername, updatePassword, updateUsername } from './user';

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

describe('updateUsername', () => {
  beforeEach(() => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(fakeStoredUsers));
  });

  it.each(['updated_user', 'FAKE_USER'])('updates and persists the username to %s', (username) => {
    const result = updateUsername({ userId: 'fake-user-id', username });

    expect(result).toEqual({
      success: true,
      user: { id: 'fake-user-id', username, status: 'active' },
    });
    expect(findUserById('fake-user-id')?.username).toBe(username);
  });

  it('rejects a username taken by another user case-insensitively', () => {
    const result = updateUsername({ userId: 'fake-user-id', username: 'OTHER_USER' });

    expect(result).toEqual({ success: false, reason: 'usernameTaken' });
  });

  it('rejects an unknown user', () => {
    const result = updateUsername({ userId: 'missing-user-id', username: 'updated_user' });

    expect(result).toEqual({ success: false, reason: 'userNotFound' });
  });
});

describe('updatePassword', () => {
  const fakeNewPassword = 'NewFakePassword123!';

  beforeEach(async () => {
    const passwordHash = await hash(fakeCredentials.password, 10);

    localStorage.setItem(
      STORAGE_KEYS.users,
      JSON.stringify([{ ...fakeStoredUsers[0], passwordHash }, fakeStoredUsers[1]]),
    );
  });

  it('updates and persists the password', async () => {
    const result = await updatePassword({
      userId: 'fake-user-id',
      currentPassword: fakeCredentials.password,
      newPassword: fakeNewPassword,
    });

    const passwordHash = findUserById('fake-user-id')?.passwordHash ?? '';

    expect(result).toEqual({ success: true });
    expect(await compare(fakeNewPassword, passwordHash)).toBe(true);
    expect(await compare(fakeCredentials.password, passwordHash)).toBe(false);
  });

  it('rejects an incorrect current password', async () => {
    const result = await updatePassword({
      userId: 'fake-user-id',
      currentPassword: 'IncorrectFakePassword123!',
      newPassword: fakeNewPassword,
    });

    expect(result).toEqual({ success: false, reason: 'incorrectCurrentPassword' });
  });

  it('rejects an unknown user', async () => {
    const result = await updatePassword({
      userId: 'missing-user-id',
      currentPassword: fakeCredentials.password,
      newPassword: fakeNewPassword,
    });

    expect(result).toEqual({ success: false, reason: 'userNotFound' });
  });
});

describe('deactivateUser', () => {
  beforeEach(() => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(fakeStoredUsers));
  });

  it('marks the user as inactive', () => {
    const result = deactivateUser('fake-user-id');

    expect(result).toEqual({ success: true });
    expect(findUserById('fake-user-id')?.status).toBe('inactive');
  });

  it('rejects an unknown user', () => {
    const result = deactivateUser('missing-user-id');

    expect(result).toEqual({ success: false, reason: 'userNotFound' });
  });
});
