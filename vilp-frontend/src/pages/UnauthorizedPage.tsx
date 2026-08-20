import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <ShieldOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">You don't have permission to view this page.</p>
        <Link to="/auth/login" className="btn-primary inline-block">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
