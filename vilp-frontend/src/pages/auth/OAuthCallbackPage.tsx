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
          const role = (sessionUser.user_metadata?.role as any) || 'STUDENT';

          const userObj = {
            id: sessionUser.id,
            email: sessionUser.email || '',
            role: role,
            emailVerified: true,
            createdAt: sessionUser.created_at,
          };

          setAuth(userObj as any, data.session.access_token, data.session.refresh_token || '');
          setStatus('success');

          setTimeout(() => {
            if (role === 'COMPANY') navigate('/company/dashboard');
            else if (role === 'MENTOR') navigate('/mentor/dashboard');
            else if (role === 'TNP_OFFICER' || role === 'TNP_HEAD') navigate('/tnp/dashboard');
            else if (role === 'SUPER_ADMIN') navigate('/admin/dashboard');
            else navigate('/student/dashboard');
          }, 800);
        } else {
          // Check hash parameters in URL
          const hash = window.location.hash;
          if (hash && hash.includes('access_token')) {
            setStatus('success');
            setTimeout(() => navigate('/student/dashboard'), 800);
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
    <div className="min-h-screen bg-[#F4EEF7] flex flex-col items-center justify-center p-4 text-[#171024]">
      <div className="max-w-md w-full bg-white p-8 border border-[#E0D3E8] rounded-sm shadow-sm text-center space-y-4">
        {status === 'loading' && (
          <>
            <Loader2 className="w-10 h-10 text-[#723ECF] animate-spin mx-auto" />
            <h2 className="font-bold text-base font-['Space_Grotesk']">
              Authenticating with Google...
            </h2>
            <p className="text-xs text-[#5D4A75]">
              Validating identity tokens with Supabase Auth provider...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h2 className="font-bold text-base text-emerald-900 font-['Space_Grotesk']">
              Authentication Successful
            </h2>
            <p className="text-xs text-emerald-700">Redirecting to your VILP portal...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
            <h2 className="font-bold text-base text-rose-900 font-['Space_Grotesk']">
              Authentication Failed
            </h2>
            <p className="text-xs text-rose-700">{errorMsg}</p>
            <button
              onClick={() => navigate('/auth/login')}
              className="mt-4 px-4 py-2 bg-[#723ECF] text-white text-xs font-bold rounded-sm"
            >
              Return to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
