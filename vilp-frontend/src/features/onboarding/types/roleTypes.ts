export type UserRoleType =
  | 'STUDENT'
  | 'FACULTY_MENTOR'
  | 'TNP_OFFICER'
  | 'COMPANY_RECRUITER'
  | 'SUPER_ADMIN';

export interface RoleMetadata {
  id: UserRoleType;
  title: string;
  category: 'STUDENT' | 'FACULTY' | 'TNP' | 'COMPANY' | 'ADMIN';
  tagline: string;
  description: string;
  verificationRequirements: string[];
  defaultTrustLevel: 'Level 1: Basic' | 'Level 2: Institutional' | 'Level 3: Fully Verified';
  targetDashboard: string;
  aiCapabilities: string[];
  requiredFields: string[];
}

export const PLATFORM_ROLES: RoleMetadata[] = [
  {
    id: 'STUDENT',
    title: 'Student Candidate',
    category: 'STUDENT',
    tagline: 'Undergraduate / Postgraduate seeking accredited internships',
    description: 'Access AICTE-compliant opportunities, 240-hour degree accumulation meter, neural ATS resume scoring, and single-active offer locking.',
    verificationRequirements: ['Institutional Email OTP', 'Mobile Contact Number', 'University Roll Number', 'Student ID Card (Optional)'],
    defaultTrustLevel: 'Level 2: Institutional',
    targetDashboard: '/student/dashboard',
    aiCapabilities: ['ATS Resume Match Radar (91/100)', 'Skill Gap Accelerators', 'Placement Readiness Score', 'Personalized Learning Roadmap'],
    requiredFields: ['Full Name', 'Institutional Email', 'Mobile', 'College', 'Department', 'CGPA', 'Graduation Year'],
  },
  {
    id: 'FACULTY_MENTOR',
    title: 'Faculty Mentor',
    category: 'FACULTY',
    tagline: 'Academic supervisor overseeing student internship contact hours',
    description: 'Audit weekly student logbooks, submit 5-dimension competency evaluation rubrics, detect academic risks, and endorse Pre-Placement Offers (PPO).',
    verificationRequirements: ['Institutional Email (@*.edu.in)', 'Faculty Employee ID', 'Departmental Dean Approval'],
    defaultTrustLevel: 'Level 2: Institutional',
    targetDashboard: '/mentor/dashboard',
    aiCapabilities: ['Student Dropout & Delay Risk Radar', 'Weekly Logbook Velocity Analytics', 'Automated Rubric Aggregation'],
    requiredFields: ['Full Name', 'Department', 'Designation', 'Employee ID', 'Years of Experience'],
  },
  {
    id: 'TNP_OFFICER',
    title: 'Training & Placement (T&P)',
    category: 'TNP',
    tagline: 'Training and Placement Cell managing campus recruitment',
    description: 'Schedule campus placement drives, verify student eligibility batches, approve AICTE NOC requests, and manage corporate recruiter partnerships.',
    verificationRequirements: ['Institutional Domain Email', 'Official T&P ID', 'Admin Clearance'],
    defaultTrustLevel: 'Level 3: Fully Verified',
    targetDashboard: '/tnp/dashboard',
    aiCapabilities: ['Campus Placement Prediction Engine', 'Recruiter-Student Match Scoring', 'Salary CTC Distribution Modeling'],
    requiredFields: ['Full Name', 'Designation', 'Official Contact', 'Placement Experience (Years)'],
  },
  {
    id: 'COMPANY_RECRUITER',
    title: 'Company / Recruiter',
    category: 'COMPANY',
    tagline: 'Corporate enterprise recruiter hiring student talent',
    description: 'Post AICTE-compliant internship opportunities, review verified student applications, schedule interviews, and issue digital offer letters.',
    verificationRequirements: ['Corporate Domain Email', 'Company GSTIN/Registration', 'HR Authority Proof'],
    defaultTrustLevel: 'Level 3: Fully Verified',
    targetDashboard: '/company/dashboard',
    aiCapabilities: ['Candidate Ranking AI', 'Skill Fit Analyzer', 'Automated Offer Letter Generator'],
    requiredFields: ['Company Name', 'HR Email', 'Website', 'Industry', 'Headquarters'],
  },
  {
    id: 'SUPER_ADMIN',
    title: 'Institutional Admin',
    category: 'ADMIN',
    tagline: 'Highest institutional authority managing campus policies and users',
    description: 'Provision college departments, govern faculty & student master rosters, configure platform policies, and generate 1-click NAAC/NBA compliance exports.',
    verificationRequirements: ['Institutional Domain Registry Clearance', 'Principal Signature Proof'],
    defaultTrustLevel: 'Level 3: Fully Verified',
    targetDashboard: '/admin/dashboard',
    aiCapabilities: ['Institutional Placement Trend Predictor', 'Accreditation Readiness Metric (NAAC/NBA)', 'Cross-Department Benchmark Radar'],
    requiredFields: ['Full Name', 'Admin Designation', 'Institutional Domain', 'Authorization Key'],
  },
];
