import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  FileText,
  Download,
  Upload,
} from 'lucide-react';
import { companyApi, documentApi, verificationApi } from '@/services/vilpApi';
import { StatusBadge } from '@/components/StatusBadge';
import { DocumentUploadModal } from '@/components/DocumentUploadModal';
import type { CreateCompanyInput } from '@/types/vilp.types';

export function CompanyProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: companyData, isLoading } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: companyApi.getMyProfile,
  });

  const company = companyData?.data;
  const isCompanyEmpty = !company && !isLoading;

  const { data: documentsData, refetch: refetchDocs } = useQuery({
    queryKey: ['companyDocs', company?.id],
    queryFn: () => (company ? documentApi.getByEntity('COMPANY', company.id) : Promise.resolve({ success: true, data: [] })),
    enabled: !!company?.id,
  });

  const documents = documentsData?.data || [];

  const [formData, setFormData] = useState<CreateCompanyInput>({
    name: '',
    description: '',
    website: '',
    industry: 'Information Technology',
    size: 'MEDIUM',
    headquarters: '',
    contactEmail: '',
    contactPhone: '',
    contactPersonName: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        description: company.description || '',
        website: company.website || '',
        industry: company.industry || 'Information Technology',
        size: company.size || 'MEDIUM',
        headquarters: company.headquarters || '',
        contactEmail: company.contactEmail || '',
        contactPhone: company.contactPhone || '',
        contactPersonName: company.contactPersonName || '',
      });
    }
  }, [company]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isCompanyEmpty) {
        return companyApi.createProfile(formData);
      }
      return companyApi.updateProfile(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
      setIsEditing(false);
      setMsg({ type: 'success', text: 'Company profile updated successfully!' });
      setTimeout(() => setMsg(null), 3000);
    },
    onError: (err: any) => {
      setMsg({
        type: 'error',
        text: err?.message || err?.response?.data?.error?.message || err?.response?.data?.message || 'Failed to save company profile',
      });
    },
  });

  const submitVerificationMutation = useMutation({
    mutationFn: () => {
      if (!company) throw new Error('No company');
      return verificationApi.submit('COMPANY', company.id, 'COMPANY_KYC', 'Company registration KYC approval');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
      setMsg({ type: 'success', text: 'Company submitted for T&P official KYC verification!' });
      setTimeout(() => setMsg(null), 4000);
    },
    onError: (err: any) => {
      setMsg({ type: 'error', text: err.response?.data?.error?.message || 'Submission failed' });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  const allowedDocTypes = [
    { label: 'Certificate of Incorporation / Registration Proof', value: 'COMPANY_PROOF' },
    { label: 'Company Brochure / Overview', value: 'COMPANY_BROCHURE' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {company?.name ? company.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {company?.name || 'Create Company Profile'}
              </h1>
              {company && <StatusBadge status={company.verificationStatus} />}
            </div>
            <p className="text-sm text-gray-500">
              {company?.industry ? `${company.industry} · ` : ''}
              {company?.headquarters || 'Location not specified'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {company && company.verificationStatus !== 'VERIFIED' && (
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
              Submit for T&P Approval
            </button>
          )}
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-secondary text-xs">
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {msg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Main Profile Form / Details */}
      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        {isEditing || isCompanyEmpty || !company ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Infosys Ltd."
                />
              </div>
              <div>
                <label className="label">Industry Sector *</label>
                <input
                  type="text"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Software & Cloud Computing"
                />
              </div>
              <div>
                <label className="label">Official Website URL</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="input-field"
                  placeholder="https://company.com"
                />
              </div>
              <div>
                <label className="label">Company Size</label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="input-field"
                >
                  <option value="STARTUP">Startup (1-50)</option>
                  <option value="SMALL">Small (51-200)</option>
                  <option value="MEDIUM">Medium (201-1000)</option>
                  <option value="LARGE">Large (1000-5000)</option>
                  <option value="ENTERPRISE">Enterprise (5000+)</option>
                </select>
              </div>
              <div>
                <label className="label">Headquarters City / State</label>
                <input
                  type="text"
                  value={formData.headquarters}
                  onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Bangalore, Karnataka"
                />
              </div>
              <div>
                <label className="label">Contact Person Name</label>
                <input
                  type="text"
                  value={formData.contactPersonName}
                  onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Rajesh Kumar (HR Manager)"
                />
              </div>
              <div>
                <label className="label">Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="input-field"
                  placeholder="hr@company.com"
                />
              </div>
              <div>
                <label className="label">Contact Phone</label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="input-field"
                  placeholder="+91 80 12345678"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Company Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  placeholder="Brief overview of company mission, services, and work culture..."
                />
              </div>

              {/* Embedded Document Upload & Management during Edit */}
              <div className="sm:col-span-2 pt-3 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="label text-sm font-bold text-gray-900 m-0">
                      Corporate KYC Documents ({documents.length})
                    </label>
                    <p className="text-xs text-gray-500">
                      Attach Certificate of Incorporation or Company Brochure (PDF/JPEG, max 10MB).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (isCompanyEmpty || !company?.id) {
                        try {
                          await saveMutation.mutateAsync();
                        } catch (e) {}
                      }
                      setIsUploadOpen(true);
                    }}
                    className="btn-secondary text-xs flex items-center gap-1 py-1.5 px-3 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-brand" /> Upload Document
                  </button>
                </div>

                {documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 bg-gray-50 border rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-gray-800 truncate" title={doc.originalFilename}>
                            {doc.originalFilename}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <StatusBadge status={doc.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    onClick={async () => {
                      if (isCompanyEmpty || !company?.id) {
                        try {
                          await saveMutation.mutateAsync();
                        } catch (e) {}
                      }
                      setIsUploadOpen(true);
                    }}
                    className="p-4 border-2 border-dashed border-gray-200 hover:border-brand bg-gray-50/60 rounded-xl text-center cursor-pointer transition-colors"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-gray-700">Click to upload Certificate of Incorporation / KYC Document</p>
                    <p className="text-[11px] text-gray-400">Required for official T&P corporate accreditation</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              {company && (
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="btn-primary flex items-center gap-2"
              >
                {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Company Profile
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Overview
              </span>
              <p className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Industry:</span>
                <span className="font-semibold text-gray-900">{company.industry || '—'}</span>
              </p>
              <p className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Company Size:</span>
                <span className="font-semibold text-gray-900">{company.size || '—'}</span>
              </p>
              <p className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Headquarters:</span>
                <span className="font-semibold text-gray-900">{company.headquarters || '—'}</span>
              </p>
              {company.website && (
                <p className="flex justify-between py-1 border-b">
                  <span className="text-gray-500">Website:</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-600 hover:underline font-medium"
                  >
                    {company.website}
                  </a>
                </p>
              )}
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Recruitment Contact
              </span>
              <p className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Contact Person:</span>
                <span className="font-semibold text-gray-900">{company.contactPersonName || '—'}</span>
              </p>
              <p className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Contact Email:</span>
                <span className="font-semibold text-gray-900">{company.contactEmail || '—'}</span>
              </p>
              <p className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Contact Phone:</span>
                <span className="font-semibold text-gray-900">{company.contactPhone || '—'}</span>
              </p>
            </div>

            {company.description && (
              <div className="md:col-span-2 pt-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Description
                </span>
                <p className="mt-1 text-gray-700 bg-gray-50 p-4 rounded-xl border leading-relaxed">
                  {company.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* KYC Documents Section */}
      {company && (
        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">KYC & Registration Documents</h3>
              <p className="text-xs text-gray-500">Upload your Certificate of Incorporation for T&P audit.</p>
            </div>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="btn-primary text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Upload Document
            </button>
          </div>

          <div className="divide-y border rounded-xl overflow-hidden">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{doc.originalFilename}</p>
                      <p className="text-xs text-gray-400">
                        {doc.documentType} · {(doc.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={doc.status} />
                    <button
                      type="button"
                      onClick={() => documentApi.downloadFile(doc.id, doc.originalFilename)}
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
                      title="Download Document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No KYC documents uploaded yet.
              </div>
            )}
          </div>

          <DocumentUploadModal
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
            entityType="COMPANY"
            entityId={company.id}
            allowedDocTypes={allowedDocTypes}
            onSuccess={() => refetchDocs()}
          />
        </div>
      )}
    </div>
  );
}
