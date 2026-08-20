// Standalone Mock Dataset for Zero-Setup UI Demonstration
// Allows full interactive exploration of all 6 roles without running Docker or backend

export const MOCK_USERS: Record<string, any> = {
  'student@vilp.edu': {
    user: { id: '11111111-1111-1111-1111-111111111111', email: 'student@vilp.edu', role: 'STUDENT', emailVerified: true },
    accessToken: 'mock_jwt_access_student',
    refreshToken: 'mock_jwt_refresh_student',
  },
  'recruiter@google.com': {
    user: { id: '22222222-2222-2222-2222-222222222222', email: 'recruiter@google.com', role: 'COMPANY', emailVerified: true },
    accessToken: 'mock_jwt_access_company',
    refreshToken: 'mock_jwt_refresh_company',
  },
  'mentor@vilp.edu': {
    user: { id: '33333333-3333-3333-3333-333333333333', email: 'mentor@vilp.edu', role: 'MENTOR', emailVerified: true },
    accessToken: 'mock_jwt_access_mentor',
    refreshToken: 'mock_jwt_refresh_mentor',
  },
  'tnp.officer@vilp.edu': {
    user: { id: '44444444-4444-4444-4444-444444444444', email: 'tnp.officer@vilp.edu', role: 'TNP_OFFICER', emailVerified: true },
    accessToken: 'mock_jwt_access_tnp_officer',
    refreshToken: 'mock_jwt_refresh_tnp_officer',
  },
  'tnp.head@vilp.edu': {
    user: { id: '55555555-5555-5555-5555-555555555555', email: 'tnp.head@vilp.edu', role: 'TNP_HEAD', emailVerified: true },
    accessToken: 'mock_jwt_access_tnp_head',
    refreshToken: 'mock_jwt_refresh_tnp_head',
  },
  'admin@vilp.edu': {
    user: { id: '66666666-6666-6666-6666-666666666666', email: 'admin@vilp.edu', role: 'SUPER_ADMIN', emailVerified: true },
    accessToken: 'mock_jwt_access_admin',
    refreshToken: 'mock_jwt_refresh_admin',
  },
};

const BASE_STUDENT_PROFILE = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  studentNumber: 'REG-2026-001',
  fullName: 'Verified Candidate',
  email: 'student@vilp.edu',
  department: { id: 1, name: 'Computer Science & Engineering', code: 'CSE' },
  branch: 'Computer Science',
  semester: 6,
  cgpa: 8.85,
  backlogs: 0,
  passingYear: 2026,
  phone: '+91 98765 43210',
  linkedinUrl: 'https://linkedin.com/in/candidate',
  portfolioUrl: 'https://github.com/candidate',
  about: 'Passionate software engineering undergraduate with solid foundations in Spring Boot, React, and distributed cloud systems.',
  verificationStatus: 'VERIFIED',
  profileCompletion: 95,
  skills: [
    { id: 1, name: 'Java' },
    { id: 2, name: 'Spring Boot' },
    { id: 3, name: 'React' },
    { id: 4, name: 'TypeScript' },
    { id: 5, name: 'PostgreSQL' },
  ],
  createdAt: '2026-01-10T10:00:00Z',
};

export const MOCK_STUDENT_PROFILE = new Proxy(BASE_STUDENT_PROFILE, {
  get(target: any, prop: string) {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('vilp_student_profile');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed[prop] !== undefined) return parsed[prop];
        }
        const authRaw = localStorage.getItem('vilp-auth');
        if (authRaw) {
          const parsedAuth = JSON.parse(authRaw);
          const user = parsedAuth?.state?.user;
          if (prop === 'fullName' && user?.fullName) return user.fullName;
          if (prop === 'email' && user?.email) return user.email;
        }
      }
    } catch {}
    return target[prop];
  },
});

export const MOCK_COMPANY_PROFILE = {
  id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  name: 'Google Cloud India',
  description: 'Global enterprise cloud infrastructure, search, AI, and developer ecosystem.',
  website: 'https://cloud.google.com',
  industry: 'Information Technology',
  size: '10,000+',
  headquarters: 'Bangalore, Karnataka, India',
  contactEmail: 'recruiter@google.com',
  contactPersonName: 'Vikram Mehta',
  verificationStatus: 'VERIFIED',
  verificationDate: '2026-01-15T12:00:00Z',
  createdAt: '2026-01-05T08:30:00Z',
};

export const MOCK_INTERNSHIPS = [
  {
    id: 'int-001',
    uniqueId: 'INT-2026-001',
    company: { id: 'comp-1', name: 'Google Cloud India', industry: 'Information Technology' },
    title: 'Cloud Engineering & Microservices Intern',
    description: 'Build enterprise-grade distributed microservices using Spring Boot, Docker, and PostgreSQL.',
    location: 'Bangalore / Hybrid',
    mode: 'HYBRID',
    duration: 6,
    startDate: '2026-06-01',
    endDate: '2026-11-30',
    stipend: 65000,
    vacancies: 8,
    applicationDeadline: '2026-09-30',
    status: 'APPLICATION_OPEN',
    verificationStatus: 'VERIFIED',
    requiredSkills: [{ id: 1, name: 'Java' }, { id: 2, name: 'Spring Boot' }, { id: 5, name: 'PostgreSQL' }],
    requirement: { minimumCgpa: 8.0, maximumBacklogs: 0, department: 'CSE', branch: 'Computer Science', passingYear: 2026 },
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'int-002',
    uniqueId: 'INT-2026-002',
    company: { id: 'comp-2', name: 'Microsoft R&D', industry: 'Software' },
    title: 'Fullstack Web Platform Developer',
    description: 'Develop responsive single-page web applications with React, TypeScript, and Tailwind CSS.',
    location: 'Hyderabad / Remote',
    mode: 'REMOTE',
    duration: 6,
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    stipend: 55000,
    vacancies: 5,
    applicationDeadline: '2026-10-15',
    status: 'APPLICATION_OPEN',
    verificationStatus: 'VERIFIED',
    requiredSkills: [{ id: 3, name: 'React' }, { id: 4, name: 'TypeScript' }],
    requirement: { minimumCgpa: 7.5, maximumBacklogs: 0, passingYear: 2026 },
    createdAt: '2026-02-10T14:00:00Z',
  },
];

export const MOCK_APPLICATIONS = [
  {
    id: 'app-001',
    internshipId: 'int-001',
    internshipTitle: 'Cloud Engineering & Microservices Intern',
    companyName: 'Google Cloud India',
    studentId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    studentName: 'Aarav Sharma',
    status: 'SELECTED',
    coverLetter: 'Strong experience building REST microservices and fullstack platforms.',
    appliedAt: '2026-02-15T09:30:00Z',
    updatedAt: '2026-02-18T16:00:00Z',
  },
];

export const MOCK_OFFERS = [
  {
    id: 'off-001',
    applicationId: 'app-001',
    internshipId: 'int-001',
    internshipTitle: 'Cloud Engineering & Microservices Intern',
    companyId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    companyName: 'Google Cloud India',
    studentId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    studentName: 'Aarav Sharma',
    stipend: 65000,
    startDate: '2026-06-01',
    endDate: '2026-11-30',
    status: 'ACCEPTED',
    termsAndConditions: 'Standard non-disclosure, 40 hours weekly, hybrid onsite presence.',
    createdAt: '2026-02-20T11:00:00Z',
  },
];

export const MOCK_NOC = {
  id: 'noc-001',
  offerId: 'off-001',
  studentId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  studentName: 'Aarav Sharma',
  studentNumber: '2022CS1045',
  departmentName: 'Computer Science & Engineering',
  internshipId: 'int-001',
  internshipTitle: 'Cloud Engineering & Microservices Intern',
  companyName: 'Google Cloud India',
  status: 'APPROVED',
  requestedAt: '2026-02-20T11:30:00Z',
  approvedBy: 'T&P Head Office',
  approvedAt: '2026-02-21T09:00:00Z',
  verificationCode: 'NOC-2026-004821',
};

export const MOCK_LOGBOOKS = [
  {
    id: 'log-001',
    studentId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    studentName: 'Aarav Sharma',
    studentNumber: '2022CS1045',
    internshipId: 'int-001',
    internshipTitle: 'Cloud Engineering & Microservices Intern',
    weekNumber: 1,
    startDate: '2026-06-01',
    endDate: '2026-06-07',
    hoursWorked: 40,
    tasksSummary: 'Configured local development workspace, initialized Spring Boot service scaffolding, and created REST endpoints.',
    skillsApplied: 'Spring Boot, Java 21, Docker',
    challengesFaced: 'Configured CORS security headers to allow cross-origin requests from Vite dev server.',
    learnings: 'Deep understanding of Spring Security filter chains.',
    status: 'APPROVED',
    mentorFeedback: 'Excellent initiative on setting up the architecture cleanly.',
    rating: 5,
    createdAt: '2026-06-07T18:00:00Z',
  },
  {
    id: 'log-002',
    studentId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    studentName: 'Aarav Sharma',
    studentNumber: '2022CS1045',
    internshipId: 'int-001',
    internshipTitle: 'Cloud Engineering & Microservices Intern',
    weekNumber: 2,
    startDate: '2026-06-08',
    endDate: '2026-06-14',
    hoursWorked: 40,
    tasksSummary: 'Implemented deterministic 8-rule eligibility evaluation engine and integrated Flyway migrations.',
    skillsApplied: 'PostgreSQL, JPA, Flyway',
    challengesFaced: 'Optimized complex query indexes to avoid table scans.',
    learnings: 'Database schema migration best practices.',
    status: 'APPROVED',
    mentorFeedback: 'High quality code with zero linter errors.',
    rating: 5,
    createdAt: '2026-06-14T18:00:00Z',
  },
];

export const MOCK_CERTIFICATE = {
  id: 'cert-001',
  studentId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  studentName: 'Aarav Sharma',
  studentNumber: '2022CS1045',
  departmentName: 'Computer Science & Engineering',
  internshipId: 'int-001',
  internshipTitle: 'Cloud Engineering & Microservices Intern',
  companyId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  companyName: 'Google Cloud India',
  certificateNumber: 'CERT-2026-004821',
  issueDate: '2026-08-15',
  grade: 'A+',
  totalHoursCompleted: 240,
  status: 'ISSUED',
  verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  createdAt: '2026-08-15T10:00:00Z',
};

export const MOCK_PPO = {
  id: 'ppo-001',
  studentId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  studentName: 'Aarav Sharma',
  studentNumber: '2022CS1045',
  departmentName: 'Computer Science & Engineering',
  companyId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  companyName: 'Google Cloud India',
  internshipId: 'int-001',
  internshipTitle: 'Cloud Engineering & Microservices Intern',
  designation: 'Associate Cloud Engineer (Full-Time)',
  ctcAnnual: 1450000,
  joiningDate: '2026-07-01',
  location: 'Bangalore, India',
  status: 'OFFERED',
  terms: 'Includes standard health benefits, annual performance bonus, and stock options.',
  createdAt: '2026-08-16T12:00:00Z',
};

export const MOCK_ANALYTICS = {
  totalStudents: 1240,
  verifiedStudents: 1180,
  totalCompanies: 85,
  verifiedCompanies: 78,
  totalInternships: 164,
  totalApplications: 3420,
  totalOffers: 840,
  totalCompletedCertificates: 620,
  totalPpos: 245,
  averageCtcLpa: 9.85,
  ppoConversionRate: 29.2,
  departmentMetrics: [
    { departmentName: 'Computer Science & Engineering', departmentCode: 'CSE', studentCount: 420, activeInternshipsCount: 180, ppoCount: 110 },
    { departmentName: 'Information Technology', departmentCode: 'IT', studentCount: 310, activeInternshipsCount: 135, ppoCount: 75 },
    { departmentName: 'Electronics & Communication', departmentCode: 'ECE', studentCount: 280, activeInternshipsCount: 95, ppoCount: 40 },
    { departmentName: 'Mechanical Engineering', departmentCode: 'MECH', studentCount: 230, activeInternshipsCount: 65, ppoCount: 20 },
  ],
};
