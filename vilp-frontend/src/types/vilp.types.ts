export interface Department {
  id: number;
  name: string;
  code: string;
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
}

export interface StudentProfile {
  id: string;
  studentNumber: string;
  fullName: string;
  email: string;
  department?: Department | null;
  branch?: string;
  semester?: number;
  cgpa?: number;
  backlogs: number;
  passingYear?: number;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  about?: string;
  verificationStatus: 'REGISTERED' | 'DOCUMENT_SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
  profileCompletion: number;
  skills: Skill[];
  createdAt: string;
}

export interface CreateStudentProfileInput {
  studentNumber: string;
  fullName: string;
  departmentId?: number;
  branch?: string;
  semester?: number;
  cgpa?: number;
  backlogs?: number;
  passingYear?: number;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  about?: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  headquarters?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPersonName?: string;
  verificationStatus: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  verificationDate?: string;
  createdAt: string;
}

export interface CreateCompanyInput {
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  headquarters?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPersonName?: string;
}

export interface InternshipRequirement {
  minimumCgpa?: number;
  maximumBacklogs?: number;
  department?: string;
  branch?: string;
  passingYear?: number;
}

export interface Internship {
  id: string;
  uniqueId: string;
  company: {
    id: string;
    name: string;
    industry?: string;
  };
  title: string;
  description: string;
  location?: string;
  mode: 'REMOTE' | 'ONSITE' | 'HYBRID';
  duration?: number;
  startDate?: string;
  endDate?: string;
  stipend?: number;
  vacancies: number;
  applicationDeadline?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'APPLICATION_OPEN' | 'APPLICATION_CLOSED' | 'SELECTION' | 'VERIFIED' | 'COMPLETED';
  verificationStatus: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
  requiredSkills: Skill[];
  requirement?: InternshipRequirement;
  createdAt: string;
}

export interface CreateInternshipInput {
  title: string;
  description: string;
  location?: string;
  mode: string;
  duration?: number;
  startDate?: string;
  endDate?: string;
  stipend?: number;
  vacancies?: number;
  applicationDeadline?: string;
  minimumCgpa?: number;
  maximumBacklogs?: number;
  department?: string;
  branch?: string;
  passingYear?: number;
}

export interface Application {
  id: string;
  internshipId: string;
  internshipTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED' | 'WITHDRAWN';
  coverLetter?: string;
  appliedAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

export interface DocumentItem {
  id: string;
  entityType: string;
  entityId: string;
  documentType: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  status: 'UPLOADED' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  verificationReason?: string;
  uploadedBy: string;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationItem {
  id: string;
  entityType: 'STUDENT' | 'COMPANY' | 'INTERNSHIP' | 'DOCUMENT' | 'OFFER' | 'CERTIFICATE';
  entityId: string;
  verificationType: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  submittedBy?: string;
  submittedByEmail?: string;
  verifiedBy?: string;
  verificationNotes?: string;
  rejectionReason?: string;
  submittedAt: string;
  verifiedAt?: string;
}

export interface RuleEvaluation {
  rule: string;
  passed: boolean;
  message: string;
}

export interface EligibilityCheckResponse {
  internshipId: string;
  studentId: string;
  eligible: boolean;
  score: number;
  evaluations: RuleEvaluation[];
  matchedSkills: string[];
  missingSkills: string[];
}

export interface Offer {
  id: string;
  applicationId: string;
  internshipId: string;
  internshipTitle: string;
  companyId: string;
  companyName: string;
  studentId: string;
  studentName: string;
  stipend?: number;
  startDate: string;
  endDate: string;
  status: 'OFFERED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'REVOKED';
  termsAndConditions?: string;
  expiryDate?: string;
  responseDate?: string;
  responseNotes?: string;
  offerLetterDocId?: string;
  createdAt: string;
}

export interface CreateOfferInput {
  applicationId: string;
  stipend?: number;
  startDate: string;
  endDate: string;
  termsAndConditions?: string;
  expiryDate?: string;
}

export interface NocRequestItem {
  id: string;
  offerId: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  departmentName?: string;
  internshipId: string;
  internshipTitle: string;
  companyName: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  verificationCode: string;
  nocDocumentId?: string;
}

export interface WeeklyReport {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  internshipId: string;
  internshipTitle: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  hoursWorked: number;
  tasksSummary: string;
  skillsApplied?: string;
  challengesFaced?: string;
  learnings?: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REVISIONS_REQUESTED' | 'REJECTED';
  mentorFeedback?: string;
  rating?: number;
  reviewedAt?: string;
  createdAt: string;
}

export interface SubmitWeeklyReportInput {
  internshipId: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  hoursWorked: number;
  tasksSummary: string;
  skillsApplied?: string;
  challengesFaced?: string;
  learnings?: string;
}

export interface EvaluationItem {
  id: string;
  internshipId: string;
  internshipTitle: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  evaluatorId: string;
  evaluatorType: 'MENTOR' | 'COMPANY';
  evaluationType: 'MIDTERM' | 'FINAL';
  technicalSkillsRating: number;
  communicationRating: number;
  punctualityRating: number;
  initiativeRating: number;
  overallPerformanceRating: number;
  remarks?: string;
  ppoRecommended: boolean;
  ppoTerms?: string;
  status: string;
  createdAt: string;
}

export interface SubmitEvaluationInput {
  internshipId: string;
  studentId: string;
  evaluatorType: 'MENTOR' | 'COMPANY';
  evaluationType: 'MIDTERM' | 'FINAL';
  technicalSkillsRating: number;
  communicationRating: number;
  punctualityRating: number;
  initiativeRating: number;
  overallPerformanceRating: number;
  remarks?: string;
  ppoRecommended?: boolean;
  ppoTerms?: string;
}

export interface InternshipRecommendation {
  internshipId: string;
  uniqueId: string;
  title: string;
  companyName: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchReasons: string[];
  learningPathAdvice: string;
}

export interface ResumeScoreResponse {
  overallScore: number;
  technicalFitScore: number;
  formattingScore: number;
  completenessScore: number;
  strengths: string[];
  improvementAreas: string[];
  recommendedKeywords: string[];
}

export interface LearningRecommendation {
  skillName: string;
  suggestedTopics: string;
  estimatedTimeToLearn: string;
  recommendedProjectType: string;
}

export interface SkillGapResponse {
  internshipId: string;
  totalRequiredSkills: number;
  matchedCount: number;
  gapCount: number;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  learningRoadmap: LearningRecommendation[];
}

export interface CertificateItem {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  departmentName?: string;
  internshipId: string;
  internshipTitle: string;
  companyId: string;
  companyName: string;
  certificateNumber: string;
  issueDate: string;
  grade: string;
  totalHoursCompleted: number;
  status: string;
  verificationHash: string;
  documentId?: string;
  createdAt: string;
}

export interface PpoItem {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  departmentName?: string;
  companyId: string;
  companyName: string;
  internshipId: string;
  internshipTitle: string;
  designation: string;
  ctcAnnual: number;
  joiningDate?: string;
  location?: string;
  status: 'OFFERED' | 'ACCEPTED' | 'DECLINED' | 'JOINED';
  terms?: string;
  acceptedAt?: string;
  createdAt: string;
}

export interface CreatePpoInput {
  studentId: string;
  internshipId: string;
  designation: string;
  ctcAnnual: number;
  joiningDate?: string;
  location?: string;
  terms?: string;
}

export interface DepartmentMetric {
  departmentName: string;
  departmentCode: string;
  studentCount: number;
  activeInternshipsCount: number;
  ppoCount: number;
}

export interface InstitutionalOverview {
  totalStudents: number;
  verifiedStudents: number;
  totalCompanies: number;
  verifiedCompanies: number;
  totalInternships: number;
  totalApplications: number;
  totalOffers: number;
  totalCompletedCertificates: number;
  totalPpos: number;
  averageCtcLpa: number;
  ppoConversionRate: number;
  departmentMetrics: DepartmentMetric[];
}

export interface AuditLogItem {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  ipAddress?: string;
  details?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ACTION_REQUIRED' | 'OFFER' | 'LOGBOOK' | 'SYSTEM';
  isRead: boolean;
  targetUrl?: string;
  createdAt: string;
}

export interface AdminUserSummary {
  id: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
  roles: string[];
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
