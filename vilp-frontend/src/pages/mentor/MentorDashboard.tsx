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
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Mentor Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-violet-800/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-violet-300 border border-white/15">
              <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
              <span>Department Faculty Advisor · CSE Department</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Faculty Mentorship Console
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Track student weekly activity logbooks, monitor approved hours, and submit milestone evaluations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/mentor/logbooks"
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
            >
              <ClipboardList className="w-4 h-4" /> Review Logbooks
            </Link>
            <Link
              to="/mentor/evaluations"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors border border-white/15"
            >
              Submit Evaluations
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Mentees</span>
            <div className="p-2.5 bg-violet-50 text-violet-700 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 font-mono mt-3">12 Students</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">100% Active in Industry</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Approved Logbooks</span>
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 font-mono mt-3">24 Entries</p>
          <span className="text-xs text-blue-600 font-semibold mt-1 inline-block">Average Rating: 4.9 ★</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Evaluations Submitted</span>
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 font-mono mt-3">8 Final Reports</p>
          <span className="text-xs text-amber-600 font-semibold mt-1 inline-block">100% PPO Recommended</span>
        </div>
      </div>

      {/* Mentees Table */}
      <div className="bg-white rounded-3xl border shadow-xs p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Student Progress & Mentee Overview</h3>
            <p className="text-xs text-gray-500">Live progress tracking of your assigned batch</p>
          </div>
          <Link to="/mentor/logbooks" className="btn-secondary text-xs flex items-center gap-1">
            Open Review Queue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b text-gray-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Host Company</th>
                <th className="px-6 py-4">Hours Logged</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900 text-sm">Assigned Student Candidate</p>
                  <p className="text-[11px] text-gray-500 font-mono">REG-2026-001 · CSE</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-800">Accredited Host Partner</p>
                  <p className="text-[11px] text-gray-400">Cloud Engineering & Distributed Systems</p>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-gray-900">
                  160 / 240 hrs
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Up to date
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
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
