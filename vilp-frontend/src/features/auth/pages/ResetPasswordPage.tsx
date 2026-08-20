import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/authSchemas';
import { authApi } from '../api/authApi';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError('');
    try {
      await authApi.resetPassword({ token, newPassword: data.newPassword });
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setServerError(error.response?.data?.error?.message || 'Failed to reset password.');
    }
  };

  if (!token) return (
    <div className="text-center">
      <p className="text-red-600">Invalid reset link. Please request a new one.</p>
      <Link to="/auth/forgot-password" className="text-primary-600 text-sm mt-2 block">Request new link</Link>
    </div>
  );

  if (success) return (
    <div className="text-center">
      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Password reset!</h2>
      <p className="text-sm text-gray-500 mb-6">You can now log in with your new password.</p>
      <button onClick={() => navigate('/auth/login')} className="btn-primary w-full">Go to Login</button>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Reset password</h2>
      <p className="text-sm text-gray-500 mb-6">Enter your new password.</p>

      {serverError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{serverError}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">New password</label>
          <input {...register('newPassword')} type="password" className={`input-field ${errors.newPassword ? 'input-error' : ''}`} placeholder="Min. 8 characters" />
          {errors.newPassword && <p className="error-text">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label className="label">Confirm new password</label>
          <input {...register('confirmPassword')} type="password" className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`} placeholder="••••••••" />
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Reset password
        </button>
      </form>
    </div>
  );
}
