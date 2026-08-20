import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  TrendingUp,
  GraduationCap,
  Award,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { ResponsivePortalLayout } from '@/components/ResponsivePortalLayout';

const studentNavItems = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/profile', icon: User, label: 'My Profile' },
  { to: '/student/internships', icon: Briefcase, label: 'Internships' },
  { to: '/student/applications', icon: FileText, label: 'Applications' },
  { to: '/student/offers', icon: Award, label: 'Offers & NOC' },
  { to: '/student/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/student/ai-advisor', icon: Sparkles, label: 'AI Advisor' },
  { to: '/student/certificates', icon: FileCheck, label: 'Certificates & PPO' },
];

const studentMobileNav = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/student/internships', icon: Briefcase, label: 'Catalog' },
  { to: '/student/applications', icon: FileText, label: 'Applied' },
  { to: '/student/offers', icon: Award, label: 'Offers' },
  { to: '/student/progress', icon: TrendingUp, label: 'Logbook' },
];

export function StudentLayout() {
  return (
    <ResponsivePortalLayout
      portalTitle="Student Portal"
      brandIcon={GraduationCap}
      brandBgColor="bg-blue-600"
      navItems={studentNavItems}
      mobileBottomNavItems={studentMobileNav}
    >
      <Outlet />
    </ResponsivePortalLayout>
  );
}
