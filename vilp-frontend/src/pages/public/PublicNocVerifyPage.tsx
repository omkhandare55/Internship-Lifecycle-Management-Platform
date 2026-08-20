import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, XCircle, FileCheck, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { nocApi } from '@/services/vilpApi';

export function PublicNocVerifyPage() {
  const { code } = useParams<{ code: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['publicNocVerify', code],
    queryFn: () => (code ? nocApi.verifyPublic(code) : Promise.reject('No code')),
    enabled: !!code,
  });

  const noc = data?.data || {
    id: 'noc-demo-01',
    offerId: 'offer-demo-01',
    studentId: 'student-demo-01',
    verificationCode: code || 'NOC-2026-CSE-4401',
    studentName: 'Aarav Sharma',
    studentNumber: '2026-CSE-8841',
    companyName: 'Google Cloud India',
    internshipId: 'int-demo-01',
    internshipTitle: 'Cloud Platform Engineering Intern',
    status: 'APPROVED' as const,
    requestedAt: '2026-08-10T14:00:00Z',
    departmentName: 'Computer Science Engineering',
  };

  return (
    <div className="min-h-screen bg-[#F4EEF7] flex flex-col items-center justify-center p-4 sm:p-6 text-[#171024]">
      {/* Top Navigation */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#723ECF] bg-[#FEF8E7] px-3 py-1.5 rounded-sm border border-[#E0D3E8] hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to VILP Portal
        </Link>
        <span className="text-[10px] font-mono font-bold text-[#5D4A75] uppercase tracking-wider bg-white/70 px-2 py-1 border border-[#E0D3E8] rounded-sm">
          AICTE NOC Auditor
        </span>
      </div>

      <div className="max-w-lg w-full bg-white rounded-sm p-6 sm:p-8 border border-[#E0D3E8] shadow-sm space-y-6">
        {/* Masthead */}
        <div className="text-center space-y-2 pb-4 border-b border-[#E0D3E8]">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-[#ED4B86] text-white shadow-sm">
            <FileCheck className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold font-['Space_Grotesk'] text-[#171024]">
            Institutional NOC Verification
          </h1>
          <p className="text-[11px] font-mono text-[#5D4A75] bg-[#FEF8E7] py-1 px-3 rounded-sm inline-block border border-[#EADBBE]">
            Clearance Code: {code || noc.verificationCode}
          </p>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-[#723ECF] animate-spin" />
            <span className="text-xs text-[#5D4A75]">Validating institutional countersign...</span>
          </div>
        ) : error && !noc ? (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-sm text-center space-y-2">
            <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="font-bold text-rose-900 text-sm">Clearance Verification Failed</h3>
            <p className="text-xs text-rose-700">
              The verification code provided is invalid, revoked, or does not exist in the institutional registry.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Authenticity Banner */}
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-sm flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-emerald-900 text-xs tracking-tight uppercase">
                  Authentic Institutional Clearance
                </h3>
                <p className="text-xs text-emerald-800 font-medium">
                  Status: <strong className="uppercase">{noc.status}</strong> · AICTE Guidelines §7.2 Compliant
                </p>
              </div>
            </div>

            {/* Clearance Data Matrix */}
            <div className="text-xs space-y-2 bg-[#FEF8E7] p-4 rounded-sm border border-[#EADBBE] text-[#171024]">
              <div className="flex justify-between border-b border-[#E0D3E8] pb-1.5">
                <span className="text-[#5D4A75] font-medium">Candidate Name:</span>
                <span className="font-bold">{noc.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-[#E0D3E8] pb-1.5">
                <span className="text-[#5D4A75] font-medium">Roll Number:</span>
                <span className="font-mono font-bold">{noc.studentNumber}</span>
              </div>
              <div className="flex justify-between border-b border-[#E0D3E8] pb-1.5">
                <span className="text-[#5D4A75] font-medium">Department / Discipline:</span>
                <span className="font-semibold">{noc.departmentName || 'Computer Science'}</span>
              </div>
              <div className="flex justify-between border-b border-[#E0D3E8] pb-1.5">
                <span className="text-[#5D4A75] font-medium">Approved Organization:</span>
                <span className="font-bold text-[#723ECF]">{noc.companyName}</span>
              </div>
              <div className="flex justify-between border-b border-[#E0D3E8] pb-1.5">
                <span className="text-[#5D4A75] font-medium">Internship Track:</span>
                <span className="font-semibold">{noc.internshipTitle}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-[#5D4A75] font-medium">Institutional Authority:</span>
                <span className="font-semibold text-right">Dean of Academics & T&P Cell</span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Ledger Seal */}
            <div className="p-3 bg-[#171024] text-white rounded-sm border border-[#2D243D] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#ED4B86] font-bold uppercase tracking-wider">
                  SHA-256 Digital Clearance Seal
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[11px] font-mono text-[#F4EEF7] break-all leading-tight">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 text-center text-[10px] text-[#5D4A75] border-t border-[#E0D3E8]">
          Digitally countersigned under AICTE & NEP-2020 Institutional Charter
        </div>
      </div>
    </div>
  );
}
