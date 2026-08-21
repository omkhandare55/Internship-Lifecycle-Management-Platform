import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Loader2, X, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { internshipApi, applicationApi, offerApi } from '@/services/vilpApi';
import { StatusBadge } from '@/components/StatusBadge';
import { sendFirebaseNotification } from '@/services/firebaseNotificationService';
import type { Application, CreateOfferInput } from '@/types/vilp.types';

export function CompanyApplicantsPage() {
  const queryClient = useQueryClient();
  const [selectedInternshipId, setSelectedInternshipId] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<string>('SHORTLISTED');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [offerApp, setOfferApp] = useState<Application | null>(null);
  const [offerData, setOfferData] = useState<CreateOfferInput>({
    applicationId: '',
    stipend: 15000,
    startDate: '',
    endDate: '',
    termsAndConditions: 'Standard 40 hours per week, remote work policy applies.',
  });
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: internshipsData } = useQuery({
    queryKey: ['myInternships'],
    queryFn: () => internshipApi.listMine(0, 50),
  });

  const internships = internshipsData?.data?.content || [];
  const activeInternshipId = selectedInternshipId || internships[0]?.id;

  const { data: applicantsData, isLoading } = useQuery({
    queryKey: ['applicants', activeInternshipId],
    queryFn: () =>
      activeInternshipId
        ? applicationApi.listForInternship(activeInternshipId, undefined, 0, 50)
        : Promise.resolve({ success: true, data: { content: [] } as any }),
    enabled: !!activeInternshipId,
  });

  const applicants = applicantsData?.data?.content || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ appId, status, reason }: { appId: string; status: string; reason?: string }) =>
      applicationApi.updateStatus(appId, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicants'] });
      queryClient.invalidateQueries({ queryKey: ['companyApplicants'] });
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      queryClient.invalidateQueries({ queryKey: ['myOffers'] });
      setSelectedApp(null);
      setRejectionReason('');
      setMsg({ type: 'success', text: 'Application status updated successfully!' });
      setTimeout(() => setMsg(null), 3000);
    },
  });

  const createOfferMutation = useMutation({
    mutationFn: (input: CreateOfferInput) => offerApi.createOffer(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicants'] });
      queryClient.invalidateQueries({ queryKey: ['companyApplicants'] });
      queryClient.invalidateQueries({ queryKey: ['myOffers'] });
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      
      // Realtime Event Dispatch to Student
      sendFirebaseNotification({
        userId: offerApp?.studentId || 'usr-1',
        title: 'Official Internship Offer Extended',
        message: `Google Cloud India issued your formal internship offer letter (${offerData.stipend ? `₹${offerData.stipend}/mo` : 'Stipend Included'}).`,
        type: 'OFFER',
        isRead: false,
      });

      setOfferApp(null);
      setMsg({
        type: 'success',
        text: 'Formal offer extended to student! Application marked as SELECTED.',
      });
      setTimeout(() => setMsg(null), 4000);
    },
    onError: (err: any) => {
      setMsg({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to extend offer',
      });
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicant Pipeline & Offers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review candidate profiles, shortlist, schedule interviews, and extend formal internship offers.
          </p>
        </div>

        {internships.length > 0 && (
          <select
            value={activeInternshipId || ''}
            onChange={(e) => setSelectedInternshipId(e.target.value)}
            className="input-field max-w-xs font-semibold text-xs"
          >
            {internships.map((i) => (
              <option key={i.id} value={i.id}>
                {i.title} ({i.mode})
              </option>
            ))}
          </select>
        )}
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

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : applicants.length > 0 ? (
        <div className="space-y-3">
          {applicants.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-5 border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900">{app.studentName}</h3>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-xs text-gray-500">
                  Applied for: <span className="font-semibold text-gray-700">{app.internshipTitle}</span> ·{' '}
                  {new Date(app.appliedAt).toLocaleDateString()}
                </p>

                {app.coverLetter && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border mt-2">
                    <span className="font-semibold text-gray-800">Cover Note:</span> {app.coverLetter}
                  </p>
                )}

                {app.rejectionReason && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 mt-2">
                    Feedback: {app.rejectionReason}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {app.status !== 'SELECTED' && app.status !== 'REJECTED' && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setNewStatus('SHORTLISTED');
                      }}
                      className="btn-secondary text-xs"
                    >
                      Update Stage
                    </button>
                    <button
                      onClick={() => {
                        setOfferApp(app);
                        setOfferData({
                          applicationId: app.id,
                          stipend: 15000,
                          startDate: new Date().toISOString().split('T')[0],
                          endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
                          termsAndConditions: 'Standard 40 hours per week, IP assignment agreement applies.',
                        });
                      }}
                      className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" /> Extend Offer
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-sm">No Applicants for this Position</h3>
          <p className="text-xs text-gray-400 mt-1">
            Ensure your internship is published and verified by T&P to attract student applications.
          </p>
        </div>
      )}

      {/* Update Status Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-lg p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1">Update Application Stage</h3>
            <p className="text-xs text-gray-500 mb-4">Candidate: {selectedApp.studentName}</p>

            <div className="space-y-4">
              <div>
                <label className="label">Next Pipeline Stage</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input-field"
                >
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEW">Interview Scheduled</option>
                  <option value="SELECTED">Selected</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {newStatus === 'REJECTED' && (
                <div>
                  <label className="label">Rejection Feedback (Required)</label>
                  <textarea
                    rows={3}
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide constructive feedback for the candidate..."
                    className="input-field"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="btn-secondary flex-1"
                  disabled={updateStatusMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateStatusMutation.mutate({
                      appId: selectedApp.id,
                      status: newStatus,
                      reason: rejectionReason,
                    })
                  }
                  disabled={updateStatusMutation.isPending || (newStatus === 'REJECTED' && !rejectionReason)}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {updateStatusMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extend Formal Offer Modal */}
      {offerApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border">
            <button
              onClick={() => setOfferApp(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-lg p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-gray-900">Extend Formal Internship Offer</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Candidate: <span className="font-semibold text-gray-800">{offerApp.studentName}</span> · {offerApp.internshipTitle}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createOfferMutation.mutate(offerData);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Monthly Stipend (INR) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="500"
                    value={offerData.stipend || 0}
                    onChange={(e) =>
                      setOfferData({ ...offerData, stipend: Number(e.target.value) })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={offerData.startDate}
                    onChange={(e) => setOfferData({ ...offerData, startDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">End Date *</label>
                  <input
                    type="date"
                    required
                    value={offerData.endDate}
                    onChange={(e) => setOfferData({ ...offerData, endDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Terms & Conditions</label>
                  <textarea
                    rows={3}
                    value={offerData.termsAndConditions}
                    onChange={(e) =>
                      setOfferData({ ...offerData, termsAndConditions: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setOfferApp(null)}
                  className="btn-secondary flex-1"
                  disabled={createOfferMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createOfferMutation.isPending}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  {createOfferMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Issue Official Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
