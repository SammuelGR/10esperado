import { createContext } from 'react';

import type { AuthenticateUserParams, AuthenticateUserResult } from '@/services/auth';
import type {
  DeactivateUserResult,
  UpdatePasswordParams,
  UpdatePasswordResult,
  UpdateUsernameResult,
} from '@/services/user';
import type { User } from '@/types/user';

export type UpdateUsernameActionResult = UpdateUsernameResult | { success: false; reason: 'unauthenticated' };

export type UpdatePasswordActionResult = UpdatePasswordResult | { success: false; reason: 'unauthenticated' };

export type DeactivateAccountActionResult = DeactivateUserResult | { success: false; reason: 'unauthenticated' };

interface AuthContextValue {
  user: User | null;
  login: (credentials: AuthenticateUserParams) => Promise<AuthenticateUserResult>;
  logout: () => void;
  updateUsername: (username: string) => UpdateUsernameActionResult;
  updatePassword: (credentials: Omit<UpdatePasswordParams, 'userId'>) => Promise<UpdatePasswordActionResult>;
  deactivateAccount: () => DeactivateAccountActionResult;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
