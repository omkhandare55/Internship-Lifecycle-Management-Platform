import { useState } from 'react';
import {
  CheckCircle2,
  Download,
  Crown,
} from 'lucide-react';

export function CompanyBillingPage() {
  const [currentPlan, setCurrentPlan] = useState<'STARTER' | 'CAMPUS_PRO' | 'ENTERPRISE'>('CAMPUS_PRO');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleUpgrade = (plan: 'STARTER' | 'CAMPUS_PRO' | 'ENTERPRISE') => {
    setIsProcessing(true);
    setTimeout(() => {
      setCurrentPlan(plan);
      setIsProcessing(false);
      setSuccessMsg(`Your subscription has been successfully updated to ${plan.replace('_', ' ')}!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Corporate Subscriptions & Billing</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Manage corporate recruitment drive packages, verified talent access tiers, and invoices.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-md">
              Basic
            </span>
            <h3 className="text-lg font-bold text-zinc-900">Standard Recruiter</h3>
            <p className="text-3xl font-extrabold text-zinc-900 font-mono">
              ₹0 <span className="text-xs text-zinc-400 font-sans font-normal">/ year</span>
            </p>
            <ul className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 2 Active Internship Postings
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Standard Applicant Review
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Institutional NOC Verification
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('STARTER')}
            disabled={currentPlan === 'STARTER' || isProcessing}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentPlan === 'STARTER'
                ? 'bg-zinc-100 text-zinc-400 cursor-default'
                : 'btn-secondary'
            }`}
          >
            {currentPlan === 'STARTER' ? 'Current Plan' : 'Downgrade to Starter'}
          </button>
        </div>

        {/* Campus Pro (Popular) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-zinc-900 shadow-md space-y-5 flex flex-col justify-between relative">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-900 text-white px-2.5 py-1 rounded-md flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" /> Campus Drive Pro
              </span>
              <span className="text-[11px] font-bold text-emerald-600 font-mono">Active</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Accredited Corporate</h3>
            <p className="text-3xl font-extrabold text-zinc-900 font-mono">
              ₹24,999 <span className="text-xs text-zinc-400 font-sans font-normal">/ drive</span>
            </p>
            <ul className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Unlimited Internship Postings
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> AI Resume Fit & Skill Radar
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Priority T&P Verification Badge
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 1-Click PPO Registry Export
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('CAMPUS_PRO')}
            disabled={currentPlan === 'CAMPUS_PRO' || isProcessing}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentPlan === 'CAMPUS_PRO'
                ? 'bg-zinc-900 text-white cursor-default'
                : 'btn-primary'
            }`}
          >
            {currentPlan === 'CAMPUS_PRO' ? 'Current Active Tier' : 'Upgrade to Campus Pro'}
          </button>
        </div>

        {/* Enterprise */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md">
              Enterprise
            </span>
            <h3 className="text-lg font-bold text-zinc-900">National Partner</h3>
            <p className="text-3xl font-extrabold text-zinc-900 font-mono">
              ₹89,999 <span className="text-xs text-zinc-400 font-sans font-normal">/ annual</span>
            </p>
            <ul className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Multi-Campus Placement Drives
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dedicated Relationship Officer
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Custom n8n Webhook Pipeline
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('ENTERPRISE')}
            disabled={currentPlan === 'ENTERPRISE' || isProcessing}
            className="btn-secondary w-full py-2.5 text-xs font-bold"
          >
            {currentPlan === 'ENTERPRISE' ? 'Current Plan' : 'Upgrade to Enterprise'}
          </button>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-zinc-900">Corporate Invoices & Receipts</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b text-zinc-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-3.5">Invoice ID</th>
                <th className="px-6 py-3.5">Tier Package</th>
                <th className="px-6 py-3.5">Billing Date</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <tr className="hover:bg-zinc-50/60 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-zinc-900">INV-2026-0881</td>
                <td className="px-6 py-4 font-medium text-zinc-800">Campus Drive Pro Tier (2026 Batch)</td>
                <td className="px-6 py-4 text-zinc-500">Feb 15, 2026</td>
                <td className="px-6 py-4 font-mono font-bold text-zinc-900">₹24,999</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-bold font-mono">
                    PAID
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => alert('Downloading official tax invoice receipt INV-2026-0881.pdf')}
                    className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
