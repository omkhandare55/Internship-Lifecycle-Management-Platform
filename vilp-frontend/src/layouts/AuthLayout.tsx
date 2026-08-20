import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-mono selection:bg-[#2563EB] selection:text-white antialiased">
      {/* Top Ribbon (#F1F5F9) */}
      <div className="border-b border-[#E2E8F0] bg-[#F1F5F9] px-6 py-3 flex items-center justify-between text-xs text-[#0F172A]">
        <Link to="/" className="inline-flex items-center gap-2 font-bold text-[#2563EB] hover:underline transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> [ RETURN TO ROOT ]
        </Link>
        <span className="text-slate-500 text-[11px]">SPEC: UGC-2026-REV4 // SECURE AUTH VAULT</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg md:max-w-2xl lg:max-w-4xl transition-all duration-300 space-y-4 sm:space-y-6">
          {/* Brand Header */}
          <div className="text-left border-b border-[#E2E8F0] pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#0A2540] text-white flex items-center justify-center font-black text-sm rounded-xs shadow-xs">
                V
              </div>
              <div>
                <h1 className="text-sm font-black text-[#0A2540] tracking-widest uppercase font-sans">
                  VILP // OS AUTHENTICATION
                </h1>
                <p className="text-[10px] text-[#2563EB] font-bold">ACADEMIC CREDENTIAL ACCESS GATEWAY</p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold border border-emerald-300 bg-emerald-50 px-2 py-0.5 rounded-xs">
              TLS_1.3 ENCRYPTED
            </span>
          </div>

          {/* Sharp Auth Card */}
          <div className="bg-white border border-[#E2E8F0] p-6 sm:p-8 shadow-xs rounded-xs">
            <Outlet />
          </div>

          <div className="text-center text-[10px] text-slate-500 font-mono">
            © 2026 VERIFIED INTERNSHIP LIFECYCLE PLATFORM · ALL TRANSACTIONS AUDITED
          </div>
        </div>
      </div>
    </div>
  );
}
