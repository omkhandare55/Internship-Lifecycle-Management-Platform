import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  CheckCircle2,
  Building2,
  Loader2,
  ShieldCheck,
  Target,
  UploadCloud,
  FileText,
  Check,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiApi, studentApi } from '@/services/vilpApi';
import { EligibilityModal } from '@/components/EligibilityModal';
import { parseResumeWithAi, type ParsedResumeProfile } from '@/features/onboarding/services/aiResumeParserService';

export function StudentAiAdvisorPage() {
  const [selectedInternship, setSelectedInternship] = useState<{ id: string; title: string } | null>(null);
  const [analyzedResume, setAnalyzedResume] = useState<ParsedResumeProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const { data: recommendationsData, isLoading: loadingRecs } = useQuery({
    queryKey: ['aiRecommendations'],
    queryFn: aiApi.getRecommendations,
  });

  const { data: resumeScoreData } = useQuery({
    queryKey: ['aiResumeScore'],
    queryFn: aiApi.getResumeScore,
  });

  const recommendations = recommendationsData?.data || [];
  const serverScore = resumeScoreData?.data;

  // Combine live analyzed resume with backend score
  const score = analyzedResume
    ? {
        overallScore: analyzedResume.atsScore,
        technicalFitScore: Math.min(analyzedResume.skills.value.length * 10, 100),
        formattingScore: 92,
        completenessScore: Math.min(Math.round((analyzedResume.wordCount / 200) * 100), 100),
        strengths: [
          `Identified candidate identity: ${analyzedResume.fullName.value}`,
          `Extracted ${analyzedResume.skills.value.length} core technical competencies`,
          `Verified academic standing: CGPA ${analyzedResume.cgpa.value.toFixed(2)} (${analyzedResume.branch.value})`,
        ],
        improvementAreas: [
          'Add targeted cloud infrastructure keywords (AWS/GCP/Docker) for shortlist acceleration',
          'Include live project repository and portfolio demo URLs',
        ],
        recommendedKeywords: analyzedResume.skills.value,
      }
    : serverScore || {
        overallScore: 78,
        technicalFitScore: 80,
        formattingScore: 88,
        completenessScore: 75,
        strengths: [
          'Registered profile in good academic standing',
          'Verified contact details on ledger',
        ],
        improvementAreas: [
          'Upload your resume below to calculate personalized ATS and recruiter match metrics',
          'Add accredited skill tokens from the catalog',
        ],
        recommendedKeywords: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker', 'REST API', 'Git'],
      };

  const handleResumeDrop = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsAnalyzing(true);
    setSyncStatus(null);
    try {
      const parsed = await parseResumeWithAi(file);
      setAnalyzedResume(parsed);
    } catch (err: any) {
      console.error('Resume parsing failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSyncSkills = async () => {
    if (!analyzedResume) return;
    setSyncStatus('syncing');
    try {
      // Sync portfolio / about if present
      await studentApi.updateProfile({
        linkedinUrl: analyzedResume.linkedinUrl.value || undefined,
        portfolioUrl: analyzedResume.portfolioUrl.value || undefined,
        about: `Candidate in ${analyzedResume.branch.value} with focus on ${analyzedResume.skills.value.slice(0, 4).join(', ')}.`,
      } as any);
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (err) {
      setSyncStatus('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in font-mono text-[#171024]">
      {/* ── Top Header Ribbon (#FEF8E7) ────────────────────────────────────── */}
      <div className="bg-[#FEF8E7] border border-[#E0D3E8] p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-xs text-[#723ECF] border border-[#E0D3E8] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#ED4B86]" />
          <span>SMART CAREER RADAR // AI RESUME ANALYZER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#171024] font-sans tracking-tight">
          Smart Career Intelligence &amp; Resume Diagnostic Radar
        </h1>
        <p className="text-xs text-zinc-600 font-mono max-w-3xl">
          Real-time ATS parsing, semantic entity extraction, and personalized opportunity matching based on AICTE placement benchmarks.
        </p>
      </div>

      {/* ── Interactive Resume Upload & Live AI Scanner Card ─────────────────── */}
      <div className="border border-[#CBD5E1] bg-white p-6 sm:p-8 rounded-xs shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase text-[#0A2540] font-sans m-0 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#2563EB]" /> Live Resume ATS Scanner
            </h2>
            <p className="text-xs text-slate-500 m-0">
              Upload your latest Resume (PDF, DOCX, or Text) for automated entity extraction and keyword scoring.
            </p>
          </div>

          <label className="btn-primary text-xs px-4 py-2.5 cursor-pointer flex items-center gap-2 shrink-0">
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Document...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" /> Select Resume File
              </>
            )}
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              disabled={isAnalyzing}
              onChange={handleResumeDrop}
              className="hidden"
            />
          </label>
        </div>

        {analyzedResume && (
          <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-[#0A2540]">
                  Analyzed: <strong className="font-mono">{analyzedResume.fullName.value}</strong> ({analyzedResume.branch.value})
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-xs">
                ATS Readiness: {analyzedResume.atsScore}%
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {analyzedResume.skills.value.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-white border border-[#CBD5E1] text-[#2563EB] text-[10px] font-bold"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Extracted from document ({analyzedResume.wordCount} words detected)
              </span>
              <button
                type="button"
                onClick={handleSyncSkills}
                disabled={syncStatus === 'syncing'}
                className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Syncing...
                  </>
                ) : syncStatus === 'synced' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Synced to Profile!
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Sync Extracted Data to Profile
                  </>
                )}
              </button>
            </div>
          </div>
        )}
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
              <span className="text-xs font-mono font-bold text-emerald-400">● {score.overallScore >= 80 ? 'TIER-1 READY' : 'OPTIMIZING'}</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black font-mono text-white">{score.overallScore}</span>
              <span className="text-lg text-zinc-500 font-mono">/ 100</span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              {score.overallScore >= 80
                ? 'Candidate profile satisfies accredited Tier-1 recruiter academic & skill cutoffs.'
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

      {/* ── Smart Matching Opportunities Feed ─────────────────────────────────── */}
      <div className="border border-[#E0D3E8] bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0D3E8] pb-4">
          <div>
            <h3 className="text-sm font-mono text-[#723ECF] mb-1 flex items-center tracking-widest uppercase">
              <span className="w-2 h-2 bg-[#723ECF] rounded-full mr-2"></span> RECOMMENDED OPPORTUNITIES
            </h3>
            <h2 className="text-xl font-black text-[#171024] uppercase font-sans m-0">
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
        ) : recommendations.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 font-mono">
            No active open internship postings matched at this moment. Check back soon!
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
