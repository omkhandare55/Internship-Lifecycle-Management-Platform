import { useEffect } from 'react';
import { ShieldOff, LogIn } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

/**
 * SessionExpiredModal
 *
 * Rendered globally in App.tsx. Activates when axiosInstance dispatches
 * the 'vilp:session-expired' event (refresh token invalid or expired).
 * Blocks the UI and forces re-authentication.
 */
export function SessionExpiredModal() {
  const sessionExpired = useAuthStore((s) => s.sessionExpired);

  useEffect(() => {
    if (sessionExpired) {
      // Small delay so any in-flight renders complete
      const timer = setTimeout(() => {
        window.location.replace('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sessionExpired]);

  if (!sessionExpired) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 font-mono"
      role="alertdialog"
      aria-modal="true"
      aria-label="Session expired"
    >
      <div className="bg-white max-w-md w-full p-8 border-2 border-[#ED4B86] shadow-2xl space-y-5 text-[#171024]">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#E0D3E8] pb-4">
          <div className="w-10 h-10 bg-red-50 border border-red-200 flex items-center justify-center text-[#ED4B86]">
            <ShieldOff className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight text-[#171024]">
              SESSION EXPIRED
            </h2>
            <p className="text-[10px] text-[#5D4A75] mt-0.5">
              Your authentication token has expired.
            </p>
          </div>
        </div>

        {/* Message */}
        <p className="text-xs text-zinc-700 leading-relaxed">
          For your security, your session has been automatically terminated. You will be
          redirected to the login page in a moment.
        </p>

        {/* Progress bar */}
        <div className="w-full h-1 bg-[#E0D3E8] rounded-full overflow-hidden">
          <div className="h-full bg-[#723ECF] animate-[shrink_3s_linear_forwards] rounded-full" />
        </div>

        {/* Manual redirect button */}
        <button
          onClick={() => window.location.replace('/auth/login')}
          className="w-full py-2.5 px-4 bg-[#723ECF] text-white text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-[#5f33ad] transition-colors"
        >
          <LogIn className="w-3.5 h-3.5" />
          SIGN IN NOW
        </button>
      </div>
    </div>
  );
}
