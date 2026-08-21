import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Award,
  Briefcase,
} from 'lucide-react';
import { companyApi, internshipApi, applicationApi } from '@/services/vilpApi';

export function CompanyDashboard() {
  const { data: profileData } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: () => companyApi.getMyProfile(),
  });

  const { data: internshipsData } = useQuery({
    queryKey: ['myInternships'],
    queryFn: () => internshipApi.listMine(),
  });

  const internships = internshipsData?.data?.content || [];
  const primaryInternshipId = internships[0]?.id;

  const { data: applicantsData } = useQuery({
    queryKey: ['companyApplicants', primaryInternshipId],
    queryFn: () => (primaryInternshipId ? applicationApi.listForInternship(primaryInternshipId) : Promise.resolve({ success: true, data: { content: [] } as any })),
    enabled: !!primaryInternshipId,
  });

  const company = profileData?.data;
  const applicants = applicantsData?.data?.content || [];

  return (
    <div className="container-fluid p-0 space-y-4 space-y-md-5 pb-5 animate-fade-in font-mono">
      {/* ── Recruiter Header Hero (#0A2540) ─────────────────────────────────── */}
      <div className="bg-[#0A2540] border border-[#1E3A5F] p-4 p-sm-5 p-md-6 rounded-xs text-white shadow-xs space-y-4">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-4">
          <div className="space-y-1.5">
            <div className="d-inline-flex align-items-center gap-2 px-2.5 py-1 bg-[#2563EB] text-white text-[11px] font-bold uppercase rounded-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
              <span>ACCREDITED CORPORATE PARTNER // {company?.industry || 'INFORMATION TECHNOLOGY'}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tight font-sans m-0">
              {company?.name || 'Enterprise Partner Portal'}
            </h1>
            <p className="text-xs text-slate-300 font-mono max-w-xl m-0">
              {company?.headquarters || 'Bangalore, Karnataka, India'} · Enterprise Size: {company?.size || '10,000+'}
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2 gap-sm-3">
            <Link
              to="/company/internships"
              className="btn-primary text-xs d-flex align-items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> POST NEW INTERNSHIP
            </Link>
            <Link
              to="/company/profile"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono text-xs font-bold rounded-xs transition-colors uppercase text-nowrap"
            >
              COMPANY PROFILE
            </Link>
          </div>
        </div>
      </div>

      {/* ── Recruiter KPI Cards (Bootstrap row g-0) ─────────────────────────── */}
      <div className="row g-0 border border-[#E2E8F0] bg-white rounded-xs overflow-hidden">
        <div className="col-12 col-sm-6 col-lg-3 p-4 border-end-md border-bottom border-bottom-lg-0 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">ACTIVE_POSTINGS</span>
            <Briefcase className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-2xl font-black text-[#2563EB] font-mono m-0">{internships.length || 2}</p>
          <span className="text-[10px] text-[#2563EB] font-bold block">Accepting Applications</span>
        </div>

        <div className="col-12 col-sm-6 col-lg-3 p-4 border-end-lg border-bottom border-bottom-lg-0 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">TOTAL_CANDIDATES</span>
            <Users className="w-4 h-4 text-[#0A2540]" />
          </div>
          <p className="text-2xl font-bold text-[#0A2540] font-mono m-0">{applicants.length || 1}</p>
          <span className="text-[10px] text-emerald-700 font-bold block">1 Selected for Offer</span>
        </div>

        <div className="col-12 col-sm-6 col-lg-3 p-4 border-end-md border-bottom border-bottom-sm-0 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">OFFERS_EXTENDED</span>
            <Building2 className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-2xl font-bold text-[#0A2540] font-mono m-0">1</p>
          <span className="text-[10px] text-[#2563EB] font-bold block">NOC Auto-Issued</span>
        </div>

        <div className="col-12 col-sm-6 col-lg-3 p-4 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">PPO_CONVERSIONS</span>
            <Award className="w-4 h-4 text-[#F97316]" />
          </div>
          <p className="text-2xl font-bold text-[#F97316] font-mono m-0">1</p>
          <span className="text-[10px] text-slate-500 font-bold block">CTC: 14.5 LPA Extended</span>
        </div>
      </div>

      {/* ── Talent Pipeline Section ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xs border border-[#E2E8F0] shadow-xs p-4 p-sm-5 space-y-4">
        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 pb-3 border-bottom border-[#E2E8F0]">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#0A2540] uppercase font-sans m-0">Active Talent Pipeline</h3>
            <p className="text-xs text-slate-600 font-mono m-0">Candidates applying for your open roles</p>
          </div>
          <Link to="/company/applicants" className="btn-secondary text-xs d-flex align-items-center gap-1">
            VIEW ALL PIPELINE <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-100 text-start text-xs font-mono">
            <thead className="bg-[#F8FAFC] border-bottom border-[#E2E8F0] text-slate-600 font-bold uppercase">
              <tr>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Role Applied</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-bold text-[#0A2540] text-sm m-0">Verified Candidate</p>
                  <p className="text-[11px] text-slate-500 font-mono m-0">REG-2026-001 · CSE (CGPA 8.85)</p>
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  Cloud Engineering &amp; Microservices Intern
                </td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xs text-[11px] font-bold">
                    SELECTED (Offer Extended)
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    to="/company/applicants"
                    className="btn-primary text-xs px-3 py-1.5 d-inline-flex align-items-center gap-1"
                  >
                    MANAGE OFFER <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
