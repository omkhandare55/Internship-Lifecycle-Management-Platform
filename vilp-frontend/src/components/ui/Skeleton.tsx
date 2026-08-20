import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
}

export function Skeleton({ className = '', variant = 'rectangular', ...props }: SkeletonProps) {
  let baseClass = 'animate-pulse bg-[#E0D3E8]/60 border border-[#E0D3E8]/40';

  if (variant === 'circular') {
    baseClass += ' rounded-full';
  } else if (variant === 'text') {
    baseClass += ' h-4 w-full rounded-sm';
  } else if (variant === 'card') {
    baseClass += ' h-32 w-full rounded-sm';
  } else {
    baseClass += ' rounded-sm';
  }

  return <div className={`${baseClass} ${className}`} {...props} />;
}

/**
 * Editorial Card Skeleton Loader
 */
export function CardSkeleton() {
  return (
    <div className="bg-white border border-[#E0D3E8] p-6 rounded-sm space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-28 bg-[#723ECF]/10" />
        <Skeleton className="h-5 w-20 bg-[#FEF8E7]" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

/**
 * Table Skeleton Loader
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white border border-[#E0D3E8] rounded-sm divide-y divide-[#E0D3E8] overflow-hidden">
      <div className="p-4 bg-[#FEF8E7] flex justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex justify-between items-center gap-4 animate-pulse">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}
