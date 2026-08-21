import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseAuth } from '@/services/firebaseClient';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/stores/authStore';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  const getRolePath = (role: string) => {
    switch (role) {
      case 'COMPANY': return '/company/dashboard';
      case 'MENTOR': return '/mentor/dashboard';
      case 'TNP_OFFICER':
      case 'TNP_HEAD': return '/tnp/dashboard';
      case 'SUPER_ADMIN': return '/admin/dashboard';
      default: return '/student/dashboard';
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function handleAuth() {
      try {
        // First check if coming back from a redirect operation
        const redirectResult = await getRedirectResult(firebaseAuth).catch(() => null);
        const currentUser = redirectResult?.user || firebaseAuth.currentUser;

        if (currentUser) {
          await processFirebaseUser(currentUser);
          return;
        }

        // If not immediately available, subscribe to auth state change
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
          if (!isMounted) return;
          if (fbUser) {
            await processFirebaseUser(fbUser);
          } else {
            // Check hash parameters for legacy callbacks
            const hash = window.location.hash;
            if (hash && hash.includes('access_token')) {
              setStatus('success');
              setTimeout(() => navigate('/onboarding/roles?googleAuth=true'), 800);
            } else {
              setTimeout(() => {
                if (isMounted) navigate('/auth/login');
              }, 1500);
            }
          }
        });

        return () => unsubscribe();
      } catch (err: any) {
        if (isMounted) {
          setStatus('error');
          setErrorMsg(err.message || 'Firebase authentication failed');
        }
      }
    }

    async function processFirebaseUser(fbUser: any) {
      const email = fbUser.email || '';
      const fullName = fbUser.displayName || '';
      const uid = fbUser.uid;
      const idToken = await fbUser.getIdToken();

      try {
        const res = await authApi.firebaseLogin({
          email,
          displayName: fullName,
          uid,
          idToken,
        });

        if (res.success && res.data) {
          const { user: authUser, accessToken, refreshToken } = res.data;
          setAuth(authUser, accessToken, refreshToken);
          if (isMounted) {
            setStatus('success');
            setTimeout(() => navigate(getRolePath(authUser.role)), 600);
          }
          return;
        }
      } catch (syncErr: any) {
        console.warn('Backend sync note:', syncErr?.message);
      }

      // Standalone fallback
      const storedRole = localStorage.getItem(`vilp_user_role_${uid}`) || 'STUDENT';
      const userObj = {
        id: uid,
        email,
        role: storedRole as any,
        emailVerified: fbUser.emailVerified,
        createdAt: new Date().toISOString(),
      };

      setAuth(userObj as any, idToken, '');
      if (isMounted) {
        setStatus('success');
        setTimeout(() => navigate(getRolePath(storedRole)), 600);
      }
    }

    handleAuth();

    return () => {
      isMounted = false;
    };
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
