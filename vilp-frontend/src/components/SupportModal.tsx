import { useState } from 'react';
import {
  HelpCircle,
  X,
  Mail,
  Bug,
  Send,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function SupportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [bugCategory, setBugCategory] = useState('UI_ISSUE');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDescription('');
      setIsOpen(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating Trigger Button (#FEF8E7) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 bg-[#FEF8E7] hover:bg-[#faefcb] text-[#723ECF] border border-[#E0D3E8] px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 group shadow-lg select-none"
        aria-label="Support & Help"
        title="Help & Support"
      >
        <HelpCircle className="w-3.5 h-3.5 text-[#723ECF]" />
        <span className="hidden sm:inline">[ HELPDESK ]</span>
      </button>

      {/* Support Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in font-mono">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 relative border border-[#E0D3E8] animate-slide-down text-[#171024] shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 bg-[#723ECF] text-white flex items-center justify-center font-bold text-xs">
                ?
              </div>
              <div>
                <h3 className="text-sm font-black text-[#171024] uppercase tracking-wider font-sans">
                  VILP TECHNICAL HELPDESK
                </h3>
                <p className="text-[10px] text-[#723ECF] font-bold">INCIDENT REPORTING &amp; CAMPUS ADVISORY</p>
              </div>
            </div>

            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-10 h-10 border border-[#723ECF] bg-[#F4EEF7] text-[#723ECF] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="font-bold text-xs text-[#171024] uppercase tracking-wider">
                  INCIDENT LOGGED SUCCESSFULLY
                </p>
                <p className="text-[10px] text-zinc-500">Ticket ref: TKT-2026-{Math.floor(Math.random() * 90000 + 10000)}</p>
              </div>
            ) : (
              <div className="space-y-6 mt-6">
                {/* Contact Channels Strip */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <a
                    href="mailto:support@vilp.edu"
                    className="p-3 bg-[#FEF8E7] hover:bg-[#faefcb] border border-[#E0D3E8] flex items-center gap-2.5 text-[#171024] transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#723ECF] shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-[#171024] text-[11px]">EMAIL HELPDESK</p>
                      <p className="text-[10px] text-zinc-600 font-mono truncate">support@vilp.edu</p>
                    </div>
                  </a>

                  <div className="p-3 bg-[#FEF8E7] border border-[#E0D3E8] flex items-center gap-2.5 text-[#171024]">
                    <Phone className="w-4 h-4 text-[#723ECF] shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-[#171024] text-[11px]">T&amp;P HOTLINE</p>
                      <p className="text-[10px] text-zinc-600 font-mono truncate">+91 020 2550-7000</p>
                    </div>
                  </div>
                </div>

                {/* Incident Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5 pt-4 border-t border-[#E0D3E8]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#171024]">
                    <Bug className="w-3.5 h-3.5 text-[#ED4B86]" />
                    <span>TRANSMIT ISSUE DIAGNOSTIC</span>
                  </div>

                  <div>
                    <label className="label">ISSUE CATEGORY</label>
                    <select
                      value={bugCategory}
                      onChange={(e) => setBugCategory(e.target.value)}
                      className="input-field text-xs uppercase"
                    >
                      <option value="UI_ISSUE">UI Layout &amp; Display Fault</option>
                      <option value="NOC_VERIFICATION">NOC / Verification Clearance</option>
                      <option value="LOGBOOK_HOURS">Logbook Hours Tracking</option>
                      <option value="LOGIN_AUTH">Account &amp; Authentication</option>
                      <option value="OTHER">Other System Query</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">INCIDENT DESCRIPTION</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Specify the observed behavior..."
                      className="input-field text-xs resize-none"
                      required
                    />
                  </div>

                  <div className="text-[10px] font-mono text-zinc-500 bg-[#F4EEF7] p-2 border border-[#E0D3E8]">
                    SESSION_ID: {user?.email || 'ANONYMOUS'} · {new Date().toLocaleTimeString()}
                  </div>

                  <button type="submit" className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2">
                    <Send className="w-3.5 h-3.5" /> DISPATCH TICKET
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
