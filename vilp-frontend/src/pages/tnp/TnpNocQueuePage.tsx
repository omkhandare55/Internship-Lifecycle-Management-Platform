import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  Building2,
  Loader2,
  Zap,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { nocApi } from '@/services/vilpApi';
import { MOCK_STUDENT_PROFILE } from '@/services/mockData';

export function TnpNocQueuePage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(true);
  const [msg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { isLoading } = useQuery({
    queryKey: ['tnpNocQueue', statusFilter],
    queryFn: () => nocApi.getQueue(statusFilter === 'ALL' ? undefined : statusFilter, 0, 50),
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Auto-Pilot Banner (Zero Manual Work Mode) */}
      <div className="bg-gradient-to-r from-emerald-900 via-zinc-900 to-zinc-900 rounded-3xl p-6 text-white border border-emerald-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-400 border border-white/15">
            <Zap className="w-3.5 h-3.5" />
            <span>Zero-Touch Institutional Auto-Pilot Mode</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            100% Autonomous NOC & Verification Engine
          </h2>
          <p className="text-xs text-zinc-300 max-w-xl">
            When active, eligible students who accept offers receive instantly stamped, tamper-proof Institutional NOCs with zero manual staff intervention.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-white/10 p-3 rounded-2xl border border-white/15 backdrop-blur-md">
          <div className="text-right">
            <p className="text-xs font-bold text-white">Auto-Pilot Status</p>
            <p className="text-[11px] text-emerald-400 font-semibold font-mono">
              {autoPilotEnabled ? 'ACTIVE (Zero Work)' : 'MANUAL APPROVAL'}
            </p>
          </div>
          <button
            onClick={() => setAutoPilotEnabled(!autoPilotEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
              autoPilotEnabled ? 'bg-emerald-500 justify-end' : 'bg-zinc-600 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> {msg.text}
        </div>
      )}

      {/* Auto-Pilot Rules Bar */}
      {autoPilotEnabled && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Autonomous Rules Active: CGPA ≥ 8.0 · 0 Backlogs · KYC Verified · Host Company Accredited
            </span>
          </div>
          <span className="font-mono text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
            0 Manual Actions Required
          </span>
        </div>
      )}

      {/* Table & Filtering */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-base text-zinc-900">NOC Registry & Verification Audit</h3>
          <div className="flex gap-2">
            {['ALL', 'APPROVED', 'PENDING_REVIEW'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === filter
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {filter.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b text-zinc-500 font-semibold uppercase">
                <tr>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Host Company</th>
                  <th className="px-6 py-3.5">Verification Code</th>
                  <th className="px-6 py-3.5">Autonomous Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr className="hover:bg-zinc-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-900">{MOCK_STUDENT_PROFILE.fullName || 'Verified Candidate'}</p>
                    <p className="text-[11px] text-zinc-500 font-mono">{MOCK_STUDENT_PROFILE.studentNumber || 'REG-2026-001'} · CSE (8.85 CGPA)</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-semibold text-zinc-800">Google Cloud India</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-emerald-700">
                    NOC-2026-004821
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold inline-flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      AUTO-APPROVED (Zero Work)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href="/verify/noc/NOC-2026-004821"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary text-xs px-3 py-1.5"
                    >
                      View Certificate
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
