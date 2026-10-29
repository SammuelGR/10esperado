import { type ReactNode, useCallback, useMemo, useState } from 'react';

import { authenticateUser, endSession, restoreSession, startSession as persistSession } from '@/services/auth';
import type { AuthenticateUserParams } from '@/services/auth';
import { updateUsername as persistUsername } from '@/services/user';

import { AuthContext } from './context';
import type { UpdateUsernameActionResult } from './context';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(restoreSession);

  const login = useCallback(async (credentials: AuthenticateUserParams) => {
    const result = await authenticateUser(credentials);

    if (result.success) {
      persistSession(result.user.id);
      setUser(result.user);
    }

    return result;
  }, []);

  const logout = useCallback(() => {
    endSession();
    setUser(null);
  }, []);

  const updateUsername = useCallback(
    (username: string): UpdateUsernameActionResult => {
      if (!user || restoreSession()?.id !== user.id) {
        return { success: false, reason: 'unauthenticated' };
      }

      const result = persistUsername({ userId: user.id, username });

      if (result.success) {
        setUser(result.user);
      }

      return result;
    },
    [user],
  );

  const value = useMemo(() => ({ user, login, logout, updateUsername }), [user, login, logout, updateUsername]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
