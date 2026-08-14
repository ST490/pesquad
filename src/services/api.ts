import { UserProfile, Post, ConnectionInvite, PostComment, FilterOptions } from '../types';

export class ApiError extends Error {
  status: number;
  details?: string[];

  constructor(message: string, status: number, details?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const TOKEN_KEY = 'pesquad_auth_token_v1';
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.warn('Could not persist token to localStorage', e);
    }
  },
  clear: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.warn('Could not clear token from localStorage', e);
    }
  },
};

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 12000, headers = {}, ...restOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const token = tokenStorage.get();
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      ...restOptions,
      credentials: 'include', // Ensures iron-session cookies are sent & received
      headers: requestHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data?.error || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data?.details);
    }

    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your network connection.', 408);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error.message || 'Unable to connect to server. Please try again.',
      503
    );
  }
}

// -------------------------------------------------------------
// Authentication API (PESU Credentials & OAuth2)
// -------------------------------------------------------------
export const authApi = {
  // Sign in with PESU Credentials (PESU ID / SRN / PRN + Password)
  login: async (
    identifier: string,
    password: string
  ): Promise<{
    message: string;
    token: string;
    user: UserProfile;
    isFirstLogin: boolean;
    redirect: '/onboarding' | '/discover';
  }> => {
    const res = await request<{
      message: string;
      token: string;
      user: UserProfile;
      isFirstLogin: boolean;
      redirect: '/onboarding' | '/discover';
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });

    if (res.token) {
      tokenStorage.set(res.token);
    }
    return res;
  },

  // Register New PESU Student Account
  register: async (userData: {
    srn: string;
    prn?: string;
    name: string;
    password: string;
    department: string;
    semester: number;
    campus?: 'RR Campus' | 'EC Campus';
    email?: string;
    phone?: string;
    hackathon_count?: number;
    interests?: string[];
    skills?: string[];
    bio?: string;
  }): Promise<{
    message: string;
    token: string;
    user: UserProfile;
    isFirstLogin: boolean;
    redirect: '/onboarding';
  }> => {
    const res = await request<{
      message: string;
      token: string;
      user: UserProfile;
      isFirstLogin: boolean;
      redirect: '/onboarding';
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (res.token) {
      tokenStorage.set(res.token);
    }
    return res;
  },

  // Initiates full Vision2822/pesu-oauth2 authorization code flow
  initiatePesuOAuth: (studentSrn?: string): void => {
    let authUrl = `${API_BASE_URL}/auth/pesu/authorize`;
    if (studentSrn) {
      authUrl += `?student_srn=${encodeURIComponent(studentSrn)}`;
    }
    window.location.href = authUrl;
  },

  getMe: async (): Promise<{ user: UserProfile }> => {
    return request<{ user: UserProfile }>('/auth/me');
  },

  logout: async (): Promise<void> => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      tokenStorage.clear();
    }
  },
};

// -------------------------------------------------------------
// Profiles API
// -------------------------------------------------------------
export const profileApi = {
  getProfiles: async (filters?: Partial<FilterOptions>): Promise<{ profiles: UserProfile[]; total: number }> => {
    const params = new URLSearchParams();
    if (filters?.searchQuery) params.append('search', filters.searchQuery);
    if (filters?.department && filters.department !== 'All') params.append('department', filters.department);
    if (filters?.semester && filters.semester !== 'All') params.append('semester', filters.semester);
    if (filters?.minHackathons && filters.minHackathons > 0) {
      params.append('minHackathons', filters.minHackathons.toString());
    }
    if (filters?.selectedInterest && filters.selectedInterest !== 'All') {
      params.append('interest', filters.selectedInterest);
    }
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    const query = params.toString() ? `?${params.toString()}` : '';
    return request<{ profiles: UserProfile[]; total: number }>(`/profiles${query}`);
  },

  getProfile: async (srn: string): Promise<{ profile: UserProfile }> => {
    return request<{ profile: UserProfile }>(`/profiles/${encodeURIComponent(srn)}`);
  },

  updateProfile: async (
    srn: string,
    updates: Partial<UserProfile>
  ): Promise<{ message: string; profile: UserProfile }> => {
    return request<{ message: string; profile: UserProfile }>(
      `/profiles/${encodeURIComponent(srn)}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
  },
};

// -------------------------------------------------------------
// Community Feed / Posts API
// -------------------------------------------------------------
export const postApi = {
  getPosts: async (options?: {
    hashtag?: string;
    author_srn?: string;
  }): Promise<{ posts: Post[]; total: number }> => {
    const params = new URLSearchParams();
    if (options?.hashtag) params.append('hashtag', options.hashtag);
    if (options?.author_srn) params.append('author_srn', options.author_srn);

    const query = params.toString() ? `?${params.toString()}` : '';
    return request<{ posts: Post[]; total: number }>(`/posts${query}`);
  },

  createPost: async (postData: {
    body: string;
    looking_for_team?: boolean;
  }): Promise<{ message: string; post: Post }> => {
    return request<{ message: string; post: Post }>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  toggleLike: async (postId: string): Promise<{ post: Post }> => {
    return request<{ post: Post }>(`/posts/${encodeURIComponent(postId)}/like`, {
      method: 'POST',
    });
  },

  addComment: async (
    postId: string,
    body: string
  ): Promise<{ message: string; comment: PostComment; post: Post }> => {
    return request<{ message: string; comment: PostComment; post: Post }>(
      `/posts/${encodeURIComponent(postId)}/comments`,
      {
        method: 'POST',
        body: JSON.stringify({ body }),
      }
    );
  },
};

// -------------------------------------------------------------
// Team Invites & Connections API
// -------------------------------------------------------------
export const inviteApi = {
  getInvites: async (): Promise<{ invites: ConnectionInvite[] }> => {
    return request<{ invites: ConnectionInvite[] }>('/invites');
  },

  sendInvite: async (
    to_srn: string,
    message?: string
  ): Promise<{ message: string; invite: ConnectionInvite }> => {
    return request<{ message: string; invite: ConnectionInvite }>('/invites', {
      method: 'POST',
      body: JSON.stringify({ to_srn, message }),
    });
  },

  respondInvite: async (
    inviteId: string,
    status: 'accepted' | 'declined'
  ): Promise<{ message: string; invite: ConnectionInvite }> => {
    return request<{ message: string; invite: ConnectionInvite }>(
      `/invites/${encodeURIComponent(inviteId)}/respond`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }
    );
  },
};

// -------------------------------------------------------------
// Stats & Hashtags API
// -------------------------------------------------------------
export const statsApi = {
  getTrendingHashtags: async (): Promise<{ hashtags: { tag: string; count: number }[] }> => {
    return request<{ hashtags: { tag: string; count: number }[] }>('/hashtags/trending');
  },

  getUserStats: async (
    srn: string
  ): Promise<{
    srn: string;
    connections: number;
    hackathons: number;
    invitesSent: number;
    invitesReceived: number;
  }> => {
    return request<{
      srn: string;
      connections: number;
      hackathons: number;
      invitesSent: number;
      invitesReceived: number;
    }>(`/stats/user/${encodeURIComponent(srn)}`);
  },
};

// -------------------------------------------------------------
// Config API
// -------------------------------------------------------------
export const configApi = {
  getConfig: async (): Promise<{
    sihDeadline: string;
    appName: string;
    institution: string;
    oauthProvider: string;
    version: string;
  }> => {
    return request<{
      sihDeadline: string;
      appName: string;
      institution: string;
      oauthProvider: string;
      version: string;
    }>('/config');
  },
};
