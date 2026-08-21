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
    retry: 1,
  });

  const cert = data?.data;
  const isFailed = !isLoading && (error || !cert || !data?.success);

  return (
    <div className="container-fluid p-3 p-sm-4 min-h-screen bg-[#F8FAFC] d-flex flex-column align-items-center justify-content-center text-[#0F172A] font-mono">
      {/* Top Brand Bar */}
      <div className="w-100 max-w-lg mb-3 d-flex align-items-center justify-content-between">
        <Link
          to="/"
          className="d-inline-flex align-items-center gap-2 text-xs font-bold text-[#2563EB] bg-white px-3 py-1.5 rounded-xs border border-[#CBD5E1] hover:bg-[#F1F5F9] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to VILP Portal
        </Link>
        <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider bg-white px-2 py-1 border border-[#CBD5E1] rounded-xs">
          Public Verifier
        </span>
      </div>

      <div className="max-w-lg w-100 bg-white rounded-xs p-4 p-sm-5 border border-[#CBD5E1] shadow-xs space-y-4">
        {/* Masthead */}
        <div className="text-center space-y-2 pb-3 border-bottom border-[#E2E8F0]">
          <div className="d-inline-flex align-items-center justify-content-center w-12 h-12 rounded-xs bg-[#0A2540] text-white shadow-xs">
            <Award className="w-6 h-6 text-[#F97316]" />
          </div>
          <h1 className="text-base sm:text-lg font-black uppercase text-[#0A2540] font-sans m-0">
            Accredited Certificate Verification
          </h1>
          <p className="text-[11px] font-mono text-[#2563EB] bg-[#F1F5F9] py-1 px-3 rounded-xs d-inline-block border border-[#CBD5E1] m-0 font-bold">
            Token: {certificateNumber || 'N/A'}
          </p>
        </div>

        {isLoading ? (
          <div className="py-12 d-flex flex-column align-items-center justify-content-center gap-2">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
            <span className="text-xs text-slate-600 font-mono">Verifying cryptographic signature on ledger...</span>
          </div>
        ) : isFailed ? (
          <div className="p-4 bg-red-50 border border-red-300 rounded-xs text-center space-y-2">
            <XCircle className="w-10 h-10 text-red-600 mx-auto" />
            <h3 className="font-bold text-red-900 text-sm m-0 uppercase">Credential Verification Failed</h3>
            <p className="text-xs text-red-700 m-0">
              The certificate token <strong className="font-mono">{certificateNumber}</strong> is invalid, revoked, or does not exist in the institutional registry.
            </p>
            <div className="pt-2 text-[10px] text-red-600 font-mono">
              Status: UNVERIFIED / REJECTED · AICTE §7.2 Policy Enforced
            </div>
          </div>
        ) : cert ? (
          <div className="space-y-3">
            {/* Authenticity Banner */}
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xs d-flex align-items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-bold text-emerald-900 text-xs tracking-tight uppercase m-0">
                  Authentic Institutional Credential
                </h3>
                <p className="text-xs text-emerald-800 font-medium m-0">
                  Status: <strong className="uppercase">{cert.status}</strong> · Grade:{' '}
                  <strong className="font-mono font-bold">{cert.grade}</strong>
                </p>
              </div>
            </div>

            {/* Credential Data Matrix */}
            <div className="text-xs space-y-2 bg-[#F8FAFC] p-3 p-sm-4 rounded-xs border border-[#E2E8F0] text-[#0F172A]">
              <div className="d-flex justify-content-between border-bottom border-[#E2E8F0] pb-1.5">
                <span className="text-slate-500 font-medium">Candidate Name:</span>
                <span className="font-bold text-[#0A2540]">{cert.studentName}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom border-[#E2E8F0] pb-1.5">
                <span className="text-slate-500 font-medium">Institutional Roll No:</span>
                <span className="font-mono font-bold">{cert.studentNumber}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom border-[#E2E8F0] pb-1.5">
                <span className="text-slate-500 font-medium">Host Organization:</span>
                <span className="font-bold text-[#2563EB]">{cert.companyName}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom border-[#E2E8F0] pb-1.5">
                <span className="text-slate-500 font-medium">Role Practicum:</span>
                <span className="font-semibold text-slate-800">{cert.internshipTitle}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom border-[#E2E8F0] pb-1.5">
                <span className="text-slate-500 font-medium">Total Logged Hours:</span>
                <span className="font-bold text-emerald-700">{cert.totalHoursCompleted} Hours</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-slate-500 font-medium">Issue Date:</span>
                <span className="font-mono">{new Date(cert.issueDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* SHA-256 Ledger Stamp */}
            {cert.verificationHash && (
              <div className="bg-[#F1F5F9] p-3 rounded-xs border border-[#CBD5E1] space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                  IMMUTABLE SHA-256 LEDGER HASH
                </span>
                <p className="text-[10px] font-mono text-[#0A2540] break-all select-all font-bold m-0">
                  {cert.verificationHash}
                </p>
              </div>
            )}

            <div className="text-center pt-2">
              <span className="d-inline-flex align-items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> AICTE &amp; NEP-2020 Validated
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
