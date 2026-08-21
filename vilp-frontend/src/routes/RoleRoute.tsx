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
    const r = (role || '').toUpperCase();
    if (r === 'COMPANY_RECRUITER' || r === 'COMPANY') return 'COMPANY';
    if (r === 'FACULTY_MENTOR' || r === 'MENTOR' || r === 'EXTERNAL_EVALUATOR' || r === 'FACULTY') return 'MENTOR';
    if (r === 'DEPT_COORDINATOR' || r === 'TNP_OFFICER' || r === 'TNP') return 'TNP_OFFICER';
    if (r === 'HOD' || r === 'COLLEGE_ADMIN' || r === 'TNP_HEAD') return 'TNP_HEAD';
    if (r === 'SUPER_ADMIN' || r === 'ADMIN') return 'SUPER_ADMIN';
    if (r === 'STUDENT') return 'STUDENT';
    return r;
  };

  const userNorm = normalizeRole(tokenRole);
  const allowedNorm = allowedRoles.map((r) => normalizeRole(String(r)));

  const isAllowed =
    allowedRoles.includes(tokenRole) ||
    allowedNorm.includes(userNorm) ||
    (allowedNorm.includes('TNP_OFFICER') && userNorm === 'TNP_HEAD') ||
    userNorm === 'SUPER_ADMIN';

  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
