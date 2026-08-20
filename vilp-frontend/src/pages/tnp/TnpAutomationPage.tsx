import { useState } from 'react';
import {
  Play,
  CheckCircle2,
  Download,
  Zap,
  Clock,
  Award,
  Mail,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';

type AutomationType =
  | 'OFFER_LETTER_DISPATCHED'
  | 'DAILY_LOGBOOK_REMINDER'
  | 'E_CERTIFICATE_ISSUED'
  | 'NOC_APPROVED'
  | 'PPO_REGISTERED';

interface AutomationDefinition {
  id: AutomationType;
  title: string;
  category: string;
  icon: any;
  color: string;
  triggerDescription: string;
  automatedActions: string[];
  mockPayload: any;
  simulatedOutput: string;
}

const AUTOMATIONS: AutomationDefinition[] = [
  {
    id: 'OFFER_LETTER_DISPATCHED',
    title: 'Offer Letter & 48h Decision Clock',
    category: 'Recruiter & Student Flow',
    icon: Mail,
    color: 'border-blue-500 bg-blue-50/40 text-blue-700',
    triggerDescription: 'Triggered when a company extends a formal internship or placement offer.',
    automatedActions: [
      'Dispatches WhatsApp & Email alert to student with digital offer letter link',
      'Starts automated 48-hour acceptance countdown timer',
      'Sends calendar invite for pre-joining briefing session',
    ],
    mockPayload: {
      eventType: 'OFFER_LETTER_DISPATCHED',
      studentName: 'Aarav Sharma',
      studentEmail: 'aarav.sharma@vilp.edu',
      companyName: 'Google Cloud India',
      role: 'Cloud Engineering & Microservices Intern',
      stipendPerMonth: '₹45,000 / month',
      deadlineHours: 48,
      offerLetterUrl: 'http://localhost:5173/student/offers',
    },
    simulatedOutput: '📩 WhatsApp & Email delivered to Aarav Sharma with 48h offer letter response link.',
  },
  {
    id: 'DAILY_LOGBOOK_REMINDER',
    title: 'Daily & Weekly Logbook Reminder Cron',
    category: 'Attendance & Compliance',
    icon: Clock,
    color: 'border-amber-500 bg-amber-50/40 text-amber-700',
    triggerDescription: 'Triggered daily at 6:00 PM / Friday 5:00 PM for students with pending weekly hours.',
    automatedActions: [
      'Scans active internships with < 40 hours logged for the current week',
      'Sends smart push notification & WhatsApp reminder to student mobile',
      'Alerts faculty mentor if logbook remains unsubmitted past Sunday deadline',
    ],
    mockPayload: {
      eventType: 'DAILY_LOGBOOK_REMINDER',
      studentName: 'Aarav Sharma',
      activeCompany: 'Google Cloud India',
      currentWeek: 4,
      loggedHoursThisWeek: 24,
      targetHoursThisWeek: 40,
      reminderMessage: 'Hi Aarav, you have 16 hours left to log for Week 4. Submit before Friday 6 PM!',
    },
    simulatedOutput: '⏰ Reminder push notification sent to Aarav Sharma: 16 hours remaining for Week 4.',
  },
  {
    id: 'E_CERTIFICATE_ISSUED',
    title: 'e-Certificate (e-Cert) & Cryptographic SHA-256 Dispatch',
    category: 'Accreditation & Credentials',
    icon: Award,
    color: 'border-purple-500 bg-purple-50/40 text-purple-700',
    triggerDescription: 'Triggered upon completion of 240 hours + approval of mentor final evaluation.',
    automatedActions: [
      'Computes tamper-evident SHA-256 cryptographic hash seal',
      'Generates institutional completion e-Certificate with public QR verification link',
      'Emails digital e-Cert PDF to student, college registrar, and host company HR',
    ],
    mockPayload: {
      eventType: 'E_CERTIFICATE_ISSUED',
      certificateNumber: 'VILP-2026-CSE-8841',
      studentName: 'Aarav Sharma',
      rollNo: '2022CS1045',
      companyName: 'Google Cloud India',
      totalApprovedHours: 240,
      gradeAchieved: 'A+ (Distinction)',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      publicVerificationUrl: 'http://localhost:5173/verify/certificate/VILP-2026-CSE-8841',
    },
    simulatedOutput: '🎓 Tamper-proof e-Certificate generated with SHA-256 seal & emailed to Aarav Sharma.',
  },
  {
    id: 'NOC_APPROVED',
    title: 'Institutional NOC Clearance & Stamping',
    category: 'T&P Governance',
    icon: FileText,
    color: 'border-emerald-500 bg-emerald-50/40 text-emerald-700',
    triggerDescription: 'Triggered when T&P approves a student No Objection Certificate application.',
    automatedActions: [
      'Applies digital institutional seal and unique verification code',
      'Generates printable official college NOC clearance certificate',
      'Sends instant WhatsApp alert with 1-click certificate view',
    ],
    mockPayload: {
      eventType: 'NOC_APPROVED',
      verificationCode: 'NOC-2026-004821',
      studentName: 'Aarav Sharma',
      companyName: 'Google Cloud India',
      approvedBy: 'Dr. Ramesh Kulkarni (T&P Head)',
      status: 'ISSUED_AND_VERIFIED',
    },
    simulatedOutput: '📜 NOC Clearance Certificate stamped with digital seal and WhatsApp sent to Aarav Sharma.',
  },
  {
    id: 'PPO_REGISTERED',
    title: 'PPO Full-Time Placement & Google Sheets Sync',
    category: 'Corporate Placements',
    icon: FileSpreadsheet,
    color: 'border-indigo-500 bg-indigo-50/40 text-indigo-700',
    triggerDescription: 'Triggered when a company converts an intern into a full-time Pre-Placement Offer.',
    automatedActions: [
      'Automatically appends student name, CTC package, and company into Master Google Sheet',
      'Calculates updated departmental placement percentage and average CTC metric',
      'Publishes congratulatory post on College Placement Portal bulletin board',
    ],
    mockPayload: {
      eventType: 'PPO_REGISTERED',
      studentName: 'Aarav Sharma',
      rollNo: '2022CS1045',
      department: 'Computer Science & Engineering',
      companyName: 'Google Cloud India',
      ctcLpa: 14.5,
      placementCategory: 'Tier-1 Dream Company',
    },
    simulatedOutput: '📊 14.5 LPA PPO package appended to Master Google Sheet & Campus Placement Board.',
  },
];

interface ExecutionLog {
  id: string;
  time: string;
  event: string;
  status: 'SUCCESS' | 'TRIGGERED';
  details: string;
  payload: any;
}

export function TnpAutomationPage() {
  const [selectedAuto, setSelectedAuto] = useState<AutomationType>('OFFER_LETTER_DISPATCHED');
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<ExecutionLog[]>([
    {
      id: 'log-initial',
      time: 'Just now',
      event: 'E_CERTIFICATE_ISSUED',
      status: 'SUCCESS',
      details: 'e-Certificate VILP-2026-CSE-8841 generated with SHA-256 seal & emailed to student',
      payload: AUTOMATIONS[2].mockPayload,
    },
  ]);

  const activeAutomation = AUTOMATIONS.find((a) => a.id === selectedAuto) || AUTOMATIONS[0];

  const handleSimulate = (automation: AutomationDefinition) => {
    setIsSimulating(true);
    setTimeout(() => {
      const newLog: ExecutionLog = {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        event: automation.id,
        status: 'SUCCESS',
        details: automation.simulatedOutput,
        payload: automation.mockPayload,
      };
      setLogs((prev) => [newLog, ...prev]);
      setIsSimulating(false);
    }, 400);
  };

  const handleDownloadWorkflow = () => {
    const workflowData = {
      name: 'VILP Institutional Placement, Offers, Reminders & e-Cert Automation',
      nodes: [
        { name: 'VILP Webhook Trigger', type: 'n8n-nodes-base.webhook', position: [250, 300] },
        { name: 'Event Type Switcher', type: 'n8n-nodes-base.switch', position: [480, 300] },
        { name: 'Offer Letter Dispatcher', type: 'n8n-nodes-base.httpRequest', position: [720, 100] },
        { name: 'Daily Logbook Reminder Cron', type: 'n8n-nodes-base.cron', position: [720, 220] },
        { name: 'e-Certificate Generator', type: 'n8n-nodes-base.httpRequest', position: [720, 340] },
        { name: 'Sync to Google Sheets', type: 'n8n-nodes-base.googleSheets', position: [720, 460] },
      ],
    };
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vilp_placement_automation_workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-900 text-white p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-400 border border-white/15">
            <Zap className="w-3.5 h-3.5" />
            <span>n8n Workflow Automation Engine · 5 Pre-Built Institutional Flows</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Workflow Automations
          </h1>
          <p className="text-sm text-zinc-300 max-w-xl">
            Automate offer letters, daily logbook attendance reminders, cryptographic e-Certificates, NOCs, and Google Sheets placement tracking.
          </p>
        </div>

        <button
          onClick={handleDownloadWorkflow}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0 active:scale-[0.98]"
        >
          <Download className="w-4 h-4" /> Download n8n Workflow JSON
        </button>
      </div>

      {/* 5 Automation Flow Selector Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
          Select Automation Flow to Inspect & Simulate
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AUTOMATIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedAuto === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedAuto(item.id)}
                className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-zinc-900 bg-white shadow-md ring-2 ring-zinc-900/10'
                    : 'border-zinc-200 bg-white/70 hover:bg-white hover:border-zinc-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600">
                      {item.category}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-zinc-900' : 'text-zinc-400'}`} />
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 leading-snug">{item.title}</h4>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{item.triggerDescription}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs">
                  <span className="font-semibold text-zinc-700">3 Automated Steps</span>
                  {isSelected ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active View
                    </span>
                  ) : (
                    <span className="text-zinc-400">Click to inspect</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Flow Deep Dive & Simulator */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 text-white text-xs font-mono font-bold">
                {activeAutomation.id}
              </span>
              <span className="text-xs text-zinc-400 font-medium">{activeAutomation.category}</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-900">{activeAutomation.title}</h3>
            <p className="text-xs text-zinc-600 max-w-2xl">{activeAutomation.triggerDescription}</p>
          </div>

          <button
            onClick={() => handleSimulate(activeAutomation)}
            disabled={isSimulating}
            className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2 shrink-0 shadow-md"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isSimulating ? 'Executing...' : 'Trigger Simulation'}</span>
          </button>
        </div>

        {/* 3 Steps Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeAutomation.automatedActions.map((step, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 space-y-2">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-zinc-200 text-zinc-700">
                Step {idx + 1}
              </span>
              <p className="text-xs font-semibold text-zinc-800 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        {/* Payload Inspector & Execution Log Stream */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Live Execution Stream & Webhook Data
          </h4>
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {log.event}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">{log.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-900">{log.details}</p>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-zinc-200 text-[11px] font-mono text-zinc-600 max-w-sm overflow-x-auto">
                  <pre className="whitespace-pre">{JSON.stringify(log.payload, null, 2)}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
