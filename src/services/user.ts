import { hash } from 'bcryptjs';

import { STORAGE_KEYS } from '@/constants/storage';
import type { User } from '@/types/user';

const PASSWORD_HASH_COST = 10;

interface CreateUserParams {
  username: string;
  password: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

type CreateUserResult = { success: true; user: User } | { success: false; reason: 'usernameTaken' };

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
