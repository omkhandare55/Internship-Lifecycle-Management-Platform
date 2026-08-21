import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  AlertCircle,
} from 'lucide-react';
import { verificationApi } from '@/services/vilpApi';
import { StatusBadge } from '@/components/StatusBadge';
import type { VerificationItem } from '@/types/vilp.types';

export function TnpVerificationQueuePage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [activeStatus, setActiveStatus] = useState<string>('PENDING');
  const [selectedItem, setSelectedItem] = useState<VerificationItem | null>(null);
  const [decision, setDecision] = useState<'VERIFIED' | 'REJECTED'>('VERIFIED');
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['verificationQueue', activeTab, activeStatus],
    queryFn: () =>
      verificationApi.getQueue(
        0,
        50,
        activeTab === 'ALL' ? undefined : activeTab,
        activeStatus === 'ALL' ? undefined : activeStatus
      ),
  });

  const queue = data?.data?.content || [];

  const processMutation = useMutation({
    mutationFn: () => {
      if (!selectedItem) throw new Error('No item');
      return verificationApi.process(selectedItem.id, decision, notes, rejectionReason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verificationQueue'] });
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
      queryClient.invalidateQueries({ queryKey: ['tnpStudents'] });
      queryClient.invalidateQueries({ queryKey: ['tnpCompanies'] });
      queryClient.invalidateQueries({ queryKey: ['allStudents'] });
      setSelectedItem(null);
      setNotes('');
      setRejectionReason('');
      setMsg({ type: 'success', text: `Verification marked as ${decision} successfully!` });
      setTimeout(() => setMsg(null), 3500);
    },
    onError: (err: any) => {
      setMsg({
        type: 'error',
        text: err.response?.data?.error?.message || 'Processing decision failed',
      });
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Universal Verification Queue</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and audit student onboarding, company KYC registrations, and internship offerings.
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

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {['ALL', 'STUDENT', 'COMPANY', 'INTERNSHIP', 'DOCUMENT'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                activeTab === tab
                  ? 'bg-brand text-white border-brand'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'ALL'].map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                activeStatus === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Queue List */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : queue.length > 0 ? (
        <div className="space-y-3">
          {queue.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                    {item.entityType}
                  </span>
                  <span className="font-bold text-gray-900 text-sm">{item.verificationType}</span>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-xs text-gray-500">
                  Submitted by: {item.submittedByEmail || item.submittedBy} ·{' '}
                  {new Date(item.submittedAt).toLocaleDateString()}
                </p>
                {item.verificationNotes && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border mt-1">
                    Notes: {item.verificationNotes}
                  </p>
                )}
                {item.rejectionReason && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200 mt-1">
                    Rejection: {item.rejectionReason}
                  </p>
                )}
              </div>

              {item.status === 'PENDING' || item.status === 'UNDER_REVIEW' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setDecision('VERIFIED');
                    }}
                    className="btn-primary text-xs flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setDecision('REJECTED');
                    }}
                    className="btn-secondary text-xs flex items-center gap-1 text-rose-600 border-rose-200 hover:bg-rose-50"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              ) : (
                <div className="text-xs text-gray-400">
                  Audit Completed {item.verifiedAt ? `on ${new Date(item.verifiedAt).toLocaleDateString()}` : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border">
          <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-sm">Verification Queue is Clear</h3>
          <p className="text-xs text-gray-400 mt-1">
            No items pending audit under the selected filter criteria.
          </p>
        </div>
      )}

      {/* Decision Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-lg p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {decision === 'VERIFIED' ? 'Confirm Approval' : 'Confirm Rejection'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Audit for: {selectedItem.entityType} ({selectedItem.verificationType})
            </p>

            <div className="space-y-4">
              <div>
                <label className="label">Decision</label>
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as any)}
                  className="input-field"
                >
                  <option value="VERIFIED">VERIFIED (Approve)</option>
                  <option value="REJECTED">REJECTED (Decline)</option>
                  <option value="UNDER_REVIEW">UNDER REVIEW (More docs needed)</option>
                </select>
              </div>

              <div>
                <label className="label">Audit / Reviewer Notes (Internal)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Verification confirmed with college records..."
                  className="input-field"
                />
              </div>

              {decision === 'REJECTED' && (
                <div>
                  <label className="label">Rejection Reason (Visible to user) *</label>
                  <textarea
                    rows={2}
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Invalid ID proof uploaded / low quality scan..."
                    className="input-field"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="btn-secondary flex-1"
                  disabled={processMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => processMutation.mutate()}
                  disabled={processMutation.isPending || (decision === 'REJECTED' && !rejectionReason)}
                  className={`flex-1 flex items-center justify-center gap-2 ${
                    decision === 'VERIFIED'
                      ? 'btn-primary bg-emerald-600 hover:bg-emerald-700'
                      : 'btn-primary bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {processMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Decision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
