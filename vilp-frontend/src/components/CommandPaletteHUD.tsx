import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Zap,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  FileCheck,
  Lock,
  Compass,
} from 'lucide-react';

interface CommandItem {
  id: string;
  category: 'NAVIGATION' | 'ACTIONS' | 'ROLES' | 'VERIFICATION';
  title: string;
  subtitle: string;
  shortcut?: string;
  icon: any;
  action: () => void;
}

export function CommandPaletteHUD() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Play subtle synthesized audio chime
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext fallback
    }
  };

  const executeAction = (action: () => void) => {
    playChime();
    setIsOpen(false);
    action();
  };

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-student',
      category: 'NAVIGATION',
      title: 'Student Command Center',
      subtitle: 'Internship applications, 240h meter & ATS radar',
      shortcut: 'G S',
      icon: GraduationCap,
      action: () => navigate('/student/dashboard'),
    },
    {
      id: 'nav-recruiter',
      category: 'NAVIGATION',
      title: 'Corporate Recruiter Console',
      subtitle: 'Post requisitions, candidate pipeline & 48h offers',
      shortcut: 'G R',
      icon: Briefcase,
      action: () => navigate('/company/dashboard'),
    },
    {
      id: 'nav-tnp',
      category: 'NAVIGATION',
      title: 'T&P Compliance & Placement Cell',
      subtitle: 'Batch verification, AICTE NOC queue & analytics',
      shortcut: 'G T',
      icon: ShieldCheck,
      action: () => navigate('/tnp/dashboard'),
    },
    {
      id: 'nav-mentor',
      category: 'NAVIGATION',
      title: 'Faculty Mentor Review Dashboard',
      subtitle: 'Weekly logbook sign-offs & 5-D evaluation rubrics',
      shortcut: 'G M',
      icon: Award,
      action: () => navigate('/mentor/dashboard'),
    },

    // Actions
    {
      id: 'act-onboarding',
      category: 'ACTIONS',
      title: 'Launch Multi-Role Onboarding Wizard',
      subtitle: '8-Step AI Profile extraction & career radar',
      shortcut: '⌘ O',
      icon: Sparkles,
      action: () => navigate('/onboarding/roles'),
    },
    {
      id: 'act-verify-cert',
      category: 'VERIFICATION',
      title: 'Public Degree Certificate Verifier',
      subtitle: 'Validate SHA-256 digital stamp & institutional seal',
      shortcut: '⌘ V',
      icon: FileCheck,
      action: () => navigate('/verify/certificate/VILP-2026-CSE-8841'),
    },
    {
      id: 'act-verify-noc',
      category: 'VERIFICATION',
      title: 'Public AICTE NOC Verifier',
      subtitle: 'Inspect cryptographic NOC approval & batch token',
      shortcut: '⌘ N',
      icon: Lock,
      action: () => navigate('/verify/noc/NOC-2026-00412'),
    },

    // Security & Platform Actions
    {
      id: 'act-support',
      category: 'ACTIONS',
      title: 'Open Institutional Helpdesk',
      subtitle: 'Submit support ticket or contact placement cell',
      shortcut: '⌘ H',
      icon: Compass,
      action: () => {
        const btn = document.querySelector('[data-support-trigger="true"]') as HTMLButtonElement;
        if (btn) btn.click();
      },
    },
    {
      id: 'act-privacy',
      category: 'ACTIONS',
      title: 'Platform Privacy & Compliance',
      subtitle: 'View AICTE data retention and privacy policies',
      icon: Lock,
      action: () => navigate('/privacy'),
    },
    {
      id: 'act-terms',
      category: 'ACTIONS',
      title: 'Terms of Institutional Service',
      subtitle: 'Review single-active allocation & mutex policies',
      icon: FileCheck,
      action: () => navigate('/terms'),
    },
  ];

  const filteredCommands = query.trim()
    ? commands.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      } else if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % (filteredCommands.length || 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((i) => (i - 1 + filteredCommands.length) % (filteredCommands.length || 1));
        } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
          e.preventDefault();
          executeAction(filteredCommands[selectedIndex].action);
        }
      }
    },
    [isOpen, filteredCommands, selectedIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Floating Raycast/Linear-style Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 px-3.5 py-2 bg-[#0A2540] hover:bg-[#1E3A5F] text-white border border-[#1E3A5F] rounded-full shadow-xl flex items-center gap-2.5 font-mono text-xs cursor-pointer transition-all hover:scale-105 active:scale-95 group"
      >
        <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
        <span className="font-bold uppercase tracking-wider text-[11px]">Command HUD</span>
        <kbd className="px-1.5 py-0.5 bg-white/10 text-slate-300 rounded-xs text-[10px] font-bold border border-white/10 group-hover:bg-white/20">
          ⌘K
        </kbd>
      </button>

      {/* Command Palette Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#0A2540]/60 backdrop-blur-xs animate-fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white border border-[#CBD5E1] rounded-xs shadow-2xl overflow-hidden font-mono flex flex-col max-h-[80vh] animate-slide-down"
          >
            {/* Search Input Bar */}
            <div className="p-3.5 sm:p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-3">
              <Search className="w-5 h-5 text-[#2563EB] shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command, role, or search jump..."
                className="w-full bg-transparent border-none text-xs sm:text-sm font-mono text-[#0A2540] placeholder-slate-400 focus:outline-none"
              />
              <kbd className="px-2 py-0.5 bg-white border border-[#CBD5E1] text-[10px] text-slate-500 font-bold rounded-xs shrink-0">
                ESC
              </kbd>
            </div>

            {/* Command List View */}
            <div className="overflow-y-auto p-2 space-y-1 divide-y divide-slate-100">
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 space-y-1">
                  <Compass className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>No matching commands found for &quot;{query}&quot;</p>
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const isSelected = selectedIndex === idx;
                  const Icon = cmd.icon;
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => executeAction(cmd.action)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 rounded-xs flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'hover:bg-[#F8FAFC] text-[#0A2540]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xs flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-white text-[#2563EB]'
                              : 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#2563EB]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs uppercase tracking-tight truncate">
                              {cmd.title}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded-xs uppercase font-bold shrink-0 ${
                                isSelected
                                  ? 'bg-[#F97316] text-white'
                                  : 'bg-[#F1F5F9] text-[#2563EB] border border-blue-200'
                              }`}
                            >
                              {cmd.category}
                            </span>
                          </div>
                          <p
                            className={`text-[11px] truncate mt-0.5 ${
                              isSelected ? 'text-blue-100' : 'text-slate-500'
                            }`}
                          >
                            {cmd.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {cmd.shortcut && (
                          <kbd
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded-xs border ${
                              isSelected
                                ? 'bg-white/20 text-white border-white/30'
                                : 'bg-[#F8FAFC] text-slate-600 border-[#CBD5E1]'
                            }`}
                          >
                            {cmd.shortcut}
                          </kbd>
                        )}
                        <ArrowRight
                          className={`w-3.5 h-3.5 ${
                            isSelected ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="p-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <div className="flex items-center gap-1 text-[#2563EB] font-bold">
                <Zap className="w-3 h-3 text-[#F97316]" /> VILP RAYCAST HUD
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
