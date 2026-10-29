import { type ReactNode, useCallback, useMemo, useState } from 'react';

import { authenticateUser, endSession, restoreSession, startSession as persistSession } from '@/services/auth';
import type { AuthenticateUserParams } from '@/services/auth';
import { deactivateUser, updatePassword as persistPassword, updateUsername as persistUsername } from '@/services/user';
import type { UpdatePasswordParams } from '@/services/user';

import { AuthContext } from './context';
import type { DeactivateAccountActionResult, UpdatePasswordActionResult, UpdateUsernameActionResult } from './context';

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

  const updatePassword = useCallback(
    async (credentials: Omit<UpdatePasswordParams, 'userId'>): Promise<UpdatePasswordActionResult> => {
      if (!user || restoreSession()?.id !== user.id) {
        return { success: false, reason: 'unauthenticated' };
      }

      return persistPassword({ ...credentials, userId: user.id });
    },
    [user],
  );

  const deactivateAccount = useCallback((): DeactivateAccountActionResult => {
    if (!user || restoreSession()?.id !== user.id) {
      return { success: false, reason: 'unauthenticated' };
    }

    const result = deactivateUser(user.id);

    if (result.success) {
      logout();
    }

    return result;
  }, [user, logout]);

  const value = useMemo(
    () => ({ user, login, logout, updateUsername, updatePassword, deactivateAccount }),
    [user, login, logout, updateUsername, updatePassword, deactivateAccount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
