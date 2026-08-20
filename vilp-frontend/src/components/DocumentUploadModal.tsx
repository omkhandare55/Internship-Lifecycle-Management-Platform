import { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { documentApi } from '@/services/vilpApi';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: string;
  entityId: string;
  allowedDocTypes: { label: string; value: string }[];
  onSuccess: () => void;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  entityType,
  entityId,
  allowedDocTypes,
  onSuccess,
}: DocumentUploadModalProps) {
  const [docType, setDocType] = useState(allowedDocTypes[0]?.value || '');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setError('File size must be under 10MB');
        return;
      }
      setFile(selected);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    if (!docType) {
      setError('Please select a document type');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const res = await documentApi.upload(entityType, entityId, docType, file);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setFile(null);
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setError(res.error?.message || 'Upload failed');
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } };
      setError(e.response?.data?.error?.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-lg p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-gray-900 mb-1">Upload Document</h3>
        <p className="text-xs text-gray-500 mb-5">Supported formats: PDF, DOCX, JPG, PNG (Max 10MB)</p>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-bounce" />
            <p className="font-semibold text-gray-900 text-sm">Document uploaded successfully!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="label">Document Category</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="input-field"
              >
                {allowedDocTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Select File</label>
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-brand transition-colors bg-gray-50 hover:bg-primary-50/20">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs font-medium text-gray-700">
                  {file ? file.name : 'Click to browse or drop file here'}
                </span>
                {file && (
                  <span className="text-[10px] text-gray-400 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading || !file}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
