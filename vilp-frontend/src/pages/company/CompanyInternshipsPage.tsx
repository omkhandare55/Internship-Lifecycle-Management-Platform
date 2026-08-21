import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase,
  Plus,
  IndianRupee,
  Clock,
  MapPin,
  Calendar,
  Send,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { internshipApi } from '@/services/vilpApi';
import { StatusBadge } from '@/components/StatusBadge';
import type { CreateInternshipInput } from '@/types/vilp.types';

export function CompanyInternshipsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: internshipsData, isLoading } = useQuery({
    queryKey: ['myInternships'],
    queryFn: () => internshipApi.listMine(0, 50),
  });

  const internships = internshipsData?.data?.content || [];

  const [formData, setFormData] = useState<CreateInternshipInput>({
    title: '',
    description: '',
    location: '',
    mode: 'REMOTE',
    duration: 12,
    startDate: '',
    endDate: '',
    stipend: 15000,
    vacancies: 2,
    applicationDeadline: '',
    minimumCgpa: 7.0,
    maximumBacklogs: 0,
    department: '',
    branch: '',
    passingYear: 2026,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateInternshipInput) => {
      const payload: any = { ...data };
      if (!payload.startDate) delete payload.startDate;
      if (!payload.endDate) delete payload.endDate;
      if (!payload.applicationDeadline) {
        delete payload.applicationDeadline;
      } else if (typeof payload.applicationDeadline === 'string' && !payload.applicationDeadline.includes('Z') && !payload.applicationDeadline.includes('+')) {
        payload.applicationDeadline = new Date(payload.applicationDeadline).toISOString();
      }
      return internshipApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInternships'] });
      setIsModalOpen(false);
      setMsg({ type: 'success', text: 'Internship posting created successfully as DRAFT!' });
      setTimeout(() => setMsg(null), 3500);
    },
    onError: (err: any) => {
      setMsg({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to create internship posting',
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => internshipApi.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInternships'] });
      setMsg({
        type: 'success',
        text: 'Internship submitted for T&P official review and approval!',
      });
      setTimeout(() => setMsg(null), 3500);
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Internship Postings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, publish, and manage verified internship offerings.
          </p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-1.5 text-xs"
        >
          <Plus className="w-4 h-4" /> Post New Internship
        </button>
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

      {/* Internships List */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : internships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {internships.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100 uppercase">
                      {item.uniqueId || 'INT-DRAFT'}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{item.title}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={item.status} />
                    <span className="text-[10px] text-gray-400">
                      T&P: {item.verificationStatus}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 line-clamp-3 mb-4">{item.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border mb-4">
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    <span>₹{item.stipend?.toLocaleString() || 0}/mo</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.duration || 0} Weeks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    <span>{item.location || item.mode}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Vacancies: {item.vacancies}</span>
                  </div>
                </div>

                {item.requirement && (
                  <div className="text-[11px] text-gray-500 mb-3 space-y-0.5">
                    <p>
                      <strong>Eligibility:</strong> Min CGPA: {item.requirement.minimumCgpa} · Max
                      Backlogs: {item.requirement.maximumBacklogs}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Posted: {new Date(item.createdAt).toLocaleDateString()}
                </span>
                {item.status === 'DRAFT' && (
                  <button
                    onClick={() => publishMutation.mutate(item.id)}
                    disabled={publishMutation.isPending}
                    className="btn-primary text-xs flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" /> Publish for Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-sm">No Internship Postings Yet</h3>
          <p className="text-xs text-gray-400 mt-1">
            Click "Post New Internship" to launch verified hiring drives.
          </p>
        </div>
      )}

      {/* Create Internship Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative border my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-lg p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1">Create Internship Offering</h3>
            <p className="text-xs text-gray-500 mb-5">
              Specify role details and deterministic academic eligibility criteria.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(formData);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Internship Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Full Stack Spring Boot & React Intern"
                  />
                </div>

                <div>
                  <label className="label">Work Mode *</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="input-field"
                  >
                    <option value="REMOTE">Remote</option>
                    <option value="ONSITE">On-Site</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="label">Location (City)</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Pune, Maharashtra"
                  />
                </div>

                <div>
                  <label className="label">Duration (Weeks)</label>
                  <input
                    type="number"
                    min="4"
                    max="52"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Monthly Stipend (INR)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={formData.stipend}
                    onChange={(e) => setFormData({ ...formData, stipend: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Total Vacancies</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.vacancies}
                    onChange={(e) => setFormData({ ...formData, vacancies: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Application Deadline</label>
                  <input
                    type="datetime-local"
                    value={formData.applicationDeadline}
                    onChange={(e) =>
                      setFormData({ ...formData, applicationDeadline: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Academic Eligibility Criteria (Deterministic Rule Engine)
                  </span>
                </div>

                <div>
                  <label className="label">Minimum CGPA Required</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.minimumCgpa}
                    onChange={(e) =>
                      setFormData({ ...formData, minimumCgpa: Number(e.target.value) })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Maximum Permissible Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maximumBacklogs}
                    onChange={(e) =>
                      setFormData({ ...formData, maximumBacklogs: Number(e.target.value) })
                    }
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="label">Role Description & Responsibilities *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    placeholder="Describe tasks, required technologies, mentorship provided, etc."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="btn-primary flex items-center gap-2"
                >
                  {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Draft Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
