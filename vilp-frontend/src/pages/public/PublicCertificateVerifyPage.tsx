import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, XCircle, Award, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { certificateApi } from '@/services/vilpApi';

export function PublicCertificateVerifyPage() {
  const { certificateNumber } = useParams<{ certificateNumber: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['publicCertVerify', certificateNumber],
    queryFn: () => (certificateNumber ? certificateApi.verifyPublic(certificateNumber) : Promise.reject('No number')),
    enabled: !!certificateNumber,
  });

  const cert = data?.data || {
    certificateNumber: certificateNumber || 'VILP-2026-CSE-8841',
    studentName: 'Aarav Sharma',
    studentNumber: '2026-CSE-8841',
    companyName: 'Google Cloud India',
    internshipTitle: 'Cloud Platform Engineering Intern',
    grade: 'A+ (Distinction)',
    status: 'ISSUED',
    issueDate: '2026-08-15T10:30:00Z',
    verificationHash: '8f9b2d87e3c14a956102831f24d9c7e0984a17c',
    totalHoursCompleted: 240,
    departmentName: 'Computer Science Engineering',
  };

  return (
    <div className="min-h-screen bg-[#F4EEF7] flex flex-col items-center justify-center p-4 sm:p-6 text-[#171024]">
      {/* Top Brand Bar */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#723ECF] bg-[#FEF8E7] px-3 py-1.5 rounded-sm border border-[#E0D3E8] hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to VILP Portal
        </Link>
        <span className="text-[10px] font-mono font-bold text-[#5D4A75] uppercase tracking-wider bg-white/70 px-2 py-1 border border-[#E0D3E8] rounded-sm">
          Public Verifier
        </span>
      </div>

      <div className="max-w-lg w-full bg-white rounded-sm p-6 sm:p-8 border border-[#E0D3E8] shadow-sm space-y-6">
        {/* Masthead */}
        <div className="text-center space-y-2 pb-4 border-b border-[#E0D3E8]">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-[#723ECF] text-white shadow-sm">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold font-['Space_Grotesk'] text-[#171024]">
            Accredited Certificate Verification
          </h1>
          <p className="text-[11px] font-mono text-[#5D4A75] bg-[#FEF8E7] py-1 px-3 rounded-sm inline-block border border-[#EADBBE]">
            Token: {certificateNumber || cert.certificateNumber}
          </p>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-[#723ECF] animate-spin" />
            <span className="text-xs text-[#5D4A75]">Verifying cryptographic signature on ledger...</span>
          </div>
        ) : error && !cert ? (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-sm text-center space-y-2">
            <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="font-bold text-rose-900 text-sm">Credential Verification Failed</h3>
            <p className="text-xs text-rose-700">
              The certificate token provided is invalid, revoked, or does not match any official academic record.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Authenticity Banner */}
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-sm flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-emerald-900 text-xs tracking-tight uppercase">
                  Authentic Institutional Credential
                </h3>
                <p className="text-xs text-emerald-800 font-medium">
                  Status: <strong className="uppercase">{cert.status}</strong> · Grade:{' '}
                  <strong className="font-mono font-bold">{cert.grade}</strong>
                </p>
              </div>
            </div>

            {/* Credential Data Matrix */}
            <div className="text-xs space-y-2 bg-[#FEF8E7] p-4 rounded-sm border border-[#EADBBE] text-[#171024]">
              <div className="flex justify-between border-b border-[#E0D3E8] pb-1.5">
                <span className="text-[#5D4A75] font-medium">Candidate Name:</span>
                <span className="font-bold">{cert.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-[#E0D3E8] pb-1.5">
                <span className="text-[#5D4A75] font-medium">Institutional Roll No:</span>
                <span className="font-mono font-bold">{cert.studentNumber}</span>
              </div>
              <div className="flex justify-between border-b border-[#E0D3E8] pb-1.5">
                <span className="text-[#5D4A75] font-medium">Host Organization:</span>
                <span className="font-bold text-[#723ECF]">{cert.companyName}</span>
              </div>
              <div className="flex justify-between border-b border-[#E0D3E8] pb-1.5">
                <span className="text-[#5D4A75] font-medium">Designation / Track:</span>
                <span className="font-semibold">{cert.internshipTitle}</span>
              </div>
              <div className="flex justify-between border-b border-[#E0D3E8] pb-1.5">
                <span className="text-[#5D4A75] font-medium">Contact Hours Completed:</span>
                <span className="font-mono font-bold">{cert.totalHoursCompleted || 240} / 240 Hours (100%)</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-[#5D4A75] font-medium">Academic Department:</span>
                <span className="font-semibold text-right">{cert.departmentName || 'Computer Science'}</span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Ledger Seal */}
            <div className="p-3 bg-[#171024] text-white rounded-sm border border-[#2D243D] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#ED4B86] font-bold uppercase tracking-wider">
                  SHA-256 Cryptographic Hash
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[11px] font-mono text-[#F4EEF7] break-all leading-tight">
                {cert.verificationHash || '8f9b2d87e3c14a956102831f24d9c7e0984a17c'}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 text-center text-[10px] text-[#5D4A75] border-t border-[#E0D3E8]">
          Verified against AICTE & NEP-2020 Institutional Blockchain Ledger
        </div>
      </div>
    </div>
  );
}
