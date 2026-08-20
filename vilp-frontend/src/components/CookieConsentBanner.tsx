import { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vilp_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vilp_cookie_consent', 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 bg-[#FEF8E7] border border-[#E0D3E8] p-4 shadow-2xl animate-slide-down select-none font-mono text-xs text-[#171024]">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 bg-[#723ECF] text-white flex items-center justify-center font-bold text-xs shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#171024] uppercase tracking-wider">PRIVACY &amp; ESSENTIAL COOKIES</h4>
            <button
              onClick={() => setShowBanner(false)}
              className="text-zinc-500 hover:text-black p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[10px] text-zinc-700 leading-relaxed">
            VILP utilizes encrypted local session storage and essential telemetry cookies for KYC verification and academic integrity.{' '}
            <a href="/privacy" className="text-[#723ECF] font-bold underline hover:text-[#5e2fb3]">
              [ PRIVACY PROTOCOL ]
            </a>
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAccept}
              className="btn-primary text-[10px] py-1 px-3"
            >
              ACCEPT ESSENTIAL
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="btn-secondary text-[10px] py-1 px-3"
            >
              DECLINE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
