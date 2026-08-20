import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [hoveredRoleId, setHoveredRoleId] = useState<string | null>(null);

  const paramEmail = searchParams.get('email') || '';
  const paramName = searchParams.get('name') || '';
  const isGoogleAuth = searchParams.get('googleAuth') === 'true';

  const filteredRoles =
    selectedCategory === 'ALL'
      ? PLATFORM_ROLES
      : PLATFORM_ROLES.filter((r) => r.category === selectedCategory);

  const handleSelectRole = (roleId: UserRoleType) => {
    const params = new URLSearchParams();
    params.set('role', roleId);
    if (paramEmail) params.set('email', paramEmail);
    if (paramName) params.set('name', paramName);
    if (isGoogleAuth) params.set('googleAuth', 'true');

    navigate(`/onboarding?${params.toString()}`);
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
    <div className="container-fluid p-0 min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-5 w-100 overflow-x-hidden">
      {/* ── Top Bar (#0A2540 Stripe Marine) ───────────────────────────── */}
      <div className="bg-[#0A2540] text-white border-b border-[#1E3A5F] px-3 px-md-4 py-4 py-md-5">
        <div className="container p-0 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div className="space-y-1 min-w-0">
            <div className="d-inline-flex align-items-center gap-2 px-2.5 py-1 bg-[#2563EB] text-white text-[11px] font-mono font-bold uppercase rounded-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
              <span className="truncate">
                {isGoogleAuth ? 'GOOGLE AUTHENTICATED // SELECT YOUR ROLE' : 'ENTERPRISE ACCESS // RBAC SUITE'}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tight font-sans m-0">
              Select Your Platform Role
            </h1>
            <p className="text-xs text-slate-300 font-mono max-w-2xl leading-relaxed m-0">
              {isGoogleAuth
                ? `Welcome ${paramName || paramEmail}! Select your role to finalize your institutional profile.`
                : 'Choose your institutional role to launch customized multi-factor verification and AI-powered profile onboarding.'}
            </p>
          </div>

          <div className="shrink-0 d-flex align-items-center gap-3">
            <Link
              to="/auth/login"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono text-xs font-bold rounded-xs transition-colors uppercase text-nowrap"
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

      <div className="container px-3 px-sm-4 pt-4 space-y-4">
        {/* ── Category Filter Bar ─────────────────────────────────────────── */}
        <div className="bg-white border border-[#CBD5E1] p-2 rounded-[2px_8px_2px_8px] d-flex align-items-center gap-2 overflow-x-auto font-mono text-xs shadow-[2px_2px_0px_0px_#E2E8F0] w-100">
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
              className={`px-3.5 py-2 font-bold uppercase text-nowrap transition-all text-[11px] sm:text-xs shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'btn-primary shadow-xs'
                  : 'btn-secondary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Bootstrap 5 Responsive Grid (col-12 col-sm-6 col-lg-4) ──────── */}
        <GodlyGrid columns={3}>
          {filteredRoles.map((role) => {
            const isHovered = hoveredRoleId === role.id;
            return (
              <GodlyGridCell
                key={role.id}
                columns={3}
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
                  <div className="d-flex align-items-start justify-content-between gap-2 min-w-0">
                    <div className="w-10 h-10 bg-[#F1F5F9] border border-[#CBD5E1] rounded-[1px_4px_1px_4px] shadow-[1px_1px_0px_0px_#0A2540] d-flex align-items-center justify-content-center shrink-0">
                      {getRoleIcon(role.id)}
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-[1px] uppercase tracking-wider shrink-0 border ${
                        role.defaultTrustLevel.includes('Level 3')
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : role.defaultTrustLevel.includes('Level 2')
                          ? 'bg-blue-50 text-[#2563EB] border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {role.defaultTrustLevel}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="min-w-0">
                    <h3 className="font-black text-sm sm:text-base uppercase text-[#0A2540] font-sans truncate m-0">
                      {role.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#2563EB] font-mono font-bold leading-snug mt-0.5 line-clamp-2">
                      {role.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3 m-0">
                    {role.description}
                  </p>

                  {/* Verification Requirements */}
                  <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-[1px_4px_1px_4px] space-y-1.5 font-mono text-[11px] min-w-0 w-100 overflow-hidden shadow-inner">
                    <span className="text-[10px] text-[#0A2540] font-extrabold uppercase block truncate">
                      REQUIRED PROOFS:
                    </span>
                    {role.verificationRequirements.map((req, i) => (
                      <div key={i} className="d-flex align-items-center gap-1.5 text-slate-700 text-[10px] sm:text-[11px] min-w-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{req}</span>
                      </div>
                    ))}
                  </div>

                  {/* AI Capabilities List */}
                  <div className="space-y-1 font-mono text-[11px] min-w-0">
                    <span className="text-[10px] text-[#F97316] font-extrabold uppercase block truncate">
                      AUTOMATION ENGINES:
                    </span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[10px] sm:text-[11px] min-w-0 m-0 p-0">
                      {role.aiCapabilities.slice(0, 2).map((ai, i) => (
                        <li key={i} className="truncate">
                          {ai}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Launch Action */}
                <div className="pt-3 border-top border-[#CBD5E1]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRole(role.id);
                    }}
                    className="btn-primary w-100 min-h-[44px] cursor-pointer"
                  >
                    ONBOARD AS {role.id.replace('_', ' ')} <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </GodlyGridCell>
            );
          })}
        </GodlyGrid>

        {/* ── Footer Security Callout ───────────────────────────────────────── */}
        <div className="box-ledger p-3 p-sm-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 text-xs font-mono text-slate-600 text-center text-md-start w-100">
          <div className="d-flex align-items-center gap-2 min-w-0">
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
