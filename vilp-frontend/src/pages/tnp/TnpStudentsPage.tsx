import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, GraduationCap, Loader2, Activity } from 'lucide-react';
import { studentApi } from '@/services/vilpApi';
import { StatusBadge } from '@/components/StatusBadge';
import { StudentLiveTelemetryModal } from '@/components/StudentLiveTelemetryModal';
import type { StudentProfile } from '@/types/vilp.types';

export function TnpStudentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedTelemetryStudent, setSelectedTelemetryStudent] = useState<StudentProfile | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['tnpStudents', statusFilter],
    queryFn: () => studentApi.listAll(0, 50, statusFilter === 'ALL' ? undefined : statusFilter),
  });

  const students = data?.data?.content || [];

  const filtered = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
        <p className="text-sm text-gray-500 mt-1">
          Institutional record of all enrolled students and verification status.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll number, or email..."
            className="input-field pl-10"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {['ALL', 'VERIFIED', 'REGISTERED', 'REJECTED'].map((s) => (
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
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 border-b text-gray-500 font-semibold uppercase">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Roll No</th>
                  <th className="p-4">Department & Branch</th>
                  <th className="p-4">CGPA / Backlogs</th>
                  <th className="p-4">Profile</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4 text-right">Realtime Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-700">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-semibold text-gray-900">
                      <div>{s.fullName}</div>
                      <div className="text-[11px] text-gray-400 font-normal">{s.email}</div>
                    </td>
                    <td className="p-4 font-mono font-medium text-gray-600">{s.studentNumber}</td>
                    <td className="p-4">
                      <div>{s.department?.name || '—'}</div>
                      <div className="text-[11px] text-gray-400">{s.branch || '—'}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-emerald-600 font-mono">
                        {s.cgpa ? Number(s.cgpa).toFixed(2) : '—'}
                      </span>{' '}
                      <span className="text-gray-400">/ Backlogs: {s.backlogs}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand rounded-full"
                            style={{ width: `${s.profileCompletion}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-gray-500">{s.profileCompletion}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={s.verificationStatus} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedTelemetryStudent(s)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0A2540] hover:bg-[#2563EB] text-white text-[11px] font-mono font-bold rounded-xs transition-colors cursor-pointer"
                      >
                        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>VIEW HEATMAP</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border">
          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-sm">No Students Found</h3>
          <p className="text-xs text-gray-400 mt-1">No student records match the search criteria.</p>
        </div>
      )}

      {/* ── Student Live Telemetry & Daily Activity Heatmap Modal ─────── */}
      {selectedTelemetryStudent && (
        <StudentLiveTelemetryModal
          student={selectedTelemetryStudent}
          onClose={() => setSelectedTelemetryStudent(null)}
        />
      )}
    </div>
  );
}
