import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { companyApi, internshipApi, applicationApi } from '@/services/vilpApi';

export function CompanyDashboard() {
  const { data: profileData } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: () => companyApi.getMyProfile(),
  });

  const { data: internshipsData } = useQuery({
    queryKey: ['myInternships'],
    queryFn: () => internshipApi.listMine(),
  });

  const { data: applicantsData } = useQuery({
    queryKey: ['companyApplicants'],
    queryFn: () => applicationApi.listForInternship('int-001'),
  });

  const company = profileData?.data;
  const internships = internshipsData?.data?.content || [];
  const applicants = applicantsData?.data?.content || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Recruiter Header Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-300 border border-white/15">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Accredited Corporate Partner · {company?.industry || 'Information Technology'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {company?.name || 'Enterprise Partner Portal'}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              {company?.headquarters || 'Bangalore, Karnataka, India'} · Enterprise Size: {company?.size || '10,000+'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/company/internships"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Post New Internship
            </Link>
            <Link
              to="/company/profile"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors border border-white/15"
            >
              Company Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Recruiter KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Postings</span>
          <p className="text-2xl font-extrabold text-gray-900 font-mono mt-2">{internships.length || 2}</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">Accepting Applications</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Candidates</span>
          <p className="text-2xl font-extrabold text-gray-900 font-mono mt-2">{applicants.length || 1}</p>
          <span className="text-xs text-blue-600 font-semibold mt-1 inline-block">1 Selected for Offer</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Offers Extended</span>
          <p className="text-2xl font-extrabold text-gray-900 font-mono mt-2">1</p>
          <span className="text-xs text-purple-600 font-semibold mt-1 inline-block">NOC Approved</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pre-Placement Offers (PPO)</span>
          <p className="text-2xl font-extrabold text-gray-900 font-mono mt-2">1</p>
          <span className="text-xs text-amber-600 font-semibold mt-1 inline-block">CTC: 14.5 LPA</span>
        </div>
      </div>

      {/* Talent Pipeline Section */}
      <div className="bg-white rounded-3xl border shadow-xs p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Active Talent Pipeline</h3>
            <p className="text-xs text-gray-500">Candidates applying for your open roles</p>
          </div>
          <Link to="/company/applicants" className="btn-secondary text-xs flex items-center gap-1">
            View All Pipeline <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b text-gray-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Role Applied</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900 text-sm">Verified Candidate</p>
                  <p className="text-[11px] text-gray-500 font-mono">REG-2026-001 · CSE (CGPA 8.85)</p>
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  Cloud Engineering & Microservices Intern
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                    SELECTED (Offer Extended)
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    to="/company/applicants"
                    className="btn-primary text-xs px-3 py-1.5 inline-flex items-center gap-1"
                  >
                    Manage Offer <ArrowRight className="w-3.5 h-3.5" />
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
