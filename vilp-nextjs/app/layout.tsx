import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VILP — Verified Internship Lifecycle Platform',
  description: 'AICTE & NEP-2020 Verified Internship & Placement Ecosystem powered by Supabase and Next.js.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F4EEF7] text-[#171024] flex flex-col font-sans selection:bg-[#723ECF] selection:text-white">
        {/* Masthead Status Bar */}
        <header className="bg-[#FEF8E7] border-b border-[#E0D3E8] px-4 sm:px-8 py-2 flex items-center justify-between text-xs font-mono select-none sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold text-[#723ECF] hover:opacity-80">
              [ VILP // NEXT.JS + SUPABASE ]
            </Link>
            <span className="text-[#E0D3E8]">|</span>
            <span className="hidden sm:inline text-zinc-600">AICTE NEP-2020 ACTIVE LEDGER</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/internships"
              className="text-[#171024] hover:text-[#723ECF] font-bold transition-colors"
            >
              Opportunities
            </Link>
            <Link
              href="/verify/certificate/VILP-2026-CSE-8841"
              className="text-[#5D4A75] hover:text-[#171024] transition-colors"
            >
              Public Verifier
            </Link>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
