interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStyle = (s: string) => {
    switch (s?.toUpperCase()) {
      case 'VERIFIED':
      case 'SELECTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING':
      case 'APPLIED':
      case 'UPLOADED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'UNDER_REVIEW':
      case 'SHORTLISTED':
      case 'INTERVIEW':
      case 'PUBLISHED':
      case 'APPLICATION_OPEN':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'REJECTED':
      case 'SUSPENDED':
      case 'WITHDRAWN':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const formatted = status ? status.replace(/_/g, ' ') : 'UNKNOWN';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle(
        status
      )} ${className}`}
    >
      {formatted}
    </span>
  );
}
