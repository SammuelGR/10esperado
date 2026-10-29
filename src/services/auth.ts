import { compare } from 'bcryptjs';

import { STORAGE_KEYS } from '@/constants/storage';
import type { User } from '@/types/user';

import { findUserById, findUserByUsername } from './user';

interface Session {
  userId: string;
}

export interface AuthenticateUserParams {
  username: string;
  password: string;
}

export type AuthenticateUserResult =
  { success: true; user: User } | { success: false; reason: 'invalidCredentials' | 'inactiveAccount' };

export function startSession(userId: string): void {
  const session: Session = { userId };

  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

export function endSession(): void {
  localStorage.removeItem(STORAGE_KEYS.session);
}

export function restoreSession(): User | null {
  const storedSession = localStorage.getItem(STORAGE_KEYS.session);

  if (storedSession === null) {
    return null;
  }

  const session = JSON.parse(storedSession) as Session;
  const storedUser = findUserById(session.userId);

  if (storedUser?.status !== 'active') {
    endSession();

    return null;
  }

  return {
    id: storedUser.id,
    username: storedUser.username,
    status: storedUser.status,
  };
}

export async function authenticateUser({
  username,
  password,
}: AuthenticateUserParams): Promise<AuthenticateUserResult> {
  const storedUser = findUserByUsername(username);

  if (!storedUser || !(await compare(password, storedUser.passwordHash))) {
    return { success: false, reason: 'invalidCredentials' };
  }

  if (storedUser.status !== 'active') {
    return { success: false, reason: 'inactiveAccount' };
  }

  const user: User = {
    id: storedUser.id,
    username: storedUser.username,
    status: storedUser.status,
  };

  return { success: true, user };
}
