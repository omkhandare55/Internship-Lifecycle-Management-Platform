import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
  Plus,
  X,
} from 'lucide-react';
import { logbookApi, offerApi } from '@/services/vilpApi';
import { sendFirebaseNotification } from '@/services/firebaseNotificationService';
import { ActivityHeatmapCalendar } from '@/components/ActivityHeatmapCalendar';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ApiErrorState } from '@/components/ui/ApiErrorState';
import type { SubmitWeeklyReportInput } from '@/types/vilp.types';

export function StudentProgressPage() {
  const queryClient = useQueryClient();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: offersData } = useQuery({
    queryKey: ['myOffers'],
    queryFn: () => offerApi.getMyOffers(0, 50),
  });

  const activeOffer = offersData?.data?.content?.find((o) => o.status === 'ACCEPTED');

  const { data: reportsData, isLoading: loadingReports, error: reportsError, refetch: refetchReports } = useQuery({
    queryKey: ['myLogbooks'],
    queryFn: () => logbookApi.getMyReports(0, 50),
  });

  const { data: approvedHoursData } = useQuery({
    queryKey: ['approvedHours'],
    queryFn: logbookApi.getTotalApprovedHours,
  });

  const reports = reportsData?.data?.content || [];
  const approvedHours = approvedHoursData?.data ?? 160;
  const targetHours = 240;
  const hoursPercentage = Math.min(Math.round((approvedHours / targetHours) * 100), 100);

  const [formData, setFormData] = useState<SubmitWeeklyReportInput>({
    internshipId: activeOffer?.internshipId || 'int-001',
    weekNumber: reports.length + 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    hoursWorked: 40,
    tasksSummary: '',
    skillsApplied: '',
    challengesFaced: '',
    learnings: '',
  });

  const submitMutation = useMutation({
    mutationFn: () => logbookApi.submitReport(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myLogbooks'] });
      queryClient.invalidateQueries({ queryKey: ['approvedHours'] });
      queryClient.invalidateQueries({ queryKey: ['mentorLogbookQueue'] });
      queryClient.invalidateQueries({ queryKey: ['mentorDashboardQueue'] });
      queryClient.invalidateQueries({ queryKey: ['mentorAnalytics'] });

      // Realtime Event Dispatch
      sendFirebaseNotification({
        userId: 'usr-1',
        title: `Week ${formData.weekNumber} Logbook Submitted`,
        message: `Submitted ${formData.hoursWorked} hours summary to Faculty Mentor for AICTE accreditation sign-off.`,
        type: 'LOGBOOK',
        isRead: false,
      });

      setIsSubmitModalOpen(false);
      setFormData({
        internshipId: activeOffer?.internshipId || 'int-001',
        weekNumber: reports.length + 2,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
        hoursWorked: 40,
        tasksSummary: '',
        skillsApplied: '',
        challengesFaced: '',
        learnings: '',
      });
      setMsg({ type: 'success', text: 'Weekly logbook report submitted to Faculty Advisor for review.' });
      setTimeout(() => setMsg(null), 4000);
    },
    onError: () => {
      setMsg({ type: 'error', text: 'Could not submit report. Please try again.' });
    },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in font-mono text-[#0F172A]">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block">
            240-HOUR ATTENDANCE TELEMETRY // AICTE DEGREE REQUIREMENT
          </span>
          <h1 className="text-xl sm:text-2xl font-black uppercase text-[#0A2540] font-sans tracking-tight m-0">
            Weekly Activity Logbook &amp; Hours Tracker
          </h1>
          <p className="text-xs text-slate-600 font-mono mt-1 max-w-2xl m-0">
            Log your weekly engineering hours, report technical milestones, and receive official faculty mentor performance ratings.
          </p>
        </div>
        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="btn-primary text-xs self-start sm:self-auto flex items-center gap-2 px-5 py-2.5"
        >
          <Plus className="w-3.5 h-3.5" /> SUBMIT NEW WEEK LOG
        </button>
      </div>

      {msg && (
        <div
          className={`p-4 border text-xs font-bold flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-red-50 text-red-700 border-red-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> {msg.text}
        </div>
      )}

      {/* ── 240-Hour Progress Ledger ───────────────────────────────────────── */}
      <div className="border border-[#E0D3E8] bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0D3E8] pb-4">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">ACADEMIC ACCREDITATION GAUGE</span>
            <h2 className="text-xl font-black text-[#171024] uppercase font-sans">
              Degree Credit Accumulation
            </h2>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-[#723ECF] font-mono">{hoursPercentage}%</p>
            <p className="text-[10px] text-zinc-500">{approvedHours} / {targetHours} Approved Hours</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-[#F4EEF7] h-3 border border-[#E0D3E8] overflow-hidden">
            <div
              className="bg-[#723ECF] h-full transition-all duration-500"
              style={{ width: `${hoursPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>0 hrs</span>
            <span>120 hrs (Midterm Checkpoint)</span>
            <span>240 hrs (Degree Credit Goal)</span>
          </div>
        </div>
      </div>

      {/* ── Daily Activity Calendar (LeetCode / GitHub Green Boxes) ───────── */}
      <ActivityHeatmapCalendar
        reports={reports}
        totalApprovedHours={approvedHours}
        isRealtime={true}
      />

      {/* ── Weekly Reports Ledger ──────────────────────────────────────────── */}
      <div className="border border-[#E0D3E8] bg-white p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E0D3E8] pb-4">
          <div>
            <span className="text-[10px] text-[#723ECF] font-bold uppercase block">HISTORICAL LOGBOOK LEDGER</span>
            <h2 className="text-xl font-black text-[#171024] uppercase font-sans">
              Submitted Weekly Activity Reports
            </h2>
          </div>
        </div>

        {loadingReports ? (
          <div className="mb-4">
            <LoadingSkeleton type="row" rows={3} />
          </div>
        ) : reportsError ? (
          <ApiErrorState error={reportsError} onRetry={refetchReports} />
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">
            No weekly reports logged yet. Click &quot;Submit New Week Log&quot; above to begin.
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <div
                key={r.id}
                className="border border-[#E0D3E8] p-6 hover:border-[#723ECF] transition-colors space-y-4 bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0D3E8] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-[#FEF8E7] text-[#723ECF] border border-[#E0D3E8] font-bold text-xs">
                      WEEK {r.weekNumber}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {r.startDate} to {r.endDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#171024]">
                      {r.hoursWorked} Hours Logged
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 font-bold uppercase ${
                        r.status === 'APPROVED'
                          ? 'bg-[#F4EEF7] text-[#723ECF] border border-[#723ECF]'
                          : 'bg-[#FEF8E7] text-[#ED4B86] border border-[#ED4B86]'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="font-bold text-[#171024]">ENGINEERING DELIVERABLES:</p>
                  <p className="text-zinc-700 leading-relaxed font-mono bg-[#F4EEF7] p-3 border border-[#E0D3E8]">
                    {r.tasksSummary}
                  </p>
                </div>

                {r.mentorFeedback && (
                  <div className="p-3 bg-[#FEF8E7] border border-[#E0D3E8] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">FACULTY ADVISOR FEEDBACK</span>
                      {r.rating && (
                        <span className="text-[#723ECF] font-bold">
                          {'★'.repeat(r.rating)} ({r.rating}.0 / 5.0)
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-800 font-mono">{r.mentorFeedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Submit Modal ───────────────────────────────────────────────────── */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in font-mono">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 relative border border-[#E0D3E8] animate-slide-down text-[#171024] shadow-2xl space-y-4">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] text-[#723ECF] font-bold uppercase">ACTIVITY DISPATCH</span>
              <h3 className="text-lg font-black text-[#171024] uppercase font-sans">
                Submit Week {formData.weekNumber} Activity Report
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitMutation.mutate();
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">HOURS WORKED</label>
                  <input
                    type="number"
                    value={formData.hoursWorked}
                    onChange={(e) => setFormData({ ...formData, hoursWorked: Number(e.target.value) })}
                    className="input-field text-xs font-mono"
                    required
                    min={1}
                    max={60}
                  />
                </div>
                <div>
                  <label className="label">WEEK NUMBER</label>
                  <input
                    type="number"
                    value={formData.weekNumber}
                    onChange={(e) => setFormData({ ...formData, weekNumber: Number(e.target.value) })}
                    className="input-field text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">TECHNICAL TASKS SUMMARY</label>
                <textarea
                  rows={3}
                  value={formData.tasksSummary}
                  onChange={(e) => setFormData({ ...formData, tasksSummary: e.target.value })}
                  placeholder="Describe systems built, PRs merged, bugs fixed, and architectural deliverables..."
                  className="input-field text-xs resize-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="label">SKILLS APPLIED (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={formData.skillsApplied || ''}
                  onChange={(e) => setFormData({ ...formData, skillsApplied: e.target.value })}
                  placeholder="Java, Spring Boot, Postgres, Docker"
                  className="input-field text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="btn-primary text-xs px-5"
                >
                  {submitMutation.isPending ? 'SUBMITTING...' : 'TRANSMIT LOGBOOK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
