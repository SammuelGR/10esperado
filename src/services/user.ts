import { compare, hash } from 'bcryptjs';

import { STORAGE_KEYS } from '@/constants/storage';
import type { User } from '@/types/user';

const PASSWORD_HASH_COST = 10;

interface CreateUserParams {
  username: string;
  password: string;
}

interface UpdateUsernameParams {
  userId: string;
  username: string;
}

export interface UpdatePasswordParams {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

type CreateUserResult = { success: true; user: User } | { success: false; reason: 'usernameTaken' };

export type UpdateUsernameResult =
  { success: true; user: User } | { success: false; reason: 'userNotFound' | 'usernameTaken' };

export type UpdatePasswordResult =
  { success: true } | { success: false; reason: 'userNotFound' | 'incorrectCurrentPassword' };

export type DeactivateUserResult = { success: true } | { success: false; reason: 'userNotFound' };

function readUsers(): StoredUser[] {
  const storedUsers = localStorage.getItem(STORAGE_KEYS.users);

  return storedUsers === null ? [] : (JSON.parse(storedUsers) as StoredUser[]);
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

export function findUserByUsername(username: string): StoredUser | null {
  const normalizedUsername = username.toLowerCase();

  return readUsers().find((user) => user.username.toLowerCase() === normalizedUsername) ?? null;
}

export function findUserById(id: string): StoredUser | null {
  return readUsers().find((user) => user.id === id) ?? null;
}

export async function createUser({ username, password }: CreateUserParams): Promise<CreateUserResult> {
  const passwordHash = await hash(password, PASSWORD_HASH_COST);

  const users = readUsers();
  const normalizedUsername = username.toLowerCase();

  if (users.some((user) => user.username.toLowerCase() === normalizedUsername)) {
    return { success: false, reason: 'usernameTaken' };
  }

  const user: User = {
    id: crypto.randomUUID(),
    username,
    status: 'active',
  };

  writeUsers([...users, { ...user, passwordHash }]);

  return { success: true, user };
}

export function updateUsername({ userId, username }: UpdateUsernameParams): UpdateUsernameResult {
  const users = readUsers();
  const existingUser = users.find((user) => user.id === userId);

  if (!existingUser) {
    return { success: false, reason: 'userNotFound' };
  }

  const normalizedUsername = username.toLowerCase();

  if (users.some((user) => user.id !== userId && user.username.toLowerCase() === normalizedUsername)) {
    return { success: false, reason: 'usernameTaken' };
  }

  const user: User = {
    id: existingUser.id,
    username,
    status: existingUser.status,
  };

  writeUsers(users.map((storedUser) => (storedUser.id === userId ? { ...storedUser, username } : storedUser)));

  return { success: true, user };
}

export async function updatePassword({
  userId,
  currentPassword,
  newPassword,
}: UpdatePasswordParams): Promise<UpdatePasswordResult> {
  const existingUser = findUserById(userId);

  if (!existingUser) {
    return { success: false, reason: 'userNotFound' };
  }

  if (!(await compare(currentPassword, existingUser.passwordHash))) {
    return { success: false, reason: 'incorrectCurrentPassword' };
  }

  const passwordHash = await hash(newPassword, PASSWORD_HASH_COST);
  const users = readUsers();
  const currentUser = users.find((user) => user.id === userId);

  if (!currentUser) {
    return { success: false, reason: 'userNotFound' };
  }

  // Preserve concurrent edits and reject a current password that changed while hashing.
  if (currentUser.passwordHash !== existingUser.passwordHash) {
    return { success: false, reason: 'incorrectCurrentPassword' };
  }

  writeUsers(users.map((storedUser) => (storedUser.id === userId ? { ...storedUser, passwordHash } : storedUser)));

  return { success: true };
}

export function deactivateUser(userId: string): DeactivateUserResult {
  const users = readUsers();

  if (!users.some((user) => user.id === userId)) {
    return { success: false, reason: 'userNotFound' };
  }

  writeUsers(
    users.map((storedUser) => (storedUser.id === userId ? { ...storedUser, status: 'inactive' } : storedUser)),
  );

  return { success: true };
}
