import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface GodlyCardProps {
  title: string;
  tagline: string;
  category: string;
  badge?: string;
  badgeType?: 'primary' | 'accent' | 'success' | 'neutral';
  metaAuthor?: string;
  metaRole?: string;
  previewElement?: React.ReactNode;
  onClick?: () => void;
  actionText?: string;
  className?: string;
}

export function GodlyCard({
  title,
  tagline,
  category,
  badge,
  badgeType = 'primary',
  metaAuthor,
  metaRole,
  previewElement,
  onClick,
  actionText = 'VIEW DETAILS',
  className = '',
}: GodlyCardProps) {
  const badgeStyles = {
    primary: 'bg-[#2563EB] text-white',
    accent: 'bg-[#F97316] text-white',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
    neutral: 'bg-[#F1F5F9] text-[#0A2540] border border-[#CBD5E1]',
  }[badgeType];

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-between border-r border-b border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] p-4 sm:p-5 transition-all duration-300 cursor-pointer min-w-0 max-w-full overflow-hidden ${className}`}
    >
      <div className="space-y-3.5 min-w-0">
        {/* Preview Frame */}
        {previewElement && (
          <div className="relative w-full aspect-video rounded-xs overflow-hidden bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center">
            <div className="w-full h-full transform transition-transform duration-500 group-hover:scale-[1.02]">
              {previewElement}
            </div>
          </div>
        )}

        {/* Header Ribbon: Category + Badge */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="font-mono font-bold text-[10px] text-slate-500 uppercase tracking-wider truncate">
            {category}
          </span>
          {badge && (
            <span
              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider shrink-0 ${badgeStyles}`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1 min-w-0">
          <h3 className="font-sans font-bold text-sm sm:text-base text-[#0A2540] group-hover:text-[#2563EB] transition-colors uppercase tracking-tight truncate">
            {title}
          </h3>
          <p className="font-sans text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {tagline}
          </p>
        </div>
      </div>

      {/* Footer Meta & Action */}
      <div className="pt-4 mt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2 text-xs font-mono">
        {metaAuthor ? (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-[#0A2540] text-white flex items-center justify-center font-bold text-[9px] shrink-0">
              {metaAuthor.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="font-bold text-[#0A2540] text-[11px] truncate block">
                {metaAuthor}
              </span>
              {metaRole && (
                <span className="text-[9px] text-slate-500 truncate block">
                  {metaRole}
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-[11px] text-[#2563EB] font-bold uppercase tracking-wider">
            {actionText}
          </span>
        )}

        <div className="w-6 h-6 rounded-xs bg-[#F1F5F9] group-hover:bg-[#2563EB] border border-[#CBD5E1] flex items-center justify-center text-slate-700 group-hover:text-white transition-colors shrink-0">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
