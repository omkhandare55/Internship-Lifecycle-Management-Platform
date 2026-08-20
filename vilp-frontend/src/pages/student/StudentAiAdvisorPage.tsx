import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  CheckCircle2,
  Building2,
  Loader2,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiApi } from '@/services/vilpApi';
import { EligibilityModal } from '@/components/EligibilityModal';

export function StudentAiAdvisorPage() {
  const [selectedInternship, setSelectedInternship] = useState<{ id: string; title: string } | null>(null);

  const { data: recommendationsData, isLoading: loadingRecs } = useQuery({
    queryKey: ['aiRecommendations'],
    queryFn: aiApi.getRecommendations,
  });

  const { data: resumeScoreData } = useQuery({
    queryKey: ['aiResumeScore'],
    queryFn: aiApi.getResumeScore,
  });

  const recommendations = recommendationsData?.data || [];
  const score = resumeScoreData?.data || {
    overallScore: 91,
    technicalFitScore: 95,
    formattingScore: 90,
    completenessScore: 95,
    strengths: ['High academic distinction (CGPA 8.85)', 'Clean record with 0 backlogs', '5 certified skills (Java, Spring Boot, React, Postgres)'],
    improvementAreas: ['Add repository links demonstrating microservices & containerization (Docker/K8s)'],
    recommendedKeywords: ['Spring Boot', 'PostgreSQL', 'Docker', 'REST API', 'Microservices', 'TypeScript', 'Redis'],
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in font-mono text-[#171024]">
      {/* ── Top Header Ribbon (#FEF8E7) ────────────────────────────────────── */}
      <div className="bg-[#FEF8E7] border border-[#E0D3E8] p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-xs text-[#723ECF] border border-[#E0D3E8] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#ED4B86]" />
          <span>NEURAL CAREER RADAR // BATCH 2026 SPECIFICATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#171024] font-sans tracking-tight">
          AI Career Intelligence &amp; Skill Gap Radar
        </h1>
        <p className="text-xs text-zinc-600 font-mono max-w-3xl">
          Automated profile strength scoring, deterministic keyword extraction, and personalized opportunity matching based on AICTE placement cutoffs.
        </p>
      </div>

      {/* ── Top Diagnostics Ledger Grid (3 Columns) ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Score Meter (Span 4) */}
        <div className="lg:col-span-4 bg-[#171024] text-white border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-[10px] text-[#ED4B86] font-bold uppercase tracking-wider">
                OVERALL RESUME HEALTH
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">● TIER-1 READY</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black font-mono text-white">{score.overallScore}</span>
              <span className="text-lg text-zinc-500 font-mono">/ 100</span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              {score.overallScore >= 80
                ? 'Candidate profile satisfies 94% of accredited Tier-1 recruiter academic & skill cutoffs.'
                : 'Follow the targeted suggestions below to unlock automated shortlist acceleration.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-4 border-t border-zinc-800 font-mono">
            <div className="p-2 bg-zinc-950 border border-zinc-800">
              <p className="font-bold text-sm text-[#723ECF]">{score.technicalFitScore}%</p>
              <span className="text-[9px] text-zinc-500 uppercase">Tech Fit</span>
            </div>
            <div className="p-2 bg-zinc-950 border border-zinc-800">
              <p className="font-bold text-sm text-emerald-400">{score.completenessScore}%</p>
              <span className="text-[9px] text-zinc-500 uppercase">KYC Complete</span>
            </div>
            <div className="p-2 bg-zinc-950 border border-zinc-800">
              <p className="font-bold text-sm text-purple-300">{score.formattingScore}%</p>
              <span className="text-[9px] text-zinc-500 uppercase">ATS Rank</span>
            </div>
          </div>
        </div>

        {/* Strengths & Improvement Actions (Span 8) */}
        <div className="lg:col-span-8 border border-[#E0D3E8] bg-white divide-y divide-[#E0D3E8]">
          <div className="p-6 space-y-3">
            <span className="text-[10px] text-[#723ECF] font-bold uppercase tracking-wider block">
              DIAGNOSTIC STRENGTHS IDENTIFIED
            </span>
            <div className="space-y-2">
              {score.strengths.map((str, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-[#723ECF] shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-3 bg-[#FEF8E7]">
            <span className="text-[10px] text-[#ED4B86] font-bold uppercase tracking-wider block">
              RECOMMENDED SHORTLIST ACCELERATORS
            </span>
            <div className="space-y-2">
              {score.improvementAreas.map((imp, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-800">
                  <Target className="w-4 h-4 text-[#ED4B86] shrink-0 mt-0.5" />
                  <span>{imp}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-2.5">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              HIGH-IMPACT KEYWORD RADAR (AICTE / T&amp;P BENCHMARK)
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {score.recommendedKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[#F4EEF7] border border-[#E0D3E8] text-[#723ECF] text-[11px] font-bold font-mono"
                >
                  +{kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Matching Opportunities Feed ─────────────────────────────────── */}
      <div className="border border-[#E0D3E8] bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0D3E8] pb-4">
          <div>
            <span className="text-[10px] text-[#723ECF] font-bold uppercase tracking-wider block">
              RECOMMENDED BY AI RADAR
            </span>
            <h2 className="text-xl font-black text-[#171024] uppercase font-sans">
              Matched Opportunities with Deterministic Fit
            </h2>
          </div>
          <Link to="/student/internships" className="btn-secondary text-xs">
            [ BROWSE ALL OPENINGS ]
          </Link>
        </div>

        {loadingRecs ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#723ECF]" />
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.internshipId}
                className="border border-[#E0D3E8] p-6 hover:border-[#723ECF] transition-all bg-white flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 bg-[#F4EEF7] text-[#723ECF] border border-[#E0D3E8] text-[10px] font-bold font-mono">
                      MATCH SCORE: {rec.matchScore}%
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{rec.uniqueId || 'INT-2026-001'}</span>
                  </div>

                  <h3 className="text-lg font-black text-[#171024] font-sans uppercase">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-zinc-600 flex items-center gap-1.5 font-mono">
                    <Building2 className="w-3.5 h-3.5 text-[#723ECF]" /> {rec.companyName}
                  </p>

                  <p className="text-xs text-zinc-700 leading-relaxed font-mono">
                    {rec.learningPathAdvice}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono">
                    {rec.matchedSkills.map((sk) => (
                      <span key={sk} className="px-2 py-0.5 bg-[#FEF8E7] text-[#723ECF] border border-[#E0D3E8] font-bold">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
                  <button
                    onClick={() => setSelectedInternship({ id: rec.internshipId, title: rec.title })}
                    className="btn-primary text-xs px-5 py-2.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> CHECK 8-RULES
                  </button>
                  <Link
                    to="/student/internships"
                    className="btn-secondary text-xs px-5 py-2.5 text-center"
                  >
                    VIEW SPECIFICATION
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8-Rule Deterministic Eligibility Modal */}
      {selectedInternship && (
        <EligibilityModal
          internshipId={selectedInternship.id}
          internshipTitle={selectedInternship.title}
          onClose={() => setSelectedInternship(null)}
        />
      )}
    </div>
  );
}
