import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Shield } from 'lucide-react';
import { ResponsivePortalLayout } from '@/components/ResponsivePortalLayout';

const adminNavItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard & Users' },
];

export function AdminLayout() {
  return (
    <ResponsivePortalLayout
      portalTitle="Super Admin"
      brandIcon={Shield}
      brandBgColor="bg-red-600"
      navItems={adminNavItems}
      mobileBottomNavItems={adminNavItems}
    >
      <Outlet />
    </ResponsivePortalLayout>
  );
}
