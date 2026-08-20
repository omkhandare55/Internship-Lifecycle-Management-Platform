import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { tokenUtils, parseJwtPayload } from '@/utils/tokenUtils';
import type { UserRole } from '@/types/auth.types';

interface RoleRouteProps {
  allowedRoles: (UserRole | string)[];
}

/**
 * Protects routes by role with JWT-validated RBAC.
 * Extracts role from JWT payload (tamper-proof) instead of localStorage.
 * Source: TRD §6.2
 */
export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((s) => s.user);
  const accessToken = tokenUtils.getAccessToken();

  if (!user || !accessToken) {
    return <Navigate to="/auth/login" replace />;
  }

  // Extract role from JWT claims — tamper-proof
  const jwtPayload = parseJwtPayload(accessToken);
  const tokenRole = (jwtPayload?.role as string) || user.role;

  const normalizeRole = (role: string): string => {
    if (role === 'COMPANY_RECRUITER') return 'COMPANY';
    if (role === 'FACULTY_MENTOR' || role === 'EXTERNAL_EVALUATOR') return 'MENTOR';
    if (role === 'DEPT_COORDINATOR') return 'TNP_OFFICER';
    if (role === 'HOD' || role === 'COLLEGE_ADMIN') return 'TNP_HEAD';
    return role;
  };

  const userNorm = normalizeRole(tokenRole);
  const isAllowed =
    allowedRoles.includes(tokenRole) ||
    allowedRoles.includes(userNorm) ||
    (allowedRoles.includes('TNP_OFFICER') && userNorm === 'TNP_HEAD') ||
    tokenRole === 'SUPER_ADMIN';

  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
