import React from 'react';

interface GodlyGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function GodlyGrid({ children, columns = 3, className = '' }: GodlyGridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  return (
    <div
      className={`grid ${colClasses} gap-0 border-l border-t border-[#E2E8F0] w-full max-w-full overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

interface GodlyGridCellProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GodlyGridCell({ children, className = '', onClick }: GodlyGridCellProps) {
  return (
    <div
      onClick={onClick}
      className={`border-r border-b border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between min-w-0 ${className}`}
    >
      {children}
    </div>
  );
}
