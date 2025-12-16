const API_BASE_URL = "http://localhost:4000/api";

const TOKEN_KEY = "sport-matcher:token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  requiresAuth?: boolean;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, requiresAuth = false } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (e) {
    throw new Error("Impossible de contacter le serveur. Verifiez que le backend est demarre sur http://localhost:4000");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.error?.message || errorData.message || "Une erreur est survenue");
    (error as any).status = response.status;
    (error as any).code = errorData.error?.code || errorData.code;
    throw error;
  }

  return response.json();
}

// Auth API
export type SignupInput = {
  email: string;
  password: string;
  pseudo: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: {
    id: number;
    email: string;
    pseudo: string;
  };
  token: string;
};

export type User = {
  id: number;
  email: string;
  pseudo: string;
  first_name?: string | null;
  last_name?: string | null;
  city?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  profile_visibility?: "public" | "groups" | "private";
  account_status?: string;
  created_at?: string;
  updated_at?: string;
};

export const authApi = {
  signup: (data: SignupInput): Promise<AuthResponse> =>
    request("/auth/signup", { method: "POST", body: data }),

  login: (data: LoginInput): Promise<AuthResponse> =>
    request("/auth/login", { method: "POST", body: data }),

  requestPasswordReset: (email: string): Promise<{ ok: boolean; token?: string }> =>
    request("/auth/password/request-reset", { method: "POST", body: { email } }),

  resetPassword: (token: string, newPassword: string): Promise<{ ok: boolean }> =>
    request("/auth/password/reset", { method: "POST", body: { token, newPassword } }),

  changePassword: (oldPassword: string, newPassword: string): Promise<{ ok: boolean }> =>
    request("/auth/password/change", {
      method: "POST",
      body: { oldPassword, newPassword },
      requiresAuth: true,
    }),
};

// Helper to unwrap responses
async function unwrap<T>(promise: Promise<{ [key: string]: T }>, key: string): Promise<T> {
  const result = await promise;
  return result[key];
}

// Users API
export type UpdateProfileInput = {
  first_name?: string | null;
  last_name?: string | null;
  city?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
};

export type SportLevel = "debutant" | "intermediaire" | "expert";

export type UserSport = {
  sport_id: number;
  level: SportLevel;
};

export const usersApi = {
  getMe: (): Promise<User> =>
    unwrap(request("/users/me", { requiresAuth: true }), "user"),

  updateMe: (data: UpdateProfileInput): Promise<User> =>
    unwrap(request("/users/me", { method: "PATCH", body: data, requiresAuth: true }), "user"),

  setVisibility: (visibility: "public" | "groups" | "private"): Promise<User> =>
    unwrap(request("/users/me/visibility", { method: "POST", body: { visibility }, requiresAuth: true }), "user"),

  setSports: (sports: UserSport[]): Promise<User> =>
    unwrap(request("/users/me/sports", { method: "POST", body: { sports }, requiresAuth: true }), "user"),

  deleteMe: (): Promise<{ ok: boolean }> =>
    request("/users/me", { method: "DELETE", requiresAuth: true }),

  getPublicProfile: (id: number): Promise<User> =>
    unwrap(request(`/users/${id}`), "user"),

  search: (query: string): Promise<User[]> =>
    unwrap(request(`/users?q=${encodeURIComponent(query)}`), "users"),
};

// Groups API
export type Group = {
  id: number;
  name: string;
  description?: string | null;
  city: string;
  sport_id: number;
  sport_name?: string;
  level: SportLevel;
  visibility: "public" | "private";
  max_members?: number | null;
  members_count?: number;
  role?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
};

export type CreateGroupInput = {
  name: string;
  description?: string | null;
  city: string;
  sport_id: number;
  level: SportLevel;
  visibility?: "public" | "private";
  max_members?: number | null;
};

export type GroupMember = {
  id: number;
  role: string;
  pseudo: string;
  avatar_url?: string | null;
};

export const groupsApi = {
  create: (data: CreateGroupInput): Promise<Group> =>
    unwrap(request("/groups", { method: "POST", body: data, requiresAuth: true }), "group"),

  search: (params: { sport_id?: number; level?: string; city?: string } = {}): Promise<Group[]> => {
    const searchParams = new URLSearchParams();
    if (params.sport_id) searchParams.set("sport_id", String(params.sport_id));
    if (params.level) searchParams.set("level", params.level);
    if (params.city) searchParams.set("city", params.city);
    const query = searchParams.toString();
    return unwrap(request(`/groups/search${query ? `?${query}` : ""}`), "groups");
  },

  mine: (): Promise<Group[]> =>
    unwrap(request("/groups/mine", { requiresAuth: true }), "groups"),

  getById: (id: number): Promise<Group> =>
    unwrap(request(`/groups/${id}`), "group"),

  join: (id: number): Promise<{ ok: boolean }> =>
    request(`/groups/${id}/join`, { method: "POST", requiresAuth: true }),

  leave: (id: number): Promise<{ ok: boolean }> =>
    request(`/groups/${id}/leave`, { method: "POST", requiresAuth: true }),

  getMembers: (id: number): Promise<GroupMember[]> =>
    unwrap(request(`/groups/${id}/members`, { requiresAuth: true }), "members"),
};

// Activities API
export type Activity = {
  id: number;
  group_id: number;
  group_name?: string;
  sport_id: number;
  sport_name?: string;
  title: string;
  description?: string | null;
  start_at: string;
  end_at?: string | null;
  location: string;
  level: SportLevel;
  max_participants?: number | null;
  registered_count?: number;
  status: "draft" | "published" | "cancelled";
  created_by: number;
  created_at: string;
  updated_at: string;
};

export type CreateActivityInput = {
  group_id: number;
  sport_id: number;
  title: string;
  description?: string | null;
  start_at: string;
  end_at?: string | null;
  location: string;
  level: SportLevel;
  max_participants?: number | null;
};

export type ActivityParticipant = {
  id: number;
  pseudo: string;
  avatar_url?: string | null;
};

export const activitiesApi = {
  create: (data: CreateActivityInput): Promise<Activity> =>
    unwrap(request("/activities", { method: "POST", body: data, requiresAuth: true }), "activity"),

  update: (id: number, data: Partial<CreateActivityInput>): Promise<Activity> =>
    unwrap(request(`/activities/${id}`, { method: "PATCH", body: data, requiresAuth: true }), "activity"),

  delete: (id: number): Promise<{ ok: boolean }> =>
    request(`/activities/${id}`, { method: "DELETE", requiresAuth: true }),

  cancel: (id: number): Promise<Activity> =>
    unwrap(request(`/activities/${id}/cancel`, { method: "POST", requiresAuth: true }), "activity"),

  getById: (id: number): Promise<Activity> =>
    unwrap(request(`/activities/${id}`), "activity"),

  enroll: (id: number): Promise<{ ok: boolean }> =>
    request(`/activities/${id}/enroll`, { method: "POST", requiresAuth: true }),

  unenroll: (id: number): Promise<{ ok: boolean }> =>
    request(`/activities/${id}/unenroll`, { method: "POST", requiresAuth: true }),

  getParticipants: (id: number): Promise<ActivityParticipant[]> =>
    unwrap(request(`/activities/${id}/participants`, { requiresAuth: true }), "participants"),

  getRemainingSpots: (id: number): Promise<{ remaining: number | null }> =>
    request(`/activities/${id}/remaining`),

  rate: (id: number, score: number, comment?: string): Promise<{ ok: boolean }> =>
    request(`/activities/${id}/rate`, { method: "POST", body: { score, comment }, requiresAuth: true }),

  listByGroup: (groupId: number): Promise<Activity[]> =>
    unwrap(request(`/activities/group/${groupId}`), "activities"),
};
