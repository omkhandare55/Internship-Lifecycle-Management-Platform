import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/types/auth.types';
import { tokenUtils } from '@/utils/tokenUtils';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpired: boolean;

  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
  handleSessionExpired: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      sessionExpired: false,

      setAuth: (user, accessToken, refreshToken) => {
        tokenUtils.setTokens(accessToken, refreshToken);
        set({ user, isAuthenticated: true, sessionExpired: false });
      },

      logout: async () => {
        const token = tokenUtils.getAccessToken();
        // Fire-and-forget: tell backend to invalidate (best-effort)
        if (token) {
          fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://vilp-backend.onrender.com/api'}/auth/logout`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => {}); // ignore errors — client clears tokens regardless
        }
        tokenUtils.clearTokens();
        set({ user: null, isAuthenticated: false, sessionExpired: false });
      },

      updateUser: (user) => set({ user }),

      handleSessionExpired: () => {
        tokenUtils.clearTokens();
        set({ user: null, isAuthenticated: false, sessionExpired: true });
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'vilp-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Listen for session expiry events dispatched by axiosInstance interceptor
if (typeof window !== 'undefined') {
  window.addEventListener('vilp:session-expired', () => {
    useAuthStore.getState().handleSessionExpired();
  });
}
