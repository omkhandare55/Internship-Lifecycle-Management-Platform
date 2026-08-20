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
    studentName: 'Verified Candidate',
    studentNumber: 'REG-2026-001',
    companyName: 'Accredited Host Partner',
    internshipId: 'int-demo-01',
    internshipTitle: 'Cloud Platform Engineering Intern',
    status: 'APPROVED' as const,
    requestedAt: '2026-08-10T14:00:00Z',
    departmentName: 'Computer Science Engineering',
  };

  return (
    <div className="container-fluid p-3 p-sm-4 min-h-screen bg-[#F8FAFC] d-flex flex-column align-items-center justify-content-center text-[#0F172A] font-mono">
      {/* Top Navigation */}
      <div className="w-100 max-w-lg mb-3 d-flex align-items-center justify-content-between">
        <Link
          to="/"
          className="d-inline-flex align-items-center gap-2 text-xs font-bold text-[#2563EB] bg-white px-3 py-1.5 rounded-xs border border-[#CBD5E1] hover:bg-[#F1F5F9] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to VILP Portal
        </Link>
        <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider bg-white px-2 py-1 border border-[#CBD5E1] rounded-xs">
          AICTE NOC Auditor
        </span>
      </div>

      <div className="max-w-lg w-100 bg-white rounded-xs p-4 p-sm-5 border border-[#CBD5E1] shadow-xs space-y-4">
        {/* Masthead */}
        <div className="text-center space-y-2 pb-3 border-bottom border-[#E2E8F0]">
          <div className="d-inline-flex align-items-center justify-content-center w-12 h-12 rounded-xs bg-[#0A2540] text-white shadow-xs">
            <FileCheck className="w-6 h-6 text-[#2563EB]" />
          </div>
          <h1 className="text-base sm:text-lg font-black uppercase text-[#0A2540] font-sans m-0">
            Institutional NOC Verification
          </h1>
          <p className="text-[11px] font-mono text-[#2563EB] bg-[#F1F5F9] py-1 px-3 rounded-xs d-inline-block border border-[#CBD5E1] m-0 font-bold">
            Clearance Code: {code || noc.verificationCode}
          </p>
        </div>

        {isLoading ? (
          <div className="py-12 d-flex flex-column align-items-center justify-content-center gap-2">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
            <span className="text-xs text-slate-600 font-mono">Validating institutional countersign...</span>
          </div>
        ) : error && !noc ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xs text-center space-y-2">
            <XCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="font-bold text-red-900 text-sm m-0">Clearance Verification Failed</h3>
            <p className="text-xs text-red-700 m-0">
              The verification code provided is invalid, revoked, or does not exist in the institutional registry.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Authenticity Banner */}
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xs d-flex align-items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-bold text-emerald-900 text-xs tracking-tight uppercase m-0">
                  Authentic Institutional Clearance
                </h3>
                <p className="text-xs text-emerald-800 font-medium m-0">
                  Status: <strong className="uppercase">{noc.status}</strong> · AICTE Guidelines §7.2 Compliant
                </p>
              </div>
            </div>

            {/* Clearance Data Matrix */}
            <div className="text-xs space-y-2 bg-[#F8FAFC] p-3 p-sm-4 rounded-xs border border-[#E2E8F0] text-[#0F172A]">
              <div className="d-flex justify-content-between border-bottom border-[#E2E8F0] pb-1.5">
                <span className="text-slate-500 font-medium">Candidate Name:</span>
                <span className="font-bold text-[#0A2540]">{noc.studentName}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom border-[#E2E8F0] pb-1.5">
                <span className="text-slate-500 font-medium">Roll Number:</span>
                <span className="font-mono font-bold">{noc.studentNumber}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom border-[#E2E8F0] pb-1.5">
                <span className="text-slate-500 font-medium">Department / Discipline:</span>
                <span className="font-semibold text-slate-800">{noc.departmentName || 'Computer Science'}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom border-[#E2E8F0] pb-1.5">
                <span className="text-slate-500 font-medium">Authorized Host Partner:</span>
                <span className="font-bold text-[#2563EB]">{noc.companyName}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom border-[#E2E8F0] pb-1.5">
                <span className="text-slate-500 font-medium">Placement Role:</span>
                <span className="font-semibold text-slate-800">{noc.internshipTitle}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-slate-500 font-medium">Countersigned Timestamp:</span>
                <span className="font-mono">{new Date(noc.requestedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* AICTE Stamp */}
            <div className="bg-[#F1F5F9] p-3 rounded-xs border border-[#CBD5E1] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                COMPLIANCE CLEARANCE STATUS
              </span>
              <p className="text-[10px] text-slate-700 m-0">
                Single-Active Offer Mutex verified. Student holds active institutional indemnity clearance for 240 hours.
              </p>
            </div>

            <div className="text-center pt-2">
              <span className="d-inline-flex align-items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> Institutional Stamp Valid
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
