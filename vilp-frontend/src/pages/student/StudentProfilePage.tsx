import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  GraduationCap,
  Award,
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Send,
  Loader2,
  ExternalLink,
  Download,
} from 'lucide-react';
import { studentApi, publicApi, documentApi, verificationApi } from '@/services/vilpApi';
import { StatusBadge } from '@/components/StatusBadge';
import { DocumentUploadModal } from '@/components/DocumentUploadModal';
import type { CreateStudentProfileInput } from '@/types/vilp.types';

export function StudentProfilePage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'details' | 'skills' | 'documents'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<number | ''>('');
  const [submitMsg, setSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Queries
  const { data: profileData, isLoading: loadingProfile } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: studentApi.getMyProfile,
  });

  const { data: deptsData } = useQuery({
    queryKey: ['departments'],
    queryFn: publicApi.getDepartments,
  });

  const { data: skillsData } = useQuery({
    queryKey: ['skills'],
    queryFn: publicApi.getSkills,
  });

  const profile = profileData?.data;
  const isProfileEmpty = !profile && !loadingProfile;

  const { data: documentsData, refetch: refetchDocs } = useQuery({
    queryKey: ['studentDocs', profile?.id],
    queryFn: () => (profile ? documentApi.getByEntity('STUDENT', profile.id) : Promise.resolve({ success: true, data: [] })),
    enabled: !!profile?.id,
  });

  const documents = documentsData?.data || [];

  // Form State
  const [formData, setFormData] = useState<CreateStudentProfileInput>({
    studentNumber: '',
    fullName: '',
    departmentId: undefined,
    branch: '',
    semester: 6,
    cgpa: 8.5,
    backlogs: 0,
    passingYear: 2026,
    phone: '',
    linkedinUrl: '',
    portfolioUrl: '',
    about: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        studentNumber: profile.studentNumber || '',
        fullName: profile.fullName || '',
        departmentId: profile.department?.id,
        branch: profile.branch || '',
        semester: profile.semester || 6,
        cgpa: profile.cgpa || 8.0,
        backlogs: profile.backlogs || 0,
        passingYear: profile.passingYear || 2026,
        phone: profile.phone || '',
        linkedinUrl: profile.linkedinUrl || '',
        portfolioUrl: profile.portfolioUrl || '',
        about: profile.about || '',
      });
    }
  }, [profile]);

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isProfileEmpty) {
        return studentApi.createProfile(formData);
      }
      return studentApi.updateProfile(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      setIsEditing(false);
      setSubmitMsg({ type: 'success', text: 'Profile saved successfully!' });
      setTimeout(() => setSubmitMsg(null), 3000);
    },
    onError: (err: any) => {
      setSubmitMsg({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to save profile',
      });
    },
  });

  const addSkillMutation = useMutation({
    mutationFn: (skillId: number) => studentApi.addSkill(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      setSelectedSkillId('');
    },
  });

  const removeSkillMutation = useMutation({
    mutationFn: (skillId: number) => studentApi.removeSkill(skillId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['studentProfile'] }),
  });

  const submitVerificationMutation = useMutation({
    mutationFn: () => {
      if (!profile) throw new Error('No profile');
      return verificationApi.submit('STUDENT', profile.id, 'STUDENT_ONBOARDING', 'Submitted for T&P approval');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      setSubmitMsg({ type: 'success', text: 'Profile submitted to T&P for official verification!' });
      setTimeout(() => setSubmitMsg(null), 4000);
    },
    onError: (err: any) => {
      setSubmitMsg({ type: 'error', text: err.response?.data?.error?.message || 'Verification submission failed' });
    },
  });

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  const allowedDocTypes = [
    { label: 'Student College ID Proof', value: 'STUDENT_ID_PROOF' },
    { label: 'Academic Transcript / Marksheet', value: 'ACADEMIC_PROOF' },
    { label: 'Latest Resume (PDF)', value: 'RESUME' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-brand flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.fullName || 'Complete Your Profile'}
              </h1>
              {profile && <StatusBadge status={profile.verificationStatus} />}
            </div>
            <p className="text-sm text-gray-500">
              {profile?.studentNumber ? `ID: ${profile.studentNumber} · ` : ''}
              {profile?.department?.name || 'Department not set'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {profile && profile.verificationStatus !== 'VERIFIED' && (
            <button
              onClick={() => submitVerificationMutation.mutate()}
              disabled={submitVerificationMutation.isPending}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              {submitVerificationMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Submit for Verification
            </button>
          )}
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-secondary text-xs">
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Completion Meter */}
      {profile && (
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2">
            <span>Profile Completion</span>
            <span>{profile.profileCompletion}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${profile.profileCompletion}%` }}
            />
          </div>
        </div>
      )}

      {submitMsg && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${
            submitMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {submitMsg.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{submitMsg.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b gap-6 text-sm font-medium text-gray-500">
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'details'
              ? 'border-brand text-brand font-semibold'
              : 'border-transparent hover:text-gray-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Academic & Personal Info
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'skills'
              ? 'border-brand text-brand font-semibold'
              : 'border-transparent hover:text-gray-900'
          }`}
        >
          <Award className="w-4 h-4" />
          Skills & Badges
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'documents'
              ? 'border-brand text-brand font-semibold'
              : 'border-transparent hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Documents ({documents.length})
        </button>
      </div>

      {/* Tab: Academic & Personal Info */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          {isEditing || isProfileEmpty || !profile ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Aditi Sharma"
                  />
                </div>
                <div>
                  <label className="label">Student Enrollment / Roll No *</label>
                  <input
                    type="text"
                    required
                    disabled={!isProfileEmpty}
                    value={formData.studentNumber}
                    onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                    className="input-field"
                    placeholder="e.g. 2022CSE045"
                  />
                </div>
                <div>
                  <label className="label">Department *</label>
                  <select
                    value={formData.departmentId || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, departmentId: Number(e.target.value) || undefined })
                    }
                    className="input-field"
                  >
                    <option value="">Select Department</option>
                    {deptsData?.data?.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Branch / Specialization</label>
                  <input
                    type="text"
                    value={formData.branch || ''}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Artificial Intelligence"
                  />
                </div>
                <div>
                  <label className="label">Current Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.semester || ''}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">CGPA (0 - 10)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.cgpa || ''}
                    onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.backlogs || 0}
                    onChange={(e) => setFormData({ ...formData, backlogs: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Passing Year</label>
                  <input
                    type="number"
                    value={formData.passingYear || 2026}
                    onChange={(e) => setFormData({ ...formData, passingYear: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="label">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={formData.linkedinUrl || ''}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="input-field"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Portfolio / GitHub Link</label>
                  <input
                    type="url"
                    value={formData.portfolioUrl || ''}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    className="input-field"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">About / Bio</label>
                  <textarea
                    rows={3}
                    value={formData.about || ''}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    className="input-field"
                    placeholder="Brief summary of your academic interests, career goals, etc."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                {profile && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="btn-primary flex items-center gap-2"
                >
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Academic Details
                  </span>
                  <div className="mt-2 space-y-2 text-sm">
                    <p className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Student Roll No:</span>
                      <span className="font-semibold text-gray-900">{profile.studentNumber}</span>
                    </p>
                    <p className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Department:</span>
                      <span className="font-semibold text-gray-900">
                        {profile.department?.name || '—'}
                      </span>
                    </p>
                    <p className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Branch:</span>
                      <span className="font-semibold text-gray-900">{profile.branch || '—'}</span>
                    </p>
                    <p className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Semester:</span>
                      <span className="font-semibold text-gray-900">{profile.semester || '—'}</span>
                    </p>
                    <p className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">CGPA:</span>
                      <span className="font-semibold text-emerald-600 font-mono">
                        {profile.cgpa ? Number(profile.cgpa).toFixed(2) : '—'}
                      </span>
                    </p>
                    <p className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Backlogs:</span>
                      <span
                        className={`font-semibold ${
                          profile.backlogs === 0 ? 'text-gray-900' : 'text-rose-600'
                        }`}
                      >
                        {profile.backlogs}
                      </span>
                    </p>
                    <p className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Passing Year:</span>
                      <span className="font-semibold text-gray-900">
                        {profile.passingYear || '—'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Contact & Links
                  </span>
                  <div className="mt-2 space-y-2 text-sm">
                    <p className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-semibold text-gray-900">{profile.email}</span>
                    </p>
                    <p className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-semibold text-gray-900">{profile.phone || '—'}</span>
                    </p>
                    {profile.linkedinUrl && (
                      <p className="flex justify-between py-1 border-b">
                        <span className="text-gray-500">LinkedIn:</span>
                        <a
                          href={profile.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary-600 hover:underline flex items-center gap-1 font-medium"
                        >
                          View Profile <ExternalLink className="w-3 h-3" />
                        </a>
                      </p>
                    )}
                    {profile.portfolioUrl && (
                      <p className="flex justify-between py-1 border-b">
                        <span className="text-gray-500">Portfolio:</span>
                        <a
                          href={profile.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary-600 hover:underline flex items-center gap-1 font-medium"
                        >
                          View Website <ExternalLink className="w-3 h-3" />
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {profile.about && (
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      About
                    </span>
                    <p className="mt-1 text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border">
                      {profile.about}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Skills & Badges */}
      {activeTab === 'skills' && (
        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900">Your Technical Skills</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Add skills from the accredited catalog to match with verified internship requirements.
            </p>
          </div>

          <div className="flex gap-3 max-w-md">
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(Number(e.target.value) || '')}
              className="input-field"
            >
              <option value="">Choose a skill to add...</option>
              {skillsData?.data
                ?.filter((s) => !profile?.skills?.some((ps) => ps.id === s.id))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.category ? `(${s.category})` : ''}
                  </option>
                ))}
            </select>
            <button
              onClick={() => {
                if (selectedSkillId) addSkillMutation.mutate(Number(selectedSkillId));
              }}
              disabled={!selectedSkillId || addSkillMutation.isPending}
              className="btn-primary flex items-center gap-1 text-xs"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {profile?.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 text-primary-800 text-xs font-semibold border border-primary-200"
                >
                  {skill.name}
                  <button
                    onClick={() => removeSkillMutation.mutate(skill.id)}
                    className="text-primary-400 hover:text-rose-600 transition-colors p-0.5"
                    title="Remove skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">No skills added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Verification & Portfolio Documents</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Upload your College ID Proof, Marks Sheets, and Resume for T&P verification.
              </p>
            </div>
            {profile && (
              <button
                onClick={() => setIsUploadOpen(true)}
                className="btn-primary text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Upload Document
              </button>
            )}
          </div>

          <div className="divide-y border rounded-xl overflow-hidden">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary-50 text-primary-700 rounded-xl">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{doc.originalFilename}</p>
                      <p className="text-xs text-gray-400">
                        {doc.documentType} · {(doc.size / 1024 / 1024).toFixed(2)} MB ·{' '}
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                      {doc.verificationReason && (
                        <p className="text-xs text-rose-600 mt-0.5 font-medium">
                          Note: {doc.verificationReason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={doc.status} />
                    <a
                      href={doc.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No documents uploaded yet. Upload your Student ID and Resume to enable verified applications.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {profile && (
        <DocumentUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          entityType="STUDENT"
          entityId={profile.id}
          allowedDocTypes={allowedDocTypes}
          onSuccess={() => {
            refetchDocs();
            queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
          }}
        />
      )}
    </div>
  );
}
