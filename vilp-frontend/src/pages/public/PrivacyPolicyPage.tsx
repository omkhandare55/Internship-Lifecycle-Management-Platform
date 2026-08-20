import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AICTE & DPDP Act Compliant Privacy Framework</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Privacy & Data Governance Policy
          </h1>
          <p className="text-xs text-zinc-400 font-mono">Last Updated: February 2026 · Version 2.4</p>
        </div>

        <div className="space-y-6 text-xs text-zinc-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-zinc-700" /> 1. Academic Record Custodianship
            </h2>
            <p>
              The Verified Internship Lifecycle Platform (VILP) processes student academic records (CGPA, backlogs, department affiliation, and enrolled degree credits) exclusively for facilitating verified corporate placements, No Objection Certificates (NOC), and academic accreditation audits.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-zinc-700" /> 2. Corporate Access & Recruiter Visibility
            </h2>
            <p>
              Corporate recruiters only receive access to student profile credentials upon explicit student application or institutional placement drive participation. Personal student contact phone numbers and residential addresses are shielded until a formal offer letter is extended.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-700" /> 3. Cryptographic Tamper-Proof Storage
            </h2>
            <p>
              All issued institutional NOCs, weekly verified logbooks, and internship completion certificates are sealed using cryptographic SHA-256 hashes to prevent academic credential fraud and ensure lifelong validity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">4. Contact Data Protection Officer</h2>
            <p>
              For data access requests, KYC record updates, or account deletion inquiries, please reach out to the Institutional Data Governance Cell at{' '}
              <a href="mailto:privacy@vilp.edu" className="text-zinc-900 font-semibold underline">
                privacy@vilp.edu
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
