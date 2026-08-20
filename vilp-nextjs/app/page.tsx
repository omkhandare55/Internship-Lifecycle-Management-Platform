import Link from 'next/link';
import { ShieldCheck, ArrowRight, Database, Zap, FileCheck, Layers } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Hero Section */}
      <section className="space-y-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FEF8E7] border border-[#EADBBE] rounded-sm text-xs font-mono text-[#723ECF] font-bold">
          <Zap className="w-3.5 h-3.5 text-[#ED4B86]" />
          NEXT.JS 14 APP ROUTER + SUPABASE REALTIME
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#171024] tracking-tight leading-tight">
          Deterministic Internship & Placement Lifecycle Engine.
        </h1>
        <p className="text-base sm:text-lg text-[#5D4A75] max-w-2xl font-normal leading-relaxed">
          National institutional clearance platform built with Server Components, Supabase PostgreSQL,
          and automated AICTE NEP-2020 verification pipelines.
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
          <Link
            href="/internships"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#723ECF] text-white font-bold text-sm rounded-sm hover:bg-[#5f33ad] transition-all shadow-sm"
          >
            Explore Live Opportunities <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/verify/certificate/VILP-2026-CSE-8841"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FEF8E7] text-[#171024] font-bold text-sm rounded-sm border border-[#E0D3E8] hover:bg-white transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-[#ED4B86]" /> Verify Certificate Token
          </Link>
        </div>
      </section>

      {/* 3-Pillar Architectural Matrix */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-sm border border-[#E0D3E8] space-y-3">
          <div className="w-10 h-10 bg-[#723ECF]/10 border border-[#723ECF]/30 flex items-center justify-center text-[#723ECF] rounded-sm">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold font-display text-base text-[#171024]">
            Supabase PostgreSQL 16
          </h3>
          <p className="text-xs text-[#5D4A75] leading-relaxed">
            Direct connection to live Supabase database with 22 relational tables, RLS policies, and
            automated Postgres PL/pgSQL triggers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-sm border border-[#E0D3E8] space-y-3">
          <div className="w-10 h-10 bg-[#ED4B86]/10 border border-[#ED4B86]/30 flex items-center justify-center text-[#ED4B86] rounded-sm">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold font-display text-base text-[#171024]">
            React Server Components (RSC)
          </h3>
          <p className="text-xs text-[#5D4A75] leading-relaxed">
            Opportunities and verification dossiers are pre-rendered on the server via `@supabase/ssr` with
            zero client JavaScript bundle overhead.
          </p>
        </div>

        <div className="bg-white p-6 rounded-sm border border-[#E0D3E8] space-y-3">
          <div className="w-10 h-10 bg-[#059669]/10 border border-[#059669]/30 flex items-center justify-center text-[#059669] rounded-sm">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold font-display text-base text-[#171024]">
            AICTE §7.2 Clearance Engine
          </h3>
          <p className="text-xs text-[#5D4A75] leading-relaxed">
            Single-active mutex locking, 48-hour decision timers, and cryptographic SHA-256 digital seals
            for institutional auditability.
          </p>
        </div>
      </section>
    </div>
  );
}
