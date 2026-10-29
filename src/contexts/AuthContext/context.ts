import { createContext } from 'react';

import type { AuthenticateUserParams, AuthenticateUserResult } from '@/services/auth';
import type { User } from '@/types/user';

interface AuthContextValue {
  user: User | null;
  login: (credentials: AuthenticateUserParams) => Promise<AuthenticateUserResult>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
