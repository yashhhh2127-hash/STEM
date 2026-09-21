// STEM Learn Frontend API Client for MongoDB Backend

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

const TOKEN_KEY = 'stem_auth_token';
const USER_KEY = 'stem_auth_user';

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

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Invalid server response' }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const authApi = {
  async register(params: { name: string; email: string; password: string; role?: string; department?: string }) {
    const data = await request<{ success: boolean; token: string; user: AuthUser; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    setStoredAuth(data.token, data.user);
    return data;
  },

  async login(email: string, password: string) {
    const data = await request<{ success: boolean; token: string; user: AuthUser; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredAuth(data.token, data.user);
    return data;
  },

  async googleAuth(payload: { credential?: string; email?: string; name?: string; picture?: string; sub?: string; role?: string }) {
    const data = await request<{ success: boolean; token: string; user: AuthUser; message: string }>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setStoredAuth(data.token, data.user);
    return data;
  },

  async getMe(): Promise<{ success: boolean; user: AuthUser }> {
    return request<{ success: boolean; user: AuthUser }>('/api/auth/me');
  },

  async getUsers(): Promise<{ success: boolean; count: number; users: AuthUser[] }> {
    return request<{ success: boolean; count: number; users: AuthUser[] }>('/api/auth/users');
  },

  async updateUserRole(id: string, role: 'admin' | 'faculty' | 'student') {
    return request<{ success: boolean; message: string; user: AuthUser }>(`/api/auth/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  async deleteUser(id: string) {
    return request<{ success: boolean; message: string }>(`/api/auth/users/${id}`, {
      method: 'DELETE',
    });
  },

  async getSystemStatus(): Promise<SystemStatus> {
    return request<SystemStatus>('/api/system/status');
  },
};
