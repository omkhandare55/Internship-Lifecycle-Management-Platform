import { useState } from 'react';
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
  Phone,
  Mail,
} from 'lucide-react';
import { PLATFORM_ROLES, type UserRoleType } from '../types/roleTypes';
import { parseResumeWithAi } from '../services/aiResumeParserService';
import { CommandPaletteHUD } from '@/components/CommandPaletteHUD';
import { useAuthStore } from '@/stores/authStore';
import { tokenUtils } from '@/utils/tokenUtils';
import { authApi } from '@/features/auth/api/authApi';
import { studentApi, companyApi } from '@/services/vilpApi';
import { firebaseSignInWithGoogle } from '@/services/firebaseClient';

export function MultiRoleOnboardingWizard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roleParam = (searchParams.get('role') as UserRoleType) || 'STUDENT';
  const paramEmail = searchParams.get('email') || '';
  const paramName = searchParams.get('name') || '';
  const isGoogleAuth = searchParams.get('googleAuth') === 'true';

  const roleMeta = PLATFORM_ROLES.find((r) => r.id === roleParam) || PLATFORM_ROLES[0];

  let mappedRole: 'STUDENT' | 'COMPANY' | 'MENTOR' | 'TNP_OFFICER' | 'SUPER_ADMIN' = 'STUDENT';
  const roleKey = (roleParam as string || '').toUpperCase();
  if (roleKey === 'COMPANY_RECRUITER' || roleKey === 'COMPANY') mappedRole = 'COMPANY';
  else if (roleKey === 'FACULTY_MENTOR' || roleKey === 'MENTOR' || roleKey === 'FACULTY') mappedRole = 'MENTOR';
  else if (roleKey === 'TNP_OFFICER' || roleKey === 'TNP' || roleKey === 'TNP_HEAD') mappedRole = 'TNP_OFFICER';
  else if (roleKey === 'SUPER_ADMIN' || roleKey === 'ADMIN') mappedRole = 'SUPER_ADMIN';
  else mappedRole = 'STUDENT';

  const [currentStep, setCurrentStep] = useState(1);

  // Common Identity Fields (pre-filled from Google OAuth if available)
  const [fullName, setFullName] = useState(paramName);
  const [email, setEmail] = useState(paramEmail);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Role-Specific Fields
  const [collegeName, setCollegeName] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [branch, setBranch] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');

  const [successMessage] = useState(
    isGoogleAuth ? '✓ Google Identity Authenticated. Complete your institutional registration details.' : ''
  );

  const completeness = currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100;

  const handleResumeUpload = async (file: File) => {
    try {
      const parsedData: any = await parseResumeWithAi(file);
      if (parsedData.fullName?.value) setFullName(parsedData.fullName.value);
      if (parsedData.email?.value) setEmail(parsedData.email.value);
      if (parsedData.branch?.value) setBranch(parsedData.branch.value);
      if (parsedData.linkedinUrl?.value) setLinkedin(parsedData.linkedinUrl.value);
      if (parsedData.githubUrl?.value) setGithub(parsedData.githubUrl.value);
    } catch {
      // Non-blocking fallback
    }
    handleFinishOnboarding();
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinishOnboarding = async () => {
    setErrorMessage('');
    setIsSubmitting(true);

    if (mappedRole === 'SUPER_ADMIN') {
      setErrorMessage('Institutional Administrator accounts cannot be self-registered publicly. Please use institutional admin credentials or contact your system administrator.');
      setIsSubmitting(false);
      return;
    }

    const userFullName = fullName || email.split('@')[0] || 'Verified Candidate';

    const effectivePassword = password && password.length >= 8
      ? password
      : isGoogleAuth
        ? `GAuth_${btoa(email.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10)}!9Xz`
        : '';

    if (!isGoogleAuth && effectivePassword.length < 8) {
      setErrorMessage('Please provide an account password of at least 8 characters.');
      setIsSubmitting(false);
      return;
    }

    try {
      let accessToken: string | null = null;
      let refreshToken: string | null = null;

      // ── Step 1: Register new user account via backend API ──────────────
      try {
        await authApi.register({
          email: email.toLowerCase(),
          password: effectivePassword,
          role: mappedRole,
        });
      } catch (regError: any) {
        // If user already exists, we will attempt to login
        if (regError?.code !== 'EMAIL_ALREADY_EXISTS' && !regError?.message?.includes('already exists')) {
          console.warn('Backend registration note:', regError?.message);
        }
      }

      // ── Step 2: Login to get real JWT tokens ──────────────────────────
      const loginRes = await authApi.login({
        email: email.toLowerCase(),
        password: effectivePassword,
      });

      if (!loginRes?.data?.accessToken) {
        throw new Error('Could not obtain authenticated server token. Please log in directly.');
      }

      accessToken = loginRes.data.accessToken;
      refreshToken = loginRes.data.refreshToken;
      tokenUtils.setTokens(accessToken, refreshToken);
      useAuthStore.getState().setAuth(loginRes.data.user, accessToken, refreshToken);

      // ── Step 3: Create role-specific profile via backend API ──────────
      try {
        if (mappedRole === 'STUDENT') {
          await studentApi.createProfile({
            studentNumber: enrollmentNumber || `REG-${Date.now()}`,
            fullName: userFullName,
            branch: branch || 'Computer Science',
            semester: 6,
            cgpa: 8.5,
            backlogs: 0,
            passingYear: 2026,
            phone: mobileNumber,
            linkedinUrl: linkedin || undefined,
            portfolioUrl: github || undefined,
            about: `Enrolled student in ${branch || 'Computer Science & Engineering'}.`,
          } as any);
        } else if (mappedRole === 'COMPANY') {
          await companyApi.createProfile({
            name: companyName || 'Company',
            description: `Recruiting organization registered via ${roleParam}`,
            website: companyWebsite || undefined,
            contactEmail: email,
            contactPhone: mobileNumber,
            contactPersonName: userFullName,
          } as any);
        }
      } catch (profileError: any) {
        // Profile creation may fail if it already exists — not a blocker
        const code = profileError?.code || '';
        if (code !== 'PROFILE_EXISTS' && code !== 'STUDENT_NUMBER_EXISTS') {
          console.warn('Profile creation note:', profileError?.message);
        }
      }

      // ── Step 4: Finalize authenticated user state and navigate ────────
      navigate(roleMeta.targetDashboard);

    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid p-0 min-h-screen bg-[#F8FAFC] text-[#0F172A] font-mono pb-5 w-100 overflow-x-hidden">
      {/* ── Top Status Bar (#0A2540) ────────────────────────────────────────── */}
      <div className="bg-[#0A2540] text-white border-b border-[#1E3A5F] px-3 px-md-4 py-3 sticky top-0 z-50">
        <div className="container p-0 d-flex align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2 gap-sm-3 min-w-0">
            <img src="/favicon.svg" alt="VILP" className="w-8 h-8 object-contain shrink-0" />
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
        <div className="relative bg-white border border-[#CBD5E1] rounded-[2px_12px_2px_12px] p-4 sm:p-6 p-md-8 shadow-[4px_4px_0px_0px_#0A2540] space-y-4 w-100">
          {/* Corner Crosshair Decoration */}
          <div className="absolute top-2 right-2.5 text-[10px] text-slate-300 font-bold select-none pointer-events-none">
            +
          </div>
          {/* =========================================================================
              STUDENT ONBOARDING FLOW
             ========================================================================= */}
          {roleParam === 'STUDENT' && (
            <>
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in font-mono w-100">
                  <div className="border-bottom border-[#CBD5E1] pb-3 space-y-1">
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

                  <form onSubmit={(e) => e.preventDefault()} className="row g-3">
                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Full Legal Name *</label>
                      <input
                        type="text"
                        placeholder="Enter full legal name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="input-field"
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
                        className="input-field"
                      />
                    </div>

                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Account Password *</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        autoComplete="new-password"
                      />
                    </div>

                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block d-flex align-items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-[#2563EB]" /> Institutional Email *
                      </label>
                      <input
                        type="email"
                        placeholder="user@institution.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </form>

                  <div className="d-flex justify-content-end pt-3 border-top border-[#CBD5E1]">
                    <button
                      type="button"
                      disabled={!fullName || !email || mobileNumber.length < 10}
                      onClick={() => {
                        setErrorMessage('');
                        setCurrentStep(2);
                      }}
                      className="btn-primary w-100 w-sm-auto min-h-[44px] cursor-pointer"
                    >
                      PROCEED TO INSTITUTIONAL DETAILS <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in font-mono w-100">
                  <div className="border-bottom border-[#CBD5E1] pb-3 space-y-1">
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
                        className="input-field"
                      />
                    </div>

                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">University *</label>
                      <input
                        type="text"
                        placeholder="Enter university name"
                        value={universityName}
                        onChange={(e) => setUniversityName(e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Branch / Department *</label>
                      <input
                        type="text"
                        placeholder="Enter branch / department"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">University Roll Number *</label>
                      <input
                        type="text"
                        placeholder="Enter university roll / enrollment number"
                        value={enrollmentNumber}
                        onChange={(e) => setEnrollmentNumber(e.target.value)}
                        className="input-field font-bold"
                      />
                    </div>
                  </div>

                  <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 pt-3 border-top border-[#CBD5E1]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="btn-secondary w-100 w-sm-auto min-h-[44px] cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" /> PREVIOUS
                    </button>
                    <button
                      type="button"
                      disabled={!collegeName || !enrollmentNumber}
                      onClick={() => setCurrentStep(3)}
                      className="btn-primary w-100 w-sm-auto min-h-[44px] cursor-pointer"
                    >
                      RESUME INGESTION <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 animate-fade-in font-mono w-100">
                  <div className="border-bottom border-[#CBD5E1] pb-3 space-y-1">
                    <div className="d-inline-flex align-items-center gap-1.5 text-xs text-[#2563EB] font-bold">
                      <Upload className="w-4 h-4 text-[#F97316] shrink-0" /> STEP 3 // SMART RESUME DROP
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-[#0A2540] uppercase font-sans tracking-tight m-0">
                      Drop Resume to Auto-Fill Profile
                    </h2>
                  </div>

                  <div className="border-2 border-dashed border-[#2563EB] bg-[#F8FAFC] p-4 p-sm-6 text-center rounded-[2px_8px_2px_8px] space-y-3 w-100 shadow-[2px_2px_0px_0px_#CBD5E1]">
                    <FileText className="w-10 h-10 text-[#2563EB] mx-auto" />
                    <p className="text-xs text-slate-600 m-0">Supports PDF &bull; AI Entity Extractor</p>
                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                      <label className="btn-primary cursor-pointer text-center min-h-[44px] d-flex align-items-center justify-content-center">
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

                  <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 pt-3 border-top border-[#CBD5E1]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="btn-secondary w-100 w-sm-auto min-h-[44px] cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" /> PREVIOUS
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleFinishOnboarding()}
                      className="btn-primary w-100 w-sm-auto min-h-[44px] cursor-pointer"
                    >
                      {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin shrink-0" /> REGISTERING...</> : <>COMPLETE REGISTRATION &rarr;</>}
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
              <div className="border-bottom border-[#CBD5E1] pb-3 space-y-1">
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

              {/* Fast-Track Google Sign-Up for Company / T&P / Mentor */}
              <div className="bg-[#F8FAFC] border border-[#CBD5E1] p-3 rounded-xs space-y-2">
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-[11px] font-bold text-[#0A2540] uppercase">
                    ⚡ 1-Click Fast Track:
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Google Auth Supported</span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setIsSubmitting(true);
                      setErrorMessage('');
                      const result = await firebaseSignInWithGoogle();
                      const fbUser = result.user;
                      const gEmail = fbUser.email || '';
                      const gName = fbUser.displayName || fullName || 'User';
                      const uid = fbUser.uid;
                      const idToken = await fbUser.getIdToken();

                      const res = await authApi.firebaseLogin({
                        email: gEmail,
                        displayName: gName,
                        uid,
                        idToken,
                        role: mappedRole as any,
                      });

                      if (res.success && res.data) {
                        const { user, accessToken, refreshToken } = res.data;
                        tokenUtils.setTokens(accessToken, refreshToken);
                        useAuthStore.getState().setAuth(user, accessToken, refreshToken);

                        if (mappedRole === 'COMPANY') {
                          try {
                            await companyApi.createProfile({
                              name: companyName || `${gName} Organization`,
                              contactEmail: gEmail,
                              contactPersonName: gName,
                            } as any);
                          } catch (_) {}
                        }

                        navigate(roleMeta.targetDashboard);
                      }
                    } catch (gErr: any) {
                      setErrorMessage(gErr.message || 'Google registration failed.');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="btn-secondary w-100 min-h-[42px] d-flex align-items-center justify-content-center gap-2 font-bold text-xs uppercase cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Register &amp; Sign In with Google as {roleMeta.title}
                </button>
              </div>

              <div className="d-flex align-items-center gap-3 my-1">
                <div className="flex-1 border-t border-[#CBD5E1]" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  OR ENTER CREDENTIALS
                </span>
                <div className="flex-1 border-t border-[#CBD5E1]" />
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6 space-y-1.5">
                  <label className="text-xs font-bold text-[#0A2540] uppercase block">Full Legal Name *</label>
                  <input
                    type="text"
                    placeholder="Enter full legal name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field"
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
                    className="input-field"
                  />
                </div>

                <div className="col-12 col-md-6 space-y-1.5">
                  <label className="text-xs font-bold text-[#0A2540] uppercase block">Account Password (Min 8 Characters) *</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    autoComplete="new-password"
                  />
                </div>

                <div className="col-12 col-md-6 space-y-1.5">
                  <label className="text-xs font-bold text-[#0A2540] uppercase block d-flex align-items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#2563EB]" /> {roleParam === 'COMPANY_RECRUITER' ? 'Work Email *' : 'Official Email *'}
                  </label>
                  <input
                    type="email"
                    placeholder={roleParam === 'COMPANY_RECRUITER' ? 'recruiter@company.com' : 'official@institution.edu'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
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
                        className="input-field font-bold"
                      />
                    </div>
                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Company Website *</label>
                      <input
                        type="url"
                        placeholder="https://yourcompany.com"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        className="input-field"
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
                        className="input-field"
                      />
                    </div>
                    <div className="col-12 col-md-6 space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2540] uppercase block">Employee ID *</label>
                      <input
                        type="text"
                        placeholder="Enter employee / faculty ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="input-field font-bold"
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
                    className="input-field"
                  />
                </div>

                <div className="col-12 col-md-6 space-y-1.5">
                  <label className="text-xs font-bold text-[#0A2540] uppercase block">Years of Experience</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="input-field font-bold"
                  />
                </div>
              </div>

              {/* Final Submit */}
              <div className="pt-3 border-top border-[#CBD5E1]">
                <button
                  type="button"
                  disabled={!fullName || !email || mobileNumber.length < 10 || isSubmitting}
                  onClick={handleFinishOnboarding}
                  className="btn-primary w-100 min-h-[44px] cursor-pointer"
                >
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin shrink-0" /> REGISTERING...</> : <><Zap className="w-4 h-4 text-[#F97316] shrink-0" /> COMPLETE REGISTRATION &amp; ENTER DASHBOARD</>}
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
