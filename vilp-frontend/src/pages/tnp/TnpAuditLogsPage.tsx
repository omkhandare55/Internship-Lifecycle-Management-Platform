import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  History,
  Search,
  Filter,
  Loader2,
  Globe,
  User,
} from 'lucide-react';
import { auditApi } from '@/services/vilpApi';

export function TnpAuditLogsPage() {
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['auditLogs', actionFilter, entityFilter, page],
    queryFn: () => auditApi.getLogs(actionFilter || undefined, entityFilter || undefined, page, 30),
  });

  const logs = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security & Compliance Audit Trail</h1>
        <p className="text-sm text-gray-500 mt-1">
          Immutable event log tracking administrative verifications, offer responses, and system security actions.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(0);
            }}
            placeholder="Filter by action (e.g. STUDENT_VERIFIED, NOC_APPROVED)..."
            className="input-field pl-9 text-xs"
          />
        </div>

        <div className="sm:w-64 relative">
          <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={entityFilter}
            onChange={(e) => {
              setEntityFilter(e.target.value);
              setPage(0);
            }}
            className="input-field pl-9 text-xs"
          >
            <option value="">All Entity Types</option>
            <option value="STUDENT">Student</option>
            <option value="COMPANY">Company</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="OFFER">Offer</option>
            <option value="NOC">NOC</option>
            <option value="CERTIFICATE">Certificate</option>
            <option value="SECURITY">Security / Auth</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b text-gray-500 font-semibold uppercase">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Client IP</th>
                  <th className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/60 transition-colors font-sans">
                    <td className="px-6 py-4 text-gray-500 text-[11px] whitespace-nowrap font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-800">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium text-xs truncate max-w-[150px]">
                          {log.userEmail || 'System'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-[11px] bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-[11px]">
                      {log.entityType ? `${log.entityType} (${log.entityId?.slice(0, 8)}...)` : '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-[11px] font-mono">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3 text-gray-300" />
                        {log.ipAddress || '127.0.0.1'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs max-w-xs truncate">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 text-xs">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 text-sm">No Audit Events Logged</h3>
            <p className="text-xs text-gray-400 mt-1">
              Events will appear as users perform verification, evaluation, and issuance operations.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between text-xs text-gray-500">
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn-secondary text-xs px-3 py-1"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn-secondary text-xs px-3 py-1"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
