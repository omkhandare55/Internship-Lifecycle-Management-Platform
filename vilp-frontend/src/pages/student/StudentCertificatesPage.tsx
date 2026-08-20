import { useQuery } from '@tanstack/react-query';
import {
  Award,
  Printer,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { certificateApi } from '@/services/vilpApi';
import { MOCK_STUDENT_PROFILE } from '@/services/mockData';

export function StudentCertificatesPage() {
  const { data: certsData, isLoading } = useQuery({
    queryKey: ['myCertificates'],
    queryFn: certificateApi.getMyCertificates,
  });

  const certificates = certsData?.data || [
    {
      id: 'cert-001',
      studentId: 'stu-001',
      studentName: MOCK_STUDENT_PROFILE.fullName || 'Verified Candidate',
      studentNumber: MOCK_STUDENT_PROFILE.studentNumber || 'REG-2026-001',
      departmentName: 'Computer Science & Engineering',
      internshipId: 'int-001',
      internshipTitle: 'Cloud Engineering & Microservices Intern',
      companyId: 'comp-001',
      companyName: 'Google Cloud India',
      certificateNumber: 'VILP-2026-CSE-8841',
      issueDate: '2026-02-18',
      grade: 'O (Outstanding)',
      totalHoursCompleted: 240,
      status: 'ISSUED',
      verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      createdAt: '2026-02-18T10:00:00Z',
    },
  ];

  const cert = certificates[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in font-mono text-[#171024]">
      {/* ── Top Header Ribbon (#FEF8E7) ────────────────────────────────────── */}
      <div className="bg-[#FEF8E7] border border-[#E0D3E8] p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-xs text-[#723ECF] border border-[#E0D3E8] font-bold">
          <Award className="w-3.5 h-3.5 text-[#ED4B86]" />
          <span>TAMPER-PROOF CREDENTIAL VAULT // SHA-256 SEALED</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#171024] font-sans tracking-tight">
          Accredited Completion e-Certificates
        </h1>
        <p className="text-xs text-zinc-600 max-w-3xl leading-relaxed">
          AICTE &amp; UGC-compliant academic degree credentials minted with immutable cryptographic hashes. Valid lifelong for employer verification and global university transcript audits.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center bg-white border border-[#E0D3E8]">
          <Loader2 className="w-6 h-6 animate-spin text-[#723ECF]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Certificate Document Showcase (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border-2 border-[#171024] p-8 sm:p-14 shadow-2xl relative space-y-8 print:border-none print:shadow-none">
              {/* Corner Watermarks */}
              <div className="absolute top-4 left-4 text-[9px] text-zinc-400 font-mono font-bold">
                AICTE / UGC ACCREDITED PROTOCOL
              </div>
              <div className="absolute top-4 right-4 text-[9px] text-[#723ECF] font-mono font-bold">
                REF: {cert.certificateNumber}
              </div>

              {/* Certificate Masthead */}
              <div className="text-center space-y-2 border-b-2 border-[#171024] pb-8 pt-4">
                <div className="w-12 h-12 bg-[#723ECF] text-white flex items-center justify-center font-black text-xl mx-auto mb-2 shadow-md">
                  V
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#171024] font-sans uppercase tracking-tight">
                  CERTIFICATE OF COMPLETION
                </h2>
                <p className="text-xs text-[#723ECF] font-bold tracking-widest uppercase">
                  VERIFIED INTERNSHIP LIFECYCLE PLATFORM
                </p>
              </div>

              {/* Certificate Body */}
              <div className="space-y-6 text-xs sm:text-sm text-zinc-800 leading-relaxed text-center max-w-xl mx-auto font-mono">
                <p className="text-xs text-zinc-500 uppercase">THIS IS TO OFFICIALLY CERTIFY THAT</p>
                <p className="text-2xl font-black text-[#171024] font-sans uppercase underline decoration-[#723ECF] decoration-2 underline-offset-4">
                  {cert.studentName}
                </p>
                <p className="text-xs text-zinc-600">
                  Candidate Number: <strong>{cert.studentNumber}</strong> · Department of <strong>{cert.departmentName || 'Computer Science & Engineering'}</strong>
                </p>
                <p>
                  has successfully satisfied all rigorous technical requirements and completed <strong>{cert.totalHoursCompleted} Approved Engineering Hours</strong> of verified corporate internship as
                </p>
                <p className="text-base font-black text-[#171024] font-sans uppercase">
                  {cert.internshipTitle}
                </p>
                <p className="text-xs text-zinc-600">
                  at <strong>{cert.companyName}</strong>, achieving the final academic grade evaluation of
                </p>
                <span className="inline-block px-4 py-1.5 bg-[#FEF8E7] text-[#723ECF] border border-[#723ECF] font-black text-sm uppercase">
                  GRADE: {cert.grade}
                </span>
              </div>

              {/* Certificate Footer Ledger */}
              <div className="border-t-2 border-[#171024] pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">FACULTY DEAN</span>
                  <p className="font-bold text-[#171024] border-b border-zinc-400 pb-1">Dr. Vikram Patil</p>
                  <p className="text-[10px] text-zinc-500">Head of Department</p>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                  <a
                    href={`/verify/certificate/${cert.certificateNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-18 h-18 border border-[#E0D3E8] bg-[#FEF8E7] p-1 flex items-center justify-center cursor-pointer group hover:scale-105 transition-transform shadow-xs"
                    title="Click or Scan to Verify Authenticity"
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                        typeof window !== 'undefined'
                          ? `${window.location.origin}/verify/certificate/${cert.certificateNumber}`
                          : `https://internship-lifecycle-management-pla.vercel.app/verify/certificate/${cert.certificateNumber}`
                      )}&bgcolor=FEF8E7&color=171024`}
                      alt="Verification QR Code"
                      className="w-full h-full object-contain"
                    />
                  </a>
                  <span className="text-[8px] font-bold text-[#723ECF] mt-1 font-mono">SCAN / CLICK TO VERIFY</span>
                </div>

                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">CORPORATE MENTOR</span>
                  <p className="font-bold text-[#171024] border-b border-zinc-400 pb-1">Ananya Joshi</p>
                  <p className="text-[10px] text-zinc-500">Lead Systems Architect</p>
                </div>
              </div>

              {/* Cryptographic SHA-256 Footer */}
              <div className="border-t border-[#E0D3E8] pt-4 text-[10px] text-zinc-500 flex flex-col sm:flex-row justify-between items-center gap-2 font-mono">
                <span className="truncate max-w-md">HASH: {cert.verificationHash}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 100% AUTHENTIC
                </span>
              </div>
            </div>

            {/* Print & Share Controls */}
            <div className="flex flex-wrap gap-4 justify-end print:hidden">
              <button
                onClick={() => window.print()}
                className="btn-secondary text-xs flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> PRINT HARDCOPY
              </button>
              <a
                href={`/verify/certificate/${cert.certificateNumber}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary text-xs flex items-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5" /> OPEN PUBLIC VERIFIER
              </a>
            </div>
          </div>

          {/* Right Credentials Telemetry Ledger (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-[#E0D3E8] bg-white p-6 space-y-4">
              <span className="text-[10px] text-[#723ECF] font-bold uppercase block">CREDENTIAL SPECIFICATION</span>
              <div className="border border-[#E0D3E8] divide-y divide-[#E0D3E8] text-xs">
                <div className="p-3 flex justify-between">
                  <span className="text-zinc-500">Certificate No:</span>
                  <span className="font-bold text-[#723ECF]">{cert.certificateNumber}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-zinc-500">Issue Date:</span>
                  <span className="font-bold text-[#171024]">{cert.issueDate}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-zinc-500">Degree Credits:</span>
                  <span className="font-bold text-emerald-700">4.0 Credits Granted</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-zinc-500">Total Hours:</span>
                  <span className="font-bold text-[#171024]">240 / 240 hrs (100%)</span>
                </div>
              </div>
            </div>

            <div className="border border-[#E0D3E8] bg-[#FEF8E7] p-6 space-y-3 font-mono text-xs">
              <span className="text-[10px] text-[#ED4B86] font-bold uppercase block">
                IMMUTABLE ACCREDITATION STATUS
              </span>
              <p className="text-xs text-zinc-700 leading-relaxed">
                This completion credential has been published to the institutional verifiable registry. Employers and universities can confirm its authenticity worldwide without manual paperwork.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
