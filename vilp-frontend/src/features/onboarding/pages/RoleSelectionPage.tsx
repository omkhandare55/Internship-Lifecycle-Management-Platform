import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Building2,
  Award,
  Users,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { PLATFORM_ROLES, type UserRoleType } from '../types/roleTypes';
import { CommandPaletteHUD } from '@/components/CommandPaletteHUD';
import { GodlyGrid, GodlyGridCell, EditorialTicker } from '@/components/ui';

export function RoleSelectionPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [hoveredRoleId, setHoveredRoleId] = useState<string | null>(null);

  const filteredRoles =
    selectedCategory === 'ALL'
      ? PLATFORM_ROLES
      : PLATFORM_ROLES.filter((r) => r.category === selectedCategory);

  const handleSelectRole = (roleId: UserRoleType) => {
    navigate(`/onboarding?role=${roleId}`);
  };

  const getRoleIcon = (roleId: UserRoleType) => {
    switch (roleId) {
      case 'STUDENT':
        return <GraduationCap className="w-5 h-5 text-[#2563EB]" />;
      case 'FACULTY_MENTOR':
      case 'HOD':
      case 'DEPT_COORDINATOR':
        return <Award className="w-5 h-5 text-[#F97316]" />;
      case 'TNP_OFFICER':
      case 'COLLEGE_ADMIN':
      case 'SUPER_ADMIN':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'COMPANY_RECRUITER':
        return <Briefcase className="w-5 h-5 text-[#0A2540]" />;
      case 'EXTERNAL_EVALUATOR':
        return <Users className="w-5 h-5 text-indigo-600" />;
      default:
        return <Building2 className="w-5 h-5 text-[#2563EB]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-16 w-full max-w-full overflow-x-hidden">
      {/* ── Top Bar (#0A2540 Stripe Marine) ───────────────────────────── */}
      <div className="bg-[#0A2540] text-white border-b border-[#1E3A5F] px-4 py-5 sm:py-7">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#2563EB] text-white text-[11px] font-mono font-bold uppercase rounded-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
              <span className="truncate">ENTERPRISE ACCESS // RBAC SUITE</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tight font-sans">
              Select Your Platform Role
            </h1>
            <p className="text-xs text-slate-300 font-mono max-w-2xl leading-relaxed">
              Choose your institutional role to launch customized multi-factor verification and AI-powered profile onboarding.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 self-start sm:self-center">
            <Link
              to="/auth/login"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono text-xs font-bold rounded-sm transition-colors uppercase whitespace-nowrap"
            >
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>

      {/* ── Continuous Telemetry Ticker ───────────────────────────────────── */}
      <EditorialTicker
        items={[
          'AICTE §7.2 DETERMINISTIC ELIGIBILITY ENGINE',
          'SINGLE-ACTIVE OFFER MUTEX ACTIVE',
          '240H ACCREDITED LOGBOOK AUDIT',
          'SHA-256 CRYPTOGRAPHIC DEGREE SEALS',
          'NEP-2020 ACADEMIC CREDIT BANK COMPLIANT',
        ]}
      />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 pt-6 space-y-6 min-w-0">
        {/* ── Category Filter Bar ─────────────────────────────────────────── */}
        <div className="bg-white border border-[#E2E8F0] p-2 rounded-xs flex items-center gap-1.5 overflow-x-auto font-mono text-xs shadow-xs scrollbar-none w-full max-w-full">
          {[
            { id: 'ALL', label: 'ALL ROLES (9)' },
            { id: 'STUDENT', label: 'STUDENTS' },
            { id: 'FACULTY', label: 'FACULTY & MENTORS' },
            { id: 'ADMIN', label: 'T&P & COLLEGE ADMIN' },
            { id: 'CORPORATE', label: 'CORPORATE RECRUITERS' },
            { id: 'EVALUATOR', label: 'EXTERNAL EVALUATORS' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xs font-bold uppercase whitespace-nowrap transition-colors text-[11px] sm:text-xs shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-slate-700 border border-[#E2E8F0] hover:bg-[#F1F5F9]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Continuous 1px Border Grid ──────────────────────────────────── */}
        <GodlyGrid columns={3}>
          {filteredRoles.map((role) => {
            const isHovered = hoveredRoleId === role.id;
            return (
              <GodlyGridCell
                key={role.id}
                onClick={() => handleSelectRole(role.id)}
                className={`space-y-4 cursor-pointer transition-all ${
                  isHovered ? 'bg-[#F8FAFC]' : 'bg-white'
                }`}
              >
                <div
                  onMouseEnter={() => setHoveredRoleId(role.id)}
                  onMouseLeave={() => setHoveredRoleId(null)}
                  className="space-y-3 min-w-0"
                >
                  {/* Top Bar: Icon + Trust Badge */}
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="w-10 h-10 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xs flex items-center justify-center shrink-0">
                      {getRoleIcon(role.id)}
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider shrink-0 ${
                        role.defaultTrustLevel.includes('Level 3')
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : role.defaultTrustLevel.includes('Level 2')
                          ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {role.defaultTrustLevel}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base uppercase text-[#0A2540] font-sans truncate">
                      {role.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#2563EB] font-mono font-medium leading-snug mt-0.5 line-clamp-2">
                      {role.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                    {role.description}
                  </p>

                  {/* Verification Requirements */}
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xs space-y-1.5 font-mono text-[11px] min-w-0 max-w-full overflow-hidden">
                    <span className="text-[10px] text-[#0A2540] font-bold uppercase block truncate">
                      REQUIRED PROOFS:
                    </span>
                    {role.verificationRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-700 text-[10px] sm:text-[11px] min-w-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{req}</span>
                      </div>
                    ))}
                  </div>

                  {/* AI Capabilities List */}
                  <div className="space-y-1 font-mono text-[11px] min-w-0">
                    <span className="text-[10px] text-[#F97316] font-bold uppercase block truncate">
                      AUTOMATION ENGINES:
                    </span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[10px] sm:text-[11px] min-w-0">
                      {role.aiCapabilities.slice(0, 2).map((ai, i) => (
                        <li key={i} className="truncate">
                          {ai}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Launch Action */}
                <div className="pt-3 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRole(role.id);
                    }}
                    className="w-full py-3 sm:py-2.5 px-4 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-mono font-bold text-xs flex items-center justify-center gap-2 rounded-xs shadow-xs transition-colors uppercase tracking-wider min-h-[44px] cursor-pointer"
                  >
                    ONBOARD AS {role.id.replace('_', ' ')} <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </GodlyGridCell>
            );
          })}
        </GodlyGrid>

        {/* ── Footer Security Callout ───────────────────────────────────────── */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-600 text-center sm:text-left min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <Lock className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span className="truncate">
              All accounts undergo cryptographic domain authentication and immutable audit trail logging.
            </span>
          </div>
          <span className="text-[11px] text-[#2563EB] font-bold shrink-0">
            AICTE §7.2 &bull; NEP-2020 &bull; RFC 7807
          </span>
        </div>
      </div>

      <CommandPaletteHUD />
    </div>
  );
}
