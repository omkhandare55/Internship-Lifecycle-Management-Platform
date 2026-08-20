import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-mono selection:bg-[#2563EB] selection:text-white antialiased">
      {/* Top Ribbon (#F1F5F9) */}
      <div className="border-b border-[#E2E8F0] bg-[#F1F5F9] px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs text-[#0F172A]">
        <Link to="/" className="inline-flex items-center gap-2 font-bold text-[#2563EB] hover:underline transition-colors text-[11px]">
          <ArrowLeft className="w-3.5 h-3.5" /> [ RETURN TO ROOT ]
        </Link>
        <span className="text-slate-500 text-[10px] sm:text-[11px] font-bold">SPEC: UGC-2026-REV4 // SECURE AUTH VAULT</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg transition-all duration-300 space-y-4">
          {/* Brand Header */}
          <div className="text-left border-b border-[#CBD5E1] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#0A2540] text-white flex items-center justify-center font-black text-xs rounded-[1px_4px_1px_4px] shadow-[2px_2px_0px_0px_#2563EB]">
                V
              </div>
              <div>
                <h1 className="text-xs sm:text-sm font-black text-[#0A2540] tracking-wider uppercase font-sans m-0">
                  VILP // OS AUTHENTICATION
                </h1>
                <p className="text-[10px] text-[#2563EB] font-bold m-0">ACADEMIC CREDENTIAL ACCESS GATEWAY</p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-extrabold border border-emerald-300 bg-emerald-50 px-2 py-0.5 rounded-[1px]">
              TLS_1.3 ENCRYPTED
            </span>
          </div>

          {/* Architectural Chassis Box */}
          <div className="relative bg-white border border-[#CBD5E1] p-6 sm:p-8 shadow-[4px_4px_0px_0px_#0A2540] rounded-[2px_12px_2px_12px]">
            {/* Corner Crosshair Decoration */}
            <div className="absolute top-2 right-2.5 text-[10px] text-slate-300 font-bold select-none pointer-events-none">
              +
            </div>
            <div className="absolute bottom-2 left-2.5 text-[10px] text-slate-300 font-bold select-none pointer-events-none">
              +
            </div>
            <Outlet />
          </div>

          <div className="text-center text-[10px] text-slate-500 font-mono">
            © 2026 VERIFIED INTERNSHIP LIFECYCLE PLATFORM · GHR COLLEGE JALGAON
          </div>
        </div>
      </div>
    </div>
  );
}
