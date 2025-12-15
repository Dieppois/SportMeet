export type SportLevel = "Débutant" | "Intermédiaire" | "Avancé" | "Compétition";

export type UserSport = {
  id: string;
  name: string;
  level: SportLevel;
};

export type User = {
  id: string;
  email: string;
  password: string; // stocké en clair uniquement pour le mock localStorage
  pseudo: string;
  age?: number;
  city?: string;
  availability?: string;
  sports: UserSport[];
  createdAt: string;
  updatedAt: string;
};

const USERS_KEY = "sport-matcher:users";
const CURRENT_USER_KEY = "sport-matcher:currentUserId";

function readUsers(): User[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as User[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getAllUsers(): User[] {
  return readUsers();
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const id = window.localStorage.getItem(CURRENT_USER_KEY);
  if (!id) return null;
  const users = readUsers();
  return users.find((u) => u.id === id) ?? null;
}

export type CreateUserInput = {
  email: string;
  password: string;
  pseudo: string;
  sportName?: string;
  sportLevel?: SportLevel;
};

export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; error: string };

function generateId() {
  return `u_${Math.random().toString(36).slice(2, 11)}`;
}

export function createUser(input: CreateUserInput): AuthResult {
  const users = readUsers();

  const existing = users.find(
    (u) => u.email.toLowerCase() === input.email.toLowerCase(),
  );

  if (existing) {
    return { ok: false, error: "Un compte existe déjà avec cet email." };
  }

  const now = new Date().toISOString();

  const sports: UserSport[] =
    input.sportName && input.sportLevel
      ? [
          {
            id: `s_${Math.random().toString(36).slice(2, 8)}`,
            name: input.sportName,
            level: input.sportLevel,
          },
        ]
      : [];

  const user: User = {
    id: generateId(),
    email: input.email,
    password: input.password,
    pseudo: input.pseudo,
    sports,
    createdAt: now,
    updatedAt: now,
  };

  const next = [...users, user];
  writeUsers(next);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CURRENT_USER_KEY, user.id);
  }

  return { ok: true, user };
}

export function authenticateUser(email: string, password: string): AuthResult {
  const users = readUsers();
  const match = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );

  if (!match) {
    return {
      ok: false,
      error: "Email ou mot de passe incorrect.",
    };
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(CURRENT_USER_KEY, match.id);
  }

  return { ok: true, user: match };
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CURRENT_USER_KEY);
}

export type UpdateUserInput = Partial<
  Omit<User, "id" | "email" | "password" | "createdAt" | "updatedAt">
>;

export function updateUser(userId: string, patch: UpdateUserInput): User | null {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  const updated: User = {
    ...users[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  const next = [...users];
  next[index] = updated;
  writeUsers(next);

  return updated;
}

export type UserSearchFilters = {
  sportName?: string;
  level?: SportLevel;
  pseudoOrEmail?: string;
};

export function searchUsers(filters: UserSearchFilters, currentUserId?: string) {
  const all = readUsers();
  return all.filter((user) => {
    if (currentUserId && user.id === currentUserId) return false;

    if (filters.pseudoOrEmail) {
      const q = filters.pseudoOrEmail.toLowerCase();
      if (
        !user.pseudo.toLowerCase().includes(q) &&
        !user.email.toLowerCase().includes(q)
      ) {
        return false;
      }
    }

    if (filters.sportName || filters.level) {
      const hasMatch = user.sports.some((s) => {
        if (filters.sportName && !s.name.toLowerCase().includes(filters.sportName.toLowerCase())) {
          return false;
        }
        if (filters.level && s.level !== filters.level) {
          return false;
        }
        return true;
      });
      if (!hasMatch) return false;
    }

    return true;
  });
}


