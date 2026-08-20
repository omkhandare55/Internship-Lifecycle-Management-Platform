import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Building2, Briefcase, Users, CreditCard } from 'lucide-react';
import { ResponsivePortalLayout } from '@/components/ResponsivePortalLayout';

const companyNavItems = [
  { to: '/company/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/company/internships', icon: Briefcase,       label: 'Internships' },
  { to: '/company/applicants',  icon: Users,           label: 'Applicants' },
  { to: '/company/billing',     icon: CreditCard,      label: 'Billing & Tiers' },
  { to: '/company/profile',     icon: Building2,       label: 'Company Profile' },
];

export function CompanyLayout() {
  return (
    <ResponsivePortalLayout
      portalTitle="Company Portal"
      brandIcon={Building2}
      brandBgColor="bg-emerald-600"
      navItems={companyNavItems}
      mobileBottomNavItems={companyNavItems}
    >
      <Outlet />
    </ResponsivePortalLayout>
  );
}
