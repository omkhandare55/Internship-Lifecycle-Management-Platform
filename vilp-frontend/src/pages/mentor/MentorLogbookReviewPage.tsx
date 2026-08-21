import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  CheckCircle2,
  Star,
  Loader2,
  X,
  AlertCircle,
} from 'lucide-react';
import { logbookApi } from '@/services/vilpApi';
import { StatusBadge } from '@/components/StatusBadge';
import { sendFirebaseNotification } from '@/services/firebaseNotificationService';
import type { WeeklyReport } from '@/types/vilp.types';

export function MentorLogbookReviewPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('SUBMITTED');
  const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null);
  const [decision, setDecision] = useState<'APPROVED' | 'REVISIONS_REQUESTED'>('APPROVED');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['mentorLogbookQueue', statusFilter],
    queryFn: () => logbookApi.getReviewQueue(statusFilter === 'ALL' ? undefined : statusFilter, 0, 50),
  });

  const reports = data?.data?.content || [];

  const reviewMutation = useMutation({
    mutationFn: () => {
      if (!selectedReport) throw new Error('No report');
      return logbookApi.reviewReport(selectedReport.id, decision, feedback, rating);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorLogbookQueue'] });
      queryClient.invalidateQueries({ queryKey: ['mentorDashboardQueue'] });
      queryClient.invalidateQueries({ queryKey: ['mentorAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['myLogbooks'] });
      queryClient.invalidateQueries({ queryKey: ['approvedHours'] });

      // Realtime Event Dispatch to Student
      sendFirebaseNotification({
        userId: selectedReport?.studentId || 'usr-1',
        title: `Weekly Logbook ${decision === 'APPROVED' ? 'Approved (40 hrs credited)' : 'Revisions Requested'}`,
        message: `Faculty mentor audited Week ${selectedReport?.weekNumber || 1} report (${rating}/5 stars).`,
        type: 'LOGBOOK',
        isRead: false,
      });

      setSelectedReport(null);
      setFeedback('');
      setMsg({ type: 'success', text: `Weekly logbook marked as ${decision} with ${rating}-star rating!` });
      setTimeout(() => setMsg(null), 3500);
    },
    onError: (err: any) => {
      setMsg({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to submit review',
      });
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Logbook Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review weekly work summaries, evaluate student performance, and grant accredited hours.
        </p>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {['SUBMITTED', 'APPROVED', 'REVISIONS_REQUESTED', 'ALL'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
              statusFilter === s
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Queue */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl p-6 border shadow-sm space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md border border-primary-100">
                      WEEK {report.weekNumber}
                    </span>
                    <h3 className="text-base font-bold text-gray-900">{report.studentName}</h3>
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Roll: <span className="font-mono">{report.studentNumber}</span> ·{' '}
                    {report.internshipTitle} ({report.hoursWorked} Hours)
                  </p>
                </div>

                {report.status === 'SUBMITTED' ? (
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setDecision('APPROVED');
                      setRating(5);
                    }}
                    className="btn-primary text-xs flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Grade & Review
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: report.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs space-y-1.5 text-gray-700">
                <p>
                  <strong className="text-gray-900">Tasks Completed:</strong> {report.tasksSummary}
                </p>
                {report.skillsApplied && (
                  <p>
                    <strong className="text-gray-900">Skills Applied:</strong> {report.skillsApplied}
                  </p>
                )}
                {report.challengesFaced && (
                  <p>
                    <strong className="text-gray-900">Challenges / Blockers:</strong>{' '}
                    {report.challengesFaced}
                  </p>
                )}
                {report.learnings && (
                  <p>
                    <strong className="text-gray-900">Learnings:</strong> {report.learnings}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-sm">No Logbooks In Queue</h3>
          <p className="text-xs text-gray-400 mt-1">
            No weekly logbooks require review under the selected filter.
          </p>
        </div>
      )}

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-lg p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1">Evaluate Weekly Logbook</h3>
            <p className="text-xs text-gray-500 mb-4">
              Student: {selectedReport.studentName} (Week {selectedReport.weekNumber})
            </p>

            <div className="space-y-4">
              <div>
                <label className="label">Review Decision</label>
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as any)}
                  className="input-field"
                >
                  <option value="APPROVED">APPROVED (Grant {selectedReport.hoursWorked} Hours)</option>
                  <option value="REVISIONS_REQUESTED">REVISIONS REQUESTED (Needs more details)</option>
                </select>
              </div>

              <div>
                <label className="label">Performance Rating (1 - 5 Stars)</label>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        rating >= s
                          ? 'bg-amber-50 text-amber-500 border-amber-300'
                          : 'bg-gray-50 text-gray-300 border-gray-200'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Mentor Feedback & Suggestions *</label>
                <textarea
                  rows={3}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Great progress on the API endpoints. Next week focus on unit tests..."
                  className="input-field"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="btn-secondary flex-1"
                  disabled={reviewMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => reviewMutation.mutate()}
                  disabled={reviewMutation.isPending || !feedback}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  {reviewMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
