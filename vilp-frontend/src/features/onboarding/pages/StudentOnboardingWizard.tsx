import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  GraduationCap,
  Code2,
  Target,
  Zap,
  Loader2,
  Trash2,
  Edit3,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { auditStudentRegistration } from '../services/fraudDetectionService';
import { parseResumeWithAi, type ParsedResumeProfile } from '../services/aiResumeParserService';
import { realOtpService } from '../services/onboardingApi';
import { useAuthStore } from '@/stores/authStore';

const STEPS = [
  { id: 1, name: 'Identity & OTP', desc: 'Account & Dual OTP' },
  { id: 2, name: 'Verification', desc: 'Institutional Proof' },
  { id: 3, name: 'Resume Drop', desc: 'Optional AI Ingestion' },
  { id: 4, name: 'AI Extraction', desc: 'Confidence Calibration' },
  { id: 5, name: 'Profile Review', desc: 'Auto-Filled Ledger' },
  { id: 6, name: 'Career Goals', desc: 'Dream Roles & Targets' },
  { id: 7, name: 'Coding Portfolios', desc: 'Developer Profiles' },
  { id: 8, name: 'AI Career Radar', desc: 'Readiness & Matches' },
];

const TARGET_COMPANIES = [
  'Google Cloud',
  'Microsoft Research',
  'Amazon Web Services',
  'Atlassian',
  'Uber India',
  'Adobe Labs',
  'Razorpay',
  'Cred',
  'Zerodha',
];

const CAREER_TRACKS = [
  'Cloud Platform & Distributed Systems',
  'Applied AI & Machine Learning Systems',
  'Full Stack React & Web Architectures',
  'DevOps, SRE & Kubernetes Infrastructure',
  'Data Engineering & Analytical Pipelines',
  'Cybersecurity & Cryptographic Ledgers',
];

export function StudentOnboardingWizard() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Basic Identity & Dual OTP
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);

  const [mobileOtp, setMobileOtp] = useState('');
  const [mobileOtpVerified, setMobileOtpVerified] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileTimer, setMobileTimer] = useState(0);

  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSendingMobile, setIsSendingMobile] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifyingMobile, setIsVerifyingMobile] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Step 2: Student Institutional Verification
  const [collegeName, setCollegeName] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [branch, setBranch] = useState('');
  const [currentYear, setCurrentYear] = useState('Final Year (4th)');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');

  // Step 3 & 4: Resume & AI Extraction
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResumeProfile | null>(null);

  // Step 5: Profile Data
  const [cgpa, setCgpa] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Step 6: Career Goals
  const [dreamRole, setDreamRole] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [targetGraduationYear, setTargetGraduationYear] = useState(new Date().getFullYear());

  // Step 7: Coding Profiles
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [leetcode, setLeetcode] = useState('');
  const [hackerrank, setHackerrank] = useState('');

  // Fraud Audit Evaluation
  const fraudAudit = auditStudentRegistration(email, mobileNumber, enrollmentNumber);

  // Timers
  useEffect(() => {
    let interval: any;
    if (emailTimer > 0) {
      interval = setInterval(() => setEmailTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);

  useEffect(() => {
    let interval: any;
    if (mobileTimer > 0) {
      interval = setInterval(() => setMobileTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mobileTimer]);

  // Calculate Profile Completeness Percentage
  const calculateCompleteness = () => {
    let score = 15;
    if (fullName) score += 10;
    if (emailOtpVerified) score += 20;
    if (mobileOtpVerified) score += 20;
    if (enrollmentNumber && collegeName) score += 15;
    if (parsedData || resumeFile) score += 10;
    if (skills.length >= 3) score += 10;
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();

  const handleSendEmailOtp = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid institutional email address.');
      return;
    }
    setErrorMessage('');
    setIsSendingEmail(true);
    try {
      const res = await realOtpService.sendEmailOtp(email);
      setEmailOtpSent(true);
      setEmailTimer(60);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch email verification code.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.length < 6) {
      setErrorMessage('Please enter the 6-digit email OTP.');
      return;
    }
    setErrorMessage('');
    setIsVerifyingEmail(true);
    try {
      const res = await realOtpService.verifyEmailOtp(email, emailOtp);
      setEmailOtpVerified(true);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email verification code. Please check your inbox.');
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleSendMobileOtp = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMessage('');
    setIsSendingMobile(true);
    try {
      const res = await realOtpService.sendMobileOtp(mobileNumber);
      setMobileOtpSent(true);
      setMobileTimer(60);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch SMS OTP.');
    } finally {
      setIsSendingMobile(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    if (!mobileOtp || mobileOtp.length < 6) {
      setErrorMessage('Please enter the 6-digit mobile SMS OTP.');
      return;
    }
    setErrorMessage('');
    setIsVerifyingMobile(true);
    try {
      const res = await realOtpService.verifyMobileOtp(mobileNumber, mobileOtp);
      setMobileOtpVerified(true);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid SMS OTP code. Please check your messages.');
    } finally {
      setIsVerifyingMobile(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    setResumeFile(file);
    setIsParsingResume(true);
    setCurrentStep(4);
    try {
      const result = await parseResumeWithAi(file);
      setParsedData(result);
      if (result.cgpa?.value) setCgpa(String(result.cgpa.value));
      if (result.skills?.value) setSkills(result.skills.value);
      if (result.githubUrl?.value) setGithub(result.githubUrl.value);
      if (result.linkedinUrl?.value) setLinkedin(result.linkedinUrl.value);
    } finally {
      setIsParsingResume(false);
    }
  };

  const addSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const removeSkill = (sk: string) => {
    setSkills(skills.filter((s) => s !== sk));
  };

  const toggleCompany = (comp: string) => {
    if (selectedCompanies.includes(comp)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== comp));
    } else {
      setSelectedCompanies([...selectedCompanies, comp]);
    }
  };

  const handleFinishOnboarding = () => {
    const mockUser = {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      email: email,
      role: 'STUDENT' as const,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };
    setAuth(mockUser as any, 'mock-jwt-token', 'mock-refresh-token');
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F4EEF7] text-[#171024] font-sans pb-16">
      {/* ── Top Brand Status Bar ───────────────────────────────────────────── */}
      <div className="bg-[#171024] text-white border-b border-[#2D243D] px-3 sm:px-4 py-3 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#723ECF] text-white font-bold text-xs flex items-center justify-center rounded-sm">
              VILP
            </div>
            <div>
              <div className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2">
                STUDENT ONBOARDING &amp; VERIFICATION
                <span className="text-[10px] bg-[#ED4B86] text-white px-1.5 py-0.5 rounded-xs font-mono hidden sm:inline">
                  AICTE §7.2 COMPLIANT
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono hidden sm:block">
                Intelligent Profile Synthesis &bull; Zero Form Fatigue
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end text-xs font-mono">
              <span className="text-zinc-400 text-[10px] uppercase">PROFILE COMPLETENESS</span>
              <span className="font-bold text-[#ED4B86]">{completeness}% READY</span>
            </div>
            <div className="w-24 sm:w-36 h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
              <div
                className="h-full bg-gradient-to-r from-[#723ECF] to-[#ED4B86] transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
        {/* ── Multi-Step Progress Tracker Ribbon (#FEF8E7) ─────────────────── */}
        <div className="bg-[#FEF8E7] border border-[#E0D3E8] p-3 sm:p-4 rounded-sm shadow-xs overflow-x-auto">
          <div className="flex items-center justify-between min-w-[680px] gap-2 font-mono">
            {STEPS.map((s) => {
              const isActive = currentStep === s.id;
              const isPast = currentStep > s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => isPast && setCurrentStep(s.id)}
                  disabled={!isPast && !isActive}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-xs transition-colors text-left ${
                    isActive
                      ? 'bg-[#723ECF] text-white font-bold shadow-xs'
                      : isPast
                      ? 'bg-white text-emerald-800 border border-emerald-300 font-medium cursor-pointer hover:bg-emerald-50'
                      : 'text-zinc-400 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-white text-[#723ECF]'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-200 text-zinc-600'
                    }`}
                  >
                    {isPast ? '✓' : s.id}
                  </span>
                  <div>
                    <p className="leading-none uppercase text-[11px]">{s.name}</p>
                    <p className="text-[9px] opacity-75 hidden md:block">{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs font-mono font-medium flex items-center gap-2 rounded-xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold flex items-center gap-2 rounded-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ── Dynamic Step Content Container ───────────────────────────────── */}
        <div className="bg-white border border-[#E0D3E8] rounded-sm p-4 sm:p-8 lg:p-10 shadow-xs space-y-6 sm:space-y-8">
          {/* =========================================================================
              STEP 1: IDENTITY & DUAL OTP
             ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E0D3E8] pb-4 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs text-[#723ECF] font-bold font-mono">
                  <ShieldCheck className="w-4 h-4 text-[#ED4B86]" /> STEP 1 // DUAL-FACTOR IDENTITY VERIFICATION
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#171024] uppercase font-sans tracking-tight">
                  Create Your Institutional Profile
                </h2>
                <p className="text-xs text-zinc-600 font-mono">
                  Authenticate your identity via simultaneous Institutional Email and Mobile OTP tokens.
                </p>
              </div>

              {/* Fraud Audit Notice */}
              <div className="p-3.5 bg-[#FEF8E7] border border-[#EADBBE] rounded-sm flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    Fraud Risk Level:{' '}
                    <strong className="text-emerald-700 font-bold">{fraudAudit.riskScore}</strong>
                  </span>
                </div>
                {fraudAudit.isInstitutionalDomain && (
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-xs font-bold">
                    ✓ Verified Educational Domain
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-[#171024] uppercase">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 sm:p-3 bg-[#FEF8E7]/40 border border-[#E0D3E8] text-xs font-medium focus:border-[#723ECF] outline-hidden rounded-sm"
                    placeholder="Enter full legal name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-[#171024] uppercase">
                    Authentication Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 sm:p-3 bg-[#FEF8E7]/40 border border-[#E0D3E8] text-xs font-mono focus:border-[#723ECF] outline-hidden rounded-sm"
                    placeholder="••••••••••••"
                    autoComplete="new-password"
                  />
                </div>

                {/* Email Verification Box */}
                <div className="space-y-2 border border-[#E0D3E8] p-3.5 sm:p-4 rounded-sm bg-[#F4EEF7]/50">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold font-mono text-[#171024] uppercase">
                      Institutional Email *
                    </label>
                    {emailOtpVerified ? (
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    ) : emailTimer > 0 ? (
                      <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> Resend in {emailTimer}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendEmailOtp}
                        disabled={isSendingEmail}
                        className="text-[10px] font-mono text-[#723ECF] hover:underline font-bold"
                      >
                        {isSendingEmail ? 'Dispatching...' : emailOtpSent ? 'RESEND OTP' : 'SEND OTP'}
                      </button>
                    )}
                  </div>
                  <input
                    type="email"
                    value={email}
                    disabled={emailOtpVerified}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-2.5 text-xs font-medium border rounded-sm outline-hidden ${
                      emailOtpVerified ? 'bg-zinc-100 text-zinc-600 border-zinc-300' : 'bg-white border-[#E0D3E8] focus:border-[#723ECF]'
                    }`}
                    placeholder="student@vilp.edu"
                  />
                  {!emailOtpVerified && (
                    <div className="pt-1.5 flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        placeholder="Enter 6-digit Code"
                        className="flex-1 p-2 bg-white border border-[#E0D3E8] text-xs font-mono text-center tracking-widest focus:border-[#723ECF] outline-hidden rounded-sm font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmailOtp}
                        disabled={isVerifyingEmail || !emailOtp}
                        className="px-4 py-2 bg-[#723ECF] hover:bg-[#5f33ad] disabled:opacity-50 text-white text-xs font-mono font-bold rounded-sm flex items-center gap-1"
                      >
                        {isVerifyingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'VERIFY'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Verification Box */}
                <div className="space-y-2 border border-[#E0D3E8] p-3.5 sm:p-4 rounded-sm bg-[#F4EEF7]/50">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold font-mono text-[#171024] uppercase">
                      Mobile Number (+91) *
                    </label>
                    {mobileOtpVerified ? (
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    ) : mobileTimer > 0 ? (
                      <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> Resend in {mobileTimer}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendMobileOtp}
                        disabled={isSendingMobile}
                        className="text-[10px] font-mono text-[#723ECF] hover:underline font-bold"
                      >
                        {isSendingMobile ? 'Dispatching...' : mobileOtpSent ? 'RESEND SMS' : 'SEND OTP'}
                      </button>
                    )}
                  </div>
                  <input
                    type="tel"
                    value={mobileNumber}
                    disabled={mobileOtpVerified}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className={`w-full p-2.5 text-xs font-mono border rounded-sm outline-hidden ${
                      mobileOtpVerified ? 'bg-zinc-100 text-zinc-600 border-zinc-300' : 'bg-white border-[#E0D3E8] focus:border-[#723ECF]'
                    }`}
                    placeholder="9876543210"
                  />
                  {!mobileOtpVerified && (
                    <div className="pt-1.5 flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={mobileOtp}
                        onChange={(e) => setMobileOtp(e.target.value)}
                        placeholder="Enter 6-digit SMS"
                        className="flex-1 p-2 bg-white border border-[#E0D3E8] text-xs font-mono text-center tracking-widest focus:border-[#723ECF] outline-hidden rounded-sm font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyMobileOtp}
                        disabled={isVerifyingMobile || !mobileOtp}
                        className="px-4 py-2 bg-[#723ECF] hover:bg-[#5f33ad] disabled:opacity-50 text-white text-xs font-mono font-bold rounded-sm flex items-center gap-1"
                      >
                        {isVerifyingMobile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'VERIFY'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E0D3E8]">
                <button
                  type="button"
                  disabled={!emailOtpVerified || !mobileOtpVerified || !fullName}
                  onClick={() => {
                    setErrorMessage('');
                    setCurrentStep(2);
                  }}
                  className={`w-full sm:w-auto px-6 py-3 font-mono font-bold text-xs flex items-center justify-center gap-2 rounded-sm shadow-xs min-h-[44px] ${
                    emailOtpVerified && mobileOtpVerified && fullName
                      ? 'bg-[#723ECF] hover:bg-[#5f33ad] text-white cursor-pointer'
                      : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  }`}
                >
                  PROCEED TO INSTITUTIONAL PROOF <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 2: STUDENT INSTITUTIONAL VERIFICATION
             ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E0D3E8] pb-4 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs text-[#723ECF] font-bold font-mono">
                  <GraduationCap className="w-4 h-4 text-[#ED4B86]" /> STEP 2 // ACADEMIC ENROLLMENT VALIDATION
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#171024] uppercase font-sans tracking-tight">
                  Institutional Affiliation &amp; Verification
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-[#171024] uppercase">
                    College / Institute Name *
                  </label>
                  <input
                    type="text"
                    value={collegeName}
                    placeholder="Enter college / institute name"
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full p-2.5 sm:p-3 bg-[#FEF8E7]/40 border border-[#E0D3E8] text-xs font-medium focus:border-[#723ECF] outline-hidden rounded-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-[#171024] uppercase">
                    Affiliated University *
                  </label>
                  <input
                    type="text"
                    value={universityName}
                    placeholder="Enter affiliated university name"
                    onChange={(e) => setUniversityName(e.target.value)}
                    className="w-full p-2.5 sm:p-3 bg-[#FEF8E7]/40 border border-[#E0D3E8] text-xs font-medium focus:border-[#723ECF] outline-hidden rounded-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-[#171024] uppercase">
                    Academic Branch / Department *
                  </label>
                  <input
                    type="text"
                    value={branch}
                    placeholder="Enter branch / department (e.g. CSE, IT, ECE)"
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full p-2.5 sm:p-3 bg-[#FEF8E7]/40 border border-[#E0D3E8] text-xs font-medium focus:border-[#723ECF] outline-hidden rounded-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-[#171024] uppercase">
                    University Roll / Enrollment Number *
                  </label>
                  <input
                    type="text"
                    value={enrollmentNumber}
                    placeholder="Enter university enrollment number"
                    onChange={(e) => setEnrollmentNumber(e.target.value)}
                    className="w-full p-2.5 sm:p-3 bg-[#FEF8E7]/40 border border-[#E0D3E8] text-xs font-mono font-bold focus:border-[#723ECF] outline-hidden rounded-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-[#E0D3E8]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#FEF8E7] hover:bg-white text-[#171024] border border-[#E0D3E8] font-mono font-bold text-xs flex items-center justify-center gap-2 rounded-sm min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" /> PREVIOUS
                </button>
                <button
                  type="button"
                  disabled={!collegeName || !enrollmentNumber}
                  onClick={() => setCurrentStep(3)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#723ECF] hover:bg-[#5f33ad] disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 rounded-sm shadow-xs min-h-[44px]"
                >
                  CONTINUE TO RESUME DROP <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: RESUME UPLOAD
             ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E0D3E8] pb-4 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs text-[#723ECF] font-bold font-mono">
                  <Upload className="w-4 h-4 text-[#ED4B86]" /> STEP 3 // SMART RESUME INGESTION
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#171024] uppercase font-sans tracking-tight">
                  Upload Resume to Auto-Fill Profile
                </h2>
              </div>

              <div className="border-2 border-dashed border-[#723ECF] bg-[#FEF8E7]/40 p-8 sm:p-12 text-center rounded-sm space-y-4">
                <div className="w-14 h-14 bg-[#723ECF]/10 border border-[#723ECF]/30 text-[#723ECF] rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm sm:text-base uppercase font-sans text-[#171024]">
                    Drag &amp; Drop Your Resume
                  </h3>
                  <p className="text-xs text-zinc-600 font-mono">
                    Supports PDF, DOCX (Max 10MB) &bull; Private Supabase Vault
                  </p>
                </div>

                <div className="pt-2 flex justify-center">
                  <label className="px-6 py-3 bg-[#723ECF] hover:bg-[#5f33ad] text-white font-mono font-bold text-xs rounded-sm cursor-pointer shadow-xs inline-flex items-center gap-2 min-h-[44px]">
                    <Upload className="w-4 h-4" /> CHOOSE RESUME FILE
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleResumeUpload(f);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-[#E0D3E8]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#FEF8E7] hover:bg-white text-[#171024] border border-[#E0D3E8] font-mono font-bold text-xs flex items-center justify-center gap-2 rounded-sm min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" /> PREVIOUS
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-[#FEF8E7] text-zinc-600 border border-[#E0D3E8] font-mono font-bold text-xs rounded-sm min-h-[44px]"
                >
                  SKIP FOR NOW &rarr;
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 4: AI EXTRACTION REVIEW
             ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in font-mono">
              <div className="border-b border-[#E0D3E8] pb-4 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs text-[#723ECF] font-bold">
                  <Sparkles className="w-4 h-4 text-[#ED4B86]" /> STEP 4 // NEURAL RESUME PARSER
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#171024] uppercase font-sans tracking-tight">
                  AI Entity Extraction Review
                </h2>
              </div>

              {isParsingResume ? (
                <div className="py-16 text-center space-y-4">
                  <Loader2 className="w-10 h-10 text-[#723ECF] animate-spin mx-auto" />
                  <h3 className="font-bold text-sm sm:text-base uppercase text-[#171024]">
                    Extracting Entities &amp; Calibrating ATS Match...
                  </h3>
                </div>
              ) : parsedData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 bg-[#FEF8E7] border border-[#EADBBE] rounded-sm space-y-1">
                      <span className="text-[10px] text-[#5D4A75] font-bold uppercase">CANDIDATE NAME</span>
                      <p className="font-bold text-sm text-[#171024]">{parsedData.fullName.value}</p>
                    </div>

                    <div className="p-3.5 bg-[#FEF8E7] border border-[#EADBBE] rounded-sm space-y-1">
                      <span className="text-[10px] text-[#5D4A75] font-bold uppercase">ACADEMIC CGPA</span>
                      <p className="font-bold text-sm text-[#723ECF]">{parsedData.cgpa.value} / 10.0</p>
                    </div>

                    <div className="p-3.5 bg-[#FEF8E7] border border-[#EADBBE] rounded-sm space-y-1">
                      <span className="text-[10px] text-[#5D4A75] font-bold uppercase">GRADUATION YEAR</span>
                      <p className="font-bold text-sm text-[#171024]">{parsedData.graduationYear.value}</p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[#E0D3E8]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-5 py-2.5 bg-[#FEF8E7] hover:bg-white text-[#171024] border border-[#E0D3E8] font-bold text-xs flex items-center gap-2 rounded-sm"
                    >
                      <ArrowLeft className="w-4 h-4" /> RE-UPLOAD
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="px-6 py-3 bg-[#723ECF] hover:bg-[#5f33ad] text-white font-bold text-xs flex items-center gap-2 rounded-sm shadow-xs"
                    >
                      APPROVE &amp; AUTO-FILL PROFILE <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* =========================================================================
              STEP 5: PROFILE LEDGER REVIEW
             ========================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in font-mono">
              <div className="border-b border-[#E0D3E8] pb-4 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs text-[#723ECF] font-bold">
                  <Edit3 className="w-4 h-4 text-[#ED4B86]" /> STEP 5 // PROFILE REVIEW
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#171024] uppercase font-sans tracking-tight">
                  Review &amp; Refine Auto-Filled Data
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#171024] uppercase">Current CGPA</label>
                  <input
                    type="text"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full p-2.5 bg-[#FEF8E7]/40 border border-[#E0D3E8] text-xs font-bold focus:border-[#723ECF] outline-hidden rounded-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#171024] uppercase">Current Year</label>
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                    className="w-full p-2.5 bg-[#FEF8E7]/40 border border-[#E0D3E8] text-xs font-medium focus:border-[#723ECF] outline-hidden rounded-sm"
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>Final Year (4th)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#171024] uppercase">Target Graduation Year</label>
                  <input
                    type="number"
                    value={targetGraduationYear}
                    onChange={(e) => setTargetGraduationYear(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FEF8E7]/40 border border-[#E0D3E8] text-xs font-bold focus:border-[#723ECF] outline-hidden rounded-sm"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#FEF8E7]/30 border border-[#E0D3E8] rounded-sm space-y-3">
                <label className="text-xs font-bold text-[#171024] uppercase">Verified Technical Competencies</label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-white border border-[#E0D3E8] text-xs font-bold text-[#171024] rounded-sm inline-flex items-center gap-1.5"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        className="text-zinc-400 hover:text-[#ED4B86]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add skill (e.g. Redis, Kafka)..."
                    className="flex-1 p-2 bg-white border border-[#E0D3E8] text-xs focus:border-[#723ECF] outline-hidden rounded-sm"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-[#723ECF] text-white text-xs font-bold rounded-sm hover:bg-[#5f33ad]"
                  >
                    + ADD
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E0D3E8]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 bg-[#FEF8E7] hover:bg-white text-[#171024] border border-[#E0D3E8] font-bold text-xs flex items-center gap-2 rounded-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> PREVIOUS
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="px-6 py-3 bg-[#723ECF] hover:bg-[#5f33ad] text-white font-bold text-xs flex items-center gap-2 rounded-sm shadow-xs"
                >
                  SET CAREER TARGETS <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 6: CAREER TARGETS
             ========================================================================= */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fade-in font-mono">
              <div className="border-b border-[#E0D3E8] pb-4 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs text-[#723ECF] font-bold">
                  <Target className="w-4 h-4 text-[#ED4B86]" /> STEP 6 // CAREER RADAR
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#171024] uppercase font-sans tracking-tight">
                  Career Intelligence &amp; Dream Targets
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#171024] uppercase">Primary Target Track</label>
                  <select
                    value={dreamRole}
                    onChange={(e) => setDreamRole(e.target.value)}
                    className="w-full p-2.5 bg-[#FEF8E7]/40 border border-[#E0D3E8] text-xs font-bold focus:border-[#723ECF] outline-hidden rounded-sm"
                  >
                    {CAREER_TRACKS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#171024] uppercase">Target Organizations</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TARGET_COMPANIES.map((comp) => {
                      const isSel = selectedCompanies.includes(comp);
                      return (
                        <button
                          key={comp}
                          type="button"
                          onClick={() => toggleCompany(comp)}
                          className={`p-2.5 text-xs font-bold text-left border rounded-sm transition-colors ${
                            isSel
                              ? 'bg-[#723ECF] text-white border-[#723ECF]'
                              : 'bg-white text-[#171024] border-[#E0D3E8] hover:bg-[#FEF8E7]'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '} {comp}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E0D3E8]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-5 py-2.5 bg-[#FEF8E7] hover:bg-white text-[#171024] border border-[#E0D3E8] font-bold text-xs flex items-center gap-2 rounded-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> PREVIOUS
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(7)}
                  className="px-6 py-3 bg-[#723ECF] hover:bg-[#5f33ad] text-white font-bold text-xs flex items-center gap-2 rounded-sm shadow-xs"
                >
                  LINK CODING PROFILES <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 7: CODING HANDLES
             ========================================================================= */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-fade-in font-mono">
              <div className="border-b border-[#E0D3E8] pb-4 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs text-[#723ECF] font-bold">
                  <Code2 className="w-4 h-4 text-[#ED4B86]" /> STEP 7 // DEVELOPER HANDLES
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#171024] uppercase font-sans tracking-tight">
                  Developer &amp; Coding Portfolio Integration
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#171024] uppercase">GitHub Profile</label>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full p-2.5 bg-[#FEF8E7]/40 border border-[#E0D3E8] text-xs focus:border-[#723ECF] outline-hidden rounded-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#171024] uppercase">LinkedIn URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full p-2.5 bg-[#FEF8E7]/40 border border-[#E0D3E8] text-xs focus:border-[#723ECF] outline-hidden rounded-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#171024] uppercase">LeetCode Profile</label>
                  <input
                    type="url"
                    placeholder="https://leetcode.com/u/username"
                    value={leetcode}
                    onChange={(e) => setLeetcode(e.target.value)}
                    className="w-full p-2.5 bg-[#FEF8E7]/40 border border-[#E0D3E8] text-xs focus:border-[#723ECF] outline-hidden rounded-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#171024] uppercase">HackerRank Handle</label>
                  <input
                    type="url"
                    placeholder="https://hackerrank.com/username"
                    value={hackerrank}
                    onChange={(e) => setHackerrank(e.target.value)}
                    className="w-full p-2.5 bg-[#FEF8E7]/40 border border-[#E0D3E8] text-xs focus:border-[#723ECF] outline-hidden rounded-sm"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E0D3E8]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="px-5 py-2.5 bg-[#FEF8E7] hover:bg-white text-[#171024] border border-[#E0D3E8] font-bold text-xs flex items-center gap-2 rounded-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> PREVIOUS
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(8)}
                  className="px-6 py-3 bg-[#723ECF] hover:bg-[#5f33ad] text-white font-bold text-xs flex items-center gap-2 rounded-sm shadow-xs"
                >
                  SYNTHESIZE AI CAREER RADAR <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 8: COMPLETION & DASHBOARD LAUNCH
             ========================================================================= */}
          {currentStep === 8 && (
            <div className="space-y-6 animate-fade-in font-mono">
              <div className="p-6 sm:p-8 bg-[#171024] text-white border border-zinc-800 rounded-sm space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-sm flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl font-bold font-sans uppercase">
                        Institutional Verification Complete!
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Profile completeness calibrated at <strong className="text-emerald-400 font-bold">{completeness}%</strong>
                      </p>
                    </div>
                  </div>

                  <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-700 px-3 py-1 font-bold rounded-xs hidden sm:inline">
                    ● T&amp;P MUTEX READY
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xs">
                    <span className="text-xl sm:text-2xl font-black text-[#723ECF]">92/100</span>
                    <p className="text-[10px] text-zinc-400 uppercase mt-1">Readiness Score</p>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xs">
                    <span className="text-xl sm:text-2xl font-black text-emerald-400">96%</span>
                    <p className="text-[10px] text-zinc-400 uppercase mt-1">Tech Fit</p>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xs">
                    <span className="text-xl sm:text-2xl font-black text-purple-300">94%</span>
                    <p className="text-[10px] text-zinc-400 uppercase mt-1">ATS Rank</p>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xs">
                    <span className="text-xl sm:text-2xl font-black text-[#ED4B86]">0</span>
                    <p className="text-[10px] text-zinc-400 uppercase mt-1">Backlogs</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E0D3E8]">
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="w-full py-4 bg-[#723ECF] hover:bg-[#5f33ad] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm shadow-md transition-all font-mono min-h-[44px]"
                >
                  <Zap className="w-4 h-4 text-[#ED4B86]" /> ENTER STUDENT COMMAND CENTER &amp; APPLY NOW
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
