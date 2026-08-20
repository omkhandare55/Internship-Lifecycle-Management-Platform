import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  Calendar,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Printer,
  QrCode,
  Loader2,
  X,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { offerApi } from '@/services/vilpApi';
import { MOCK_STUDENT_PROFILE } from '@/services/mockData';
import { sendFirebaseNotification } from '@/services/firebaseNotificationService';
import type { Offer } from '@/types/vilp.types';

export function StudentOffersPage() {
  const queryClient = useQueryClient();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [responseAction, setResponseAction] = useState<'ACCEPT' | 'REJECT'>('ACCEPT');
  const [responseNotes, setResponseNotes] = useState('');
  const [viewNocForOfferId, setViewNocForOfferId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: offersData, isLoading } = useQuery({
    queryKey: ['myOffers'],
    queryFn: offerApi.getMyOffers,
  });

  const offers = offersData?.data || [];

  const respondMutation = useMutation({
    mutationFn: () => {
      if (!selectedOffer) throw new Error('No offer');
      return offerApi.respond(selectedOffer.id, responseAction, responseNotes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOffers'] });

      // Realtime Event Dispatch
      sendFirebaseNotification({
        userId: 'usr-1',
        title: responseAction === 'ACCEPT' ? 'Offer Accepted // Single-Offer Lock Engaged' : 'Offer Declined',
        message: responseAction === 'ACCEPT'
          ? `Accepted ${selectedOffer?.internshipTitle || 'Cloud Engineering'} offer. Autonomous NOC-2026-004821 stamped!`
          : `Declined offer for ${selectedOffer?.internshipTitle || 'Position'}.`,
        type: 'OFFER',
        isRead: false,
      });

      setSelectedOffer(null);
      setResponseNotes('');
      setMsg({
        type: 'success',
        text:
          responseAction === 'ACCEPT'
            ? 'Offer accepted! Single-Active Lock engaged and Institutional NOC auto-stamped.'
            : 'Offer declined. Your applicant queue has been updated.',
      });
      setTimeout(() => setMsg(null), 4000);
    },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in font-mono text-[#171024]">
      {/* ── Top Header Ribbon (#FEF8E7) ────────────────────────────────────── */}
      <div className="bg-[#FEF8E7] border border-[#E0D3E8] p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-xs text-[#723ECF] border border-[#E0D3E8] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#ED4B86]" />
          <span>SINGLE-ACTIVE INTERNSHIP GOVERNANCE // MUTEX ENFORCED</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#171024] font-sans tracking-tight">
          Offers &amp; Institutional NOC Clearance
        </h1>
        <p className="text-xs text-zinc-600 max-w-3xl leading-relaxed">
          In accordance with University Placement Cell regulations, accepting an offer locks your active allocation and automatically withdraws pending draft applications across the university.
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

      {/* ── Offers Ledger ──────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="py-12 flex justify-center bg-white border border-[#E0D3E8]">
          <Loader2 className="w-6 h-6 animate-spin text-[#723ECF]" />
        </div>
      ) : offers.length === 0 ? (
        <div className="border border-[#E0D3E8] bg-white p-12 text-center space-y-2">
          <p className="font-black text-[#171024] text-base font-sans uppercase">No Formal Offers Extended Yet</p>
          <p className="text-xs text-zinc-500">Keep applying to accredited openings through your Student Command center.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="border border-[#E0D3E8] bg-white p-6 sm:p-8 space-y-6 shadow-xs hover:border-[#723ECF] transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0D3E8] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#FEF8E7] text-[#723ECF] border border-[#E0D3E8] text-[10px] font-bold">
                      OFFER ID: {offer.id.slice(0, 8)}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        offer.status === 'ACCEPTED'
                          ? 'bg-[#F4EEF7] text-[#723ECF] border border-[#723ECF]'
                          : offer.status === 'OFFERED'
                          ? 'bg-[#FEF8E7] text-[#ED4B86] border border-[#ED4B86]'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {offer.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#171024] font-sans uppercase">
                    {offer.internshipTitle}
                  </h3>
                  <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#723ECF]" /> {offer.companyName}
                  </p>
                </div>

                {/* 48h Decision Clock */}
                {offer.status === 'OFFERED' && (
                  <div className="bg-[#FEF8E7] border border-[#ED4B86] p-3 text-right shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-[#ED4B86] font-bold">
                      <Clock className="w-3.5 h-3.5" /> 48h Decision Window Active
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Auto-expires in 34h 12m</p>
                  </div>
                )}
              </div>

              {/* Offer Vitals Ledger */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="border border-[#E0D3E8] p-3 bg-[#F4EEF7]">
                  <span className="text-[10px] text-zinc-500 font-bold block">MONTHLY_STIPEND</span>
                  <p className="font-bold text-[#171024] flex items-center gap-1 mt-0.5">
                    <IndianRupee className="w-3.5 h-3.5 text-[#723ECF]" /> {offer.stipend?.toLocaleString('en-IN') || '45,000'} / mo
                  </p>
                </div>
                <div className="border border-[#E0D3E8] p-3 bg-[#F4EEF7]">
                  <span className="text-[10px] text-zinc-500 font-bold block">COMMENCEMENT</span>
                  <p className="font-bold text-[#171024] flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-[#723ECF]" /> {offer.startDate || '2026-03-01'}
                  </p>
                </div>
                <div className="border border-[#E0D3E8] p-3 bg-[#F4EEF7]">
                  <span className="text-[10px] text-zinc-500 font-bold block">COMPLETION</span>
                  <p className="font-bold text-[#171024] flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-[#723ECF]" /> {offer.endDate || '2026-06-30'}
                  </p>
                </div>
                <div className="border border-[#E0D3E8] p-3 bg-[#F4EEF7]">
                  <span className="text-[10px] text-zinc-500 font-bold block">INSTITUTIONAL_NOC</span>
                  <p className="font-bold text-[#ED4B86] mt-0.5">
                    {offer.status === 'ACCEPTED' ? 'NOC-2026-004821' : 'UNLOCKED ON ACCEPT'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E0D3E8]">
                <div className="text-[11px] text-zinc-500">
                  {offer.status === 'ACCEPTED' ? (
                    <span className="text-[#723ECF] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Single-Active Lock Engaged · All other queues withdrawn
                    </span>
                  ) : (
                    <span>Review terms thoroughly before submitting legal response.</span>
                  )}
                </div>

                <div className="flex gap-2.5">
                  {offer.status === 'ACCEPTED' && (
                    <button
                      onClick={() => setViewNocForOfferId(offer.id)}
                      className="btn-primary text-xs px-4 py-2"
                    >
                      <FileCheck className="w-3.5 h-3.5" /> VIEW STAMPED NOC
                    </button>
                  )}

                  {offer.status === 'OFFERED' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedOffer(offer);
                          setResponseAction('ACCEPT');
                        }}
                        className="btn-primary text-xs px-5 py-2"
                      >
                        ACCEPT OFFER &amp; RELEASE NOC
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOffer(offer);
                          setResponseAction('REJECT');
                        }}
                        className="btn-secondary text-xs px-4 py-2 text-[#ED4B86] border-[#ED4B86]"
                      >
                        DECLINE
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Acceptance Confirmation Dialog ─────────────────────────────────── */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in font-mono">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 relative border border-[#E0D3E8] animate-slide-down text-[#171024] shadow-2xl space-y-5">
            <button
              onClick={() => setSelectedOffer(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#723ECF] uppercase">CONFIRMATION PROTOCOL</span>
              <h3 className="text-lg font-black text-[#171024] uppercase font-sans">
                {responseAction === 'ACCEPT' ? 'Accept Institutional Offer' : 'Decline Offer'}
              </h3>
              <p className="text-xs text-zinc-600">
                {selectedOffer.internshipTitle} · {selectedOffer.companyName}
              </p>
            </div>

            {responseAction === 'ACCEPT' && (
              <div className="p-3 bg-[#FEF8E7] border border-[#ED4B86] text-[11px] text-zinc-800 space-y-1.5">
                <p className="font-bold text-[#ED4B86] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> University Mutex Policy Notice:
                </p>
                <p>
                  Accepting this offer engages the <strong>Single-Active Lock</strong> and automatically withdraws all other pending applications. An Institutional NOC will be stamped immediately.
                </p>
              </div>
            )}

            <div>
              <label className="label">OPTIONAL RESPONSE NOTES</label>
              <textarea
                rows={2}
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                placeholder="Add optional notes for the recruiter or placement office..."
                className="input-field text-xs resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOffer(null)}
                className="btn-secondary text-xs"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => respondMutation.mutate()}
                disabled={respondMutation.isPending}
                className="btn-primary text-xs px-5"
              >
                {respondMutation.isPending ? 'PROCESSING...' : 'CONFIRM DECISION'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Official Stamped NOC Modal ──────────────────────────────────────── */}
      {viewNocForOfferId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-fade-in font-mono">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-10 relative border-2 border-[#171024] animate-slide-down text-[#171024] shadow-2xl space-y-6">
            <button
              onClick={() => setViewNocForOfferId(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black p-1 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* NOC Certificate Header */}
            <div className="text-center border-b-2 border-[#171024] pb-6 space-y-1">
              <span className="text-[10px] font-bold text-[#723ECF] uppercase tracking-widest block">
                GOVERNMENT / UNIVERSITY TRAINING &amp; PLACEMENT CELL
              </span>
              <h2 className="text-2xl font-black text-[#171024] uppercase font-sans tracking-tight">
                INSTITUTIONAL NO OBJECTION CERTIFICATE
              </h2>
              <p className="text-xs text-zinc-500 font-mono">
                AICTE / UGC Compliant Credential · Ref: NOC-2026-004821
              </p>
            </div>

            {/* Certificate Body */}
            <div className="space-y-4 text-xs text-zinc-800 leading-relaxed font-mono">
              <p>
                This is to certify that <strong>{MOCK_STUDENT_PROFILE.fullName || 'Verified Candidate'}</strong> (Student No: <strong>{MOCK_STUDENT_PROFILE.studentNumber || 'REG-2026-001'}</strong>), an enrolled candidate in the Department of {MOCK_STUDENT_PROFILE.department?.name || 'Computer Science & Engineering'}, has been granted institutional clearance to undertake the accredited corporate internship with <strong>Google Cloud India</strong>.
              </p>
              <p>
                The student has satisfied all academic prerequisites (CGPA: <strong>8.85</strong>, Active Backlogs: <strong>0</strong>) and is permitted to log up to 240 hours towards mandatory degree credit completion.
              </p>
            </div>

            {/* Digital Seal & QR Footer */}
            <div className="border-t-2 border-[#171024] pt-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">DIGITAL SHA-256 STAMP</p>
                <p className="text-[10px] text-[#723ECF] font-bold truncate max-w-xs font-mono">
                  HASH: e3b0c44298fc1c149afbf4c8996fb92427ae41e4
                </p>
                <p className="text-[9px] text-zinc-500">Autonomous Auto-Pilot Stamped · Verified Lifelong</p>
              </div>

              <div className="w-16 h-16 border border-[#E0D3E8] bg-[#FEF8E7] flex flex-col items-center justify-center text-center shrink-0">
                <QrCode className="w-8 h-8 text-[#171024]" />
                <span className="text-[8px] font-bold text-[#723ECF]">VERIFIED</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="btn-secondary text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> PRINT NOC
              </button>
              <button
                onClick={() => setViewNocForOfferId(null)}
                className="btn-primary text-xs"
              >
                CLOSE PREVIEW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
