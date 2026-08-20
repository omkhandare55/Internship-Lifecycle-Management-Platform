import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Briefcase,
  Building2,
  Download,
  Loader2,
} from 'lucide-react';
import { ppoApi } from '@/services/vilpApi';
import { StatusBadge } from '@/components/StatusBadge';

export function TnpPpoRegistryPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['ppoRegistry', statusFilter],
    queryFn: () => ppoApi.getRegistry(statusFilter === 'ALL' ? undefined : statusFilter, 0, 100),
  });

  const ppos = data?.data?.content || [];

  const handleExportCsv = () => {
    if (ppos.length === 0) return;
    const headers = ['Student Name', 'Roll No', 'Department', 'Company', 'Designation', 'CTC (INR)', 'Status', 'Joining Date'];
    const rows = ppos.map((p) => [
      `"${p.studentName}"`,
      `"${p.studentNumber}"`,
      `"${p.departmentName || 'Engineering'}"`,
      `"${p.companyName}"`,
      `"${p.designation}"`,
      p.ctcAnnual,
      `"${p.status}"`,
      `"${p.joiningDate || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vilp_placement_registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Institutional Placement & PPO Registry</h1>
          <p className="text-sm text-gray-500 mt-1">
            Central repository of Pre-Placement Offers, corporate conversion packages, and joining statuses.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={ppos.length === 0}
          className="btn-secondary text-xs flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm flex gap-2">
        {['ALL', 'OFFERED', 'ACCEPTED', 'DECLINED', 'JOINED'].map((s) => (
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

      {/* Registry Table */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : ppos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b text-gray-500 font-semibold uppercase">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Host Recruiter</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4">CTC Package</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joining Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ppos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{p.studentName}</p>
                      <p className="text-[11px] text-gray-400 font-mono">
                        {p.studentNumber} · {p.departmentName || 'Engineering'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        {p.companyName}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{p.designation}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        ₹{(p.ctcAnnual / 100000).toFixed(2)} LPA
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {p.joiningDate ? new Date(p.joiningDate).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 text-xs">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 text-sm">No PPO Records Found</h3>
            <p className="text-xs text-gray-400 mt-1">
              No placement records match the current filter selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
