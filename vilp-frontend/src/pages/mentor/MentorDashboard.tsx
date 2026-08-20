import { Link } from 'react-router-dom';
import {
  Users,
  ClipboardList,
  Star,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

export function MentorDashboard() {
  return (
    <div className="container-fluid p-0 space-y-4 space-y-md-5 pb-5 animate-fade-in font-mono">
      {/* ── Mentor Hero Banner (#0A2540) ────────────────────────────────────── */}
      <div className="bg-[#0A2540] border border-[#1E3A5F] p-4 p-sm-5 p-md-6 rounded-xs text-white shadow-xs space-y-4">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-4">
          <div className="space-y-1.5">
            <div className="d-inline-flex align-items-center gap-2 px-2.5 py-1 bg-[#2563EB] text-white text-[11px] font-bold uppercase rounded-xs">
              <GraduationCap className="w-3.5 h-3.5 text-[#F97316]" />
              <span>DEPARTMENT FACULTY ADVISOR // CSE DEPARTMENT</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tight font-sans m-0">
              Faculty Mentorship Console
            </h1>
            <p className="text-xs text-slate-300 font-mono max-w-xl m-0">
              Track student weekly activity logbooks, monitor approved hours, and submit milestone evaluations.
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2 gap-sm-3">
            <Link
              to="/mentor/logbooks"
              className="btn-primary text-xs d-flex align-items-center gap-1.5"
            >
              <ClipboardList className="w-4 h-4" /> REVIEW LOGBOOKS
            </Link>
            <Link
              to="/mentor/evaluations"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono text-xs font-bold rounded-xs transition-colors uppercase text-nowrap"
            >
              SUBMIT EVALUATIONS
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metric Cards (Bootstrap row g-0) ────────────────────────────────── */}
      <div className="row g-0 border border-[#E2E8F0] bg-white rounded-xs overflow-hidden">
        <div className="col-12 col-md-4 p-4 border-end-md border-bottom border-bottom-md-0 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">ASSIGNED_MENTEES</span>
            <Users className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-2xl font-black text-[#0A2540] font-mono m-0">12 Students</p>
          <span className="text-[10px] text-emerald-700 font-bold block">100% Active in Industry</span>
        </div>

        <div className="col-12 col-md-4 p-4 border-end-md border-bottom border-bottom-md-0 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">APPROVED_LOGBOOKS</span>
            <BookOpen className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-2xl font-bold text-[#2563EB] font-mono m-0">24 Entries</p>
          <span className="text-[10px] text-[#2563EB] font-bold block">Average Rating: 4.9 ★</span>
        </div>

        <div className="col-12 col-md-4 p-4 space-y-2">
          <div className="d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span className="font-bold">EVALUATIONS_SUBMITTED</span>
            <Star className="w-4 h-4 text-[#F97316]" />
          </div>
          <p className="text-2xl font-bold text-[#F97316] font-mono m-0">8 Final Reports</p>
          <span className="text-[10px] text-slate-500 font-bold block">100% PPO Recommended</span>
        </div>
      </div>

      {/* ── Mentees Table ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xs border border-[#E2E8F0] shadow-xs p-4 p-sm-5 space-y-4">
        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 pb-3 border-bottom border-[#E2E8F0]">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#0A2540] uppercase font-sans m-0">Student Progress &amp; Mentee Overview</h3>
            <p className="text-xs text-slate-600 font-mono m-0">Live progress tracking of your assigned batch</p>
          </div>
          <Link to="/mentor/logbooks" className="btn-secondary text-xs d-flex align-items-center gap-1">
            OPEN REVIEW QUEUE <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-100 text-start text-xs font-mono">
            <thead className="bg-[#F8FAFC] border-bottom border-[#E2E8F0] text-slate-600 font-bold uppercase">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Host Company</th>
                <th className="px-4 py-3">Hours Logged</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-bold text-[#0A2540] text-sm m-0">Assigned Student Candidate</p>
                  <p className="text-[11px] text-slate-500 font-mono m-0">REG-2026-001 · CSE</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-bold text-slate-800 m-0">Accredited Host Partner</p>
                  <p className="text-[11px] text-slate-500 m-0">Cloud Engineering &amp; Distributed Systems</p>
                </td>
                <td className="px-4 py-3 font-mono font-bold text-[#0A2540]">
                  160 / 240 hrs
                </td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xs text-[11px] font-bold d-inline-flex align-items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Up to date
                  </span>
                </td>
                <td className="px-4 py-3 text-end space-x-2">
                  <Link to="/mentor/logbooks" className="btn-secondary text-xs px-2.5 py-1">
                    Logbooks
                  </Link>
                  <Link to="/mentor/evaluations" className="btn-primary text-xs px-2.5 py-1">
                    Evaluate
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
