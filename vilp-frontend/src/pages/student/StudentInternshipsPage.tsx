import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  IndianRupee,
  Building2,
  Calendar,
  CheckCircle2,
  Send,
  Loader2,
  AlertCircle,
  X,
  ShieldCheck,
} from 'lucide-react';
import { internshipApi, applicationApi, studentApi } from '@/services/vilpApi';
import { StatusBadge } from '@/components/StatusBadge';
import { EligibilityModal } from '@/components/EligibilityModal';
import type { Internship } from '@/types/vilp.types';

export function StudentInternshipsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('ALL');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [eligibilityAuditItem, setEligibilityAuditItem] = useState<Internship | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Queries
  const { data: internshipsData, isLoading } = useQuery({
    queryKey: ['openInternships'],
    queryFn: () => internshipApi.listOpen(0, 50),
  });

  const { data: studentProfileData } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: studentApi.getMyProfile,
  });

  const student = studentProfileData?.data;
  const internships = internshipsData?.data?.content || [];

  // Filtered internships
  const filtered = internships.filter((i) => {
    const matchesSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.company?.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description?.toLowerCase().includes(search.toLowerCase());
    const matchesMode = selectedMode === 'ALL' || i.mode === selectedMode;
    return matchesSearch && matchesMode;
  });

  // Apply Mutation
  const applyMutation = useMutation({
    mutationFn: (internshipId: string) => applicationApi.apply(internshipId, coverLetter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      setSelectedInternship(null);
      setCoverLetter('');
      setActionMsg({
        type: 'success',
        text: 'Application submitted successfully! Track it in the Applications tab.',
      });
      setTimeout(() => setActionMsg(null), 4000);
    },
    onError: (err: any) => {
      setActionMsg({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to submit application',
      });
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verified Internships</h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore accredited opportunities from verified companies approved by T&P.
        </p>
      </div>

      {actionMsg && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${
            actionMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {actionMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role, company name, or keywords..."
            className="input-field pl-10"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {['ALL', 'REMOTE', 'ONSITE', 'HYBRID'].map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-3.5 py-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedMode === mode
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Internship Cards Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100 uppercase tracking-wider">
                      {item.uniqueId || 'VERIFIED INTERNSHIP'}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{item.title}</h3>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-semibold">{item.company?.name}</span>
                      {item.company?.industry && ` · ${item.company.industry}`}
                    </p>
                  </div>
                  <StatusBadge status={item.mode} />
                </div>

                <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                  {item.description}
                </p>

                {/* Details Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border mb-4">
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.stipend ? `₹${item.stipend.toLocaleString()}/mo` : 'Unpaid / Free'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.duration ? `${item.duration} Weeks` : 'Flexible'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    <span>{item.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      {item.applicationDeadline
                        ? `Deadline: ${new Date(item.applicationDeadline).toLocaleDateString()}`
                        : 'Open until filled'}
                    </span>
                  </div>
                </div>

                {/* Requirements check preview */}
                {item.requirement && (
                  <div className="text-[11px] text-gray-500 mb-4 space-y-0.5">
                    <p>
                      <strong>Eligibility:</strong> Min CGPA:{' '}
                      <span className="text-gray-900 font-mono">
                        {item.requirement.minimumCgpa || 0}
                      </span>{' '}
                      · Max Backlogs: {item.requirement.maximumBacklogs ?? 0}
                    </p>
                    {item.requirement.department && (
                      <p>
                        <strong>Target Dept:</strong> {item.requirement.department}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setEligibilityAuditItem(item)}
                  className="btn-secondary text-xs flex items-center gap-1 text-primary-700 hover:bg-primary-50/50"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-primary-600" /> Check Eligibility
                </button>
                <button
                  onClick={() => setSelectedInternship(item)}
                  className="btn-primary text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-sm">No Internships Found</h3>
          <p className="text-xs text-gray-400 mt-1">
            Try adjusting your search keywords or mode filters.
          </p>
        </div>
      )}

      {/* Apply Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border">
            <button
              onClick={() => setSelectedInternship(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-lg p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900">
              Apply for {selectedInternship.title}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {selectedInternship.company?.name} · {selectedInternship.mode}
            </p>

            {student?.verificationStatus !== 'VERIFIED' && (
              <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> Your student profile is currently{' '}
                  <span className="font-semibold">{student?.verificationStatus || 'UNVERIFIED'}</span>.
                  T&P verification is recommended before submitting applications.
                </span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="label">Cover Letter / Note to Recruiter (Optional)</label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain why you are a great fit for this internship..."
                  className="input-field"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInternship(null)}
                  className="btn-secondary flex-1"
                  disabled={applyMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => applyMutation.mutate(selectedInternship.id)}
                  disabled={applyMutation.isPending}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {applyMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Confirm & Submit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Eligibility Audit Modal */}
      {eligibilityAuditItem && (
        <EligibilityModal
          internshipId={eligibilityAuditItem.id}
          internshipTitle={eligibilityAuditItem.title}
          isOpen={!!eligibilityAuditItem}
          onClose={() => setEligibilityAuditItem(null)}
          onApply={() => {
            setSelectedInternship(eligibilityAuditItem);
            setEligibilityAuditItem(null);
          }}
        />
      )}
    </div>
  );
}
