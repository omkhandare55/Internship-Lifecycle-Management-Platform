import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ShieldCheck, Lock, Mail } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../schemas/authSchemas';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/stores/authStore';
import { firebaseSignInWithGoogle } from '@/services/firebaseClient';
import { ApiError } from '@/services/axiosInstance';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleRole, setGoogleRole] = useState<'STUDENT' | 'COMPANY' | 'TNP_OFFICER' | 'MENTOR'>('STUDENT');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const getRolePath = (role: string) => {
    switch (role) {
      case 'STUDENT':     return '/student/dashboard';
      case 'COMPANY':     return '/company/dashboard';
      case 'MENTOR':      return '/mentor/dashboard';
      case 'TNP_OFFICER':
      case 'TNP_HEAD':    return '/tnp/dashboard';
      case 'SUPER_ADMIN': return '/admin/dashboard';
      default:            return '/student/dashboard';
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setServerError('');
    try {
      const res = await authApi.login(data);
      if (res.success && res.data) {
        const { user, accessToken, refreshToken } = res.data;
        setAuth(user, accessToken, refreshToken);
        navigate(getRolePath(user.role));
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        // Map backend error codes to user-friendly messages
        const messages: Record<string, string> = {
          INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
          ACCOUNT_LOCKED: 'Account temporarily locked due to too many failed attempts. Try again in 30 minutes.',
          EMAIL_NOT_VERIFIED: 'Please verify your email address before logging in. Check your inbox.',
          ACCOUNT_SUSPENDED: 'Your account has been suspended. Contact the administrator.',
          REQUEST_TIMEOUT: 'The server is waking up (cold start). Please wait 30 seconds and try again.',
          NETWORK_ERROR: 'Cannot connect to server. Please check your internet connection.',
        };
        setServerError(messages[err.code] || err.message || 'Login failed. Please try again.');
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setServerError('');
    try {
      const result = await firebaseSignInWithGoogle();
      const fbUser = result.user;
      const email = fbUser.email || '';
      const displayName = fbUser.displayName || '';
      const uid = fbUser.uid;
      const idToken = await fbUser.getIdToken();

      // Synchronize with VILP backend with chosen role
      const res = await authApi.firebaseLogin({
        email,
        displayName,
        uid,
        idToken,
        role: googleRole as any,
      });

      if (res.success && res.data) {
        const { user: authUser, accessToken, refreshToken } = res.data;
        setAuth(authUser, accessToken, refreshToken);
        navigate(getRolePath(authUser.role));
      } else {
        throw new Error('Could not synchronize authentication with server.');
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        // User closed popup; do not display error
      } else {
        const status = err.response?.status;
        let msg = err.response?.data?.message || err.message || 'Firebase Google Authentication failed.';
        if (status === 500 || status === 502 || status === 503) {
          msg = 'Cloud backend is currently completing deployment or waking up from cold start (~20s). Please retry in a few moments.';
        }
        setServerError(msg);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-4 font-mono">
      <div className="space-y-1 border-bottom border-[#E2E8F0] pb-3">
        <div className="d-inline-flex align-items-center gap-1.5 text-xs text-[#2563EB] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" /> VILP // SECURE RBAC GATEWAY
        </div>
        <h2 className="text-lg sm:text-xl font-black text-[#0A2540] uppercase font-sans tracking-tight m-0">
          Account Sign In
        </h2>
        <p className="text-xs text-slate-600 m-0">
          Enter institutional credentials or authenticate via Google OAuth.
        </p>
      </div>

      {serverError && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs font-mono font-medium rounded-xs">
          ERROR: {serverError}
        </div>
      )}

      {/* Role Selection for Google Auth */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
          Sign In Role:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
          {[
            { role: 'STUDENT', label: '🎓 Student' },
            { role: 'COMPANY', label: '🏢 Company' },
            { role: 'TNP_OFFICER', label: '🏛️ T&P' },
            { role: 'MENTOR', label: '👨‍🏫 Mentor' },
          ].map((item) => (
            <button
              key={item.role}
              type="button"
              onClick={() => setGoogleRole(item.role as any)}
              className={`px-2 py-1.5 text-[10px] font-bold uppercase rounded-xs border transition-all cursor-pointer ${
                googleRole === item.role
                  ? 'bg-[#0A2540] text-white border-[#0A2540]'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="btn-secondary w-100 min-h-[44px] flex items-center justify-center gap-2.5 font-bold text-xs uppercase cursor-pointer"
      >
        {googleLoading ? (
          <Loader2 className="w-4 h-4 text-[#2563EB] animate-spin" />
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        Continue with Google as {googleRole}
      </button>

      <div className="d-flex align-items-center gap-3 my-2">
        <div className="flex-grow-1 border-bottom border-[#CBD5E1]" />
        <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">
          OR INSTITUTIONAL EMAIL
        </span>
        <div className="flex-grow-1 border-bottom border-[#CBD5E1]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#0A2540] uppercase block d-flex align-items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-[#2563EB]" /> Email Address *
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="user@institution.edu"
            className="input-field"
          />
          {errors.email && <p className="text-[11px] text-red-600 font-bold m-0">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <div className="d-flex align-items-center justify-content-between">
            <label className="text-xs font-bold text-[#0A2540] uppercase block d-flex align-items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#2563EB]" /> Password *
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-[11px] font-bold text-[#2563EB] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="position-relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              autoComplete="current-password"
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="position-absolute end-0 top-0 bottom-0 px-3 text-slate-500 hover:text-[#0A2540] d-flex align-items-center cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-600 font-bold m-0">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-100 min-h-[44px] cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'AUTHENTICATE & ENTER PORTAL'
          )}
        </button>
      </form>

      <div className="text-center pt-2 border-top border-[#E2E8F0]">
        <p className="text-xs text-slate-600 m-0">
          New institutional member?{' '}
          <Link
            to="/onboarding/roles"
            className="text-[#2563EB] font-bold hover:underline"
          >
            Create your account &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
