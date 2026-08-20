import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabaseClient';
import { useAuthStore } from '@/stores/authStore';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function handleOAuth() {
      try {
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data.session) {
          const sessionUser = data.session.user;
          const email = sessionUser.email || '';
          const fullName = sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || '';
          const existingRole = sessionUser.user_metadata?.role as any;
          const isOnboarded = localStorage.getItem(`vilp_user_onboarded_${sessionUser.id}`) === 'true' || !!sessionUser.user_metadata?.onboarded;

          // If new user who has not completed role registration, route them to register / select role first
          if (!isOnboarded && !existingRole) {
            setStatus('success');
            setTimeout(() => {
              navigate(`/onboarding/roles?email=${encodeURIComponent(email)}&name=${encodeURIComponent(fullName)}&googleAuth=true`);
            }, 600);
            return;
          }

          // Existing onboarded user
          const userObj = {
            id: sessionUser.id,
            email: email,
            role: existingRole || 'STUDENT',
            emailVerified: true,
            createdAt: sessionUser.created_at,
          };

          setAuth(userObj as any, data.session.access_token, data.session.refresh_token || '');
          setStatus('success');

          setTimeout(() => {
            if (existingRole === 'COMPANY') navigate('/company/dashboard');
            else if (existingRole === 'MENTOR') navigate('/mentor/dashboard');
            else if (existingRole === 'TNP_OFFICER' || existingRole === 'TNP_HEAD') navigate('/tnp/dashboard');
            else if (existingRole === 'SUPER_ADMIN') navigate('/admin/dashboard');
            else navigate('/student/dashboard');
          }, 800);
        } else {
          // Check hash parameters in URL
          const hash = window.location.hash;
          if (hash && hash.includes('access_token')) {
            setStatus('success');
            setTimeout(() => navigate('/onboarding/roles?googleAuth=true'), 800);
          } else {
            navigate('/auth/login');
          }
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err.message || 'Google Authentication failed');
      }
    }

    handleOAuth();
  }, [navigate, setAuth]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-[#0F172A] font-mono">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 border border-[#CBD5E1] rounded-xs shadow-xs text-center space-y-4">
        {status === 'loading' && (
          <>
            <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin mx-auto" />
            <h2 className="font-bold text-base uppercase font-sans text-[#0A2540] m-0">
              Authenticating with Google...
            </h2>
            <p className="text-xs text-slate-600 font-mono m-0">
              Validating identity credentials with Verified Internship Lifecycle Platform (VILP)...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h2 className="font-bold text-base text-emerald-900 uppercase font-sans m-0">
              Google Identity Verified
            </h2>
            <p className="text-xs text-emerald-700 font-mono m-0">
              Routing to institutional profile setup...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
            <h2 className="font-bold text-base text-red-900 uppercase font-sans m-0">
              Authentication Failed
            </h2>
            <p className="text-xs text-red-700 font-mono m-0">{errorMsg}</p>
            <button
              onClick={() => navigate('/auth/login')}
              className="mt-4 px-4 py-2 bg-[#0A2540] text-white text-xs font-bold font-mono uppercase rounded-xs"
            >
              Return to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
