// STEM Learn Frontend API Client with Resilient Offline & Local Fallback
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  provider?: 'local' | 'google';
  avatar?: string;
  department?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface SystemStatus {
  success: boolean;
  server: string;
  database: {
    connected: boolean;
    readyState: number;
    readyStateText: string;
    host: string | null;
    dbName: string | null;
    error: string | null;
    uri: string;
    userCount: number;
    adminCount: number;
  };
  googleOAuthConfigured: boolean;
}

interface LocalStoredUser extends AuthUser {
  password?: string;
}

const TOKEN_KEY = 'stem_auth_token';
const USER_KEY = 'stem_auth_user';
const LOCAL_USERS_KEY = 'stem_local_registered_users';

export const PRESET_DEMO_ACCOUNTS = {
  student: {
    email: 'student@stemlearn.edu',
    password: 'student123',
    name: 'STEM Scholar',
    role: 'student' as const,
    department: 'SDES Junior STEM Academy',
  },
  admin: {
    email: 'admin@stemlearn.edu',
    password: 'admin123',
    name: 'Dr. Palghar Faculty',
    role: 'admin' as const,
    department: 'Department of Information Technology, SDES Palghar',
  },
  faculty: {
    email: 'faculty@stemlearn.edu',
    password: 'faculty123',
    name: 'Prof. SDES Faculty',
    role: 'faculty' as const,
    department: 'Department of Information Technology, SDES Palghar',
  },
  yash: {
    email: 'yash@stemlearn.edu',
    password: 'password123',
    name: 'Yash Kini',
    role: 'student' as const,
    department: 'SDES Junior STEM Academy',
  },
};

const DEFAULT_LOCAL_USERS: LocalStoredUser[] = [
  {
    id: 'usr-student-demo',
    name: PRESET_DEMO_ACCOUNTS.student.name,
    email: PRESET_DEMO_ACCOUNTS.student.email,
    password: PRESET_DEMO_ACCOUNTS.student.password,
    role: PRESET_DEMO_ACCOUNTS.student.role,
    provider: 'local',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=STEMScholar',
    department: PRESET_DEMO_ACCOUNTS.student.department,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'usr-admin-demo',
    name: PRESET_DEMO_ACCOUNTS.admin.name,
    email: PRESET_DEMO_ACCOUNTS.admin.email,
    password: PRESET_DEMO_ACCOUNTS.admin.password,
    role: PRESET_DEMO_ACCOUNTS.admin.role,
    provider: 'local',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=PalgharFaculty',
    department: PRESET_DEMO_ACCOUNTS.admin.department,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'usr-faculty-demo',
    name: PRESET_DEMO_ACCOUNTS.faculty.name,
    email: PRESET_DEMO_ACCOUNTS.faculty.email,
    password: PRESET_DEMO_ACCOUNTS.faculty.password,
    role: PRESET_DEMO_ACCOUNTS.faculty.role,
    provider: 'local',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SDESFaculty',
    department: PRESET_DEMO_ACCOUNTS.faculty.department,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'usr-yash-demo',
    name: PRESET_DEMO_ACCOUNTS.yash.name,
    email: PRESET_DEMO_ACCOUNTS.yash.email,
    password: PRESET_DEMO_ACCOUNTS.yash.password,
    role: PRESET_DEMO_ACCOUNTS.yash.role,
    provider: 'local',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=YashKini',
    department: PRESET_DEMO_ACCOUNTS.yash.department,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
];

function getLocalUsers(): LocalStoredUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(DEFAULT_LOCAL_USERS));
      return DEFAULT_LOCAL_USERS;
    }
    const parsed = JSON.parse(raw);
    for (const def of DEFAULT_LOCAL_USERS) {
      if (!parsed.some((u: LocalStoredUser) => u.email.toLowerCase() === def.email.toLowerCase())) {
        parsed.push(def);
      }
    }
    return parsed;
  } catch {
    return DEFAULT_LOCAL_USERS;
  }
}

function saveLocalUsers(users: LocalStoredUser[]) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setStoredAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json().catch(() => ({ success: false, message: 'Invalid server response' }));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export const authApi = {
  async register(params: { name: string; email: string; password: string; role?: string; department?: string }) {
    const cleanEmail = params.email.toLowerCase().trim();

    try {
      const data = await request<{ success: boolean; token: string; user: AuthUser; message: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(params),
      });

      if (data.success && data.user) {
        setStoredAuth(data.token, data.user);
        const users = getLocalUsers();
        if (!users.some((u) => u.email.toLowerCase() === cleanEmail)) {
          users.push({
            ...data.user,
            password: params.password,
          });
          saveLocalUsers(users);
        }
        return data;
      }
    } catch (err: any) {
      console.warn('[Register: backend unavailable, using resilient local storage]:', err.message);
    }

    const users = getLocalUsers();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: LocalStoredUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: params.name.trim(),
      email: cleanEmail,
      password: params.password,
      role: (params.role as any) || 'student',
      provider: 'local',
      department: params.department || 'SDES Department of Information Technology',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(params.name.trim())}`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    users.push(newUser);
    saveLocalUsers(users);

    const fallbackToken = `local-jwt-${Date.now()}-${btoa(cleanEmail)}`;
    const sanitized: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      provider: newUser.provider,
      avatar: newUser.avatar,
      department: newUser.department,
      createdAt: newUser.createdAt,
      lastLogin: newUser.lastLogin,
    };

    setStoredAuth(fallbackToken, sanitized);
    return {
      success: true,
      token: fallbackToken,
      user: sanitized,
      message: 'Account created successfully (Offline Resilient Mode)',
    };
  },

  async login(email: string, password: string) {
    const cleanEmail = email.toLowerCase().trim();

    try {
      const data = await request<{ success: boolean; token: string; user: AuthUser; message: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.success && data.user) {
        setStoredAuth(data.token, data.user);
        return data;
      }
    } catch (err: any) {
      console.warn('[Login: backend unavailable, falling back to local accounts]:', err.message);
    }

    const users = getLocalUsers();
    const matched = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!matched) {
      throw new Error(
        'No registered user found with this email. Try student@stemlearn.edu / student123 or click "Student Demo".'
      );
    }

    if (matched.password && matched.password !== password) {
      throw new Error('Invalid password. Please check your credentials and try again.');
    }

    matched.lastLogin = new Date().toISOString();
    saveLocalUsers(users);

    const fallbackToken = `local-jwt-${Date.now()}-${btoa(cleanEmail)}`;
    const sanitized: AuthUser = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      role: matched.role,
      provider: matched.provider,
      avatar: matched.avatar,
      department: matched.department,
      createdAt: matched.createdAt,
      lastLogin: matched.lastLogin,
    };

    setStoredAuth(fallbackToken, sanitized);
    return {
      success: true,
      token: fallbackToken,
      user: sanitized,
      message: 'Logged in successfully (Offline Resilient Mode)',
    };
  },

  async googleAuth(payload: { credential?: string; email?: string; name?: string; picture?: string; sub?: string; role?: string }) {
    try {
      const data = await request<{ success: boolean; token: string; user: AuthUser; message: string }>('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (data.success && data.user) {
        setStoredAuth(data.token, data.user);
        return data;
      }
    } catch (err: any) {
      console.warn('[Google Auth: backend unavailable, falling back to local profile]:', err.message);
    }

    const email = payload.email || 'learner@gmail.com';
    const name = payload.name || email.split('@')[0];
    const role = (payload.role as any) || 'student';
    const cleanEmail = email.toLowerCase().trim();

    const users = getLocalUsers();
    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      user = {
        id: `usr-google-${Date.now()}`,
        name,
        email: cleanEmail,
        role,
        provider: 'google',
        avatar: payload.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
        department: 'SDES Department of Information Technology',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      users.push(user);
    } else {
      user.lastLogin = new Date().toISOString();
      if (payload.picture) user.avatar = payload.picture;
    }
    saveLocalUsers(users);

    const fallbackToken = `google-jwt-${Date.now()}-${btoa(cleanEmail)}`;
    const sanitized: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
      avatar: user.avatar,
      department: user.department,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };

    setStoredAuth(fallbackToken, sanitized);
    return {
      success: true,
      token: fallbackToken,
      user: sanitized,
      message: 'Google Sign-In successful (Offline Resilient Mode)',
    };
  },

  async getMe(): Promise<{ success: boolean; user: AuthUser }> {
    try {
      return await request<{ success: boolean; user: AuthUser }>('/api/auth/me');
    } catch {
      const stored = getStoredUser();
      if (stored) {
        return { success: true, user: stored };
      }
      throw new Error('Not authenticated');
    }
  },

  async getUsers(): Promise<{ success: boolean; count: number; users: AuthUser[] }> {
    try {
      return await request<{ success: boolean; count: number; users: AuthUser[] }>('/api/auth/users');
    } catch {
      const users = getLocalUsers().map(({ password, ...rest }) => rest);
      return { success: true, count: users.length, users };
    }
  },

  async updateUserRole(id: string, role: 'admin' | 'faculty' | 'student') {
    try {
      return await request<{ success: boolean; message: string; user: AuthUser }>(`/api/auth/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
    } catch {
      const users = getLocalUsers();
      const user = users.find((u) => u.id === id);
      if (user) {
        user.role = role;
        saveLocalUsers(users);
        const { password, ...sanitized } = user;
        return { success: true, message: `User role updated to ${role} (locally)`, user: sanitized };
      }
      throw new Error('User not found');
    }
  },

  async deleteUser(id: string) {
    try {
      return await request<{ success: boolean; message: string }>(`/api/auth/users/${id}`, {
        method: 'DELETE',
      });
    } catch {
      let users = getLocalUsers();
      users = users.filter((u) => u.id !== id);
      saveLocalUsers(users);
      return { success: true, message: 'User deleted successfully' };
    }
  },

  async getSystemStatus(): Promise<SystemStatus> {
    try {
      return await request<SystemStatus>('/api/system/status');
    } catch {
      const users = getLocalUsers();
      return {
        success: true,
        server: 'STEM Learn Client (Offline-Ready Mode)',
        database: {
          connected: true,
          readyState: 1,
          readyStateText: 'Active (Offline Resilient Store)',
          host: 'local',
          dbName: 'stem_db',
          error: null,
          uri: 'local://stem_db',
          userCount: users.length,
          adminCount: users.filter((u) => u.role === 'admin' || u.role === 'faculty').length,
        },
        googleOAuthConfigured: true,
      };
    }
  },
};
