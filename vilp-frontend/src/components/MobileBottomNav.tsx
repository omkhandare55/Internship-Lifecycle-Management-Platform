import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Award,
  TrendingUp,
} from 'lucide-react';
import { nativeBridge } from '@/services/nativeBridge';

const studentMobileNav = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/student/internships', icon: Briefcase, label: 'Catalog' },
  { to: '/student/applications', icon: FileText, label: 'Applied' },
  { to: '/student/offers', icon: Award, label: 'Offers' },
  { to: '/student/progress', icon: TrendingUp, label: 'Logbook' },
];

export function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t z-40 pb-[env(safe-area-inset-bottom)] shadow-lg">
      <div className="flex items-center justify-around h-14">
        {studentMobileNav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => nativeBridge.hapticFeedback('selection')}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-primary-700 font-bold' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
