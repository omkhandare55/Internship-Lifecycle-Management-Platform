import { Outlet } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Star, Users } from 'lucide-react';
import { ResponsivePortalLayout } from '@/components/ResponsivePortalLayout';

const mentorNavItems = [
  { to: '/mentor/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/mentor/logbooks',    icon: ClipboardList,   label: 'Weekly Logbooks' },
  { to: '/mentor/evaluations', icon: Star,            label: 'Evaluations' },
];

export function MentorLayout() {
  return (
    <ResponsivePortalLayout
      portalTitle="Mentor Portal"
      brandIcon={Users}
      brandBgColor="bg-violet-600"
      navItems={mentorNavItems}
      mobileBottomNavItems={mentorNavItems}
    >
      <Outlet />
    </ResponsivePortalLayout>
  );
}
