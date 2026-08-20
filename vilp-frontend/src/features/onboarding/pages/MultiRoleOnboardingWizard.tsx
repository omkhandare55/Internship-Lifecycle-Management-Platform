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
  Phone,
  Mail,
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
  const paramEmail = searchParams.get('email') || '';
  const paramName = searchParams.get('name') || '';
  const isGoogleAuth = searchParams.get('googleAuth') === 'true';

  const roleMeta = PLATFORM_ROLES.find((r) => r.id === roleParam) || PLATFORM_ROLES[0];

  const [currentStep, setCurrentStep] = useState(1);

  // Common Identity Fields (pre-filled from Google OAuth if available)
  const [fullName, setFullName] = useState(paramName);
  const [email, setEmail] = useState(paramEmail);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  // Email OTP States (Auto-verified if Google Auth)
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpVerified, setEmailOtpVerified] = useState(isGoogleAuth);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);

  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(
    isGoogleAuth ? '✓ Google Identity Authenticated. Complete your institutional registration details.' : ''
  );

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

  // Timer countdown hook
  useEffect(() => {
    let emailInterval: any;
    if (emailTimer > 0) {
      emailInterval = setInterval(() => setEmailTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(emailInterval);
  }, [emailTimer]);

  // Calculate Profile Completeness Percentage
  const calculateCompleteness = () => {
    let score = 20;
    if (fullName) score += 15;
    if (emailOtpVerified) score += 25;
    if (mobileNumber.length >= 10) score += 15;
    if (collegeName || companyName) score += 15;
    if (skills.length >= 2 || department || github || linkedin) score += 10;
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();

  const handleSendEmailOtp = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid institutional email address.');
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
      setErrorMessage('Please enter the 6-digit email verification code.');
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

    const mockId = `usr-${Date.now()}`;
    const userFullName = fullName || email.split('@')[0] || 'Verified Candidate';

    const studentProfile = {
      id: mockId,
      studentNumber: enrollmentNumber || 'REG-2026-001',
      fullName: userFullName,
      email: email,
      department: { id: 1, name: department || branch || 'Computer Science & Engineering', code: 'CSE' },
      branch: branch || 'Computer Science',
      collegeName: collegeName || universityName || 'Institutional Institute',
      universityName: universityName || collegeName || 'State Technical University',
      semester: 6,
      cgpa: 8.85,
      backlogs: 0,
      passingYear: 2026,
      phone: mobileNumber,
      linkedinUrl: linkedin || `https://linkedin.com/in/${encodeURIComponent(userFullName.toLowerCase().replace(/\s+/g, '-'))}`,
      portfolioUrl: github || `https://github.com/${encodeURIComponent(userFullName.toLowerCase().replace(/\s+/g, '-'))}`,
      about: `Enrolled student candidate in ${branch || 'Computer Science & Engineering'}.`,
      verificationStatus: 'VERIFIED',
      profileCompletion: completeness,
      skills: skills.length > 0 ? skills.map((s, idx) => ({ id: idx + 1, name: s })) : [
        { id: 1, name: 'Java' },
        { id: 2, name: 'Spring Boot' },
        { id: 3, name: 'React' },
        { id: 4, name: 'TypeScript' },
      ],
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('vilp_student_profile', JSON.stringify(studentProfile));
    } catch {}

    const mockUser = {
      id: mockId,
      email: email,
      fullName: userFullName,
      role: mappedRole,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`vilp_user_onboarded_${mockId}`, 'true');
    setAuth(mockUser as any, 'vilp-jwt-token-active', 'vilp-refresh-token-active');
    navigate(roleMeta.targetDashboard);
  };

  return (
    <div className="container-fluid p-0 min-h-screen bg-[#F8FAFC] text-[#0F172A] font-mono pb-5 w-100 overflow-x-hidden">
      {/* ── Top Status Bar (#0A2540) ────────────────────────────────────────── */}
      <div className="bg-[#0A2540] text-white border-b border-[#1E3A5F] px-3 px-md-4 py-3 sticky top-0 z-50">
        <div className="container p-0 d-flex align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2 gap-sm-3 min-w-0">
            <div className="w-8 h-8 bg-[#2563EB] text-white font-bold text-xs d-flex align-items-center justify-content-center rounded-xs shrink-0 shadow-xs">
              VILP
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold font-mono uppercase tracking-wider d-flex align-items-center gap-1.5">
                <span className="truncate max-w-[130px] sm:max-w-xs">{roleMeta.title.toUpperCase()}</span>
                <span className="text-[9px] sm:text-[10px] bg-[#F97316] text-white px-1.5 py-0.5 rounded-xs font-mono shrink-0">
                  {roleMeta.defaultTrustLevel}
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-mono d-none d-sm-block truncate m-0">
                {roleMeta.tagline}
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/onboarding/roles')}
              className="text-[11px] font-mono text-slate-300 hover:text-white underline text-nowrap cursor-pointer"
            >
              Roles
            </button>
            <div className="d-none d-md-flex flex-column align-items-end text-xs font-mono">
              <span className="text-slate-300 text-[10px] uppercase">COMPLETION</span>
              <span className="font-bold text-[#F97316]">{completeness}%</span>
            </div>
            <div className="w-16 sm:w-28 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-100 bg-gradient-to-r from-[#2563EB] to-[#F97316] transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container px-3 px-sm-4 pt-3 pt-sm-4 space-y-4">
        {/* ── Role Banner (#F1F5F9) ─────────────────────────────────────────── */}
        <div className="bg-[#F1F5F9] border border-[#CBD5E1] p-3 p-sm-4 rounded-xs d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 font-mono text-xs shadow-xs w-100">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] text-[#2563EB] font-bold uppercase tracking-wider block truncate">
              VERIFIED INTERNSHIP LIFECYCLE PLATFORM (VILP) &bull; REGISTRATION FOR {roleMeta.category}
            </span>
            <p className="text-slate-700 font-sans text-xs line-clamp-2 m-0">{roleMeta.description}</p>
          </div>
          <span className="px-2.5 py-1 bg-white border border-[#CBD5E1] text-[#0A2540] font-bold text-[10px] sm:text-[11px] uppercase rounded-xs text-nowrap shrink-0">
            {roleMeta.defaultTrustLevel}
          </span>
        </div>

        {/* Dynamic Alerts */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs font-mono font-medium d-flex align-items-center gap-2 rounded-xs w-100">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="break-words">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold d-flex align-items-center gap-2 rounded-xs w-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="break-words">{successMessage}</span>
          </div>
        )}

        {/* ── Dynamic Form Container (Bootstrap Row/Col System) ─────────────── */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-3 p-sm-4 p-md-5 shadow-xs space-y-4 w-100">
          {/* =========================================================================
              STUDENT ONBOARDING FLOW
             ========================================================================= */}
          {roleParam === 'STUDENT' && (
            <>
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in font-mono w-100">
                  <div className="border-bottom border-[#E2E8F0] pb-3 space-y-1">
                    <div className="d-inline-flex align-items-center gap-1.5 text-xs text-[#2563EB] font-bold">
                      <ShieldCheck className="w-4 h-4 text-[#F97316] shrink-0" /> STEP 1 // ACCOUNT IDENTITY &amp; EMAIL VERIFICATION
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-[#0A2540] uppercase font-sans tracking-tight m-0">
                      Create Your Institutional Profile
                    </h2>
                    <p className="text-xs text-slate-600 m-0">
                      Verify your institutional email to secure your immutable student credential passport.
                    </p>
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Full Legal Name *</label>
                      <input
                        type="text"
                        placeholder="Enter full legal name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs"
                      />
                    </div>

                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block d-flex align-items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#2563EB]" /> Mobile Number (10 Digits) *
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs"
                      />
                    </div>

                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Account Password *</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs focus:border-[#2563EB] outline-hidden rounded-xs"
                      />
                    </div>

                    {/* Email Verification Box */}
                    <div className="col-12 col-md-6">
                      <div className="space-y-2 border border-[#E2E8F0] p-3 p-sm-4 rounded-xs bg-[#F8FAFC] w-100 h-100 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <label className="text-xs font-bold text-[#0A2540] uppercase truncate m-0 d-flex align-items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-[#2563EB]" /> Institutional Email *
                            </label>
                            {emailOtpVerified ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-xs d-flex align-items-center gap-1 shrink-0">
                                <CheckCircle2 className="w-3 h-3" /> VERIFIED
                              </span>
                            ) : emailTimer > 0 ? (
                              <span className="text-[10px] text-slate-500 d-flex align-items-center gap-1 shrink-0">
                                <Clock className="w-3 h-3 text-amber-600" /> Resend in {emailTimer}s
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSendEmailOtp}
                                disabled={isSendingEmailOtp}
                                className="text-[10px] text-[#2563EB] hover:underline font-bold shrink-0 cursor-pointer"
                              >
                                {isSendingEmailOtp ? 'Sending...' : emailOtpSent ? 'RESEND CODE' : 'SEND CODE'}
                              </button>
                            )}
                          </div>
                          <input
                            type="email"
                            placeholder="user@institution.edu"
                            disabled={emailOtpVerified}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-100 p-2.5 text-xs border rounded-xs outline-hidden ${
                              emailOtpVerified ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-white border-[#CBD5E1] focus:border-[#2563EB]'
                            }`}
                          />
                        </div>
                        {!emailOtpVerified && (
                          <div className="pt-2 d-flex flex-column flex-sm-row gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              value={emailOtp}
                              onChange={(e) => setEmailOtp(e.target.value)}
                              placeholder="Enter 6-digit Code"
                              className="flex-grow-1 p-2 bg-white border border-[#CBD5E1] text-xs text-center tracking-widest focus:border-[#2563EB] outline-hidden rounded-xs font-bold"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyEmailOtp}
                              disabled={isVerifyingEmail || !emailOtp}
                              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-50 text-white text-xs font-bold rounded-xs d-flex align-items-center justify-content-center gap-1 shrink-0 min-h-[38px] cursor-pointer"
                            >
                              {isVerifyingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'VERIFY CODE'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end pt-3 border-top border-[#E2E8F0]">
                    <button
                      type="button"
                      disabled={!emailOtpVerified || !fullName || mobileNumber.length < 10}
                      onClick={() => {
                        setErrorMessage('');
                        setCurrentStep(2);
                      }}
                      className={`w-100 w-sm-auto px-5 py-3 font-bold text-xs d-flex align-items-center justify-content-center gap-2 rounded-xs shadow-xs min-h-[44px] ${
                        emailOtpVerified && fullName && mobileNumber.length >= 10
                          ? 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      PROCEED TO INSTITUTIONAL DETAILS <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in font-mono w-100">
                  <div className="border-bottom border-[#E2E8F0] pb-3 space-y-1">
                    <div className="d-inline-flex align-items-center gap-1.5 text-xs text-[#2563EB] font-bold">
                      <GraduationCap className="w-4 h-4 text-[#F97316] shrink-0" /> STEP 2 // ACADEMIC DETAILS
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-[#0A2540] uppercase font-sans tracking-tight m-0">
                      Enrollment &amp; Department Mapping
                    </h2>
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">College / Institute *</label>
                      <input
                        type="text"
                        placeholder="Enter college / institute name"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs"
                      />
                    </div>

                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">University *</label>
                      <input
                        type="text"
                        placeholder="Enter university name"
                        value={universityName}
                        onChange={(e) => setUniversityName(e.target.value)}
                        className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs"
                      />
                    </div>

                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Branch / Department *</label>
                      <input
                        type="text"
                        placeholder="Enter branch / department"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs"
                      />
                    </div>

                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">University Roll Number *</label>
                      <input
                        type="text"
                        placeholder="Enter university roll / enrollment number"
                        value={enrollmentNumber}
                        onChange={(e) => setEnrollmentNumber(e.target.value)}
                        className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold focus:border-[#2563EB] outline-hidden rounded-xs"
                      />
                    </div>
                  </div>

                  <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 pt-3 border-top border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-100 w-sm-auto px-4 py-2.5 bg-[#F1F5F9] hover:bg-white text-[#0A2540] border border-[#CBD5E1] font-bold text-xs d-flex align-items-center justify-content-center gap-2 rounded-xs min-h-[44px] cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" /> PREVIOUS
                    </button>
                    <button
                      type="button"
                      disabled={!collegeName || !enrollmentNumber}
                      onClick={() => setCurrentStep(3)}
                      className="w-100 w-sm-auto px-5 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-bold text-xs d-flex align-items-center justify-content-center gap-2 rounded-xs shadow-xs min-h-[44px] cursor-pointer"
                    >
                      RESUME INGESTION <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 animate-fade-in font-mono w-100">
                  <div className="border-bottom border-[#E2E8F0] pb-3 space-y-1">
                    <div className="d-inline-flex align-items-center gap-1.5 text-xs text-[#2563EB] font-bold">
                      <Upload className="w-4 h-4 text-[#F97316] shrink-0" /> STEP 3 // SMART RESUME DROP
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-[#0A2540] uppercase font-sans tracking-tight m-0">
                      Drop Resume to Auto-Fill Profile
                    </h2>
                  </div>

                  <div className="border-2 border-dashed border-[#2563EB] bg-[#F8FAFC] p-4 p-sm-5 text-center rounded-xs space-y-3 w-100">
                    <FileText className="w-10 h-10 text-[#2563EB] mx-auto" />
                    <p className="text-xs text-slate-600 m-0">Supports PDF &bull; AI Entity Extractor</p>
                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                      <label className="px-4 py-2.5 bg-[#2563EB] text-white font-bold text-xs rounded-xs cursor-pointer hover:bg-[#1d4ed8] text-center min-h-[44px] d-flex align-items-center justify-content-center shadow-xs">
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

                  <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 pt-3 border-top border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-100 w-sm-auto px-4 py-2.5 bg-[#F1F5F9] text-[#0A2540] border border-[#CBD5E1] font-bold text-xs d-flex align-items-center justify-content-center gap-2 rounded-xs min-h-[44px] cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" /> PREVIOUS
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFinishOnboarding()}
                      className="w-100 w-sm-auto px-5 py-3 bg-[#2563EB] text-white font-bold text-xs rounded-xs shadow-xs min-h-[44px] cursor-pointer"
                    >
                      COMPLETE REGISTRATION &rarr;
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
            <div className="space-y-4 animate-fade-in font-mono w-100">
              <div className="border-bottom border-[#E2E8F0] pb-3 space-y-1">
                <div className="d-inline-flex align-items-center gap-1.5 text-xs text-[#2563EB] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#F97316] shrink-0" /> {roleMeta.title.toUpperCase()} // REGISTRATION &amp; VERIFICATION
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-[#0A2540] uppercase font-sans tracking-tight m-0">
                  {roleMeta.title} Profile Setup
                </h2>
                <p className="text-xs text-slate-600 m-0">
                  Provide your professional credentials to establish verified {roleMeta.category.toLowerCase()} authorization.
                </p>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6 space-y-1.5">
                  <label className="text-xs font-bold text-[#0A2540] uppercase block">Full Legal Name *</label>
                  <input
                    type="text"
                    placeholder="Enter full legal name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs"
                  />
                </div>

                <div className="col-12 col-md-6 space-y-1.5">
                  <label className="text-xs font-bold text-[#0A2540] uppercase block d-flex align-items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#2563EB]" /> Mobile Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs"
                  />
                </div>

                <div className="col-12 col-md-6 space-y-1.5">
                  <label className="text-xs font-bold text-[#0A2540] uppercase block">
                    {roleParam === 'COMPANY_RECRUITER' ? 'Corporate Work Email *' : 'Official Institutional Email *'}
                  </label>
                  <input
                    type="email"
                    placeholder={roleParam === 'COMPANY_RECRUITER' ? 'recruiter@company.com' : 'official@institution.edu'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs"
                  />
                </div>

                {roleParam === 'COMPANY_RECRUITER' ? (
                  <>
                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Hiring Organization Name *</label>
                      <input
                        type="text"
                        placeholder="Enter organization / corporate entity name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold focus:border-[#2563EB] outline-hidden rounded-xs"
                      />
                    </div>
                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Company Website *</label>
                      <input
                        type="url"
                        placeholder="https://yourcompany.com"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs focus:border-[#2563EB] outline-hidden rounded-xs"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Assigned Department *</label>
                      <input
                        type="text"
                        placeholder="Enter department name"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs"
                      />
                    </div>
                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Employee ID *</label>
                      <input
                        type="text"
                        placeholder="Enter employee / faculty ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold focus:border-[#2563EB] outline-hidden rounded-xs"
                      />
                    </div>
                  </>
                )}

                <div className="col-12 col-md-6 space-y-1.5">
                  <label className="text-xs font-bold text-[#0A2540] uppercase block">Official Designation *</label>
                  <input
                    type="text"
                    placeholder="Enter designation (e.g. Associate Professor, Dean)"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs"
                  />
                </div>

                <div className="col-12 col-md-6 space-y-1.5">
                  <label className="text-xs font-bold text-[#0A2540] uppercase block">Years of Experience</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold focus:border-[#2563EB] outline-hidden rounded-xs"
                  />
                </div>
              </div>

              {/* Final Submit */}
              <div className="pt-3 border-top border-[#E2E8F0]">
                <button
                  type="button"
                  disabled={!fullName || !email || mobileNumber.length < 10}
                  onClick={handleFinishOnboarding}
                  className="w-100 py-3.5 bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider d-flex align-items-center justify-content-center gap-2 rounded-xs shadow-xs transition-all min-h-[44px] cursor-pointer"
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
