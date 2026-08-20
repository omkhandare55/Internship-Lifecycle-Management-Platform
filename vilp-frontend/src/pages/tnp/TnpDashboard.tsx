import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  Award,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { analyticsApi } from '@/services/vilpApi';

export function TnpDashboard() {
  const { data } = useQuery({
    queryKey: ['analyticsOverview'],
    queryFn: () => analyticsApi.getOverview(),
  });

  const stats = data?.data;

  return (
    <div className="container-fluid p-0 space-y-4 space-y-md-5 pb-5 animate-fade-in font-mono">
      {/* ── Top T&P Masthead (#0A2540) ──────────────────────────────────────── */}
      <div className="bg-[#0A2540] border border-[#1E3A5F] p-4 p-sm-5 p-md-6 rounded-xs text-white shadow-xs space-y-4">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-4">
          <div className="space-y-1.5">
            <div className="d-inline-flex align-items-center gap-2 px-2.5 py-1 bg-[#2563EB] text-white text-[11px] font-bold uppercase rounded-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
              <span>TRAINING &amp; PLACEMENT HEADQUARTERS // AICTE §7.2 GOVERNANCE</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tight font-sans m-0">
              Institutional Placement Headquarters
            </h1>
            <p className="text-xs text-slate-300 font-mono max-w-2xl leading-relaxed m-0">
              Verify credentials, manage corporate recruiter partnerships, issue auto-stamped institutional NOCs, and audit placement metrics.
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2 gap-sm-3">
            <Link
              to="/tnp/verification"
              className="btn-primary text-xs d-flex align-items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" /> VERIFICATION QUEUE
            </Link>
            <Link
              to="/tnp/analytics"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono text-xs font-bold rounded-xs transition-colors uppercase text-nowrap"
            >
              EXECUTIVE AUDIT
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI Highlight Grid (Bootstrap row g-0) ──────────────────────────── */}
      <div className="row g-0 border border-[#E2E8F0] bg-white rounded-xs overflow-hidden">
        <div className="col-12 col-sm-6 col-lg-3 p-4 border-end-md border-bottom border-bottom-lg-0 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">PLACEMENT_RATE</span>
            <TrendingUp className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-2xl font-black text-[#2563EB] font-mono m-0">
            {stats ? `${((stats.totalOffers / (stats.totalStudents || 1)) * 100).toFixed(1)}%` : '95.2%'}
          </p>
          <span className="text-[10px] text-slate-500 font-bold block">
            Of verified student pool
          </span>
        </div>

        <div className="col-12 col-sm-6 col-lg-3 p-4 border-end-lg border-bottom border-bottom-lg-0 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">AVERAGE_CTC</span>
            <Award className="w-4 h-4 text-[#0A2540]" />
          </div>
          <p className="text-2xl font-bold text-[#0A2540] font-mono m-0">
            {stats?.averageCtcLpa || 9.85} LPA
          </p>
          <span className="text-[10px] text-emerald-700 font-bold block">
            +18% YoY growth
          </span>
        </div>

        <div className="col-12 col-sm-6 col-lg-3 p-4 border-end-md border-bottom border-bottom-sm-0 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">VERIFIED_RECRUITERS</span>
            <Building2 className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-2xl font-bold text-[#0A2540] font-mono m-0">
            {stats?.verifiedCompanies || 78}
          </p>
          <span className="text-[10px] text-[#2563EB] font-bold block">
            Accredited Tier-1 Partners
          </span>
        </div>

        <div className="col-12 col-sm-6 col-lg-3 p-4 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">PPO_CONVERSION</span>
            <ShieldCheck className="w-4 h-4 text-[#F97316]" />
          </div>
          <p className="text-2xl font-bold text-[#F97316] font-mono m-0">
            {stats?.ppoConversionRate || 29.2}%
          </p>
          <span className="text-[10px] text-slate-500 font-bold block">
            245 Pre-Placement Offers
          </span>
        </div>
      </div>

      {/* ── Governance & Action Hubs (Bootstrap row g-3 g-md-4) ─────────────── */}
      <div className="row g-3 g-md-4">
        <div className="col-12 col-md-4">
          <Link
            to="/tnp/verification"
            className="border border-[#E2E8F0] bg-white p-4 p-sm-5 rounded-xs space-y-3 shadow-xs hover:border-[#2563EB] transition-all d-flex flex-column justify-content-between h-100 group block"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 bg-[#F1F5F9] border border-[#CBD5E1] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white rounded-xs d-flex align-items-center justify-content-center transition-colors">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base uppercase text-[#0A2540] font-sans m-0">
                Universal Verification Queue
              </h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed m-0">
                Review student KYC, institutional credentials, and corporate partner onboarding audits.
              </p>
            </div>
            <span className="text-xs font-bold text-[#2563EB] d-flex align-items-center gap-1 pt-2 font-mono uppercase">
              Open Queue <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        <div className="col-12 col-md-4">
          <Link
            to="/tnp/noc"
            className="border border-[#E2E8F0] bg-white p-4 p-sm-5 rounded-xs space-y-3 shadow-xs hover:border-[#2563EB] transition-all d-flex flex-column justify-content-between h-100 group block"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 bg-[#F1F5F9] border border-[#CBD5E1] text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white rounded-xs d-flex align-items-center justify-content-center transition-colors">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base uppercase text-[#0A2540] font-sans m-0">
                Institutional NOC Clearances
              </h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed m-0">
                Approve and stamp No Objection Certificates with SHA-256 tamper-proof institutional seals.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 d-flex align-items-center gap-1 pt-2 font-mono uppercase">
              Manage NOCs <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        <div className="col-12 col-md-4">
          <Link
            to="/tnp/ppo"
            className="border border-[#E2E8F0] bg-white p-4 p-sm-5 rounded-xs space-y-3 shadow-xs hover:border-[#2563EB] transition-all d-flex flex-column justify-content-between h-100 group block"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 bg-[#F1F5F9] border border-[#CBD5E1] text-[#0A2540] group-hover:bg-[#0A2540] group-hover:text-white rounded-xs d-flex align-items-center justify-content-center transition-colors">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base uppercase text-[#0A2540] font-sans m-0">
                Placement &amp; PPO Registry
              </h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed m-0">
                Central corporate offer tracker with annual CTC metrics and 1-click accreditation exports.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0A2540] d-flex align-items-center gap-1 pt-2 font-mono uppercase">
              View Registry <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
