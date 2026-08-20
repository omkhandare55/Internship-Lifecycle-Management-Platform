import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types/auth.types';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

/**
 * Protects routes by role.
 * Users with wrong role see /unauthorized.
 * Source: TRD §6.2
 *
 * Note: This is UX-only. Real authorization happens in Spring Security.
 */
export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
