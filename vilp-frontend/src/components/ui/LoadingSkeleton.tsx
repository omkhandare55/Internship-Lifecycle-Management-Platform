/**
 * Flexible skeleton loader for various content types.
 */
export function LoadingSkeleton({ rows = 3, type = 'card' }: { rows?: number; type?: 'card' | 'row' | 'stat' }) {
  if (type === 'stat') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E0D3E8] p-4 animate-pulse">
            <div className="h-3 bg-zinc-200 rounded w-16 mb-2" />
            <div className="h-7 bg-zinc-200 rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'row') {
    return (
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-white border border-[#E0D3E8] animate-pulse">
            <div className="w-10 h-10 bg-zinc-200 rounded" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-zinc-200 rounded w-48" />
              <div className="h-2.5 bg-zinc-100 rounded w-32" />
            </div>
            <div className="h-6 bg-zinc-200 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  // Default: card
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white border border-[#E0D3E8] p-5 space-y-3 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="h-4 bg-zinc-200 rounded w-40" />
            <div className="h-5 bg-zinc-100 rounded w-16" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 bg-zinc-100 rounded w-full" />
            <div className="h-3 bg-zinc-100 rounded w-3/4" />
          </div>
          <div className="flex gap-2 pt-1">
            <div className="h-7 bg-zinc-200 rounded w-20" />
            <div className="h-7 bg-zinc-100 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
