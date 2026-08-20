import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, CheckCircle2 } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-zinc-200/80 shadow-xs">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Platform
        </Link>

        <div className="space-y-2 border-b border-zinc-100 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 text-zinc-800 rounded-full text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>Institutional Placement & Internship Code of Conduct</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Terms of Service & Placement Regulations
          </h1>
          <p className="text-xs text-zinc-400 font-mono">Governed by University Placement Regulations · 2026</p>
        </div>

        <div className="space-y-6 text-xs text-zinc-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1. Single Active Internship Policy
            </h2>
            <p>
              In accordance with university placement governance rules, an enrolled student may hold only **one active accepted internship offer** at any given time. Accepting a subsequent offer automatically nullifies previous draft applications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 2. Weekly Logbook & 240-Hour Requirement
            </h2>
            <p>
              Students must submit weekly activity logbooks describing engineering deliverables and work completed. A minimum of 240 approved hours and satisfactory mentor evaluation are mandatory for academic degree credit.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3. Institutional No Objection Certificate (NOC)
            </h2>
            <p>
              No student may commence physical or remote work with a corporate partner without an issued and digitally verified Institutional NOC from the Training & Placement Cell.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
