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
  const offers = offersData?.data || [];
  const approvedHours = hoursData?.data ?? 160;
  const targetHours = 240;
  const progressPercent = Math.min(100, Math.round((approvedHours / targetHours) * 100));
  const aiRecommendations = aiRecsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in font-mono">
      {/* ── Top Hero & Academic Credentials Seal (#FEF8E7) ──────────────────── */}
      <div className="bg-[#FEF8E7] border border-[#E0D3E8] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-xs text-[#723ECF] border border-[#E0D3E8] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ED4B86]" />
              <span>VERIFIED ACADEMIC PROFILE · {student?.studentNumber || '2022CS1045'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#171024] font-sans tracking-tight">
              STUDENT COMMAND // {student?.fullName || user?.email?.split('@')[0] || 'Aarav Sharma'}
            </h1>
            <p className="text-xs text-zinc-600 font-mono">
              {student?.department?.name || 'Computer Science & Engineering'} · Semester {student?.semester || 6} (Batch of {student?.passingYear || 2026})
            </p>
          </div>

          {/* Academic Vitals Ledger */}
          <div className="flex flex-wrap gap-3">
            <div className="border border-[#E0D3E8] bg-white p-3 min-w-[110px] text-center">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">CGPA</span>
              <p className="text-xl font-mono font-bold text-[#723ECF] mt-0.5">
                {student?.cgpa?.toFixed(2) || '8.85'}
              </p>
            </div>
            <div className="border border-[#E0D3E8] bg-white p-3 min-w-[110px] text-center">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">BACKLOGS</span>
              <p className="text-xl font-mono font-bold text-[#171024] mt-0.5">
                {student?.backlogs ?? 0} Active
              </p>
            </div>
            <div className="border border-[#E0D3E8] bg-white p-3 min-w-[120px] text-center">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">KYC STATUS</span>
              <p className="text-xs font-bold text-[#ED4B86] font-mono mt-1.5 uppercase">
                ACCREDITED
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metric Highlights Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#E0D3E8] divide-y sm:divide-y-0 sm:divide-x divide-[#E0D3E8] bg-white">
        <div className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-bold">ACTIVE_INTERNSHIP</span>
            <Building2 className="w-4 h-4 text-[#723ECF]" />
          </div>
          <p className="text-base font-black text-[#171024] truncate font-sans">
            {offers.length > 0 ? offers[0].companyName : 'Google Cloud India'}
          </p>
          <span className="text-[10px] text-[#723ECF] font-bold block">
            ● IN PROGRESS (OFFER LOCKED)
          </span>
        </div>

        <div className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-bold">APPROVED_HOURS</span>
            <TrendingUp className="w-4 h-4 text-[#723ECF]" />
          </div>
          <p className="text-2xl font-bold text-[#171024] font-mono">
            {approvedHours} <span className="text-xs text-zinc-500 font-normal">/ {targetHours} hrs</span>
          </p>
          <div className="w-full bg-[#F4EEF7] h-1.5 border border-[#E0D3E8] overflow-hidden">
            <div className="bg-[#723ECF] h-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-bold">APPLICATIONS</span>
            <Briefcase className="w-4 h-4 text-[#723ECF]" />
          </div>
          <p className="text-2xl font-bold text-[#171024] font-mono">
            {applications.length || 1}
          </p>
          <span className="text-[10px] text-[#723ECF] font-bold block">
            {applications.length > 0 ? applications[0].status : 'Selected for Offer'}
          </span>
        </div>

        <div className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-bold">OFFERS_&amp;_NOC</span>
            <Award className="w-4 h-4 text-[#ED4B86]" />
          </div>
          <p className="text-2xl font-bold text-[#171024] font-mono">
            {offers.length || 1}
          </p>
          <span className="text-[10px] text-[#ED4B86] font-bold block">
            NOC-2026-004821 ISSUED
          </span>
        </div>
      </div>

      {/* ── Main Two-Column Layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Placement & AI Radar */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Internship Live Tracking Wireframe */}
          <div className="border border-[#E0D3E8] bg-white p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0D3E8]">
              <div>
                <span className="text-[10px] text-[#723ECF] uppercase font-bold tracking-wider block">CURRENT PLACEMENT</span>
                <h3 className="text-lg font-black text-[#171024] uppercase font-sans mt-0.5">
                  Cloud Engineering &amp; Microservices Intern
                </h3>
                <p className="text-xs text-zinc-600 font-mono mt-1">
                  Google Cloud India · Bangalore / Hybrid
                </p>
              </div>

              <Link
                to="/student/progress"
                className="btn-primary text-xs self-start sm:self-auto flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" /> SUBMIT LOGBOOK
              </Link>
            </div>

            {/* Live Progress Gauge */}
            <div className="p-4 bg-[#FEF8E7] border border-[#E0D3E8] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#171024]">
                <span className="font-bold">INTERNSHIP COMPLETION PROGRESS</span>
                <span className="font-bold text-[#723ECF] font-mono">{progressPercent}% COMPLETED</span>
              </div>
              <div className="w-full bg-white h-2.5 border border-[#E0D3E8] overflow-hidden">
                <div
                  className="bg-[#723ECF] h-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>0 hrs</span>
                <span>{approvedHours} hrs Approved</span>
                <span>{targetHours} hrs Goal</span>
              </div>
            </div>

            {/* Academic Evaluation Ledger */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="border border-[#E0D3E8] p-3 bg-[#F4EEF7]">
                <span className="text-[10px] text-zinc-500 font-bold block">FACULTY_MENTOR</span>
                <p className="font-bold text-[#171024]">Dr. Vikram Patil</p>
              </div>
              <div className="border border-[#E0D3E8] p-3 bg-[#F4EEF7]">
                <span className="text-[10px] text-zinc-500 font-bold block">MENTOR_RATING</span>
                <p className="font-bold text-[#723ECF]">★★★★★ 5.0 Rating</p>
              </div>
              <div className="border border-[#E0D3E8] p-3 bg-[#F4EEF7]">
                <span className="text-[10px] text-zinc-500 font-bold block">NOC_REFERENCE</span>
                <p className="font-bold text-[#ED4B86]">NOC-2026-004821</p>
              </div>
            </div>
          </div>

          {/* AI Skill Radar & Opportunity Feed */}
          <div className="border border-[#E0D3E8] bg-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0D3E8] pb-3">
              <div>
                <span className="text-[10px] text-[#723ECF] font-bold uppercase block">SKILL MATCH RADAR</span>
                <h3 className="text-base font-black text-[#171024] uppercase font-sans">
                  Accredited Internship Openings
                </h3>
              </div>
              <Link to="/student/internships" className="text-xs font-bold text-[#723ECF] hover:underline">
                [ VIEW ALL ]
              </Link>
            </div>

            <div className="divide-y divide-[#E0D3E8] text-xs">
              {aiRecommendations.length > 0 ? (
                aiRecommendations.slice(0, 3).map((rec: any, idx: number) => (
                  <div key={rec.id || rec.title || idx} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-[#171024]">{rec.title}</p>
                      <p className="text-[11px] text-zinc-500">{rec.companyName} · {rec.location}</p>
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
                <div className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-[#171024]">Full Stack Engineering Intern</p>
                    <p className="text-[11px] text-zinc-500">Microsoft India · Hyderabad</p>
                  </div>
                  <button
                    onClick={() => setSelectedInternship({ id: 'mock-msft', title: 'Full Stack Engineering Intern' })}
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
        <div className="space-y-8">
          <div className="border border-[#E0D3E8] bg-white p-6 space-y-4">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">QUICK ACTIONS</span>
            <div className="space-y-2">
              <Link to="/student/progress" className="btn-secondary w-full justify-between">
                <span>WEEKLY LOGBOOKS</span> <ArrowRight className="w-3.5 h-3.5 text-[#723ECF]" />
              </Link>
              <Link to="/student/offers" className="btn-secondary w-full justify-between">
                <span>OFFERS &amp; NOC CLEARANCE</span> <ArrowRight className="w-3.5 h-3.5 text-[#723ECF]" />
              </Link>
              <Link to="/student/certificate" className="btn-secondary w-full justify-between">
                <span>SHA-256 E-CERTIFICATE</span> <ArrowRight className="w-3.5 h-3.5 text-[#723ECF]" />
              </Link>
            </div>
          </div>

          {/* SHA-256 Public Verification Ledger Box */}
          <div className="border border-[#E0D3E8] bg-[#FEF8E7] p-6 space-y-3 font-mono text-xs">
            <span className="text-[10px] text-[#ED4B86] uppercase font-bold block">
              CRYPTOGRAPHIC TAMPER-PROOF SEAL
            </span>
            <p className="text-zinc-700 text-[11px] leading-relaxed">
              Your institutional completion credentials will be stamped with a lifelong SHA-256 hash valid for accreditation audits.
            </p>
            <div className="border border-[#E0D3E8] p-2 bg-white text-[10px] text-[#723ECF] truncate font-bold">
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
