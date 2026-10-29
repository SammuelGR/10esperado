import { createContext } from 'react';

import type { AuthenticateUserParams, AuthenticateUserResult } from '@/services/auth';
import type { UpdateUsernameResult } from '@/services/user';
import type { User } from '@/types/user';

export type UpdateUsernameActionResult = UpdateUsernameResult | { success: false; reason: 'unauthenticated' };

interface AuthContextValue {
  user: User | null;
  login: (credentials: AuthenticateUserParams) => Promise<AuthenticateUserResult>;
  logout: () => void;
  updateUsername: (username: string) => UpdateUsernameActionResult;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
