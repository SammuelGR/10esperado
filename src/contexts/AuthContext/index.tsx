import { type ReactNode, useCallback, useMemo, useState } from 'react';

import { authenticateUser, endSession, restoreSession, startSession as persistSession } from '@/services/auth';
import type { AuthenticateUserParams } from '@/services/auth';

import { AuthContext } from './context';

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

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
