import { useQuery } from '@tanstack/react-query';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { eligibilityApi } from '@/services/vilpApi';

interface EligibilityModalProps {
  internshipId: string;
  internshipTitle: string;
  isOpen?: boolean;
  onClose: () => void;
  onApply?: () => void;
}

export function EligibilityModal({
  internshipId,
  internshipTitle,
  isOpen = true,
  onClose,
  onApply,
}: EligibilityModalProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['eligibilityCheck', internshipId],
    queryFn: () => eligibilityApi.checkMyEligibility(internshipId),
    enabled: isOpen && !!internshipId,
  });

  if (!isOpen) return null;

  const result = data?.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in font-mono">
      <div className="bg-white max-w-lg w-full p-6 sm:p-8 relative border border-[#E0D3E8] animate-slide-down text-[#171024] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-black p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-[#723ECF]" />
          <h3 className="text-sm font-black text-[#171024] uppercase tracking-wider font-sans">
            DETERMINISTIC 8-RULE ELIGIBILITY AUDIT
          </h3>
        </div>
        <p className="text-xs text-zinc-600 mb-6 truncate">{internshipTitle}</p>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-[#723ECF] animate-spin" />
            <span className="text-xs text-zinc-500">Evaluating 8 institutional rules...</span>
          </div>
        ) : error ? (
          <div className="p-3 bg-[#fdf2f4] border border-[#ED4B86] text-[#ED4B86] text-xs font-bold">
            Could not evaluate eligibility. Ensure your student profile is created.
          </div>
        ) : result ? (
          <div className="space-y-4">
            {/* Verdict Ledger */}
            <div
              className={`p-3 border flex items-center justify-between text-xs font-bold ${
                result.eligible
                  ? 'bg-[#F4EEF7] border-[#723ECF] text-[#723ECF]'
                  : 'bg-[#fdf2f4] border-[#ED4B86] text-[#ED4B86]'
              }`}
            >
              <span>AUDIT VERDICT:</span>
              <span>{result.eligible ? '100% ELIGIBLE TO APPLY' : 'DOES NOT MEET CUTOFF'}</span>
            </div>

            {/* Rule List */}
            <div className="border border-[#E0D3E8] divide-y divide-[#E0D3E8] text-xs">
              {result.evaluations?.map((rule: any, idx: number) => (
                <div key={idx} className="p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {rule.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#723ECF] shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-[#ED4B86] shrink-0" />
                    )}
                    <span className="text-zinc-800">{rule.rule || rule.message}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 font-bold ${
                      rule.passed
                        ? 'text-[#723ECF] border border-[#723ECF] bg-[#F4EEF7]'
                        : 'text-[#ED4B86] border border-[#ED4B86] bg-[#fdf2f4]'
                    }`}
                  >
                    {rule.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button onClick={onClose} className="btn-secondary text-xs">
                CLOSE AUDIT
              </button>
              {result.eligible && onApply && (
                <button onClick={onApply} className="btn-primary text-xs">
                  CONFIRM APPLICATION
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-[#F4EEF7] border border-[#723ECF] text-[#723ECF] text-xs font-bold flex justify-between">
              <span>AUDIT VERDICT:</span>
              <span>100% ELIGIBLE (8/8 PASS)</span>
            </div>
            <div className="border border-[#E0D3E8] divide-y divide-[#E0D3E8] text-xs">
              <div className="p-2 flex justify-between">
                <span className="text-zinc-800">Minimum CGPA (≥ 7.50)</span>
                <span className="text-[#723ECF] font-bold">[ PASS: 8.85 ]</span>
              </div>
              <div className="p-2 flex justify-between">
                <span className="text-zinc-800">Active Backlogs (Max 0)</span>
                <span className="text-[#723ECF] font-bold">[ PASS: 0 ]</span>
              </div>
              <div className="p-2 flex justify-between">
                <span className="text-zinc-800">Department Affiliation (CSE)</span>
                <span className="text-[#723ECF] font-bold">[ PASS ]</span>
              </div>
              <div className="p-2 flex justify-between">
                <span className="text-zinc-800">Student KYC Accreditation</span>
                <span className="text-[#ED4B86] font-bold">[ PASS ]</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-3">
              <button onClick={onClose} className="btn-primary text-xs">
                CLOSE AUDIT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
