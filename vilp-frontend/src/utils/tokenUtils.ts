// Token utilities
// Manage JWT tokens in localStorage.
// Source: TRD §10

const ACCESS_TOKEN_KEY = 'vilp_access_token';
const REFRESH_TOKEN_KEY = 'vilp_refresh_token';
const USER_KEY = 'vilp_user';

export const tokenUtils = {
  getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isTokenExpired: (token: string | null): boolean => {
    if (!token) return true;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (typeof payload.exp === 'number') {
        return payload.exp * 1000 < Date.now();
      }
      return false;
    } catch {
      return false;
    }
  },
};

export const isTokenExpired = tokenUtils.isTokenExpired;

/**
 * Parse JWT payload without verification (client-side claims extraction).
 * Used to extract role from token for tamper-proof route guards.
 */
export function parseJwtPayload(token: string | null): Record<string, unknown> | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}
