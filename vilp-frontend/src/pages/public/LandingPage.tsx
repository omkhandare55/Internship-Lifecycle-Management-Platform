import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Search,
  Lock,
} from 'lucide-react';
import { CommandPaletteHUD } from '@/components/CommandPaletteHUD';

// ── 7-Stage Interactive Lifecycle Pipeline ──────────────────────────────────
interface LifecycleStage {
  id: number;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  stakeholder: string;
  badge: string;
  telemetryTitle: string;
  telemetryCode: string;
  telemetryMetrics: { label: string; value: string; highlight?: boolean }[];
}

const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    id: 1,
    number: '01',
    title: 'Student KYC & Profile',
    shortDesc: 'Automated academic data sync and verified digital profile enrollment.',
    fullDesc: 'Students register with institutional email, verified mobile OTP, and academic enrollment credentials. Academic records are locked into the system ledger.',
    stakeholder: 'Student & Academic ERP',
    badge: 'KYC_ACCREDITED',
    telemetryTitle: 'STUDENT_ENROLLMENT_TELEMETRY',
    telemetryCode: 'ENROLL_RECORD(student_id) -> STATUS: ACTIVE_VERIFIED',
    telemetryMetrics: [
      { label: 'Academic Standing', value: '8.85 CGPA / 0 Backlogs', highlight: true },
      { label: 'Identity Verification', value: 'Dual-Factor OTP Verified' },
      { label: 'Eligible Credits', value: '16 Academic Units' },
    ],
  },
  {
    id: 2,
    number: '02',
    title: 'AI ATS Match & Apply',
    shortDesc: 'Groq Llama 3.3 resume match scoring and deterministic eligibility radar.',
    fullDesc: 'Ultra-low latency Groq AI analyzes candidate skill stacks against recruiter requirements, generating immediate fit scores and personalized skill-gap roadmaps.',
    stakeholder: 'Student & Groq AI Engine',
    badge: 'GROQ_AI_94%_MATCH',
    telemetryTitle: 'AI_RESONANCE_EVALUATION',
    telemetryCode: 'GROQ_LLAMA3_EVAL(resume_matrix, role_reqs) -> SCORE: 94/100',
    telemetryMetrics: [
      { label: 'Technical Fit Score', value: '94% Match Probability', highlight: true },
      { label: 'Eligibility Engine', value: '8/8 Cutoff Rules Satisfied' },
      { label: 'Inference Speed', value: '42ms (Groq Llama 3.3)' },
    ],
  },
  {
    id: 3,
    number: '03',
    title: 'Faculty Mentor Approval',
    shortDesc: 'Departmental curriculum compliance and academic safety review.',
    fullDesc: 'Designated faculty mentors review student application suitability, project alignment, and academic credit pre-requisites before corporate submission.',
    stakeholder: 'Faculty Mentor',
    badge: 'MENTOR_APPROVED',
    telemetryTitle: 'CURRICULUM_COMPLIANCE_PASS',
    telemetryCode: 'FACULTY_VERIFY(curriculum_id, credits) -> ENDORSED: TRUE',
    telemetryMetrics: [
      { label: 'Assigned Faculty', value: 'Prof. S. R. Kulkarni' },
      { label: 'Domain Approval', value: 'Distributed Systems & Cloud' },
      { label: 'Compliance Status', value: '100% AICTE §7.2 Aligned', highlight: true },
    ],
  },
  {
    id: 4,
    number: '04',
    title: 'Corporate Shortlist',
    shortDesc: 'Recruiter review, technical screening, and verified candidate selection.',
    fullDesc: 'Enterprise recruiters review accredited student portfolios with pre-verified CGPA records, conducting technical rounds directly on the platform.',
    stakeholder: 'Enterprise Recruiter',
    badge: 'CANDIDATE_SELECTED',
    telemetryTitle: 'CORPORATE_SELECTION_LEDGER',
    telemetryCode: 'CORPORATE_DECISION(applicant_id) -> RESULT: SELECTED_ROUND_3',
    telemetryMetrics: [
      { label: 'Host Enterprise', value: 'Accredited Cloud Partner' },
      { label: 'Stipend Package', value: '₹45,000 / month', highlight: true },
      { label: 'Role Profile', value: 'Cloud Systems Engineer Intern' },
    ],
  },
  {
    id: 5,
    number: '05',
    title: 'Digital Offer & Instant NOC',
    shortDesc: 'Zero-touch dual-level Dean & T&P digitally stamped No Objection Certificate.',
    fullDesc: 'Upon candidate acceptance of the digital offer letter, the institutional governance engine auto-generates a signed and stamped NOC with tamper-proof QR verification.',
    stakeholder: 'Dean & T&P Headquarters',
    badge: 'NOC_STAMPED_ACTIVE',
    telemetryTitle: 'INSTITUTIONAL_NOC_ISSUANCE',
    telemetryCode: 'MINT_NOC(offer_id, dean_key) -> NOC-2026-004821',
    telemetryMetrics: [
      { label: 'Digital NOC Code', value: 'NOC-2026-004821', highlight: true },
      { label: 'Signatory Authority', value: 'Dean Academics & T&P Head' },
      { label: 'Verification Method', value: 'Public QR Code & Cryptographic Token' },
    ],
  },
  {
    id: 6,
    number: '06',
    title: '240h Logbook Tracking',
    shortDesc: 'Weekly progress reports, mentor rubric evaluations, and hour ledger.',
    fullDesc: 'Students log structured weekly accomplishments. Faculty mentors and corporate supervisors grade on a 5-dimension rubric, accumulating hours toward the 240h target.',
    stakeholder: 'Student & Faculty Evaluator',
    badge: '240H_TARGET_MET',
    telemetryTitle: 'ATTENDANCE_HOUR_ACCUMULATOR',
    telemetryCode: 'ACCUMULATE_HOURS(logbooks) -> 240/240 HOURS VERIFIED',
    telemetryMetrics: [
      { label: 'Verified Hours', value: '240 / 240 Hours (Week 6)', highlight: true },
      { label: 'Faculty Rubric Score', value: '4.92 / 5.00 Grade Matrix' },
      { label: 'Corporate Rating', value: 'Exceeds Expectations' },
    ],
  },
  {
    id: 7,
    number: '07',
    title: 'SHA-256 e-Certificate Minting',
    shortDesc: 'Final academic accreditation with immutable public verification.',
    fullDesc: 'The platform cryptographically signs the completion certificate with SHA-256 digest hashing. Employers and universities verify authenticity with zero fail-open risk.',
    stakeholder: 'Institution & Global Verifier',
    badge: 'CERTIFICATE_SEALED',
    telemetryTitle: 'CRYPTOGRAPHIC_CERTIFICATE_VAULT',
    telemetryCode: 'SHA256(cert_id + student_number + 240h) -> VILP-2026-CSE-8841',
    telemetryMetrics: [
      { label: 'Certificate Code', value: 'VILP-2026-CSE-8841', highlight: true },
      { label: 'Cryptographic Hash', value: 'a9f4c3...88e1 (SHA-256 Immutable)' },
      { label: 'Fail-Closed Security', value: '100% Cryptographically Verified' },
    ],
  },
];

export function LandingPage() {
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [activeRoleTab, setActiveRoleTab] = useState<'STUDENT' | 'COMPANY' | 'MENTOR' | 'TNP'>('STUDENT');
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  // Auto-cycle through the lifecycle visualization if user is idle
  useEffect(() => {
    if (!isAutoCycling) return;
    const interval = setInterval(() => {
      setActiveStageId((prev) => (prev % LIFECYCLE_STAGES.length) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoCycling]);

  const activeStage = LIFECYCLE_STAGES.find((s) => s.id === activeStageId) || LIFECYCLE_STAGES[0];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#0F172A] font-mono selection:bg-[#2563EB] selection:text-white antialiased">
      {/* ── Top Status Ribbon (#0A2540 Stripe Marine) ─────────────────────────── */}
      <div className="bg-[#0A2540] border-b border-[#1E3A5F] text-[11px] text-white px-3 sm:px-8 py-2 select-none">
        <div className="container-fluid max-w-7xl mx-auto d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <span className="font-extrabold tracking-widest text-[#2563EB]">[ VILP // GHR ECOSYSTEM ]</span>
            <span className="text-slate-500">|</span>
            <span className="font-semibold text-slate-200">G H RAISONI COLLEGE OF ENGINEERING &amp; MANAGEMENT · AICTE §7.2 SPEC</span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-[#F97316] font-bold">● ZERO-TOUCH AUTO-PILOT ACTIVE</span>
          </div>
          <div className="d-flex align-items-center gap-4 text-slate-400 text-[10px]">
            <span className="text-emerald-400 font-bold">● RELATIONAL POSTGRES ACTIVE</span>
            <span className="text-slate-600">|</span>
            <span className="font-bold text-slate-200">JALGAON, MH (20.9980° N, 75.5667° E)</span>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Header ────────────────────────────────────────── */}
      <header className="border-b border-[#CBD5E1] bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-2xs">
        <div className="container-fluid max-w-7xl mx-auto px-3 sm:px-8 h-18 d-flex align-items-center justify-content-between">
          <Link to="/" className="d-flex align-items-center gap-3 text-decoration-none group">
            <div className="w-9 h-9 bg-[#0A2540] text-white d-flex align-items-center justify-center font-black text-base shadow-xs group-hover:bg-[#2563EB] transition-colors rounded-xs">
              V
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-[#0A2540] d-block font-sans">
                VILP PLATFORM
              </span>
              <span className="text-[10px] text-[#2563EB] font-mono tracking-widest uppercase d-block -mt-1 font-bold">
                Verified Lifecycle OS
              </span>
            </div>
          </Link>

          <nav className="hidden lg:d-flex align-items-center gap-7 text-xs font-mono font-bold tracking-wider text-[#0A2540]">
            <a href="#lifecycle" className="text-[#0A2540] hover:text-[#2563EB] transition-colors text-decoration-none">[ 01. LIFECYCLE ]</a>
            <a href="#ecosystem" className="text-[#0A2540] hover:text-[#2563EB] transition-colors text-decoration-none">[ 02. ECOSYSTEM ]</a>
            <a href="#features" className="text-[#0A2540] hover:text-[#2563EB] transition-colors text-decoration-none">[ 03. ENGINES ]</a>
            <a href="#analytics" className="text-[#0A2540] hover:text-[#2563EB] transition-colors text-decoration-none">[ 04. TELEMETRY ]</a>
          </nav>

          <div className="d-flex align-items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className="hidden sm:inline-flex align-items-center gap-2 px-2.5 py-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-xs text-xs text-slate-600 hover:text-[#2563EB] transition-colors font-mono cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="text-[11px] font-bold">Search</span>
              <kbd className="text-[9px] bg-white border border-slate-300 px-1 py-0.2 rounded-xs font-mono font-bold text-slate-500">⌘K</kbd>
            </button>
            <Link
              to="/auth/login"
              className="text-xs font-bold text-[#0A2540] hover:text-[#2563EB] px-2.5 py-2 transition-colors uppercase tracking-wider text-decoration-none"
            >
              Sign In
            </Link>
            <Link
              to="/auth/login"
              className="btn-primary text-decoration-none"
            >
              <span>Launch OS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── SECTION 01: Hero Spread with Interactive Lifecycle Storytelling ─ */}
      <section className="border-b border-[#CBD5E1] bg-white">
        <div className="container-fluid max-w-7xl mx-auto px-0">
          <div className="row g-0">
            {/* Left Lead Column (Col 7) */}
            <div className="col-12 col-lg-7 p-5 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-end border-[#CBD5E1] space-y-6 d-flex flex-column justify-content-between bg-white">
              <div className="space-y-5">
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 bg-[#F1F5F9] border border-[#CBD5E1] text-xs font-bold text-[#2563EB] rounded-xs">
                  <span className="w-2 h-2 bg-[#F97316]"></span>
                  <span>AUTONOMOUS ACADEMIC GOVERNANCE // 2026 SPECIFICATION</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0A2540] uppercase tracking-tighter leading-[0.94] font-sans m-0">
                  Where Academic <br />
                  <span className="text-[#2563EB]">Eligibility</span> Meets <br />
                  Certainty.
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 font-mono leading-relaxed max-w-xl m-0">
                  The institutional operating system replacing manual college internship bureaucracy with deterministic 8-rule candidate filtering, instant auto-stamped NOCs, Groq Llama 3.3 AI matching, and cryptographic SHA-256 e-Certificates.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3 pt-3">
                <Link to="/auth/login" className="btn-primary text-decoration-none">
                  <span>Launch Live System</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a href="#lifecycle" className="btn-secondary text-decoration-none">
                  <Lock className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>View Lifecycle</span>
                </a>
              </div>

              {/* Technical Footnote Specs */}
              <div className="pt-4 border-t border-[#E2E8F0] d-flex flex-wrap gap-4 text-[11px] text-slate-600">
                <div className="d-flex align-items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-[#0A2540]">Zero-Touch NOC</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-[#0A2540]">240h Logbook Ledger</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-[#0A2540]">SHA-256 Cryptographic Digest</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Lifecycle Simulator (Col 5) */}
            <div className="col-12 col-lg-5 p-5 sm:p-8 bg-[#F1F5F9] space-y-4 d-flex flex-column justify-content-between">
              <div className="space-y-3">
                <div className="d-flex align-items-center justify-content-between border-b border-[#CBD5E1] pb-2.5 text-xs">
                  <div className="d-flex align-items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse"></span>
                    <span className="font-bold text-[#2563EB]">INTERNSHIP LIFECYCLE SIMULATOR</span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#0A2540] text-white font-bold text-[10px] rounded-xs font-mono">
                    STAGE {activeStage.number} / 07
                  </span>
                </div>

                {/* Stage Title Card */}
                <div className="border border-[#CBD5E1] p-3.5 bg-white space-y-1.5 rounded-xs">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{activeStage.stakeholder}</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 border border-emerald-200 rounded-xs">
                      {activeStage.badge}
                    </span>
                  </div>
                  <h3 className="font-black text-[#0A2540] font-sans text-base m-0">
                    {activeStage.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 font-mono leading-relaxed m-0">
                    {activeStage.fullDesc}
                  </p>
                </div>

                {/* Active Stage Live Telemetry Box */}
                <div className="border border-[#0A2540] bg-[#0A2540] text-white p-3.5 rounded-xs font-mono text-[11px] space-y-2.5 shadow-xs">
                  <div className="d-flex justify-content-between text-[10px] text-slate-400 border-b border-white/10 pb-1.5">
                    <span>{activeStage.telemetryTitle}</span>
                    <span className="text-emerald-400 font-bold">● ACTIVE</span>
                  </div>
                  <div className="text-[#F97316] font-bold truncate">
                    <code>&gt; {activeStage.telemetryCode}</code>
                  </div>
                  <div className="space-y-1 pt-1">
                    {activeStage.telemetryMetrics.map((m, idx) => (
                      <div key={idx} className="d-flex justify-content-between text-[10px]">
                        <span className="text-slate-300">{m.label}:</span>
                        <span className={m.highlight ? 'text-emerald-400 font-bold' : 'text-white'}>
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Step Switchers */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider d-block">
                  Simulate Lifecycle Step:
                </span>
                <div className="d-flex gap-1.5 flex-wrap">
                  {LIFECYCLE_STAGES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setActiveStageId(s.id);
                        setIsAutoCycling(false);
                      }}
                      className={`px-2.5 py-1.5 text-[11px] font-bold border transition-all rounded-xs cursor-pointer ${
                        activeStageId === s.id
                          ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                          : 'bg-white border-[#CBD5E1] text-[#0A2540] hover:bg-[#F8FAFC]'
                      }`}
                      title={s.title}
                    >
                      [ {s.number} ]
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 02: STAKEHOLDER ECOSYSTEM (4 SPECIALIZED PORTALS) ──────── */}
      <section id="ecosystem" className="border-b border-[#CBD5E1] bg-[#F1F5F9]">
        <div className="container-fluid max-w-7xl mx-auto border-x border-[#CBD5E1] p-0">
          <div className="p-4 sm:p-8 border-b border-[#CBD5E1] d-flex flex-wrap align-items-center justify-content-between gap-4 bg-white">
            <div>
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider d-block">
                SECTION 02 // STAKEHOLDER MATRIX
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-[#0A2540] uppercase font-sans m-0">
                One Platform. 4 Specialized Portals.
              </h2>
            </div>
            <div className="d-flex flex-wrap gap-2 text-xs">
              {(['STUDENT', 'COMPANY', 'MENTOR', 'TNP'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveRoleTab(role)}
                  className={`px-3.5 py-1.5 border transition-all rounded-xs cursor-pointer font-bold ${
                    activeRoleTab === role
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-white border-[#CBD5E1] text-[#0A2540] hover:bg-[#F8FAFC]'
                  }`}
                >
                  [ {role} ]
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-10 bg-white">
            {activeRoleTab === 'STUDENT' && (
              <div className="row g-4 align-items-start">
                <div className="col-12 col-lg-6 space-y-3.5">
                  <span className="text-[10px] font-bold text-[#2563EB] bg-[#F8FAFC] border border-[#CBD5E1] px-2.5 py-1 rounded-xs d-inline-block">
                    ROLE_01 // STUDENT EXPERIENCE
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0A2540] font-sans uppercase m-0">
                    Career Radar &amp; Attendance Gauge
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed m-0">
                    Undergraduates evaluate internship eligibility mathematically, track approved hours towards their 240-hour requirement, and download verified certificates.
                  </p>
                  <div className="border border-[#CBD5E1] divide-y divide-[#E2E8F0] text-xs rounded-xs">
                    <div className="p-2.5 d-flex justify-content-between">
                      <span className="text-slate-500">Eligibility Engine:</span>
                      <span className="font-bold text-[#0A2540]">Deterministic 8-Rule Evaluator</span>
                    </div>
                    <div className="p-2.5 d-flex justify-content-between">
                      <span className="text-slate-500">Attendance Telemetry:</span>
                      <span className="font-bold text-[#0A2540]">240-Hour Logbook Accumulator</span>
                    </div>
                    <div className="p-2.5 d-flex justify-content-between">
                      <span className="text-slate-500">Credential Minting:</span>
                      <span className="font-bold text-[#2563EB]">SHA-256 Tamper-Proof e-Certs</span>
                    </div>
                  </div>
                  <Link to="/auth/login" className="btn-primary text-decoration-none mt-2">
                    ACCESS STUDENT PORTAL →
                  </Link>
                </div>

                <div className="col-12 col-lg-6 border border-[#CBD5E1] bg-[#F8FAFC] p-4 sm:p-5 space-y-3 font-mono text-xs rounded-xs">
                  <div className="border-b border-[#CBD5E1] pb-2 d-flex justify-content-between text-slate-500">
                    <span>RECORD: 2022CS1045</span>
                    <span className="text-[#F97316] font-bold">KYC_VERIFIED</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#0A2540] font-black font-sans text-sm m-0">Aarav Sharma · Computer Science</p>
                    <p className="text-slate-600 m-0">CGPA: 8.85 · Active Backlogs: 0</p>
                    <p className="text-slate-600 m-0">Host: Google Cloud India</p>
                    <p className="text-slate-600 m-0">Hours Logged: 240 / 240 hrs (Week 6)</p>
                  </div>
                  <div className="border border-[#CBD5E1] p-2.5 text-[11px] text-[#2563EB] bg-white font-bold rounded-xs">
                    STATUS: SELECTED · NOC-2026-004821 (ISSUED)
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'COMPANY' && (
              <div className="row g-4 align-items-start">
                <div className="col-12 col-lg-6 space-y-3.5">
                  <span className="text-[10px] font-bold text-[#2563EB] bg-[#F8FAFC] border border-[#CBD5E1] px-2.5 py-1 rounded-xs d-inline-block">
                    ROLE_02 // CORPORATE RECRUITER
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0A2540] font-sans uppercase m-0">
                    Accredited Candidate Discovery
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed m-0">
                    Recruiters post verified internships, screen candidates with pre-verified academic data, and extend digital offer letters that auto-trigger institutional NOC clearance.
                  </p>
                  <div className="border border-[#CBD5E1] divide-y divide-[#E2E8F0] text-xs rounded-xs">
                    <div className="p-2.5 d-flex justify-content-between">
                      <span className="text-slate-500">Candidate Pool:</span>
                      <span className="font-bold text-[#0A2540]">100% Pre-Verified Academic Standing</span>
                    </div>
                    <div className="p-2.5 d-flex justify-content-between">
                      <span className="text-slate-500">Offer Clearance:</span>
                      <span className="font-bold text-[#2563EB]">1-Click Digital Offer Letters</span>
                    </div>
                  </div>
                  <Link to="/auth/login" className="btn-primary text-decoration-none mt-2">
                    ACCESS RECRUITER PORTAL →
                  </Link>
                </div>

                <div className="col-12 col-lg-6 border border-[#CBD5E1] bg-[#F8FAFC] p-4 sm:p-5 space-y-3 font-mono text-xs rounded-xs">
                  <div className="border-b border-[#CBD5E1] pb-2 d-flex justify-content-between text-slate-500">
                    <span>HOST: GOOGLE CLOUD INDIA</span>
                    <span className="text-emerald-700 font-bold">RECRUITER_ACCREDITED</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#0A2540] font-black font-sans text-sm m-0">Cloud Engineering Intern (4 Positions)</p>
                    <p className="text-slate-600 m-0">Stipend: ₹45,000 / month · 24 Total Applicants</p>
                    <p className="text-slate-600 m-0">Cutoff: 8.00 CGPA · 0 Backlogs Required</p>
                  </div>
                  <div className="border border-[#CBD5E1] p-2.5 text-[11px] text-[#0A2540] bg-white font-bold rounded-xs">
                    SELECTION RATE: 100% VERIFIED CANDIDATES
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'MENTOR' && (
              <div className="row g-4 align-items-start">
                <div className="col-12 col-lg-6 space-y-3.5">
                  <span className="text-[10px] font-bold text-[#2563EB] bg-[#F8FAFC] border border-[#CBD5E1] px-2.5 py-1 rounded-xs d-inline-block">
                    ROLE_03 // FACULTY MENTORS
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0A2540] font-sans uppercase m-0">
                    Weekly Logbook &amp; Rubric Scoring
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed m-0">
                    Faculty mentors evaluate student weekly reports, verify industrial competencies, and submit standardized 5-dimension grading rubrics.
                  </p>
                  <div className="border border-[#CBD5E1] divide-y divide-[#E2E8F0] text-xs rounded-xs">
                    <div className="p-2.5 d-flex justify-content-between">
                      <span className="text-slate-500">Rubric Dimensions:</span>
                      <span className="font-bold text-[#0A2540]">5 Accredited Competency Matrices</span>
                    </div>
                    <div className="p-2.5 d-flex justify-content-between">
                      <span className="text-slate-500">Review SLA:</span>
                      <span className="font-bold text-[#2563EB]">Weekly Verified Hour Sign-off</span>
                    </div>
                  </div>
                  <Link to="/auth/login" className="btn-primary text-decoration-none mt-2">
                    ACCESS MENTOR PORTAL →
                  </Link>
                </div>

                <div className="col-12 col-lg-6 border border-[#CBD5E1] bg-[#F8FAFC] p-4 sm:p-5 space-y-3 font-mono text-xs rounded-xs">
                  <div className="border-b border-[#CBD5E1] pb-2 d-flex justify-content-between text-slate-500">
                    <span>MENTOR_QUEUE: CSE-DEPT</span>
                    <span className="text-[#2563EB] font-bold">12 PENDING REVIEWS</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#0A2540] font-black font-sans text-sm m-0">Week 6 Report · Aarav Sharma</p>
                    <p className="text-slate-600 m-0">Hours Submitted: 40 Hours (Total: 240 / 240)</p>
                    <p className="text-slate-600 m-0">Evaluation Grade: 4.92 / 5.00 (Exemplary)</p>
                  </div>
                  <div className="border border-[#CBD5E1] p-2.5 text-[11px] text-emerald-700 bg-emerald-50 font-bold rounded-xs">
                    STATUS: APPROVED &amp; ACCUMULATED
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'TNP' && (
              <div className="row g-4 align-items-start">
                <div className="col-12 col-lg-6 space-y-3.5">
                  <span className="text-[10px] font-bold text-[#2563EB] bg-[#F8FAFC] border border-[#CBD5E1] px-2.5 py-1 rounded-xs d-inline-block">
                    ROLE_04 // PLACEMENT HEADQUARTERS
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0A2540] font-sans uppercase m-0">
                    Zero-Touch Auto-Pilot Governance
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed m-0">
                    College Placement Officers eliminate manual paper approvals. Eligible candidates accepting offers receive instantly stamped institutional NOCs.
                  </p>
                  <div className="border border-[#CBD5E1] divide-y divide-[#E2E8F0] text-xs rounded-xs">
                    <div className="p-2.5 d-flex justify-content-between">
                      <span className="text-slate-500">Placement Rate:</span>
                      <span className="text-[#2563EB] font-bold font-mono">95.2% Verified Pool</span>
                    </div>
                    <div className="p-2.5 d-flex justify-content-between">
                      <span className="text-slate-500">Average Package:</span>
                      <span className="text-[#0A2540] font-bold font-mono">9.85 LPA CTC</span>
                    </div>
                    <div className="p-2.5 d-flex justify-content-between">
                      <span className="text-slate-500">Auto-Pilot Mode:</span>
                      <span className="text-[#F97316] font-bold">100% ACTIVE (0 Manual Work)</span>
                    </div>
                  </div>
                  <Link to="/auth/login" className="btn-primary text-decoration-none mt-2">
                    ACCESS T&amp;P PORTAL →
                  </Link>
                </div>

                <div className="col-12 col-lg-6 border border-[#CBD5E1] bg-[#F8FAFC] p-4 sm:p-5 space-y-3 font-mono text-xs rounded-xs">
                  <div className="border-b border-[#CBD5E1] pb-2 d-flex justify-content-between text-slate-500">
                    <span>GOVERNANCE_LEDGER</span>
                    <span className="text-[#2563EB] font-bold">AUTO_PILOT_ON</span>
                  </div>
                  <div className="row g-2 text-center">
                    <div className="col-6">
                      <div className="border border-[#CBD5E1] p-3 bg-white rounded-xs">
                        <span className="text-[10px] text-slate-500 font-bold d-block">PLACEMENT_RATE</span>
                        <p className="text-xl font-black text-[#2563EB] font-mono mt-1 m-0">95.2%</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="border border-[#CBD5E1] p-3 bg-white rounded-xs">
                        <span className="text-[10px] text-slate-500 font-bold d-block">AVG_CTC</span>
                        <p className="text-xl font-black text-[#0A2540] font-mono mt-1 m-0">9.85 LPA</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SECTION 03: VERIFIED 7-STEP TIMELINE GRID ─────────────────────── */}
      <section id="lifecycle" className="border-b border-[#CBD5E1] bg-white">
        <div className="container-fluid max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
          <div className="mb-10 space-y-2">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider d-block">
              SECTION 03 // END-TO-END WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0A2540] uppercase font-sans m-0">
              The 7-Step Verified Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-mono m-0 max-w-2xl">
              Every phase is deterministically validated by multi-party digital signatures and academic policy constraints.
            </p>
          </div>

          <div className="row g-3 sm:g-4">
            {LIFECYCLE_STAGES.map((stage) => (
              <div key={stage.id} className="col-12 col-md-6 col-lg-4">
                <div className="editorial-card h-100 d-flex flex-column justify-content-between space-y-3">
                  <div className="space-y-2">
                    <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
                      <span className="font-bold text-[#0A2540]">STEP_{stage.number}</span>
                      <span className="text-[#2563EB] font-bold">[ {stage.number} ]</span>
                    </div>
                    <h3 className="text-base font-black text-[#0A2540] font-sans uppercase m-0">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed m-0">
                      {stage.shortDesc}
                    </p>
                  </div>
                  <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFC] text-[10px] text-[#2563EB] font-mono rounded-xs">
                    <code>STAKEHOLDER: {stage.stakeholder}</code>
                  </div>
                </div>
              </div>
            ))}

            {/* 8th Card: Launch Callout */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="border border-[#0A2540] bg-[#0A2540] text-white p-5 rounded-xs h-100 d-flex flex-column justify-content-between space-y-3">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#F97316] uppercase font-mono d-block">
                    INSTITUTIONAL DEPLOYMENT
                  </span>
                  <h3 className="text-lg font-black text-white font-sans uppercase m-0">
                    Deploy Zero-Touch Governance
                  </h3>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed m-0">
                    Connect university cohorts to automated placement governance.
                  </p>
                </div>
                <Link to="/auth/login" className="btn-primary bg-[#2563EB] text-white text-decoration-none text-center">
                  <span>Launch Portal Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 04: CORE ARCHITECTURAL ENGINES ────────────────────────── */}
      <section id="features" className="border-b border-[#CBD5E1] bg-[#F1F5F9]">
        <div className="container-fluid max-w-7xl mx-auto border-x border-[#CBD5E1] p-0">
          <div className="p-4 sm:p-8 border-b border-[#CBD5E1] bg-white">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider d-block">
              SECTION 04 // ENTERPRISE ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0A2540] uppercase font-sans m-0">
              Deterministic Engines. Zero Compromise.
            </h2>
          </div>

          <div className="row g-0 bg-white">
            {/* Engine 1 */}
            <div className="col-12 col-md-6 p-6 sm:p-8 border-b md:border-end border-[#CBD5E1] space-y-3 hover:bg-[#F8FAFC] transition-colors">
              <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
                <span className="font-bold text-[#0A2540]">ENGINE_01</span>
                <span className="text-[#2563EB] font-bold">[ 01 ]</span>
              </div>
              <h3 className="text-base font-black text-[#0A2540] font-sans uppercase m-0">
                SHA-256 Vault &amp; Fail-Closed Verifier
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                Every institutional NOC and certificate is sealed with an immutable cryptographic digest for instant public verification without student PII leakage.
              </p>
              <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFC] text-[10px] text-[#F97316] font-mono truncate rounded-xs">
                <code>SHA256(noc_id + student + timestamp)</code>
              </div>
            </div>

            {/* Engine 2 */}
            <div className="col-12 col-md-6 p-6 sm:p-8 border-b border-[#CBD5E1] space-y-3 hover:bg-[#F8FAFC] transition-colors">
              <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
                <span className="font-bold text-[#0A2540]">ENGINE_02</span>
                <span className="text-[#2563EB] font-bold">[ 02 ]</span>
              </div>
              <h3 className="text-base font-black text-[#0A2540] font-sans uppercase m-0">
                Deterministic 8-Rule Eligibility Radar
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                Eliminates recruiter bias with hardcoded academic cutoff rules (CGPA, active backlogs, departmental branch restrictions, and prerequisite credit hours).
              </p>
              <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFC] text-[10px] text-[#2563EB] font-mono rounded-xs">
                <code>EVALUATE(cgpa &gt;= min_cutoff &amp;&amp; backlogs == 0)</code>
              </div>
            </div>

            {/* Engine 3 */}
            <div className="col-12 col-md-6 p-6 sm:p-8 border-b md:border-b-0 md:border-end border-[#CBD5E1] space-y-3 hover:bg-[#F8FAFC] transition-colors">
              <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
                <span className="font-bold text-[#0A2540]">ENGINE_03</span>
                <span className="text-[#2563EB] font-bold">[ 03 ]</span>
              </div>
              <h3 className="text-base font-black text-[#0A2540] font-sans uppercase m-0">
                Groq Llama 3.3 AI Career Advisor
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                Real-time ATS resume keyword extraction, role resonance scoring, and personalized skill-gap roadmaps executed at 42ms inference speed.
              </p>
              <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFC] text-[10px] text-[#2563EB] font-mono rounded-xs">
                <code>GROQ_INFERENCE(model: &quot;llama-3.3-70b-versatile&quot;)</code>
              </div>
            </div>

            {/* Engine 4 */}
            <div className="col-12 col-md-6 p-6 sm:p-8 space-y-3 hover:bg-[#F8FAFC] transition-colors">
              <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
                <span className="font-bold text-[#0A2540]">ENGINE_04</span>
                <span className="text-[#2563EB] font-bold">[ 04 ]</span>
              </div>
              <h3 className="text-base font-black text-[#0A2540] font-sans uppercase m-0">
                PostgreSQL ACID &amp; Firebase Storage
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                22 relational tables with foreign keys and ACID transaction guarantees protect academic records, complemented by Firebase Cloud Storage for high-speed resume and KYC PDF vaulting.
              </p>
              <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFC] text-[10px] text-[#F97316] font-mono truncate rounded-xs">
                <code>POSTGRES_ACID + FIREBASE_STORAGE_VAULT</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 05: INSTITUTIONAL TELEMETRY & KPIS ────────────────────── */}
      <section id="analytics" className="border-b border-[#CBD5E1] bg-white">
        <div className="container-fluid max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
          <div className="mb-10 space-y-2">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider d-block">
              SECTION 05 // INSTITUTIONAL TELEMETRY
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0A2540] uppercase font-sans m-0">
              Placement Intelligence &amp; Vitals
            </h2>
          </div>

          <div className="row g-3 sm:g-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="editorial-card p-5 text-center space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">CONVERSION_RATE</span>
                <div className="text-3xl font-black text-[#2563EB] font-mono">95.2%</div>
                <span className="text-[11px] text-emerald-700 font-bold">Verified Student Pool</span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="editorial-card p-5 text-center space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">AVERAGE_CTC</span>
                <div className="text-3xl font-black text-[#0A2540] font-mono">9.85 <span className="text-base text-[#2563EB]">LPA</span></div>
                <span className="text-[11px] text-[#0A2540] font-bold">Top Engineering Recruiters</span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="editorial-card p-5 text-center space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">ATTENDANCE_HOURS</span>
                <div className="text-3xl font-black text-[#0A2540] font-mono">240+ <span className="text-base text-[#F97316]">Hrs</span></div>
                <span className="text-[11px] text-emerald-700 font-bold">100% Mentor-Verified</span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="editorial-card p-5 text-center space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">NOC_CLEARANCE</span>
                <div className="text-3xl font-black text-[#0A2540] font-mono">&lt;10 <span className="text-base text-[#2563EB]">Sec</span></div>
                <span className="text-[11px] text-[#2563EB] font-bold">Zero Paper Bureaucracy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 07: FINAL CONVERSION CALLOUT ──────────────────────────── */}
      <section className="bg-[#0A2540] text-white py-14 sm:py-18 border-b border-[#1E3A5F]">
        <div className="container-fluid max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <span className="text-xs font-bold text-[#F97316] uppercase font-mono tracking-widest d-block">
            // INSTITUTIONAL DEPLOYMENT 2026 //
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-sans tracking-tight m-0">
            Deploy Zero-Touch <br />
            <span className="text-[#2563EB]">Internship Governance</span> Today.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-xl mx-auto leading-relaxed m-0">
            Join students, companies, faculty mentors, and institutional placement teams operating on a single verified platform.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3 pt-2">
            <Link to="/auth/login" className="btn-primary text-decoration-none">
              <span>Launch Live System</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/auth/login" className="btn-secondary text-decoration-none">
              <span>Sign In with Institutional ID</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-[#061826] text-slate-400 text-xs py-10 border-t border-[#1E3A5F]">
        <div className="container-fluid max-w-7xl mx-auto px-4 sm:px-8">
          <div className="row g-4 justify-content-between align-items-center border-b border-white/10 pb-6 mb-6">
            <div className="col-12 col-md-6 space-y-1.5">
              <div className="d-flex align-items-center gap-2.5">
                <div className="w-7 h-7 bg-[#2563EB] text-white d-flex align-items-center justify-center font-black text-xs rounded-xs">
                  V
                </div>
                <span className="font-black text-sm text-white tracking-tight font-sans">VILP PLATFORM</span>
              </div>
              <p className="text-slate-400 text-[11px] font-mono leading-relaxed max-w-md m-0">
                Verified Internship Lifecycle Platform · Built for G H Raisoni College of Engineering &amp; Management in accordance with AICTE §7.2 specifications.
              </p>
            </div>

            <div className="col-12 col-md-6 d-flex flex-wrap gap-4 justify-content-md-end text-[11px] font-bold font-mono">
              <a href="#lifecycle" className="text-slate-300 hover:text-[#2563EB] text-decoration-none">[ Lifecycle ]</a>
              <a href="#ecosystem" className="text-slate-300 hover:text-[#2563EB] text-decoration-none">[ Ecosystem ]</a>
              <a href="#features" className="text-slate-300 hover:text-[#2563EB] text-decoration-none">[ Engines ]</a>
              <a href="#verifier" className="text-slate-300 hover:text-[#2563EB] text-decoration-none">[ Verifier ]</a>
              <Link to="/privacy" className="text-slate-300 hover:text-[#2563EB] text-decoration-none">[ Privacy ]</Link>
              <Link to="/terms" className="text-slate-300 hover:text-[#2563EB] text-decoration-none">[ Terms ]</Link>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 text-[10px] text-slate-500 font-mono">
            <div>
              © 2026 Verified Internship Lifecycle Platform (VILP). All rights reserved.
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400">All Systems Operational (PostgreSQL 16 + Groq Llama 3.3)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Keyboard Shortcut Palette HUD */}
      <CommandPaletteHUD />
    </div>
  );
}
