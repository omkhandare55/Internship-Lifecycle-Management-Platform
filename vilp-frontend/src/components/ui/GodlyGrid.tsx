import React from 'react';

interface GodlyGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function GodlyGrid({ children, className = '' }: GodlyGridProps) {
  return (
    <div
      className={`row g-0 border-start border-top border-[#E2E8F0] w-100 m-0 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

interface GodlyGridCellProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  onClick?: () => void;
}

export function GodlyGridCell({
  children,
  columns = 3,
  className = '',
  onClick,
}: GodlyGridCellProps) {
  const bootstrapCol = {
    1: 'col-12',
    2: 'col-12 col-md-6',
    3: 'col-12 col-sm-6 col-lg-4',
    4: 'col-12 col-sm-6 col-lg-4 col-xl-3',
  }[columns];

  return (
    <div
      onClick={onClick}
      className={`${bootstrapCol} border-end border-bottom border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] p-4 p-md-5 transition-all d-flex flex-column justify-content-between min-w-0 ${className}`}
    >
      {children}
    </div>
  );
}
