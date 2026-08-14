import { UserProfile, Post, ConnectionInvite, PostComment } from '../types';
import { authApi, profileApi, postApi, inviteApi, tokenStorage } from './api';

const CACHED_USER_KEY = 'pesquad_cached_user_v1';

export class StorageService {
  // Session caching
  static getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(CACHED_USER_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  }

  static setCurrentUser(user: UserProfile | null): void {
    try {
      if (user) {
        localStorage.setItem(CACHED_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CACHED_USER_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }

  static hasToken(): boolean {
    return !!tokenStorage.get();
  }

  static clearSession(): void {
    tokenStorage.clear();
    this.setCurrentUser(null);
  }
}
