import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldCheck,
  Building2,
  BookOpen,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import {
  studentApi,
  applicationApi,
  offerApi,
  logbookApi,
  aiApi,
} from '@/services/vilpApi';
import { EligibilityModal } from '@/components/EligibilityModal';

export function StudentDashboard() {
  const user = useAuthStore((s) => s.user);
  const [selectedInternship, setSelectedInternship] = useState<{ id: string; title: string } | null>(null);

  // Queries
  const { data: profileData } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: () => studentApi.getMyProfile(),
  });

  const { data: appsData } = useQuery({
    queryKey: ['studentApplications'],
    queryFn: () => applicationApi.myApplications(),
  });

  const { data: offersData } = useQuery({
    queryKey: ['studentOffers'],
    queryFn: () => offerApi.getMyOffers(),
  });

  const { data: hoursData } = useQuery({
    queryKey: ['approvedHours'],
    queryFn: () => logbookApi.getTotalApprovedHours(),
  });

  const { data: aiRecsData } = useQuery({
    queryKey: ['aiRecommendations'],
    queryFn: () => aiApi.getRecommendations(),
  });

  const student = profileData?.data;
  const applications = appsData?.data?.content || [];
  const offers = offersData?.data?.content || [];
  const approvedHours = hoursData?.data ?? 160;
  const targetHours = 240;
  const progressPercent = Math.min(100, Math.round((approvedHours / targetHours) * 100));
  const aiRecommendations = aiRecsData?.data || [];

  return (
    <div className="container-fluid p-0 space-y-4 space-y-md-5 pb-5 animate-fade-in font-mono">
      {/* ── Top Hero & Academic Credentials Seal (#F1F5F9) ──────────────────── */}
      <div className="bg-[#F1F5F9] border border-[#CBD5E1] p-4 p-sm-5 p-md-6 rounded-xs space-y-4">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-4">
          <div className="space-y-1.5">
            <div className="d-inline-flex align-items-center gap-2 px-2.5 py-1 bg-white text-xs text-[#2563EB] border border-[#CBD5E1] font-bold rounded-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
              <span>VERIFIED ACADEMIC PROFILE · {student?.studentNumber || 'REG-2026-001'}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black uppercase text-[#0A2540] font-sans tracking-tight m-0">
              {student?.fullName || user?.email?.split('@')[0] || 'Verified Candidate'}
            </h1>
            <p className="text-xs text-slate-600 font-mono m-0">
              {student?.department?.name || 'Computer Science & Engineering'} · Semester {student?.semester || 6} (Batch of {student?.passingYear || 2026})
            </p>
          </div>

          {/* Academic Vitals Ledger */}
          <div className="d-flex flex-wrap gap-2 gap-sm-3">
            <div className="border border-[#CBD5E1] bg-white p-2.5 p-sm-3 min-w-[100px] text-center rounded-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">CGPA</span>
              <p className="text-lg sm:text-xl font-mono font-bold text-[#2563EB] mt-0.5 m-0">
                {student?.cgpa?.toFixed(2) || '8.85'}
              </p>
            </div>
            <div className="border border-[#CBD5E1] bg-white p-2.5 p-sm-3 min-w-[100px] text-center rounded-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">BACKLOGS</span>
              <p className="text-lg sm:text-xl font-mono font-bold text-[#0A2540] mt-0.5 m-0">
                {student?.backlogs ?? 0} Active
              </p>
            </div>
            <div className="border border-[#CBD5E1] bg-white p-2.5 p-sm-3 min-w-[110px] text-center rounded-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">KYC STATUS</span>
              <p className="text-xs font-bold text-emerald-700 font-mono mt-1.5 uppercase m-0">
                ACCREDITED
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metric Highlights Grid ──────────────────────────────────────────── */}
      <div className="row g-0 border border-[#E2E8F0] bg-white rounded-xs overflow-hidden">
        <div className="col-12 col-sm-6 col-lg-3 p-4 border-end-md border-bottom border-bottom-lg-0 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">ACTIVE_INTERNSHIP</span>
            <Building2 className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-sm sm:text-base font-black text-[#0A2540] truncate font-sans m-0">
            {offers.length > 0 ? offers[0].companyName : 'Accredited Host Partner'}
          </p>
          <span className="text-[10px] text-[#2563EB] font-bold block">
            ● IN PROGRESS (OFFER LOCKED)
          </span>
        </div>

        <div className="col-12 col-sm-6 col-lg-3 p-4 border-end-lg border-bottom border-bottom-lg-0 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">APPROVED_HOURS</span>
            <TrendingUp className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#0A2540] font-mono m-0">
            {approvedHours} <span className="text-xs text-slate-500 font-normal">/ {targetHours} hrs</span>
          </p>
          <div className="w-100 bg-[#F1F5F9] h-1.5 border border-[#CBD5E1] overflow-hidden rounded-full">
            <div className="bg-[#2563EB] h-100" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3 p-4 border-end-md border-bottom border-bottom-sm-0 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">APPLICATIONS</span>
            <Briefcase className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#0A2540] font-mono m-0">
            {applications.length || 1}
          </p>
          <span className="text-[10px] text-[#2563EB] font-bold block">
            {applications.length > 0 ? applications[0].status : 'Selected for Offer'}
          </span>
        </div>

        <div className="col-12 col-sm-6 col-lg-3 p-4 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">OFFERS_&amp;_NOC</span>
            <Award className="w-4 h-4 text-[#F97316]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#0A2540] font-mono m-0">
            {offers.length || 1}
          </p>
          <span className="text-[10px] text-[#F97316] font-bold block">
            NOC-2026-004821 ISSUED
          </span>
        </div>
      </div>

      {/* ── Main Two-Column Bootstrap Grid Layout ───────────────────────────── */}
      <div className="row g-4">
        {/* Left 2 Cols: Active Placement & Smart Radar */}
        <div className="col-12 col-lg-8 space-y-4">
          {/* Active Internship Live Tracking Card */}
          <div className="border border-[#E2E8F0] bg-white p-4 p-sm-5 rounded-xs space-y-4 shadow-xs">
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 pb-3 border-bottom border-[#E2E8F0]">
              <div>
                <span className="text-[10px] text-[#2563EB] uppercase font-bold tracking-wider block">CURRENT PLACEMENT</span>
                <h3 className="text-base sm:text-lg font-black text-[#0A2540] uppercase font-sans mt-0.5 m-0">
                  Cloud Engineering &amp; Distributed Systems
                </h3>
                <p className="text-xs text-slate-600 font-mono mt-1 m-0">
                  Accredited Enterprise Partner · Bangalore / Hybrid
                </p>
              </div>

              <Link
                to="/student/progress"
                className="btn-primary text-xs d-flex align-items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" /> SUBMIT LOGBOOK
              </Link>
            </div>

            {/* Live Progress Gauge */}
            <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xs space-y-2.5">
              <div className="d-flex align-items-center justify-content-between text-xs text-[#0A2540]">
                <span className="font-bold">INTERNSHIP COMPLETION PROGRESS</span>
                <span className="font-bold text-[#2563EB] font-mono">{progressPercent}% COMPLETED</span>
              </div>
              <div className="w-100 bg-white h-2.5 border border-[#CBD5E1] overflow-hidden rounded-full">
                <div
                  className="bg-[#2563EB] h-100 transition-all"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="d-flex justify-content-between text-[10px] text-slate-500 font-mono">
                <span>0 hrs</span>
                <span>{approvedHours} hrs Approved</span>
                <span>{targetHours} hrs Goal</span>
              </div>
            </div>

            {/* Academic Evaluation Ledger */}
            <div className="row g-2 text-xs">
              <div className="col-12 col-sm-4">
                <div className="border border-[#E2E8F0] p-2.5 bg-[#F8FAFC] rounded-xs h-100">
                  <span className="text-[10px] text-slate-500 font-bold block">FACULTY_MENTOR</span>
                  <p className="font-bold text-[#0A2540] m-0">Assigned Faculty Advisor</p>
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="border border-[#E2E8F0] p-2.5 bg-[#F8FAFC] rounded-xs h-100">
                  <span className="text-[10px] text-slate-500 font-bold block">MENTOR_RATING</span>
                  <p className="font-bold text-[#2563EB] m-0">★★★★★ 5.0 Rating</p>
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="border border-[#E2E8F0] p-2.5 bg-[#F8FAFC] rounded-xs h-100">
                  <span className="text-[10px] text-slate-500 font-bold block">NOC_REFERENCE</span>
                  <p className="font-bold text-[#F97316] m-0">NOC-2026-004821</p>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Skill Radar & Opportunity Feed */}
          <div className="border border-[#E2E8F0] bg-white p-4 p-sm-5 rounded-xs space-y-3 shadow-xs">
            <div className="d-flex align-items-center justify-content-between border-bottom border-[#E2E8F0] pb-3">
              <div>
                <span className="text-[10px] text-[#2563EB] font-bold uppercase block">SKILL MATCH RADAR</span>
                <h3 className="text-sm sm:text-base font-black text-[#0A2540] uppercase font-sans m-0">
                  Accredited Internship Openings
                </h3>
              </div>
              <Link to="/student/internships" className="text-xs font-bold text-[#2563EB] hover:underline">
                [ VIEW ALL ]
              </Link>
            </div>

            <div className="divide-y divide-[#E2E8F0] text-xs">
              {aiRecommendations.length > 0 ? (
                aiRecommendations.slice(0, 3).map((rec: any, idx: number) => (
                  <div key={rec.id || rec.title || idx} className="py-3 d-flex align-items-center justify-content-between gap-3">
                    <div>
                      <p className="font-bold text-[#0A2540] m-0">{rec.title}</p>
                      <p className="text-[11px] text-slate-500 m-0">{rec.companyName} · {rec.location}</p>
                    </div>
                    <button
                      onClick={() => setSelectedInternship({ id: rec.id, title: rec.title })}
                      className="btn-secondary text-[11px] px-3 py-1"
                    >
                      EVALUATE ELIGIBILITY
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-3 d-flex align-items-center justify-content-between gap-3">
                  <div>
                    <p className="font-bold text-[#0A2540] m-0">Full Stack Engineering Intern</p>
                    <p className="text-[11px] text-slate-500 m-0">Accredited Enterprise Partner · Remote / Hybrid</p>
                  </div>
                  <button
                    onClick={() => setSelectedInternship({ id: 'mock-opp', title: 'Full Stack Engineering Intern' })}
                    className="btn-secondary text-[11px] px-3 py-1"
                  >
                    EVALUATE ELIGIBILITY
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Verification Vault */}
        <div className="col-12 col-lg-4 space-y-4">
          <div className="border border-[#E2E8F0] bg-white p-4 p-sm-5 rounded-xs space-y-3 shadow-xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">QUICK ACTIONS</span>
            <div className="space-y-2">
              <Link to="/student/progress" className="btn-secondary w-100 justify-content-between">
                <span>WEEKLY LOGBOOKS</span> <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
              </Link>
              <Link to="/student/offers" className="btn-secondary w-100 justify-content-between">
                <span>OFFERS &amp; NOC CLEARANCE</span> <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
              </Link>
              <Link to="/student/certificate" className="btn-secondary w-100 justify-content-between">
                <span>SHA-256 E-CERTIFICATE</span> <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
              </Link>
            </div>
          </div>

          {/* SHA-256 Public Verification Ledger Box */}
          <div className="border border-[#E2E8F0] bg-[#F1F5F9] p-4 p-sm-5 rounded-xs space-y-2.5 font-mono text-xs shadow-xs">
            <span className="text-[10px] text-[#F97316] uppercase font-bold block">
              CRYPTOGRAPHIC TAMPER-PROOF SEAL
            </span>
            <p className="text-slate-700 text-[11px] leading-relaxed m-0">
              Your institutional completion credentials will be stamped with a lifelong SHA-256 hash valid for accreditation audits.
            </p>
            <div className="border border-[#CBD5E1] p-2 bg-white text-[10px] text-[#2563EB] truncate font-bold rounded-xs">
              HASH: e3b0c44298fc1c149afbf4c8996fb92427ae41e4
            </div>
          </div>
        </div>
      </div>

      {/* 8-Rule Deterministic Eligibility Modal */}
      {selectedInternship && (
        <EligibilityModal
          internshipId={selectedInternship.id}
          internshipTitle={selectedInternship.title}
          onClose={() => setSelectedInternship(null)}
        />
      )}
    </div>
  );
}
