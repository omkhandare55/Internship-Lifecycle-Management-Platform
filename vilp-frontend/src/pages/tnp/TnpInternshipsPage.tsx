import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase,
  Search,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Clock,
  Building2,
  Loader2,
} from 'lucide-react';
import { internshipApi } from '@/services/vilpApi';
import { StatusBadge } from '@/components/StatusBadge';

export function TnpInternshipsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['tnpInternships'],
    queryFn: () => internshipApi.listOpen(0, 100),
  });

  const internships = data?.data?.content || [];

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => internshipApi.verify(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tnpInternships'] }),
  });

  const filtered = internships.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.company?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Internships Audit & Governance</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review academic criteria, verify authenticity, and approve internships for student applications.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by internship title, company name, or unique ID..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100 uppercase">
                      {item.uniqueId || 'INT-OFFERING'}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {item.company?.name}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <p className="text-xs text-gray-600 line-clamp-3 mb-4">{item.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border mb-3">
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    <span>₹{item.stipend?.toLocaleString() || 0}/mo</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.duration || 0} Weeks ({item.mode})</span>
                  </div>
                </div>

                {item.requirement && (
                  <div className="text-[11px] text-gray-600 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 mb-3 space-y-0.5">
                    <p>
                      <strong>Academic Eligibility:</strong> Min CGPA: {item.requirement.minimumCgpa} ·
                      Max Backlogs: {item.requirement.maximumBacklogs}
                    </p>
                    {item.requirement.department && (
                      <p>
                        <strong>Eligible Department:</strong> {item.requirement.department}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t flex items-center justify-between mt-2">
                <span className="text-[11px] text-gray-400">
                  Verification: {item.verificationStatus}
                </span>
                {item.verificationStatus !== 'VERIFIED' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => verifyMutation.mutate({ id: item.id, status: 'VERIFIED' })}
                      disabled={verifyMutation.isPending}
                      className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Approve
                    </button>
                    <button
                      onClick={() => verifyMutation.mutate({ id: item.id, status: 'REJECTED' })}
                      disabled={verifyMutation.isPending}
                      className="btn-secondary text-xs text-rose-600 border-rose-200 hover:bg-rose-50 flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-sm">No Internships Found</h3>
          <p className="text-xs text-gray-400 mt-1">No postings match the current search filter.</p>
        </div>
      )}
    </div>
  );
}
