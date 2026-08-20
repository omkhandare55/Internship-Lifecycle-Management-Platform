import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  GraduationCap,
  Briefcase,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { PLATFORM_ROLES, type UserRoleType } from '../../onboarding/types/roleTypes';
import { MultiRoleOnboardingWizard } from '../../onboarding/pages/MultiRoleOnboardingWizard';

export function RegisterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [hoveredRoleId, setHoveredRoleId] = useState<string | null>(null);

  const selectedRole = searchParams.get('role') as UserRoleType | null;

  const filteredRoles =
    selectedCategory === 'ALL'
      ? PLATFORM_ROLES
      : PLATFORM_ROLES.filter((r) => r.category === selectedCategory);

  const handleSelectRole = (roleId: UserRoleType) => {
    setSearchParams({ role: roleId });
  };

  const getRoleIcon = (roleId: UserRoleType) => {
    switch (roleId) {
      case 'STUDENT':
        return <GraduationCap className="w-5 h-5 text-[#723ECF]" />;
      case 'FACULTY_MENTOR':
        return <Award className="w-5 h-5 text-[#ED4B86]" />;
      case 'TNP_OFFICER':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'COMPANY_RECRUITER':
        return <Briefcase className="w-5 h-5 text-[#723ECF]" />;
      case 'SUPER_ADMIN':
        return <Users className="w-5 h-5 text-indigo-600" />;
      default:
        return <GraduationCap className="w-5 h-5 text-[#723ECF]" />;
    }
  };

  // If a role is actively selected in search params, render the full tailored onboarding wizard
  if (selectedRole) {
    return <MultiRoleOnboardingWizard />;
  }

  // Otherwise, render the Role Selection Matrix
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in font-mono">
      {/* ── Top Masthead ───────────────────────────────────────────────────── */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs text-[#723ECF] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#ED4B86]" /> STEP 1 // INSTITUTIONAL ROLE SELECTION
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#171024] uppercase font-sans tracking-tight">
          Create Your Verified Identity
        </h2>
        <p className="text-xs text-zinc-600">
          Select your institutional role to launch customized multi-factor verification and AI profile onboarding.
        </p>
      </div>

      {/* ── Category Filter Pills (Touch scrollable on mobile) ─────────────── */}
      <div className="bg-[#FEF8E7] border border-[#E0D3E8] p-2 rounded-sm flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
        {[
          { id: 'ALL', label: 'ALL ROLES (9)' },
          { id: 'STUDENT', label: 'STUDENTS' },
          { id: 'FACULTY', label: 'FACULTY & MENTORS' },
          { id: 'ADMIN', label: 'T&P & ADMIN' },
          { id: 'CORPORATE', label: 'RECRUITERS' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xs text-[10px] sm:text-[11px] font-bold uppercase whitespace-nowrap transition-colors shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-[#723ECF] text-white'
                : 'bg-white text-zinc-700 border border-[#E0D3E8] hover:bg-[#F4EEF7]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Role Grid (Responsive 1-col on mobile, 2-col on tablet, 3-col on desktop) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredRoles.map((role) => {
          const isHovered = hoveredRoleId === role.id;
          return (
            <div
              key={role.id}
              onMouseEnter={() => setHoveredRoleId(role.id)}
              onMouseLeave={() => setHoveredRoleId(null)}
              onClick={() => handleSelectRole(role.id)}
              className={`bg-white border rounded-sm p-4 cursor-pointer flex flex-col justify-between space-y-3 transition-all min-h-[160px] ${
                isHovered
                  ? 'border-[#723ECF] shadow-sm ring-1 ring-[#723ECF] bg-[#F4EEF7]/30'
                  : 'border-[#E0D3E8] hover:border-zinc-400'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#F4EEF7] border border-[#E0D3E8] rounded-xs flex items-center justify-center shrink-0">
                      {getRoleIcon(role.id)}
                    </div>
                    <span className="font-bold text-xs uppercase text-[#171024] font-sans truncate">
                      {role.title}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase shrink-0 ${
                      role.defaultTrustLevel.includes('Level 3')
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#FEF8E7] text-[#723ECF] border border-[#E0D3E8]'
                    }`}
                  >
                    {role.defaultTrustLevel}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-600 font-sans line-clamp-2 leading-relaxed">
                  {role.tagline}
                </p>

                <div className="space-y-1 text-[10px] text-zinc-500 pt-1">
                  <span className="text-[#5D4A75] font-bold uppercase block">Verification Proofs:</span>
                  <div className="flex flex-wrap gap-1">
                    {role.verificationRequirements.slice(0, 2).map((req, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-[#FEF8E7] px-1.5 py-0.5 border border-[#EADBBE] rounded-xs text-[10px] truncate max-w-full">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" /> {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E0D3E8] flex justify-between items-center text-[11px] font-bold text-[#723ECF]">
                <span>SELECT &amp; PROCEED</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer Navigation ──────────────────────────────────────────────── */}
      <div className="p-3.5 bg-[#FEF8E7] border border-[#E0D3E8] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-center sm:text-left">
        <span className="text-zinc-600">Already registered on VILP?</span>
        <Link
          to="/auth/login"
          className="text-[#723ECF] font-bold uppercase hover:underline"
        >
          [ SIGN IN TO YOUR PORTAL &rarr; ]
        </Link>
      </div>
    </div>
  );
}
