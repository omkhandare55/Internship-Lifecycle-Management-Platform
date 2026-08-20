import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Search, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { companyApi } from '@/services/vilpApi';
import { StatusBadge } from '@/components/StatusBadge';

export function TnpCompaniesPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['tnpCompanies', statusFilter],
    queryFn: () => companyApi.listAll(0, 50, statusFilter === 'ALL' ? undefined : statusFilter),
  });

  const companies = data?.data?.content || [];

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      companyApi.verify(id, status, 'Direct T&P verification update'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tnpCompanies'] }),
  });

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry?.toLowerCase().includes(search.toLowerCase()) ||
      c.contactEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Registered Companies</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review corporate recruiters, verify accreditation, and govern internship posting privileges.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name, industry, or contact email..."
            className="input-field pl-10"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                statusFilter === s
                  ? 'bg-brand text-white border-brand'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                    <p className="text-xs text-gray-500">{c.industry || 'Industry not specified'}</p>
                  </div>
                  <StatusBadge status={c.verificationStatus} />
                </div>

                {c.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">{c.description}</p>
                )}

                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border space-y-1">
                  <p>
                    <strong>Contact:</strong> {c.contactPersonName || '—'} ({c.contactEmail || '—'})
                  </p>
                  <p>
                    <strong>Location:</strong> {c.headquarters || '—'} · <strong>Size:</strong>{' '}
                    {c.size || '—'}
                  </p>
                  {c.website && (
                    <p>
                      <strong>Website:</strong>{' '}
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        {c.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-between mt-3">
                <span className="text-[11px] text-gray-400">
                  Registered: {new Date(c.createdAt).toLocaleDateString()}
                </span>
                {c.verificationStatus !== 'VERIFIED' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => verifyMutation.mutate({ id: c.id, status: 'VERIFIED' })}
                      disabled={verifyMutation.isPending}
                      className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Approve KYC
                    </button>
                    <button
                      onClick={() => verifyMutation.mutate({ id: c.id, status: 'REJECTED' })}
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
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-sm">No Companies Found</h3>
          <p className="text-xs text-gray-400 mt-1">No company records match your current filter.</p>
        </div>
      )}
    </div>
  );
}
