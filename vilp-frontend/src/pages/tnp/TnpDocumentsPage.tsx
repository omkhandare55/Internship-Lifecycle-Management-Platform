import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FileSearch,
  FileCheck,
  Building2,
  GraduationCap,
  Download,
  Loader2,
  Calendar,
} from 'lucide-react';
import { verificationApi } from '@/services/vilpApi';
import { StatusBadge } from '@/components/StatusBadge';
import type { VerificationItem } from '@/types/vilp.types';

export function TnpDocumentsPage() {
  const [activeStatus, setActiveStatus] = useState<string>('ALL');

  const { data, isLoading, error } = useQuery({
    queryKey: ['tnpDocuments', activeStatus],
    queryFn: () =>
      verificationApi.getQueue(
        0,
        50,
        'DOCUMENT',
        activeStatus === 'ALL' ? undefined : activeStatus
      ),
  });

  const documents = data?.data?.content || [];

  return (
    <div className="container-fluid p-0 space-y-4 space-y-md-5 pb-5 animate-fade-in font-mono">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <div className="bg-[#F1F5F9] border border-[#CBD5E1] p-4 p-sm-5 p-md-6 rounded-xs space-y-3">
        <div className="d-inline-flex align-items-center gap-2 px-2.5 py-1 bg-white text-xs text-[#2563EB] border border-[#CBD5E1] font-bold rounded-xs">
          <FileSearch className="w-3.5 h-3.5 text-[#F97316]" />
          <span>T&amp;P INSTITUTIONAL COMPLIANCE · DOCUMENT AUDIT LEDGER</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black uppercase text-[#0A2540] font-sans tracking-tight m-0">
          Document Governance &amp; Verification
        </h1>
        <p className="text-xs text-slate-600 m-0">
          Audit uploaded student KYC, offer letters, company charters, and compliance indemnity agreements.
        </p>
      </div>

      {/* ── Filter Bar ────────────────────────────────────────────── */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 bg-white p-3 border border-[#CBD5E1] rounded-xs">
        <div className="d-flex gap-2">
          {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xs transition-colors cursor-pointer ${
                activeStatus === status
                  ? 'bg-[#0A2540] text-white'
                  : 'bg-[#F1F5F9] text-slate-700 hover:bg-[#E2E8F0]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500 font-mono">
          Total Documents: <strong>{documents.length}</strong>
        </span>
      </div>

      {/* ── Documents Table ───────────────────────────────────────── */}
      <div className="bg-white border border-[#CBD5E1] rounded-xs overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-12 d-flex flex-column align-items-center justify-content-center gap-2">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
            <span className="text-xs text-slate-500">Loading compliance document ledger...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-xs text-red-600">
            Failed to load compliance documents. Please try again.
          </div>
        ) : documents.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <FileCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 m-0">No documents found</h3>
            <p className="text-xs text-slate-500 m-0">
              {activeStatus === 'ALL'
                ? 'No documents currently registered in the institutional repository.'
                : `No documents found matching status '${activeStatus}'.`}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-xs font-mono">
              <thead className="bg-[#F8FAFC] border-bottom border-[#CBD5E1] text-slate-600 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Verification Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4 text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {documents.map((doc: VerificationItem) => (
                  <tr key={doc.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4">
                      <div className="d-flex align-items-center gap-2 font-bold text-[#0A2540]">
                        {doc.entityType === 'STUDENT' ? (
                          <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                        ) : (
                          <Building2 className="w-4 h-4 text-slate-600" />
                        )}
                        <span>{doc.entityType}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 select-all">
                      {doc.entityId.slice(0, 13)}...
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-[#F1F5F9] px-2 py-0.5 rounded-xs border border-[#CBD5E1] text-[11px] font-bold text-slate-700">
                        {doc.verificationType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      <div className="d-flex align-items-center gap-1.5 text-[11px]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(doc.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <a
                        href={`/api/documents/${doc.entityId}/download`}
                        target="_blank"
                        rel="noreferrer"
                        className="d-inline-flex align-items-center gap-1 text-[11px] font-bold text-[#2563EB] hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
