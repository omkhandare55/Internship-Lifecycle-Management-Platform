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
    primary: 'bg-[#2563EB] text-white border-blue-600',
    accent: 'bg-[#F97316] text-white border-orange-600',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    neutral: 'bg-[#F1F5F9] text-[#0A2540] border-[#CBD5E1]',
  }[badgeType];

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-between border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] p-4 sm:p-5 transition-all duration-200 cursor-pointer min-w-0 max-w-full overflow-hidden shadow-[2px_2px_0px_0px_#E2E8F0] hover:shadow-[3px_3px_0px_0px_#0A2540] hover:-translate-y-0.5 rounded-[2px_8px_2px_8px] ${className}`}
    >
      {/* Precision Corner Crosshair Accent */}
      <div className="absolute top-1.5 right-2 text-[9px] font-mono text-slate-300 font-bold select-none pointer-events-none group-hover:text-[#2563EB] transition-colors">
        +
      </div>

      <div className="space-y-3.5 min-w-0">
        {/* Preview Frame */}
        {previewElement && (
          <div className="relative w-full aspect-video rounded-[1px_6px_1px_6px] overflow-hidden bg-[#F1F5F9] border border-[#CBD5E1] flex items-center justify-center">
            <div className="w-full h-full transform transition-transform duration-300 group-hover:scale-[1.02]">
              {previewElement}
            </div>
          </div>
        )}

        {/* Header Ribbon: Category + Badge */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="font-mono font-extrabold text-[10px] text-slate-500 uppercase tracking-widest truncate">
            {category}
          </span>
          {badge && (
            <span
              className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-[1px] uppercase tracking-wider shrink-0 border ${badgeStyles}`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1 min-w-0">
          <h3 className="font-sans font-black text-sm sm:text-base text-[#0A2540] group-hover:text-[#2563EB] transition-colors uppercase tracking-tight truncate m-0">
            {title}
          </h3>
          <p className="font-sans text-xs text-slate-600 line-clamp-2 leading-relaxed m-0">
            {tagline}
          </p>
        </div>
      </div>

      {/* Footer Meta & Action */}
      <div className="pt-3.5 mt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2 text-xs font-mono">
        {metaAuthor ? (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-[2px] bg-[#0A2540] text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs">
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
          <span className="text-[11px] text-[#2563EB] font-bold uppercase tracking-wider flex items-center gap-1">
            {actionText} <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        )}

        <div className="w-6 h-6 rounded-[1px] border border-[#CBD5E1] group-hover:border-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white text-slate-500 flex items-center justify-center transition-colors shrink-0">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
