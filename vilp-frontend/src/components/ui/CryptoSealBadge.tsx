import { useState } from 'react';
import { ShieldCheck, Copy, Check } from 'lucide-react';

interface CryptoSealBadgeProps {
  hash: string;
  label?: string;
  level?: 'Level 1: Basic' | 'Level 2: Institutional' | 'Level 3: Cryptographically Verified';
  className?: string;
}

export function CryptoSealBadge({
  hash,
  label = 'SHA-256 DIGITAL SEAL',
  level = 'Level 3: Cryptographically Verified',
  className = '',
}: CryptoSealBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncatedHash =
    hash.length > 16 ? `${hash.slice(0, 8)}...${hash.slice(-8)}` : hash;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xs font-mono text-xs ${className}`}
    >
      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 font-bold uppercase truncate">
            {label}:
          </span>
          <span className="font-bold text-[#2563EB] text-[11px] font-mono">
            {truncatedHash}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            title="Copy cryptographic hash"
            className="p-0.5 hover:text-[#2563EB] text-slate-400 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
        <span className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider">
          {level}
        </span>
      </div>
    </div>
  );
}
