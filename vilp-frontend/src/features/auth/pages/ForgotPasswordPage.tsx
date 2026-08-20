import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Loader2, Mail } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/authSchemas';
import { authApi } from '../api/authApi';

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await authApi.forgotPassword(data);
    setSent(true); // Always show success (no email enumeration)
  };

  if (sent) {
    return (
      <div className="text-center">
        <Mail className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-sm text-gray-500 mb-6">
          If an account exists with that email, we've sent a password reset link.
        </p>
        <Link to="/auth/login" className="btn-primary inline-block w-full text-center">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Forgot password?</h2>
      <p className="text-sm text-gray-500 mb-6">Enter your email to receive a reset link.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Email address</label>
          <input {...register('email')} type="email" className={`input-field ${errors.email ? 'input-error' : ''}`} placeholder="you@example.com" />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Send reset link
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link to="/auth/login" className="text-primary-600 font-medium hover:text-primary-700">← Back to login</Link>
      </p>
    </div>
  );
}
