interface EditorialTickerProps {
  items: string[];
  speed?: 'normal' | 'fast' | 'slow';
  className?: string;
}

export function EditorialTicker({
  items,
  className = '',
}: EditorialTickerProps) {
  return (
    <div
      className={`w-full overflow-hidden bg-[#F1F5F9] border-y border-[#CBD5E1] py-2 font-mono text-[11px] select-none ${className}`}
    >
      <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
        {items.concat(items).map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 text-[#0F172A] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
            <span className="font-bold tracking-wider uppercase">{item}</span>
            <span className="text-[#CBD5E1]">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
