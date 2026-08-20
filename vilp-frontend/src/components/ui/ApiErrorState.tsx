import { AlertTriangle, RefreshCw, WifiOff, Clock } from 'lucide-react';
import { ApiError } from '@/services/axiosInstance';

interface ApiErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  compact?: boolean;
}

/**
 * Renders a contextual error state based on ApiError type.
 * Shows different messaging for network errors, timeouts, and server errors.
 */
export function ApiErrorState({ error, onRetry, compact = false }: ApiErrorStateProps) {
  const isTimeout = error instanceof ApiError && error.code === 'REQUEST_TIMEOUT';
  const isNetwork = error instanceof ApiError && error.code === 'NETWORK_ERROR';
  const isServer  = error instanceof ApiError && error.status >= 500;
  const isAuth    = error instanceof ApiError && (error.status === 401 || error.status === 403);

  const icon = isTimeout ? <Clock className="w-5 h-5" /> :
               isNetwork ? <WifiOff className="w-5 h-5" /> :
               <AlertTriangle className="w-5 h-5" />;

  const title = isTimeout ? 'Server is starting up' :
                isNetwork ? 'Connection failed' :
                isAuth    ? 'Access denied' :
                isServer  ? 'Server error' : 'Something went wrong';

  const message = isTimeout
    ? 'The backend server is warming up (can take up to 60 seconds on free tier). Please wait and try again.'
    : isNetwork
    ? 'Unable to reach the server. Check your internet connection.'
    : isAuth
    ? 'You do not have permission to view this resource.'
    : (error instanceof ApiError ? error.message : 'An unexpected error occurred.');

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 p-2 rounded-sm">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        <span>{message}</span>
        {onRetry && (
          <button onClick={onRetry} className="ml-auto text-[#723ECF] font-bold hover:underline">
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center font-mono">
      <div className="w-12 h-12 bg-red-50 border border-red-200 flex items-center justify-center text-red-500 mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-black uppercase text-[#171024] mb-1">{title}</h3>
      <p className="text-xs text-zinc-600 max-w-xs leading-relaxed mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#723ECF] text-white text-xs font-bold hover:bg-[#5f33ad] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> TRY AGAIN
        </button>
      )}
    </div>
  );
}
