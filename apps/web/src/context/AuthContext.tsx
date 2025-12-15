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
  authApi,
  usersApi,
  setToken,
  clearToken,
  type User,
  type UpdateProfileInput,
} from "../services/api";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (input: { email: string; password: string; pseudo: string }) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await usersApi.getMe();
        setUser(userData);
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signup = useCallback(
    async (input: { email: string; password: string; pseudo: string }) => {
      try {
        const response = await authApi.signup(input);
        setToken(response.token);
        setUser(response.user as User);
        return { ok: true as const };
      } catch (e: any) {
        return { ok: false as const, error: e.message || "Impossible de créer le compte." };
      }
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      setToken(response.token);
      setUser(response.user as User);
      return { ok: true as const };
    } catch (e: any) {
      return { ok: false as const, error: e.message || "Email ou mot de passe incorrect." };
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await usersApi.getMe();
      setUser(userData);
    } catch {
      clearToken();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signup,
      login,
      logout,
      refreshUser,
    }),
    [isLoading, login, logout, refreshUser, signup, user]
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
    async (patch: UpdateProfileInput): Promise<{ ok: boolean; error?: string }> => {
      if (!user) {
        return { ok: false, error: "Aucun utilisateur connecté." };
      }
      try {
        await usersApi.updateMe(patch);
        await refreshUser();
        return { ok: true };
      } catch (e: any) {
        return { ok: false, error: e.message || "Impossible de mettre à jour le profil." };
      }
    },
    [refreshUser, user]
  );

  return update;
}
