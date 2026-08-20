import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail, ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { realOtpService } from '@/features/onboarding/services/onboardingApi';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid account email address.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await realOtpService.sendPasswordResetEmail(email);
      setSent(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch password recovery instructions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-4 font-mono">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-xs d-flex align-items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-black uppercase text-[#0A2540] font-sans m-0">
            Recovery Email Dispatched
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed m-0">
            We have sent password recovery instructions from <strong>Verified Internship Lifecycle Platform (VILP)</strong> to <strong>{email}</strong>.
          </p>
        </div>

        <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xs text-[11px] text-slate-600 space-y-1">
          <p className="font-bold text-[#0A2540] m-0">Next Steps:</p>
          <ul className="list-disc list-inside space-y-0.5 m-0 p-0 text-[10px] sm:text-[11px]">
            <li>Check your email inbox or spam folder.</li>
            <li>Click the reset link or proceed with your 6-digit recovery code.</li>
          </ul>
        </div>

        <div className="space-y-2 pt-2">
          <Link
            to={`/auth/reset-password?email=${encodeURIComponent(email)}`}
            className="btn-primary w-100 text-center text-xs py-2.5 font-bold uppercase block"
          >
            Enter Recovery Token / New Password &rarr;
          </Link>
          <Link
            to="/auth/login"
            className="btn-secondary w-100 text-center text-xs py-2 font-bold uppercase block text-slate-600"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono">
      <div className="space-y-1 border-bottom border-[#E2E8F0] pb-3">
        <div className="d-inline-flex align-items-center gap-1.5 text-xs text-[#2563EB] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" /> VILP SECURITY // ACCOUNT RECOVERY
        </div>
        <h2 className="text-lg sm:text-xl font-black text-[#0A2540] uppercase font-sans tracking-tight m-0">
          Reset Your Password
        </h2>
        <p className="text-xs text-slate-600 m-0">
          Enter your registered institutional email address to receive password recovery instructions.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs font-mono font-medium d-flex align-items-center gap-2 rounded-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0A2540] uppercase block d-flex align-items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-[#2563EB]" /> Registered Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-100 p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:border-[#2563EB] outline-hidden rounded-xs"
            placeholder="user@institution.edu"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-100 py-3 text-xs font-bold uppercase tracking-wider d-flex align-items-center justify-content-center gap-2 min-h-[44px] cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'SEND PASSWORD RECOVERY INSTRUCTIONS'
          )}
        </button>
      </form>

      <div className="pt-2 text-center">
        <Link
          to="/auth/login"
          className="text-xs text-[#2563EB] hover:underline font-bold d-inline-flex align-items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Account Login
        </Link>
      </div>
    </div>
  );
}
