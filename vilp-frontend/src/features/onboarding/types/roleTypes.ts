export type UserRoleType =
  | 'STUDENT'
  | 'FACULTY_MENTOR'
  | 'TNP_OFFICER'
  | 'DEPT_COORDINATOR'
  | 'HOD'
  | 'COLLEGE_ADMIN'
  | 'COMPANY_RECRUITER'
  | 'EXTERNAL_EVALUATOR'
  | 'SUPER_ADMIN';

export interface RoleMetadata {
  id: UserRoleType;
  title: string;
  category: 'STUDENT' | 'FACULTY' | 'ADMIN' | 'CORPORATE' | 'EVALUATOR';
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
    title: 'Faculty Mentor / Guide',
    category: 'FACULTY',
    tagline: 'Academic supervisor overseeing student internship contact hours',
    description: 'Audit weekly student logbooks, submit 5-dimension competency evaluation rubrics, detect academic risks, and endorse Pre-Placement Offers (PPO).',
    verificationRequirements: ['Institutional Email (@*.edu.in)', 'Faculty Employee ID', 'Departmental Dean Approval'],
    defaultTrustLevel: 'Level 2: Institutional',
    targetDashboard: '/mentor/dashboard',
    aiCapabilities: ['Student Dropout & Delay Risk Radar', 'Weekly Logbook Velocity Analytics', 'Automated Rubric Aggregation'],
    requiredFields: ['Full Name', 'Department', 'Designation', 'Employee ID', 'Years of Experience', 'Research Areas'],
  },
  {
    id: 'TNP_OFFICER',
    title: 'T&P Officer / TPO',
    category: 'ADMIN',
    tagline: 'Training and Placement Cell executive managing campus recruitment',
    description: 'Schedule campus placement drives, verify student eligibility batches, approve AICTE NOC requests, and manage corporate recruiter partnerships.',
    verificationRequirements: ['Institutional Domain Email', 'Official T&P ID', 'Admin Clearance'],
    defaultTrustLevel: 'Level 3: Fully Verified',
    targetDashboard: '/tnp/dashboard',
    aiCapabilities: ['Campus Placement Prediction Engine', 'Recruiter-Student Match Scoring', 'Salary CTC Distribution Modeling'],
    requiredFields: ['Full Name', 'Designation', 'Official Contact', 'Placement Experience (Years)', 'Authorized Department Scope'],
  },
  {
    id: 'HOD',
    title: 'Head of Department (HOD)',
    category: 'FACULTY',
    tagline: 'Academic department leader overseeing faculty and batch outcomes',
    description: 'Review departmental placement health scores, monitor faculty mentor review velocities, and export AICTE/NAAC regulatory accreditation filings.',
    verificationRequirements: ['Institutional Dean Verification', 'Employee ID', 'College Principal Approval'],
    defaultTrustLevel: 'Level 3: Fully Verified',
    targetDashboard: '/tnp/dashboard',
    aiCapabilities: ['Departmental Placement Health Score', 'Batch Academic Risk Index', 'Curriculum Industry Alignment'],
    requiredFields: ['Full Name', 'Department', 'Highest Qualification', 'Employee ID', 'Tenure'],
  },
  {
    id: 'DEPT_COORDINATOR',
    title: 'Department Placement Coordinator',
    category: 'FACULTY',
    tagline: 'Faculty or senior representative coordinating branch-specific drives',
    description: 'Assist T&P cell in student document verifications, branch-specific internship attendance audits, and company drive logistics.',
    verificationRequirements: ['Institutional Email', 'HOD Endorsement', 'Faculty ID'],
    defaultTrustLevel: 'Level 2: Institutional',
    targetDashboard: '/tnp/dashboard',
    aiCapabilities: ['Batch Attendance & Hour Tracking', 'Student Verification Anomaly Detection'],
    requiredFields: ['Full Name', 'Assigned Branch', 'Designation', 'Faculty ID'],
  },
  {
    id: 'COLLEGE_ADMIN',
    title: 'College Administrator / Dean',
    category: 'ADMIN',
    tagline: 'Highest institutional authority managing campus policies and users',
    description: 'Provision college departments, govern faculty & student master rosters, configure platform policies, and generate 1-click NAAC/NBA compliance exports.',
    verificationRequirements: ['Institutional Domain Registry Clearance', 'Principal Signature Proof'],
    defaultTrustLevel: 'Level 3: Fully Verified',
    targetDashboard: '/admin/dashboard',
    aiCapabilities: ['Institutional Placement Trend Predictor', 'Accreditation Readiness Metric (NAAC/NBA)', 'Cross-Department Benchmark Radar'],
    requiredFields: ['Full Name', 'Admin Designation', 'Institutional Domain', 'Authorization Key'],
  },
  {
    id: 'COMPANY_RECRUITER',
    title: 'Corporate Recruiter / Partner',
    category: 'CORPORATE',
    tagline: 'Verified employer hiring talent for internships and PPOs',
    description: 'Post verified internship requisitions, filter candidates by automated ATS rank, schedule interview rounds, and issue 48-hour binding offers.',
    verificationRequirements: ['Corporate Domain Email (@company.com)', 'Company Website & CIN', 'LinkedIn Recruiter Verification'],
    defaultTrustLevel: 'Level 2: Institutional',
    targetDashboard: '/company/dashboard',
    aiCapabilities: ['Instant 0-100 Candidate ATS Matching', 'Skill Matrix Heatmap', 'Offer Acceptance Probability Estimator'],
    requiredFields: ['Full Name', 'Company Name', 'Corporate Email', 'Designation', 'Company Website', 'Headquarters Location'],
  },
  {
    id: 'EXTERNAL_EVALUATOR',
    title: 'External Industry Evaluator',
    category: 'EVALUATOR',
    tagline: 'Independent industry expert conducting viva and capstone scoring',
    description: 'Conduct blind viva evaluations for student internship capstones, submit standardized grading rubrics, and certify industry readiness.',
    verificationRequirements: ['Institutional Invitation Token', 'Corporate/Academic Credentials'],
    defaultTrustLevel: 'Level 2: Institutional',
    targetDashboard: '/mentor/dashboard',
    aiCapabilities: ['Automated Score Normalization', 'Rubric Consistency Auditor'],
    requiredFields: ['Full Name', 'Organization / Institute', 'Industry Domain', 'Years of Industry Practice'],
  },
  {
    id: 'SUPER_ADMIN',
    title: 'Super Administrator',
    category: 'ADMIN',
    tagline: 'Global platform security, governance, and cryptographic ledger monitor',
    description: 'Manage global user permissions, monitor system security and fraud risk scores, inspect database audit logs, and configure AI models.',
    verificationRequirements: ['Multi-Factor Security Token', 'Master Infrastructure Access'],
    defaultTrustLevel: 'Level 3: Fully Verified',
    targetDashboard: '/admin/dashboard',
    aiCapabilities: ['Platform Security & Anomaly Detector', 'Global Model Drift Monitor', 'System Audit Trail Analyzer'],
    requiredFields: ['Super Admin Key', 'Security Passcode'],
  },
];
