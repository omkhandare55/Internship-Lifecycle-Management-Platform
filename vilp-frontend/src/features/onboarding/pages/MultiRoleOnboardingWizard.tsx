import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  GraduationCap,
  Zap,
  Loader2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { PLATFORM_ROLES, type UserRoleType } from '../types/roleTypes';
import { parseResumeWithAi } from '../services/aiResumeParserService';
import { realOtpService } from '../services/onboardingApi';
import { CommandPaletteHUD } from '@/components/CommandPaletteHUD';
import { useAuthStore } from '@/stores/authStore';

export function MultiRoleOnboardingWizard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const roleParam = (searchParams.get('role') as UserRoleType) || 'STUDENT';
  const roleMeta = PLATFORM_ROLES.find((r) => r.id === roleParam) || PLATFORM_ROLES[0];

  const [currentStep, setCurrentStep] = useState(1);

  // Common Identity Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  // Real-time OTP States
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);

  const [mobileOtp, setMobileOtp] = useState('');
  const [mobileOtpVerified, setMobileOtpVerified] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileTimer, setMobileTimer] = useState(0);

  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isSendingMobileOtp, setIsSendingMobileOtp] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifyingMobile, setIsVerifyingMobile] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Student-specific States
  const [collegeName, setCollegeName] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [branch, setBranch] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // Faculty / Mentor / HOD / Admin specific States
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');

  // Timer countdown hooks
  useEffect(() => {
    let emailInterval: any;
    if (emailTimer > 0) {
      emailInterval = setInterval(() => setEmailTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(emailInterval);
  }, [emailTimer]);

  useEffect(() => {
    let mobileInterval: any;
    if (mobileTimer > 0) {
      mobileInterval = setInterval(() => setMobileTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(mobileInterval);
  }, [mobileTimer]);

  // Calculate Profile Completeness Percentage
  const calculateCompleteness = () => {
    let score = 15;
    if (fullName) score += 10;
    if (emailOtpVerified) score += 20;
    if (mobileOtpVerified) score += 20;
    if (collegeName || companyName) score += 15;
    if (skills.length >= 2) score += 10;
    if (github || linkedin || companyWebsite) score += 10;
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();

  const handleSendEmailOtp = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setErrorMessage('');
    setIsSendingEmailOtp(true);
    try {
      const res = await realOtpService.sendEmailOtp(email);
      setEmailOtpSent(true);
      setEmailTimer(60);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send verification email.');
    } finally {
      setIsSendingEmailOtp(false);
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
      setErrorMessage(err.message || 'Invalid email verification code.');
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
    setIsSendingMobileOtp(true);
    try {
      const res = await realOtpService.sendMobileOtp(mobileNumber);
      setMobileOtpSent(true);
      setMobileTimer(60);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send SMS OTP.');
    } finally {
      setIsSendingMobileOtp(false);
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
      setErrorMessage(err.message || 'Invalid SMS OTP code.');
    } finally {
      setIsVerifyingMobile(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    const result = await parseResumeWithAi(file);
    if (result.skills?.value) setSkills(result.skills.value);
    if (result.githubUrl?.value) setGithub(result.githubUrl.value);
    if (result.linkedinUrl?.value) setLinkedin(result.linkedinUrl.value);
    handleFinishOnboarding();
  };

  const handleFinishOnboarding = () => {
    let mappedRole: 'STUDENT' | 'COMPANY' | 'MENTOR' | 'TNP_OFFICER' | 'TNP_HEAD' | 'SUPER_ADMIN' = 'STUDENT';
    if (roleParam === 'COMPANY_RECRUITER') mappedRole = 'COMPANY';
    else if (roleParam === 'FACULTY_MENTOR' || roleParam === 'EXTERNAL_EVALUATOR') mappedRole = 'MENTOR';
    else if (roleParam === 'TNP_OFFICER' || roleParam === 'DEPT_COORDINATOR') mappedRole = 'TNP_OFFICER';
    else if (roleParam === 'HOD' || roleParam === 'COLLEGE_ADMIN') mappedRole = 'TNP_HEAD';
    else if (roleParam === 'SUPER_ADMIN') mappedRole = 'SUPER_ADMIN';

    const mockUser = {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      email: email,
      role: mappedRole,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };
    setAuth(mockUser as any, 'mock-jwt-token', 'mock-refresh-token');
    navigate(roleMeta.targetDashboard);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-16 w-full max-w-full overflow-x-hidden">
      {/* ── Top Status Bar (#0A2540) ────────────────────────────────────────── */}
      <div className="bg-[#0A2540] text-white border-b border-[#1E3A5F] px-3 sm:px-4 py-3 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0">
            <div className="w-8 h-8 bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center rounded-xs shrink-0 shadow-xs">
              VILP
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                <span className="truncate max-w-[130px] sm:max-w-xs">{roleMeta.title.toUpperCase()}</span>
                <span className="text-[9px] sm:text-[10px] bg-[#F97316] text-white px-1.5 py-0.5 rounded-xs font-mono shrink-0">
                  {roleMeta.defaultTrustLevel}
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-mono hidden sm:block truncate">
                {roleMeta.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => navigate('/onboarding/roles')}
              className="text-[11px] font-mono text-slate-300 hover:text-white underline whitespace-nowrap cursor-pointer"
            >
              Roles
            </button>
            <div className="hidden md:flex flex-col items-end text-xs font-mono">
              <span className="text-slate-300 text-[10px] uppercase">COMPLETION</span>
              <span className="font-bold text-[#F97316]">{completeness}%</span>
            </div>
            <div className="w-16 sm:w-28 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-[#2563EB] to-[#F97316] transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 space-y-4 sm:space-y-6 min-w-0">
        {/* ── Role Banner (#F1F5F9) ─────────────────────────────────────────── */}
        <div className="bg-[#F1F5F9] border border-[#CBD5E1] p-3.5 sm:p-4 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs shadow-xs min-w-0 max-w-full overflow-hidden">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] text-[#2563EB] font-bold uppercase tracking-wider block truncate">
              REAL-TIME VERIFICATION &bull; SCOPE: {roleMeta.category}
            </span>
            <p className="text-slate-700 font-sans text-xs line-clamp-2">{roleMeta.description}</p>
          </div>
          <span className="px-2.5 py-1 bg-white border border-[#CBD5E1] text-[#0A2540] font-bold text-[10px] sm:text-[11px] uppercase rounded-xs whitespace-nowrap shrink-0">
            {roleMeta.defaultTrustLevel}
          </span>
        </div>

        {/* Dynamic Alerts */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs font-mono font-medium flex items-center gap-2 rounded-xs min-w-0">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="break-words">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold flex items-center gap-2 rounded-xs min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="break-words">{successMessage}</span>
          </div>
        )}

        {/* ── Dynamic Form Container ───────────────────────────────────────── */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-4 sm:p-8 lg:p-10 shadow-xs space-y-6 sm:space-y-8 min-w-0 max-w-full overflow-hidden">
          {/* =========================================================================
              STUDENT ONBOARDING FLOW
             ========================================================================= */}
          {roleParam === 'STUDENT' && (
            <>
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in font-mono min-w-0">
                  <div className="border-b border-[#E2E8F0] pb-4 space-y-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#2563EB] font-bold">
                      <ShieldCheck className="w-4 h-4 text-[#F97316] shrink-0" /> STEP 1 // REAL-TIME DUAL OTP VERIFICATION
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-[#0A2540] uppercase font-sans tracking-tight">
                      Verify Identity via Live OTP
                    </h2>
                    <p className="text-xs text-slate-600">
                      Both Email and Mobile OTPs must be verified in real time to establish an accredited institutional account.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0">
                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Full Legal Name *</label>
                      <input
                        type="text"
                        placeholder="Enter full legal name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full min-w-0 p-2.5 sm:p-3 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs box-border"
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Password *</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full min-w-0 p-2.5 sm:p-3 bg-[#F8FAFC] border border-[#CBD5E1] text-xs focus:border-[#2563EB] outline-hidden rounded-xs box-border"
                      />
                    </div>

                    {/* Email Verification Box */}
                    <div className="space-y-2 border border-[#E2E8F0] p-3.5 sm:p-4 rounded-xs bg-[#F8FAFC] min-w-0 max-w-full overflow-hidden">
                      <div className="flex justify-between items-center min-w-0">
                        <label className="text-xs font-bold text-[#0A2540] uppercase truncate">Institutional Email *</label>
                        {emailOtpVerified ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-xs flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                          </span>
                        ) : emailTimer > 0 ? (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3 text-amber-600" /> Resend in {emailTimer}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendEmailOtp}
                            disabled={isSendingEmailOtp}
                            className="text-[10px] text-[#2563EB] hover:underline font-bold shrink-0 cursor-pointer"
                          >
                            {isSendingEmailOtp ? 'Sending...' : emailOtpSent ? 'RESEND OTP' : 'SEND OTP'}
                          </button>
                        )}
                      </div>
                      <input
                        type="email"
                        placeholder="user@institution.edu"
                        disabled={emailOtpVerified}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full min-w-0 p-2.5 text-xs border rounded-xs outline-hidden box-border ${
                          emailOtpVerified ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-white border-[#CBD5E1] focus:border-[#2563EB]'
                        }`}
                      />
                      {!emailOtpVerified && (
                        <div className="pt-1.5 flex flex-col sm:flex-row gap-2 min-w-0">
                          <input
                            type="text"
                            maxLength={6}
                            value={emailOtp}
                            onChange={(e) => setEmailOtp(e.target.value)}
                            placeholder="Enter 6-digit Code"
                            className="flex-1 min-w-0 p-2 bg-white border border-[#CBD5E1] text-xs text-center tracking-widest focus:border-[#2563EB] outline-hidden rounded-xs font-bold box-border"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyEmailOtp}
                            disabled={isVerifyingEmail || !emailOtp}
                            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-50 text-white text-xs font-bold rounded-xs flex items-center justify-center gap-1 shrink-0 min-h-[38px] cursor-pointer"
                          >
                            {isVerifyingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'VERIFY'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Mobile Verification Box */}
                    <div className="space-y-2 border border-[#E2E8F0] p-3.5 sm:p-4 rounded-xs bg-[#F8FAFC] min-w-0 max-w-full overflow-hidden">
                      <div className="flex justify-between items-center min-w-0">
                        <label className="text-xs font-bold text-[#0A2540] uppercase truncate">Mobile Number *</label>
                        {mobileOtpVerified ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-xs flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                          </span>
                        ) : mobileTimer > 0 ? (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3 text-amber-600" /> Resend in {mobileTimer}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendMobileOtp}
                            disabled={isSendingMobileOtp}
                            className="text-[10px] text-[#2563EB] hover:underline font-bold shrink-0 cursor-pointer"
                          >
                            {isSendingMobileOtp ? 'Sending...' : mobileOtpSent ? 'RESEND SMS' : 'SEND OTP'}
                          </button>
                        )}
                      </div>
                      <input
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        disabled={mobileOtpVerified}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className={`w-full min-w-0 p-2.5 text-xs border rounded-xs outline-hidden box-border ${
                          mobileOtpVerified ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-white border-[#CBD5E1] focus:border-[#2563EB]'
                        }`}
                      />
                      {!mobileOtpVerified && (
                        <div className="pt-1.5 flex flex-col sm:flex-row gap-2 min-w-0">
                          <input
                            type="text"
                            maxLength={6}
                            value={mobileOtp}
                            onChange={(e) => setMobileOtp(e.target.value)}
                            placeholder="Enter 6-digit SMS"
                            className="flex-1 min-w-0 p-2 bg-white border border-[#CBD5E1] text-xs text-center tracking-widest focus:border-[#2563EB] outline-hidden rounded-xs font-bold box-border"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyMobileOtp}
                            disabled={isVerifyingMobile || !mobileOtp}
                            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-50 text-white text-xs font-bold rounded-xs flex items-center justify-center gap-1 shrink-0 min-h-[38px] cursor-pointer"
                          >
                            {isVerifyingMobile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'VERIFY'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-[#E2E8F0]">
                    <button
                      type="button"
                      disabled={!emailOtpVerified || !mobileOtpVerified || !fullName}
                      onClick={() => {
                        setErrorMessage('');
                        setCurrentStep(2);
                      }}
                      className={`w-full sm:w-auto px-6 py-3 font-bold text-xs flex items-center justify-center gap-2 rounded-xs shadow-xs min-h-[44px] ${
                        emailOtpVerified && mobileOtpVerified && fullName
                          ? 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      PROCEED TO INSTITUTIONAL PROOF <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in font-mono min-w-0">
                  <div className="border-b border-[#E2E8F0] pb-4 space-y-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#2563EB] font-bold">
                      <GraduationCap className="w-4 h-4 text-[#F97316] shrink-0" /> STEP 2 // ACADEMIC DETAILS
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-[#0A2540] uppercase font-sans tracking-tight">
                      Enrollment &amp; Department Mapping
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0">
                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">College / Institute *</label>
                      <input
                        type="text"
                        placeholder="Enter college / institute name"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        className="w-full min-w-0 p-2.5 sm:p-3 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs box-border"
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">University *</label>
                      <input
                        type="text"
                        placeholder="Enter university name"
                        value={universityName}
                        onChange={(e) => setUniversityName(e.target.value)}
                        className="w-full min-w-0 p-2.5 sm:p-3 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs box-border"
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Branch / Department *</label>
                      <input
                        type="text"
                        placeholder="Enter branch / department"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full min-w-0 p-2.5 sm:p-3 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs box-border"
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">University Roll Number *</label>
                      <input
                        type="text"
                        placeholder="Enter university roll / enrollment number"
                        value={enrollmentNumber}
                        onChange={(e) => setEnrollmentNumber(e.target.value)}
                        className="w-full min-w-0 p-2.5 sm:p-3 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold focus:border-[#2563EB] outline-hidden rounded-xs box-border"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#F1F5F9] hover:bg-white text-[#0A2540] border border-[#CBD5E1] font-bold text-xs flex items-center justify-center gap-2 rounded-xs min-h-[44px] cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" /> PREVIOUS
                    </button>
                    <button
                      type="button"
                      disabled={!collegeName || !enrollmentNumber}
                      onClick={() => setCurrentStep(3)}
                      className="w-full sm:w-auto px-6 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 rounded-xs shadow-xs min-h-[44px] cursor-pointer"
                    >
                      RESUME INGESTION <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in font-mono min-w-0">
                  <div className="border-b border-[#E2E8F0] pb-4 space-y-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#2563EB] font-bold">
                      <Upload className="w-4 h-4 text-[#F97316] shrink-0" /> STEP 3 // SMART RESUME DROP
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-[#0A2540] uppercase font-sans tracking-tight">
                      Drop Resume to Auto-Fill Profile
                    </h2>
                  </div>

                  <div className="border-2 border-dashed border-[#2563EB] bg-[#F8FAFC] p-6 sm:p-8 text-center rounded-xs space-y-4 min-w-0 max-w-full overflow-hidden">
                    <FileText className="w-10 h-10 text-[#2563EB] mx-auto" />
                    <p className="text-xs text-slate-600">Supports PDF &bull; Neural Entity Extractor</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <label className="px-5 py-3 bg-[#2563EB] text-white font-bold text-xs rounded-xs cursor-pointer hover:bg-[#1d4ed8] text-center min-h-[44px] flex items-center justify-center shadow-xs">
                        CHOOSE RESUME FILE
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleResumeUpload(e.target.files[0]);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#F1F5F9] text-[#0A2540] border border-[#CBD5E1] font-bold text-xs flex items-center justify-center gap-2 rounded-xs min-h-[44px] cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" /> PREVIOUS
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFinishOnboarding()}
                      className="w-full sm:w-auto px-6 py-3 bg-[#2563EB] text-white font-bold text-xs rounded-xs shadow-xs min-h-[44px] cursor-pointer"
                    >
                      COMPLETE ONBOARDING &rarr;
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* =========================================================================
              FACULTY / RECRUITER / ADMIN FLOW
             ========================================================================= */}
          {roleParam !== 'STUDENT' && (
            <div className="space-y-6 animate-fade-in font-mono min-w-0">
              <div className="border-b border-[#E2E8F0] pb-4 space-y-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 text-xs text-[#2563EB] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#F97316] shrink-0" /> {roleMeta.title.toUpperCase()} // REGISTRATION &amp; VERIFICATION
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-[#0A2540] uppercase font-sans tracking-tight">
                  {roleMeta.title} Profile Setup
                </h2>
                <p className="text-xs text-slate-600">
                  Provide your professional credentials to establish verified {roleMeta.category.toLowerCase()} authorization.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0">
                <div className="space-y-1.5 min-w-0">
                  <label className="text-xs font-bold text-[#0A2540] uppercase block">Full Legal Name *</label>
                  <input
                    type="text"
                    placeholder="Enter full legal name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full min-w-0 p-2.5 sm:p-3 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs box-border"
                  />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <label className="text-xs font-bold text-[#0A2540] uppercase block">
                    {roleParam === 'COMPANY_RECRUITER' ? 'Corporate Work Email *' : 'Official Institutional Email *'}
                  </label>
                  <input
                    type="email"
                    placeholder={roleParam === 'COMPANY_RECRUITER' ? 'recruiter@company.com' : 'official@institution.edu'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full min-w-0 p-2.5 sm:p-3 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs box-border"
                  />
                </div>

                {roleParam === 'COMPANY_RECRUITER' ? (
                  <>
                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Hiring Organization Name *</label>
                      <input
                        type="text"
                        placeholder="Enter organization / corporate entity name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full min-w-0 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold focus:border-[#2563EB] outline-hidden rounded-xs box-border"
                      />
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Company Website *</label>
                      <input
                        type="url"
                        placeholder="https://yourcompany.com"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        className="w-full min-w-0 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs focus:border-[#2563EB] outline-hidden rounded-xs box-border"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Assigned Department *</label>
                      <input
                        type="text"
                        placeholder="Enter department name"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full min-w-0 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs box-border"
                      />
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Employee ID *</label>
                      <input
                        type="text"
                        placeholder="Enter employee / faculty ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="w-full min-w-0 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold focus:border-[#2563EB] outline-hidden rounded-xs box-border"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5 min-w-0">
                  <label className="text-xs font-bold text-[#0A2540] uppercase block">Official Designation *</label>
                  <input
                    type="text"
                    placeholder="Enter designation (e.g. Associate Professor, Dean)"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full min-w-0 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs box-border"
                  />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <label className="text-xs font-bold text-[#0A2540] uppercase block">Years of Experience</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full min-w-0 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold focus:border-[#2563EB] outline-hidden rounded-xs box-border"
                  />
                </div>
              </div>

              {/* Final Submit */}
              <div className="pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  disabled={!fullName || !email}
                  onClick={handleFinishOnboarding}
                  className="w-full py-3.5 sm:py-4 bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs shadow-md transition-all min-h-[44px] cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#F97316] shrink-0" /> COMPLETE REGISTRATION &amp; ENTER DASHBOARD
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CommandPaletteHUD />
    </div>
  );
}
