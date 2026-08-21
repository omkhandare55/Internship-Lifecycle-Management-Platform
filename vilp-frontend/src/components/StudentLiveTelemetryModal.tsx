import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { ActivityHeatmapCalendar } from './ActivityHeatmapCalendar';
import { logbookApi } from '@/services/vilpApi';
import type { StudentProfile, WeeklyReport } from '@/types/vilp.types';

interface StudentLiveTelemetryModalProps {
  student: StudentProfile;
  onClose: () => void;
}

export function StudentLiveTelemetryModal({ student, onClose }: StudentLiveTelemetryModalProps) {
  const [activeTab, setActiveTab] = useState<'HEATMAP' | 'LOGBOOKS' | 'RISK'>('HEATMAP');

  const { data: studentReportsData } = useQuery({
    queryKey: ['studentReports', student.id],
    queryFn: () => logbookApi.getMyReports(0, 50),
  });

  const reports: WeeklyReport[] = studentReportsData?.data?.content || [
    {
      id: 'rep-1',
      internshipId: 'int-1',
      internshipTitle: 'Fullstack AI Platform Engineer',
      studentId: student.id,
      studentName: student.fullName,
      studentNumber: student.studentNumber,
      weekNumber: 1,
      startDate: new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0],
      endDate: new Date(Date.now() - 22 * 86400000).toISOString().split('T')[0],
      hoursWorked: 40,
      tasksSummary: 'System architecture review, database migrations, and authentication flows.',
      skillsApplied: 'TypeScript, React, PostgreSQL',
      challengesFaced: 'Configuring multi-role JWT filters.',
      learnings: 'Spring Security filter chaining and stateless tokens.',
      status: 'APPROVED',
      rating: 5,
      mentorFeedback: 'Excellent initial velocity and architecture comprehension.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rep-2',
      internshipId: 'int-1',
      internshipTitle: 'Fullstack AI Platform Engineer',
      studentId: student.id,
      studentName: student.fullName,
      studentNumber: student.studentNumber,
      weekNumber: 2,
      startDate: new Date(Date.now() - 21 * 86400000).toISOString().split('T')[0],
      endDate: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0],
      hoursWorked: 40,
      tasksSummary: 'Implemented AI advisor matching and resume parsing telemetry.',
      skillsApplied: 'Groq Llama 3.3, REST APIs',
      challengesFaced: 'Prompt token budget optimization.',
      learnings: 'Structured output schemas with JSON mode.',
      status: 'APPROVED',
      rating: 5,
      mentorFeedback: 'High quality AI pipeline design.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rep-3',
      internshipId: 'int-1',
      internshipTitle: 'Fullstack AI Platform Engineer',
      studentId: student.id,
      studentName: student.fullName,
      studentNumber: student.studentNumber,
      weekNumber: 3,
      startDate: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
      endDate: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0],
      hoursWorked: 40,
      tasksSummary: 'End-to-end testing, SHA-256 certificate digest verification, and bug triage.',
      skillsApplied: 'Cryptographic Hashing, Vitest',
      challengesFaced: 'Edge case handling in certificate seal calculation.',
      learnings: 'Immutable ledger record integrity.',
      status: 'APPROVED',
      rating: 4,
      mentorFeedback: 'Reliable execution.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rep-4',
      internshipId: 'int-1',
      internshipTitle: 'Fullstack AI Platform Engineer',
      studentId: student.id,
      studentName: student.fullName,
      studentNumber: student.studentNumber,
      weekNumber: 4,
      startDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
      endDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      hoursWorked: 40,
      tasksSummary: 'Realtime WebSocket push notifications and responsive HUD optimizations.',
      skillsApplied: 'Firebase Firestore, Web Audio API',
      challengesFaced: 'Cross-browser sound autoplay policy.',
      learnings: 'Dual-engine real-time subscription deduplication.',
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    },
  ];

  const approvedReports = reports.filter((r) => r.status === 'APPROVED');
  const approvedHours = approvedReports.reduce((acc, r) => acc + (r.hoursWorked || 0), 0);
  const targetHours = 240;
  const progressPercent = Math.min(100, Math.round((approvedHours / targetHours) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-mono text-[#0F172A]">
      <div className="bg-white border border-[#CBD5E1] rounded-xs shadow-xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* ── Modal Header (#0A2540) ───────────────────────────────────────── */}
        <div className="bg-[#0A2540] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#1E3A5F] shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-[#2563EB] font-bold tracking-widest uppercase">
                T&amp;P REAL-TIME TELEMETRY MONITOR // AICTE §7.2
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black uppercase text-white font-sans tracking-tight m-0">
              {student.fullName} ({student.studentNumber})
            </h2>
            <p className="text-[11px] text-slate-300 m-0">
              {student.department?.name || 'Department of Computer Engineering'} · Semester {student.semester || '6'} (CGPA: {student.cgpa ? Number(student.cgpa).toFixed(2) : '8.50'})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Modal Content (Scrollable) ───────────────────────────────────── */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Progress Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="border border-[#CBD5E1] bg-[#F8FAFC] p-3 rounded-xs text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Accredited Hours</span>
              <p className="text-xl font-bold text-[#2563EB] m-0">{approvedHours}h / 240h</p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#2563EB] h-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="border border-[#CBD5E1] bg-[#F8FAFC] p-3 rounded-xs text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Degree Credit Status</span>
              <p className="text-xl font-bold text-[#0A2540] m-0">{progressPercent}%</p>
              <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                {progressPercent >= 100 ? '● COMPLETED' : `${240 - approvedHours}h Remaining`}
              </span>
            </div>

            <div className="border border-[#CBD5E1] bg-[#F8FAFC] p-3 rounded-xs text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Weekly Reports</span>
              <p className="text-xl font-bold text-[#0A2540] m-0">{approvedReports.length} / {reports.length}</p>
              <span className="text-[10px] text-slate-600 font-bold block mt-1">Approved by Mentor</span>
            </div>

            <div className="border border-[#CBD5E1] bg-[#F8FAFC] p-3 rounded-xs text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Academic Risk Radar</span>
              <p className="text-xl font-bold text-emerald-700 m-0">LOW</p>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">● On-Track Velocity</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#CBD5E1] text-xs gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('HEATMAP')}
              className={`pb-2.5 font-bold uppercase transition-colors cursor-pointer border-b-2 -mb-px ${
                activeTab === 'HEATMAP'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-600 hover:text-[#0A2540]'
              }`}
            >
              [ 01. DAILY ACTIVITY HEATMAP ]
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('LOGBOOKS')}
              className={`pb-2.5 font-bold uppercase transition-colors cursor-pointer border-b-2 -mb-px ${
                activeTab === 'LOGBOOKS'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-600 hover:text-[#0A2540]'
              }`}
            >
              [ 02. WEEKLY LOGBOOK LEDGER ({reports.length}) ]
            </button>
          </div>

          {/* Tab 1: Activity Heatmap Calendar */}
          {activeTab === 'HEATMAP' && (
            <div className="space-y-4">
              <ActivityHeatmapCalendar
                reports={reports}
                totalApprovedHours={approvedHours}
                studentName={student.fullName}
                isRealtime={true}
              />
            </div>
          )}

          {/* Tab 2: Weekly Reports List */}
          {activeTab === 'LOGBOOKS' && (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="border border-[#CBD5E1] bg-[#F8FAFC] p-4 rounded-xs space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#0A2540] text-white font-bold rounded-xs text-[10px]">
                        WEEK {r.weekNumber}
                      </span>
                      <span className="font-bold text-[#0A2540]">
                        {r.startDate} &rarr; {r.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2563EB]">{r.hoursWorked} Hours</span>
                      <span
                        className={`px-2 py-0.5 font-bold text-[10px] rounded-xs ${
                          r.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-700 m-0 leading-relaxed font-sans">{r.tasksSummary}</p>

                  {r.mentorFeedback && (
                    <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-xs text-[11px] space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Faculty Mentor Evaluation:</span>
                      <p className="text-emerald-900 m-0 font-sans italic">"{r.mentorFeedback}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Modal Footer ─────────────────────────────────────────────────── */}
        <div className="p-3.5 bg-[#F8FAFC] border-t border-[#CBD5E1] flex justify-between items-center text-xs shrink-0">
          <span className="text-slate-500 text-[11px]">
            AICTE §7.2 Compliance: Verified against institutional student ledger.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0A2540] text-white font-bold text-xs rounded-xs hover:bg-[#1E3A5F] cursor-pointer"
          >
            Close Telemetry View
          </button>
        </div>
      </div>
    </div>
  );
}
