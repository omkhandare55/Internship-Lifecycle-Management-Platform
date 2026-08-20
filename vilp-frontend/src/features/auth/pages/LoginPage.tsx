import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../schemas/authSchemas';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/services/supabaseClient';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

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
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setServerError(
        error.response?.data?.error?.message || 'Invalid credentials. Please verify and try again.'
      );
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setServerError('');
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      if (err.message && err.message.includes('provider is not enabled')) {
        setServerError(
          'Google Provider is not enabled in your Supabase Dashboard yet. Enable it at: supabase.com/dashboard/project/pabrkfwturuzewbkswwu/auth/providers'
        );
      } else {
        setServerError(err.message || 'Google OAuth failed to initialize');
      }
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-[#171024] uppercase font-sans">
          Identity Authentication
        </h2>
        <p className="text-xs text-zinc-600 font-mono">
          Enter institutional credentials or authenticate with Google OAuth.
        </p>
      </div>

      {serverError && (
        <div className="p-3 bg-[#fdf2f4] border border-[#ED4B86] text-[#ED4B86] text-xs font-mono font-bold">
          ERROR: {serverError}
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full py-2.5 px-4 bg-white border-2 border-[#171024] hover:bg-[#FEF8E7] text-[#171024] font-bold text-xs flex items-center justify-center gap-2.5 transition-colors shadow-sm font-mono uppercase"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
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
        {googleLoading ? 'CONNECTING GOOGLE OAUTH...' : 'CONTINUE WITH GOOGLE'}
      </button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E0D3E8]"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-bold">
          <span className="bg-white px-2 text-zinc-500 font-mono">OR USE EMAIL CREDENTIALS</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">INSTITUTIONAL EMAIL</label>
          <input
            {...register('email')}
            type="email"
            placeholder="user@vilp.edu"
            className={`input-field ${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label">AUTHENTICATION KEY (PASSWORD)</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#723ECF]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-600 pt-1 font-bold">
          <Link to="/auth/forgot-password" className="hover:text-[#723ECF] transition-colors">
            [ FORGOT KEY? ]
          </Link>
          <Link to="/auth/register" className="hover:text-[#723ECF] transition-colors">
            [ REGISTER NEW ID ]
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3 text-xs justify-center font-bold tracking-widest mt-2"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> VERIFYING CREDENTIALS...
            </span>
          ) : (
            'AUTHENTICATE & ENTER PORTAL'
          )}
        </button>
      </form>
    </div>
  );
}
