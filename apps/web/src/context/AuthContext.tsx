import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import {
  authenticateUser,
  createUser,
  getCurrentUser,
  logoutUser,
  type CreateUserInput,
  type User,
  updateUser,
} from "../services/localUserService";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  signup: (input: CreateUserInput) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{
    ok: boolean;
    error?: string;
  }>;
  logout: () => void;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const existing = getCurrentUser();
    setUser(existing);
  }, []);

  const signup = useCallback(
    async (input: CreateUserInput) => {
      const result = createUser(input);
      if (!result.ok) {
        return { ok: false as const, error: result.error };
      }
      setUser(result.user);
      return { ok: true as const };
    },
    [],
  );

  const login = useCallback(async (email: string, password: string) => {
    const result = authenticateUser(email, password);
    if (!result.ok) {
      return { ok: false as const, error: result.error };
    }
    setUser(result.user);
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const refreshUser = useCallback(() => {
    const latest = getCurrentUser();
    setUser(latest);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
      refreshUser,
    }),
    [login, logout, refreshUser, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function useUpdateProfile() {
  const { user, refreshUser } = useAuth();

  const update = useCallback(
    async (
      patch: Parameters<typeof updateUser>[1],
    ): Promise<{ ok: boolean; error?: string }> => {
      if (!user) {
        return { ok: false, error: "Aucun utilisateur connecté." };
      }
      const updated = updateUser(user.id, patch);
      if (!updated) {
        return { ok: false, error: "Impossible de mettre à jour le profil." };
      }
      refreshUser();
      return { ok: true };
    },
    [refreshUser, user],
  );

  return update;
}


