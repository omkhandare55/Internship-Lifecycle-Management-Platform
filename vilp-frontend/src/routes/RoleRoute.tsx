import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types/auth.types';

interface RoleRouteProps {
  allowedRoles: (UserRole | string)[];
}

/**
 * Protects routes by role with institutional RBAC normalizer.
 * Users with unauthorized roles are redirected safely to /unauthorized.
 * Source: TRD §6.2
 */
export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const normalizeRole = (role: string): string => {
    if (role === 'COMPANY_RECRUITER') return 'COMPANY';
    if (role === 'FACULTY_MENTOR' || role === 'EXTERNAL_EVALUATOR') return 'MENTOR';
    if (role === 'DEPT_COORDINATOR') return 'TNP_OFFICER';
    if (role === 'HOD' || role === 'COLLEGE_ADMIN') return 'TNP_HEAD';
    return role;
  };

  const userNorm = normalizeRole(user.role);
  const isAllowed =
    allowedRoles.includes(user.role) ||
    allowedRoles.includes(userNorm) ||
    (allowedRoles.includes('TNP_OFFICER') && userNorm === 'TNP_HEAD') ||
    user.role === 'SUPER_ADMIN';

  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
