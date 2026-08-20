import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  CheckCircle2,
  Award,
  BookOpen,
} from 'lucide-react';
import { evaluationApi, studentApi, internshipApi } from '@/services/vilpApi';
import type { SubmitEvaluationInput } from '@/types/vilp.types';

export function MentorEvaluationPage() {
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: studentsData } = useQuery({
    queryKey: ['allStudents'],
    queryFn: () => studentApi.listAll(0, 100),
  });

  const { data: internshipsData } = useQuery({
    queryKey: ['openInternships'],
    queryFn: () => internshipApi.listOpen(0, 100),
  });

  const students = studentsData?.data?.content || [];
  const internships = internshipsData?.data?.content || [];

  const [formData, setFormData] = useState<SubmitEvaluationInput>({
    internshipId: 'int-001',
    studentId: 'stu-001',
    evaluatorType: 'MENTOR',
    evaluationType: 'FINAL',
    technicalSkillsRating: 5,
    communicationRating: 4,
    punctualityRating: 5,
    initiativeRating: 5,
    overallPerformanceRating: 5,
    remarks: 'Demonstrated outstanding engineering rigor in microservices development. Recommended for Pre-Placement Offer (PPO).',
    ppoRecommended: true,
    ppoTerms: '₹14.5 LPA CTC with Google Cloud Core Infrastructure Team',
  });

  const submitMutation = useMutation({
    mutationFn: (input: SubmitEvaluationInput) => evaluationApi.submit(input),
    onSuccess: () => {
      setMsg({ type: 'success', text: '5-Dimension Competency Evaluation & PPO Recommendation committed to Registry!' });
      setTimeout(() => setMsg(null), 4000);
    },
    onError: (err: any) => {
      setMsg({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to submit evaluation',
      });
    },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in font-mono text-[#171024]">
      {/* ── Top Header Ribbon (#FEF8E7) ────────────────────────────────────── */}
      <div className="bg-[#FEF8E7] border border-[#E0D3E8] p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-xs text-[#723ECF] border border-[#E0D3E8] font-bold">
          <BookOpen className="w-3.5 h-3.5 text-[#ED4B86]" />
          <span>FACULTY MENTORSHIP CONSOLE // 5-DIMENSION RUBRIC</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#171024] font-sans tracking-tight">
          Competency Evaluation &amp; PPO Endorsement
        </h1>
        <p className="text-xs text-zinc-600 max-w-3xl leading-relaxed">
          Record deterministic faculty assessment across core engineering dimensions. Direct recommendations automatically trigger Pre-Placement Offer locks in the University T&amp;P Registry.
        </p>
      </div>

      {msg && (
        <div
          className={`p-4 border text-xs font-bold flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-[#F4EEF7] text-[#723ECF] border-[#723ECF]'
              : 'bg-[#fdf2f4] text-[#ED4B86] border-[#ED4B86]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> {msg.text}
        </div>
      )}

      {/* ── Main Evaluation Form Ledger ────────────────────────────────────── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitMutation.mutate(formData);
        }}
        className="border border-[#E0D3E8] bg-white p-6 sm:p-8 space-y-8"
      >
        {/* Candidate & Internship Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-[#E0D3E8]">
          <div>
            <label className="label">ASSIGNED STUDENT CANDIDATE</label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="input-field text-xs uppercase"
              required
            >
              {students.length > 0 ? (
                students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.studentNumber}) - {s.department?.name || 'Department'}
                  </option>
                ))
              ) : (
                <option value="stu-001">Enrolled Candidate (REG-2026-001) - Computer Science</option>
              )}
            </select>
          </div>

          <div>
            <label className="label">CORPORATE INTERNSHIP PROGRAM</label>
            <select
              value={formData.internshipId}
              onChange={(e) => setFormData({ ...formData, internshipId: e.target.value })}
              className="input-field text-xs uppercase"
              required
            >
              {internships.length > 0 ? (
                internships.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.title} - {i.company?.name || 'Host Organization'}
                  </option>
                ))
              ) : (
                <option value="int-001">Cloud Engineering &amp; Distributed Systems - Enterprise Partner</option>
              )}
            </select>
          </div>
        </div>

        {/* 5-Dimension Rating Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E0D3E8] pb-2">
            <span className="text-xs font-black text-[#171024] uppercase font-sans">
              5-Dimension Academic Competency Rubric
            </span>
            <span className="text-[10px] text-zinc-500">Scale: 1 (Deficient) to 5 (Outstanding)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#FEF8E7] border border-[#E0D3E8] space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-[#171024]">1. TECHNICAL COMPETENCY</span>
                <span className="font-bold text-[#723ECF]">{formData.technicalSkillsRating} / 5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={formData.technicalSkillsRating}
                onChange={(e) => setFormData({ ...formData, technicalSkillsRating: Number(e.target.value) })}
                className="w-full accent-[#723ECF]"
              />
            </div>

            <div className="p-4 bg-[#FEF8E7] border border-[#E0D3E8] space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-[#171024]">2. INITIATIVE &amp; OWNERSHIP</span>
                <span className="font-bold text-[#723ECF]">{formData.initiativeRating} / 5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={formData.initiativeRating}
                onChange={(e) => setFormData({ ...formData, initiativeRating: Number(e.target.value) })}
                className="w-full accent-[#723ECF]"
              />
            </div>

            <div className="p-4 bg-[#FEF8E7] border border-[#E0D3E8] space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-[#171024]">3. COMMUNICATION &amp; SPRINT COLLAB</span>
                <span className="font-bold text-[#723ECF]">{formData.communicationRating} / 5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={formData.communicationRating}
                onChange={(e) => setFormData({ ...formData, communicationRating: Number(e.target.value) })}
                className="w-full accent-[#723ECF]"
              />
            </div>

            <div className="p-4 bg-[#FEF8E7] border border-[#E0D3E8] space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-[#171024]">4. ATTENDANCE &amp; LOGBOOK RIGOR</span>
                <span className="font-bold text-[#723ECF]">{formData.punctualityRating} / 5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={formData.punctualityRating}
                onChange={(e) => setFormData({ ...formData, punctualityRating: Number(e.target.value) })}
                className="w-full accent-[#723ECF]"
              />
            </div>
          </div>
        </div>

        {/* Evaluation Remarks */}
        <div className="space-y-2">
          <label className="label">MENTOR QUALITATIVE SUMMARY &amp; REMARKS</label>
          <textarea
            rows={3}
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            className="input-field text-xs font-mono resize-none"
            required
          />
        </div>

        {/* PPO Endorsement Box */}
        <div className="p-6 bg-[#FEF8E7] border border-[#723ECF] space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="ppo-check"
              checked={formData.ppoRecommended}
              onChange={(e) => setFormData({ ...formData, ppoRecommended: e.target.checked })}
              className="w-4 h-4 accent-[#723ECF]"
            />
            <label htmlFor="ppo-check" className="text-xs font-bold text-[#171024] cursor-pointer">
              RECOMMEND FOR PRE-PLACEMENT OFFER (PPO) TO UNIVERSITY REGISTRY
            </label>
          </div>

          {formData.ppoRecommended && (
            <div className="space-y-2 pt-2 border-t border-[#E0D3E8]">
              <label className="label text-[#723ECF]">OFFER PACKAGE &amp; DESIGNATION (CTC)</label>
              <input
                type="text"
                value={formData.ppoTerms || ''}
                onChange={(e) => setFormData({ ...formData, ppoTerms: e.target.value })}
                placeholder="e.g. ₹14.5 LPA CTC - Software Development Engineer 1"
                className="input-field text-xs font-mono"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#E0D3E8]">
          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="btn-primary text-xs px-8 py-3 font-bold flex items-center gap-2"
          >
            <Award className="w-3.5 h-3.5" />
            {submitMutation.isPending ? 'TRANSMITTING RUBRIC...' : 'COMMIT EVALUATION TO REGISTRY'}
          </button>
        </div>
      </form>
    </div>
  );
}
