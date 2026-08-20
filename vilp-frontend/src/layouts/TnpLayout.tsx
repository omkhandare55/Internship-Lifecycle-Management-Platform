import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Building2,
  Briefcase,
  BarChart3,
  FileSearch,
  UserPlus,
  History,
  FileCheck,
  Award,
  Zap,
} from 'lucide-react';
import { ResponsivePortalLayout } from '@/components/ResponsivePortalLayout';

const tnpNavItems = [
  { to: '/tnp/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tnp/verification', icon: UserCheck,       label: 'Verification' },
  { to: '/tnp/noc',          icon: FileCheck,       label: 'NOC Queue' },
  { to: '/tnp/ppo',          icon: Award,           label: 'PPO Registry' },
  { to: '/tnp/automation',   icon: Zap,             label: 'n8n Automations' },
  { to: '/tnp/students',     icon: UserPlus,        label: 'Students' },
  { to: '/tnp/companies',    icon: Building2,       label: 'Companies' },
  { to: '/tnp/internships',  icon: Briefcase,       label: 'Internships' },
  { to: '/tnp/documents',    icon: FileSearch,      label: 'Documents' },
  { to: '/tnp/analytics',    icon: BarChart3,       label: 'Analytics' },
  { to: '/tnp/audit',        icon: History,         label: 'Audit Logs' },
];

const tnpMobileNav = [
  { to: '/tnp/dashboard',    icon: LayoutDashboard, label: 'Home' },
  { to: '/tnp/verification', icon: UserCheck,       label: 'Verify' },
  { to: '/tnp/noc',          icon: FileCheck,       label: 'NOC' },
  { to: '/tnp/automation',   icon: Zap,             label: 'Automations' },
  { to: '/tnp/analytics',    icon: BarChart3,       label: 'Analytics' },
];

export function TnpLayout() {
  return (
    <ResponsivePortalLayout
      portalTitle="T&P Portal"
      brandIcon={UserCheck}
      brandBgColor="bg-orange-600"
      navItems={tnpNavItems}
      mobileBottomNavItems={tnpMobileNav}
    >
      <Outlet />
    </ResponsivePortalLayout>
  );
}
