import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle, ShieldCheck, Lock, Key } from 'lucide-react';
import { realOtpService } from '@/features/onboarding/services/onboardingApi';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialEmail = searchParams.get('email') || '';
  const initialToken = searchParams.get('token') || '';

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setServerError('Please enter your account email address.');
      return;
    }
    if (!token || token.length < 6) {
      setServerError('Please enter the 6-digit recovery code or token.');
      return;
    }
    if (newPassword.length < 8) {
      setServerError('Password must be at least 8 characters in length.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setServerError('Passwords do not match. Please verify and re-type.');
      return;
    }

    setServerError('');
    setIsSubmitting(true);
    try {
      await realOtpService.resetPassword(email, token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/auth/login'), 2000);
    } catch (err: any) {
      setServerError(err.message || 'Failed to reset password. Token may be expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4 font-mono">
        <div className="w-12 h-12 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-xs d-flex align-items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-lg sm:text-xl font-black uppercase text-[#0A2540] font-sans m-0">
          Password Updated!
        </h2>
        <p className="text-xs text-slate-600 m-0">
          Your credentials have been securely updated. Redirecting to login...
        </p>
        <button
          type="button"
          onClick={() => navigate('/auth/login')}
          className="btn-primary w-100 py-2.5 text-xs font-bold uppercase"
        >
          GO TO LOGIN NOW &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono">
      <div className="space-y-1 border-bottom border-[#E2E8F0] pb-3">
        <div className="d-inline-flex align-items-center gap-1.5 text-xs text-[#2563EB] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" /> VILP SECURITY // SET NEW PASSWORD
        </div>
        <h2 className="text-lg sm:text-xl font-black text-[#0A2540] uppercase font-sans tracking-tight m-0">
          Choose New Password
        </h2>
        <p className="text-xs text-slate-600 m-0">
          Enter your recovery code and create a secure new password for your account.
        </p>
      </div>

      {serverError && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs font-mono font-medium d-flex align-items-center gap-2 rounded-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0A2540] uppercase block">Account Email *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="user@institution.edu"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0A2540] uppercase block d-flex align-items-center gap-1">
            <Key className="w-3.5 h-3.5 text-[#2563EB]" /> 6-Digit Recovery Token / Code *
          </label>
          <input
            type="text"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="input-field font-mono font-bold tracking-widest"
            placeholder="Enter 6-digit Code"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0A2540] uppercase block d-flex align-items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#2563EB]" /> New Password (Min 8 Characters) *
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••••••"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0A2540] uppercase block">Confirm New Password *</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-100 min-h-[44px] cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'CONFIRM & UPDATE PASSWORD'
          )}
        </button>
      </form>

      <div className="pt-2 text-center">
        <Link
          to="/auth/login"
          className="text-xs text-[#2563EB] hover:underline font-bold"
        >
          &larr; Return to Sign In
        </Link>
      </div>
    </div>
  );
}
