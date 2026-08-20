import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Building2, Loader2 } from 'lucide-react';
import { applicationApi } from '@/services/vilpApi';
import { StatusBadge } from '@/components/StatusBadge';

export function StudentApplicationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => applicationApi.myApplications(0, 50),
  });

  const withdrawMutation = useMutation({
    mutationFn: (appId: string) => applicationApi.withdraw(appId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
  });

  const applications = data?.data?.content || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track the status of all your internship applications in real-time.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{app.internshipTitle}</h3>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-semibold">{app.companyName}</span>
                  <span>· Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                </p>

                {app.coverLetter && (
                  <p className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl border mt-2">
                    <span className="font-medium text-gray-700">Cover Note:</span> {app.coverLetter}
                  </p>
                )}

                {app.rejectionReason && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 mt-2 font-medium">
                    Feedback / Reason: {app.rejectionReason}
                  </p>
                )}
              </div>

              {app.status === 'APPLIED' && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to withdraw this application?')) {
                      withdrawMutation.mutate(app.id);
                    }
                  }}
                  disabled={withdrawMutation.isPending}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                >
                  Withdraw
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-sm">No Applications Yet</h3>
          <p className="text-xs text-gray-400 mt-1">
            Browse the internships catalog and apply to verified positions.
          </p>
        </div>
      )}
    </div>
  );
}
