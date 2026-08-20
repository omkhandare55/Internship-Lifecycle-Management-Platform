import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { tokenUtils, isTokenExpired } from '@/utils/tokenUtils';

/**
 * Protects routes that require authentication.
 * Validates JWT expiry — forces re-auth if token is expired.
 * Source: TRD §6.2
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = tokenUtils.getAccessToken();

  if (!isAuthenticated || !accessToken || isTokenExpired(accessToken)) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
