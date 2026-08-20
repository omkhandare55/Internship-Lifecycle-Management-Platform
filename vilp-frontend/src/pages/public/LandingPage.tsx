import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Search } from 'lucide-react';
import { CommandPaletteHUD } from '@/components/CommandPaletteHUD';

export function LandingPage() {
  const [activeRoleTab, setActiveRoleTab] = useState<'STUDENT' | 'TNP' | 'COMPANY' | 'MENTOR'>('STUDENT');
  const [verificationCode, setVerificationCode] = useState('');

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;
    window.open(`/verify/noc/${encodeURIComponent(verificationCode.trim())}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-mono selection:bg-[#2563EB] selection:text-white antialiased">
      {/* ── Status Ribbon (#0A2540 Stripe Marine) ─────────────────────────── */}
      <div className="bg-[#0A2540] border-b border-[#1E3A5F] text-[11px] text-white px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-3">
          <span className="font-extrabold tracking-widest text-[#2563EB]">[ VILP // OS ]</span>
          <span className="text-slate-600">|</span>
          <span className="font-semibold text-slate-200">ISSUE NO. 26 · AICTE/UGC GOVERNANCE SPECIFICATION</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-[#F97316] font-bold">● ZERO-TOUCH AUTO-PILOT ACTIVE</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 text-[10px]">
          <span>TELEMETRY: LIVE</span>
          <span className="text-slate-600">|</span>
          <span className="font-bold text-slate-200">PUNE, INDIA (18.5204° N)</span>
        </div>
      </div>

      {/* ── Main Navigation Header ────────────────────────────────────────── */}
      <header className="border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#0A2540] text-white flex items-center justify-center font-black text-base shadow-xs group-hover:bg-[#2563EB] transition-colors rounded-xs">
              V
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-[#0A2540] block font-sans">
                VILP PLATFORM
              </span>
              <span className="text-[10px] text-[#2563EB] font-mono tracking-widest uppercase block -mt-1 font-bold">
                Verified Lifecycle
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-mono font-bold tracking-wider text-[#0A2540]">
            <a href="#manifesto" className="hover:text-[#2563EB] transition-colors">[ 01. MANIFESTO ]</a>
            <a href="#engines" className="hover:text-[#2563EB] transition-colors">[ 02. ARCHITECTURE ]</a>
            <a href="#blueprint" className="hover:text-[#2563EB] transition-colors">[ 03. ECOSYSTEM ]</a>
            <a href="#verifier" className="hover:text-[#2563EB] transition-colors">[ 04. CRYPTO VAULT ]</a>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
              }}
              className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-full text-xs text-slate-600 hover:text-[#2563EB] transition-colors font-mono cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="text-[11px] font-bold">Search</span>
              <kbd className="text-[9px] bg-white border border-slate-300 px-1 py-0.2 rounded-xs font-mono font-bold text-slate-500">⌘K</kbd>
            </button>
            <Link
              to="/auth/login"
              className="text-xs font-bold text-[#0A2540] hover:text-[#2563EB] px-2.5 py-2 transition-colors uppercase tracking-wider"
            >
              Sign In
            </Link>
            <Link
              to="/auth/login"
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-mono font-bold transition-all shadow-xs flex items-center gap-2 uppercase tracking-wider active:scale-95 rounded-xs"
            >
              <span>Launch OS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── SECTION 01: Hero Spread ───────────────────────────────────────── */}
      <section className="border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Left Lead Column (Span 7) */}
          <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#E2E8F0] space-y-8 flex flex-col justify-between bg-white">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F1F5F9] border border-[#CBD5E1] text-xs font-bold text-[#2563EB] rounded-xs">
                <span className="w-2 h-2 bg-[#F97316]"></span>
                <span>AUTONOMOUS ACADEMIC GOVERNANCE // 2026 SPECIFICATION</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A2540] uppercase tracking-tighter leading-[0.92] font-sans">
                Where Academic <br />
                <span className="text-[#2563EB]">Eligibility</span> Meets <br />
                Certainty.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-mono leading-relaxed max-w-xl">
                The institutional operating system replacing manual college placement bureaucracy with deterministic 8-rule candidate filtering, instant auto-stamped NOCs, and cryptographic SHA-256 e-Certificates.
              </p>
            </div>

            {/* Primary Triggers */}
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/auth/login"
                className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold font-mono px-7 py-3.5 flex items-center gap-2.5 tracking-wider uppercase transition-all shadow-xs active:scale-95 rounded-xs"
              >
                <span>Launch Live System</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#verifier"
                className="bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0A2540] border border-[#CBD5E1] text-xs font-bold font-mono px-7 py-3.5 flex items-center gap-2.5 tracking-wider uppercase transition-all active:scale-95 rounded-xs"
              >
                <Lock className="w-4 h-4 text-[#F97316]" />
                <span>Verify Credential</span>
              </a>
            </div>
          </div>

          {/* Right Lead Ledger (Span 5) in Subtle Slate #F1F5F9 */}
          <div className="lg:col-span-5 p-6 sm:p-10 bg-[#F1F5F9] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3 text-xs">
                <span className="font-bold text-[#2563EB]">LIVE CANDIDATE TELEMETRY</span>
                <span className="px-2 py-0.5 bg-[#F97316] text-white font-bold text-[10px] rounded-xs">
                  KYC ACCREDITED
                </span>
              </div>

              {/* Data Rows */}
              <div className="space-y-3 text-xs">
                <div className="border border-[#E2E8F0] p-3.5 bg-white space-y-1 rounded-xs">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">CANDIDATE_RECORD</span>
                  <p className="font-black text-[#0A2540] font-sans text-sm">Verified Candidate · Academic ID: REG-2026-001</p>
                  <p className="text-[11px] text-[#2563EB] font-bold">CGPA: 8.85 / 10.00 · 0 Active Backlogs</p>
                </div>

                <div className="border border-[#E2E8F0] p-3.5 bg-white space-y-1 rounded-xs">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">HOST_ORGANIZATION</span>
                  <p className="font-black text-[#0A2540] font-sans text-sm">Accredited Enterprise Partner</p>
                  <p className="text-[11px] text-slate-600">Cloud Engineering &amp; Distributed Systems</p>
                </div>

                <div className="border border-[#E2E8F0] p-3.5 bg-white space-y-1 rounded-xs">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">ATTENDANCE_ACCUMULATOR</span>
                  <p className="font-bold text-[#0A2540]">160 / 240 Approved Hours (67%)</p>
                  <div className="w-full bg-[#F1F5F9] h-2 border border-[#CBD5E1] mt-1.5 overflow-hidden rounded-full">
                    <div className="bg-[#2563EB] h-full w-2/3"></div>
                  </div>
                </div>

                <div className="border border-[#E2E8F0] p-3.5 bg-white space-y-1 rounded-xs">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">INSTITUTIONAL_NOC</span>
                  <p className="font-mono font-bold text-[#F97316]">NOC-2026-004821</p>
                  <p className="text-[10px] text-slate-500">Auto-Stamped with SHA-256 Tamper-Proof Seal</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#CBD5E1] pt-4 text-[10px] text-slate-500 flex justify-between">
              <span>SECURITY: SHA-256 HASHED</span>
              <span>NODE: VILP-IN-WEST-1</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 02: Manifesto & Transformation Grid ───────────────────── */}
      <section id="manifesto" className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto border-x border-[#E2E8F0]">
          <div className="p-6 sm:p-12 border-b border-[#E2E8F0] space-y-4">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">
              SECTION 01 // THE MANIFESTO
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0A2540] uppercase font-sans tracking-tight leading-[0.96]">
              From Manual Paperwork Chaos <br />
              to Deterministic Governance.
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Every academic semester, college placement cells waste thousands of hours cross-referencing marksheets, managing student offer hoards, and signing paper NOC certificates. VILP brings mathematical discipline and zero manual paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
            {/* The Legacy Way */}
            <div className="p-6 sm:p-10 space-y-4 bg-white/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase">LEGACY OPERATIONS</span>
                <span className="text-[#F97316] font-bold">[ VULNERABLE ]</span>
              </div>
              <h3 className="text-xl font-black text-[#0A2540] font-sans uppercase">
                The 100,000-Hour Bureaucracy Bottleneck
              </h3>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#F97316] font-bold">✕</span>
                  <span>Students hoard multiple simultaneous job offers, abandoning recruiters on day one.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#F97316] font-bold">✕</span>
                  <span>Placement officers manually inspect backlogs, passing years, and branch eligibility.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#F97316] font-bold">✕</span>
                  <span>Paper logbooks and certificates are easily forged, failing accreditation audits.</span>
                </li>
              </ul>
            </div>

            {/* The VILP Way */}
            <div className="p-6 sm:p-10 space-y-4 bg-white">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#2563EB] font-bold uppercase">VILP PROTOCOL</span>
                <span className="text-[#2563EB] font-bold">[ 100% DETERMINISTIC ]</span>
              </div>
              <h3 className="text-xl font-black text-[#0A2540] font-sans uppercase">
                Autonomous Cryptographic Architecture
              </h3>
              <ul className="space-y-3 text-xs text-slate-800">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span><strong>Single-Active Mutex Lock:</strong> Accepting an offer automatically withdraws all other applications across the university.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span><strong>8-Rule Deterministic Screening:</strong> Mathematical evaluation of CGPA, backlogs, branch, and KYC.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2563EB] font-bold">✓</span>
                  <span><strong>SHA-256 Digital Verification:</strong> Lifelong public QR validation for every issued NOC and degree credit e-Certificate.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 03: The 4 Core Architectural Engines ──────────────────── */}
      <section id="engines" className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto border-x border-[#E2E8F0]">
          <div className="p-6 sm:p-10 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">
                SECTION 02 // TECHNICAL BLUEPRINT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540] uppercase font-sans">
                The 4 Deterministic Platform Engines
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500 font-mono">PURE MATHEMATICAL LOGIC</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0] bg-white">
            {/* Engine 1 */}
            <div className="p-6 sm:p-8 space-y-3 hover:bg-[#F8FAFC] transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold">ENGINE_01</span>
                <span className="text-[#2563EB] font-bold">[ 01 ]</span>
              </div>
              <h3 className="text-base font-black text-[#0A2540] font-sans uppercase">
                8-Rule Evaluator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic mathematical scoring evaluating CGPA, backlogs, branch match, and KYC before application submission.
              </p>
              <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFC] text-[10px] text-[#2563EB] font-mono rounded-xs">
                <code>IF (cgpa &gt;= cutoff &amp;&amp; backlogs == 0)</code>
              </div>
            </div>

            {/* Engine 2 */}
            <div className="p-6 sm:p-8 space-y-3 hover:bg-[#F8FAFC] transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold">ENGINE_02</span>
                <span className="text-[#2563EB] font-bold">[ 02 ]</span>
              </div>
              <h3 className="text-base font-black text-[#0A2540] font-sans uppercase">
                Single-Active Mutex
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prevents candidate hoarding and job abandonment. Accepting an offer locks candidate status and cleanses queues.
              </p>
              <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFC] text-[10px] text-[#2563EB] font-mono rounded-xs">
                <code>LOCK(student_id) -&gt; WITHDRAW(all)</code>
              </div>
            </div>

            {/* Engine 3 */}
            <div className="p-6 sm:p-8 space-y-3 hover:bg-[#F8FAFC] transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold">ENGINE_03</span>
                <span className="text-[#2563EB] font-bold">[ 03 ]</span>
              </div>
              <h3 className="text-base font-black text-[#0A2540] font-sans uppercase">
                240h Attendance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Weekly logbook tracker with faculty mentor 5-dimension grading matrices and approved hour accumulator.
              </p>
              <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFC] text-[10px] text-[#2563EB] font-mono rounded-xs">
                <code>ACCUMULATE(hours) &gt;= 240 -&gt; MINT_CERT</code>
              </div>
            </div>

            {/* Engine 4 */}
            <div className="p-6 sm:p-8 space-y-3 hover:bg-[#F8FAFC] transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold">ENGINE_04</span>
                <span className="text-[#2563EB] font-bold">[ 04 ]</span>
              </div>
              <h3 className="text-base font-black text-[#0A2540] font-sans uppercase">
                SHA-256 Vault
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every institutional NOC and certificate is sealed with an immutable cryptographic digest for public verification.
              </p>
              <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFC] text-[10px] text-[#F97316] font-mono truncate rounded-xs">
                <code>SHA256(noc_id + student + timestamp)</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 04: Interactive Role Blueprint Ecosystem ──────────────── */}
      <section id="blueprint" className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto border-x border-[#E2E8F0]">
          <div className="p-6 sm:p-10 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">
                SECTION 03 // STAKEHOLDER MATRIX
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540] uppercase font-sans">
                One Platform. 4 Specialized Portals.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {(['STUDENT', 'TNP', 'COMPANY', 'MENTOR'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRoleTab(role)}
                  className={`px-4 py-2 border transition-all rounded-xs cursor-pointer ${
                    activeRoleTab === role
                      ? 'bg-[#2563EB] text-white border-[#2563EB] font-bold'
                      : 'bg-white border-[#CBD5E1] text-[#0A2540] hover:bg-[#F8FAFC]'
                  }`}
                >
                  [ {role} ]
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-12 bg-white">
            {activeRoleTab === 'STUDENT' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                <div className="lg:col-span-6 space-y-4">
                  <span className="text-[10px] font-bold text-[#2563EB] bg-[#F8FAFC] border border-[#CBD5E1] px-2.5 py-1 rounded-xs">
                    ROLE_01 // STUDENT EXPERIENCE
                  </span>
                  <h3 className="text-2xl font-black text-[#0A2540] font-sans uppercase">
                    Career Radar &amp; Attendance Gauge
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Undergraduates evaluate internship eligibility mathematically, track approved hours towards their 240-hour requirement, and download verified certificates.
                  </p>
                  <div className="border border-[#E2E8F0] divide-y divide-[#E2E8F0] text-xs rounded-xs">
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-500">Eligibility Engine:</span>
                      <span className="font-bold text-[#0A2540]">Deterministic 8-Rule Evaluator</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-500">Attendance Telemetry:</span>
                      <span className="font-bold text-[#0A2540]">240-Hour Logbook Accumulator</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-500">Credential Minting:</span>
                      <span className="font-bold text-[#2563EB]">SHA-256 Tamper-Proof e-Certs</span>
                    </div>
                  </div>
                  <Link to="/auth/login" className="inline-flex items-center gap-2 text-xs bg-[#2563EB] text-white px-5 py-2.5 font-bold hover:bg-[#1d4ed8] transition-colors rounded-xs">
                    ACCESS STUDENT PORTAL →
                  </Link>
                </div>

                <div className="lg:col-span-6 border border-[#E2E8F0] bg-[#F8FAFC] p-6 space-y-4 font-mono text-xs rounded-xs">
                  <div className="border-b border-[#CBD5E1] pb-2 flex justify-between text-slate-500">
                    <span>RECORD: 2026-CSE-001</span>
                    <span className="text-[#F97316] font-bold">KYC_VERIFIED</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#0A2540] font-black font-sans text-sm">Verified Candidate · Computer Science</p>
                    <p className="text-slate-600">CGPA: 8.85 · Active Backlogs: 0</p>
                    <p className="text-slate-600">Host: Accredited Enterprise Partner</p>
                    <p className="text-slate-600">Hours Logged: 160 / 240 hrs (Week 4)</p>
                  </div>
                  <div className="border border-[#CBD5E1] p-2.5 text-[11px] text-[#2563EB] bg-white font-bold rounded-xs">
                    STATUS: SELECTED (Offer Accepted) · NOC-2026-004821
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'TNP' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                <div className="lg:col-span-6 space-y-4">
                  <span className="text-[10px] font-bold text-[#2563EB] bg-[#F8FAFC] border border-[#CBD5E1] px-2.5 py-1 rounded-xs">
                    ROLE_02 // PLACEMENT HEADQUARTERS
                  </span>
                  <h3 className="text-2xl font-black text-[#0A2540] font-sans uppercase">
                    Zero-Touch Auto-Pilot Governance
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    College Placement Officers eliminate manual paper approvals. Eligible candidates accepting offers receive instantly stamped institutional NOCs.
                  </p>
                  <div className="border border-[#E2E8F0] divide-y divide-[#E2E8F0] text-xs rounded-xs">
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-500">Placement Rate:</span>
                      <span className="text-[#2563EB] font-bold font-mono">95.2% Verified Pool</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-500">Average Package:</span>
                      <span className="text-[#0A2540] font-bold font-mono">9.85 LPA CTC</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-500">Auto-Pilot Mode:</span>
                      <span className="text-[#F97316] font-bold">100% ACTIVE (0 Manual Work)</span>
                    </div>
                  </div>
                  <Link to="/auth/login" className="inline-flex items-center gap-2 text-xs bg-[#2563EB] text-white px-5 py-2.5 font-bold hover:bg-[#1d4ed8] transition-colors rounded-xs">
                    ACCESS T&amp;P PORTAL →
                  </Link>
                </div>

                <div className="lg:col-span-6 border border-[#E2E8F0] bg-[#F8FAFC] p-6 space-y-4 font-mono text-xs rounded-xs">
                  <div className="border-b border-[#CBD5E1] pb-2 flex justify-between text-slate-500">
                    <span>GOVERNANCE_LEDGER</span>
                    <span className="text-[#2563EB] font-bold">AUTO_PILOT_ON</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="border border-[#CBD5E1] p-3 bg-white rounded-xs">
                      <span className="text-[10px] text-slate-500 font-bold">PLACEMENT_RATE</span>
                      <p className="text-2xl font-bold text-[#2563EB] font-mono mt-1">95.2%</p>
                    </div>
                    <div className="border border-[#CBD5E1] p-3 bg-white rounded-xs">
                      <span className="text-[10px] text-slate-500 font-bold">AVERAGE_CTC</span>
                      <p className="text-2xl font-bold text-[#0A2540] font-mono mt-1">9.85 LPA</p>
                    </div>
                  </div>
                  <div className="border border-[#CBD5E1] p-2.5 text-[11px] text-slate-700 bg-white rounded-xs">
                    CLEARANCE: 0 Pending Manual Reviews · NOCs Auto-Issued
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'COMPANY' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                <div className="lg:col-span-6 space-y-4">
                  <span className="text-[10px] font-bold text-[#2563EB] bg-[#F8FAFC] border border-[#CBD5E1] px-2.5 py-1 rounded-xs">
                    ROLE_03 // CORPORATE RECRUITER
                  </span>
                  <h3 className="text-2xl font-black text-[#0A2540] font-sans uppercase">
                    Verified Talent Pipeline &amp; PPO
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Corporate talent partners post accredited vacancies, review pre-screened eligible applicants, issue formal offer letters, and extend Pre-Placement Offers (PPO).
                  </p>
                  <div className="border border-[#E2E8F0] divide-y divide-[#E2E8F0] text-xs rounded-xs">
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-500">Talent Screening:</span>
                      <span className="font-bold text-[#0A2540]">100% Pre-Filtered Against Cutoffs</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-500">Offer Expiry Clock:</span>
                      <span className="font-bold text-[#0A2540]">48-Hour Automated Decision Window</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-500">Institutional NOC:</span>
                      <span className="font-bold text-[#2563EB]">Auto-Generated upon Acceptance</span>
                    </div>
                  </div>
                  <Link to="/auth/login" className="inline-flex items-center gap-2 text-xs bg-[#2563EB] text-white px-5 py-2.5 font-bold hover:bg-[#1d4ed8] transition-colors rounded-xs">
                    ACCESS RECRUITER PORTAL →
                  </Link>
                </div>

                <div className="lg:col-span-6 border border-[#E2E8F0] bg-[#F8FAFC] p-6 space-y-4 font-mono text-xs rounded-xs">
                  <div className="border-b border-[#CBD5E1] pb-2 flex justify-between text-slate-500">
                    <span>HOST: ENTERPRISE_PARTNER</span>
                    <span className="text-[#2563EB] font-bold">ACCREDITED_PARTNER</span>
                  </div>
                  <div className="border border-[#CBD5E1] p-3 bg-white flex justify-between items-center rounded-xs">
                    <div>
                      <p className="font-bold text-[#0A2540] font-sans">Verified Candidate</p>
                      <p className="text-[11px] text-slate-500">Cloud Engineering Intern</p>
                    </div>
                    <span className="text-[10px] text-[#F97316] border border-[#F97316]/30 bg-[#F97316]/10 px-2 py-0.5 font-bold rounded-xs">
                      OFFER_ACCEPTED
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'MENTOR' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                <div className="lg:col-span-6 space-y-4">
                  <span className="text-[10px] font-bold text-[#2563EB] bg-[#F8FAFC] border border-[#CBD5E1] px-2.5 py-1 rounded-xs">
                    ROLE_04 // FACULTY ADVISOR
                  </span>
                  <h3 className="text-2xl font-black text-[#0A2540] font-sans uppercase">
                    Logbook Review &amp; Competency Matrix
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Faculty mentors review weekly student activity reports, grade engineering deliverables with 1–5 stars, monitor approved hours, and submit final accreditation matrices.
                  </p>
                  <div className="border border-[#E2E8F0] divide-y divide-[#E2E8F0] text-xs rounded-xs">
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-500">Review Cycle:</span>
                      <span className="font-bold text-[#0A2540]">Weekly Activity Logbook Queue</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-500">Evaluation Model:</span>
                      <span className="font-bold text-[#0A2540]">5-Dimension Competency Matrix</span>
                    </div>
                    <div className="p-2.5 flex justify-between">
                      <span className="text-slate-500">PPO Conversion:</span>
                      <span className="font-bold text-[#2563EB]">Faculty Recommendation Toggle</span>
                    </div>
                  </div>
                  <Link to="/auth/login" className="inline-flex items-center gap-2 text-xs bg-[#2563EB] text-white px-5 py-2.5 font-bold hover:bg-[#1d4ed8] transition-colors rounded-xs">
                    ACCESS MENTOR PORTAL →
                  </Link>
                </div>

                <div className="lg:col-span-6 border border-[#E2E8F0] bg-[#F8FAFC] p-6 space-y-4 font-mono text-xs rounded-xs">
                  <div className="border-b border-[#CBD5E1] pb-2 flex justify-between text-slate-500">
                    <span>DEPARTMENT: CSE</span>
                    <span className="text-[#2563EB] font-bold">FACULTY_ADVISOR</span>
                  </div>
                  <div className="border border-[#CBD5E1] p-3 bg-white flex justify-between items-center rounded-xs">
                    <div>
                      <p className="font-bold text-[#0A2540] font-sans">Week 4 Activity Logbook</p>
                      <p className="text-[11px] text-slate-500">Verified Candidate (40 hrs)</p>
                    </div>
                    <span className="text-[#2563EB] font-bold">★★★★★ 5.0</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SECTION 05: Public Cryptographic Terminal ─────────────────────── */}
      <section id="verifier" className="border-b border-[#1E3A5F] py-18 bg-[#0A2540] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] text-[#F97316] uppercase font-bold tracking-wider">
              SECTION 04 // CRYPTOGRAPHIC VAULT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-sans">
              Public Credential Verification Terminal
            </h2>
            <p className="text-xs text-slate-300">
              Inspect the cryptographic legitimacy of any issued Institutional NOC or completion certificate.
            </p>
          </div>

          <form
            onSubmit={handleVerificationSubmit}
            className="border border-slate-700 bg-slate-900 p-2.5 flex flex-col sm:flex-row gap-2 rounded-xs"
          >
            <div className="flex-1 flex items-center gap-2 px-3">
              <span className="text-[#F97316] font-mono text-xs">&gt;</span>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="ENTER CODE (e.g. NOC-2026-004821 or VILP-2026-CSE-8841)"
                className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono uppercase"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-colors shrink-0 rounded-xs cursor-pointer"
            >
              EXECUTE QUERY
            </button>
          </form>

          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            <span>SAMPLE_QUERIES:</span>
            <button
              onClick={() => setVerificationCode('NOC-2026-004821')}
              className="text-[#F97316] border border-slate-700 bg-slate-900 px-2 py-0.5 hover:border-white rounded-xs cursor-pointer"
            >
              NOC-2026-004821
            </button>
            <button
              onClick={() => setVerificationCode('VILP-2026-CSE-8841')}
              className="text-blue-300 border border-slate-700 bg-slate-900 px-2 py-0.5 hover:border-white rounded-xs cursor-pointer"
            >
              VILP-2026-CSE-8841
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 06: Balance Sheet (Stats) ─────────────────────────────── */}
      <section className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto border-x border-[#E2E8F0] grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0] text-center">
          <div className="p-8 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">PLACEMENT_RATE</span>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] font-mono">95.2%</p>
            <span className="text-[10px] text-slate-600">Verified Pool</span>
          </div>

          <div className="p-8 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">AVERAGE_CTC</span>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] font-mono">9.85 LPA</p>
            <span className="text-[10px] text-slate-600">+18% YoY Growth</span>
          </div>

          <div className="p-8 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">MAX_PPO_OFFER</span>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#F97316] font-mono">14.5 LPA</p>
            <span className="text-[10px] text-slate-600">Enterprise Host Partner</span>
          </div>

          <div className="p-8 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">ACCREDITED_CORP</span>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] font-mono">78+</p>
            <span className="text-[10px] text-slate-600">Tier-1 Recruiters</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 07: Footer ────────────────────────────────────────────── */}
      <footer className="bg-[#0A2540] text-slate-400 text-xs py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="space-y-1">
              <span className="font-bold text-white text-sm block">VILP // ACADEMIC OPERATING SYSTEM</span>
              <p className="text-[11px] text-slate-400">Autonomous Internship Lifecycle &amp; Placement Governance Platform.</p>
            </div>
            <Link
              to="/auth/login"
              className="bg-[#2563EB] text-white px-6 py-3 font-bold text-xs hover:bg-[#1d4ed8] transition-colors rounded-xs shadow-xs"
            >
              LAUNCH CONSOLE →
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px]">
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">[ Privacy Policy ]</Link>
              <Link to="/terms" className="hover:text-white transition-colors">[ Terms of Governance ]</Link>
              <a href="mailto:support@vilp.edu" className="hover:text-white transition-colors">[ Helpdesk ]</a>
            </div>
            <span className="text-slate-500">© 2026 VILP PLATFORM. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </footer>

      <CommandPaletteHUD />
    </div>
  );
}
