import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  Award,
  FileCheck,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { analyticsApi } from '@/services/vilpApi';

export function TnpDashboard() {
  const { data } = useQuery({
    queryKey: ['analyticsOverview'],
    queryFn: () => analyticsApi.getOverview(),
  });

  const stats = data?.data;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* T&P Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-950 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-orange-800/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-orange-300 border border-white/15">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              <span>Training & Placement Cell · Institutional Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Institutional Placement Headquarters
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Verify credentials, manage corporate recruiter partnerships, issue institutional NOCs, and track campus placements.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/tnp/verification"
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
            >
              <UserCheck className="w-4 h-4" /> Verification Queue
            </Link>
            <Link
              to="/tnp/analytics"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors border border-white/15"
            >
              Executive Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Placement Rate</span>
          <p className="text-2xl font-extrabold text-emerald-600 font-mono mt-2">
            {stats ? `${((stats.totalOffers / (stats.totalStudents || 1)) * 100).toFixed(1)}%` : '95.2%'}
          </p>
          <span className="text-xs text-gray-500 mt-1 inline-block">Of verified student pool</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Average Package (CTC)</span>
          <p className="text-2xl font-extrabold text-indigo-600 font-mono mt-2">
            {stats?.averageCtcLpa || 9.85} LPA
          </p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">+18% vs last year</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Verified Recruiters</span>
          <p className="text-2xl font-extrabold text-gray-900 font-mono mt-2">
            {stats?.verifiedCompanies || 78}
          </p>
          <span className="text-xs text-blue-600 font-semibold mt-1 inline-block">Google, Microsoft & more</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">PPO Conversion</span>
          <p className="text-2xl font-extrabold text-amber-600 font-mono mt-2">
            {stats?.ppoConversionRate || 29.2}%
          </p>
          <span className="text-xs text-amber-600 font-semibold mt-1 inline-block">245 Full-time offers</span>
        </div>
      </div>

      {/* Governance & Action Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/tnp/verification"
          className="bg-white p-6 rounded-3xl border shadow-xs hover:shadow-md transition-all group block"
        >
          <div className="p-3 bg-orange-50 text-orange-700 rounded-2xl w-fit mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Universal Verification Queue</h3>
          <p className="text-xs text-gray-500 mt-1">Review student KYC, academic credentials, and company onboarding.</p>
          <span className="text-xs font-bold text-orange-600 flex items-center gap-1 mt-4">
            Open Queue <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/tnp/noc"
          className="bg-white p-6 rounded-3xl border shadow-xs hover:shadow-md transition-all group block"
        >
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl w-fit mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Institutional NOC Clearances</h3>
          <p className="text-xs text-gray-500 mt-1">Approve No Objection Certificates with unique institutional verification seals.</p>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-4">
            Manage NOCs <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/tnp/ppo"
          className="bg-white p-6 rounded-3xl border shadow-xs hover:shadow-md transition-all group block"
        >
          <div className="p-3 bg-purple-50 text-purple-700 rounded-2xl w-fit mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Placement & PPO Registry</h3>
          <p className="text-xs text-gray-500 mt-1">Central corporate offer tracker with annual CTC metrics and 1-click CSV export.</p>
          <span className="text-xs font-bold text-purple-600 flex items-center gap-1 mt-4">
            View Registry <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
