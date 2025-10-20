import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

const STORAGE_KEY = "family-tree-auth";

const buildInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? "")
    .join("") || "U";

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  initials: string;
  role: "user" | "admin";
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (payload: { name: string; email?: string; role?: "user" | "admin" }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getInitialUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    const parsed = JSON.parse(stored) as Partial<AuthUser>;
    if (!parsed?.id || !parsed.name) {
      return null;
    }
    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role === "admin" ? "admin" : "user",
      initials: parsed.initials ?? buildInitials(parsed.name)
    };
  } catch (error) {
    console.warn("Failed to parse stored auth session", error);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getInitialUser());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!user) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const login = useCallback(({ name, email, role = "user" }: { name: string; email?: string; role?: "user" | "admin" }) => {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error("Name is required");
    }
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
    setUser({
      id,
      name: trimmed,
      email: email?.trim() || undefined,
      initials: buildInitials(trimmed),
      role
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login,
      logout
    }),
    [login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
