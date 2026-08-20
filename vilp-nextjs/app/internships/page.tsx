import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { MapPin, DollarSign, Clock, Building, CheckCircle2, ArrowRight } from 'lucide-react';

export const revalidate = 0; // Fresh live data on each request

export default async function InternshipsPage() {
  const supabase = createClient();

  // Fetch opportunities with joined company data directly from Supabase
  const { data: internships, error } = await supabase
    .from('internships')
    .select(`
      id,
      unique_id,
      title,
      description,
      location,
      mode,
      duration,
      stipend,
      application_deadline,
      companies (
        name,
        industry,
        website
      ),
      internship_requirements (
        minimum_cgpa,
        maximum_backlogs,
        department
      ),
      internship_skills (
        skills (
          name
        )
      )
    `)
    .eq('status', 'PUBLISHED');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0D3E8]">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#723ECF] bg-[#FEF8E7] px-2 py-0.5 border border-[#EADBBE] rounded-sm uppercase tracking-wider">
            React Server Component (RSC)
          </span>
          <h1 className="text-2xl font-bold font-display text-[#171024] mt-1">
            Verified Internship Catalog
          </h1>
          <p className="text-xs text-[#5D4A75]">
            Queried live from Supabase PostgreSQL database with deterministic eligibility filters.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-[#059669] font-bold">
            ● {internships?.length || 0} ACTIVE ROLES FOUND
          </span>
        </div>
      </div>

      {/* Opportunities Feed */}
      {error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-sm">
          Failed to query Supabase: {error.message}
        </div>
      ) : !internships || internships.length === 0 ? (
        <div className="p-8 bg-white border border-[#E0D3E8] text-center text-xs text-[#5D4A75] rounded-sm">
          No published opportunities found in Supabase database.
        </div>
      ) : (
        <div className="space-y-4">
          {internships.map((item: any) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-sm border border-[#E0D3E8] hover:border-[#723ECF] transition-all space-y-4 shadow-sm"
            >
              {/* Header Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#723ECF]">
                    {item.companies?.name || 'Partner Enterprise'}
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-[10px] font-mono text-zinc-500">{item.unique_id}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#FEF8E7] text-[#171024] border border-[#EADBBE] rounded-sm">
                  {item.mode}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-lg font-bold font-display text-[#171024]">{item.title}</h2>
                <p className="text-xs text-[#5D4A75] mt-1 line-clamp-2">{item.description}</p>
              </div>

              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 font-medium">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{item.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-[#ED4B86]">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>₹{Number(item.stipend).toLocaleString()} / month</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{item.duration} Weeks</span>
                </div>
              </div>

              {/* Required Skills */}
              {item.internship_skills && item.internship_skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.internship_skills.map((s: any, idx: number) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-[#F4EEF7] text-[#171024] px-2 py-0.5 rounded-sm border border-[#E0D3E8]"
                    >
                      {s.skills?.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
