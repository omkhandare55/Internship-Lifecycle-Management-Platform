import axiosInstance from './axiosInstance';
import type { ApiResponse } from '@/types/auth.types';
import type {
  Department,
  Skill,
  StudentProfile,
  CreateStudentProfileInput,
  CompanyProfile,
  CreateCompanyInput,
  Internship,
  CreateInternshipInput,
  Application,
  DocumentItem,
  VerificationItem,
  EligibilityCheckResponse,
  Offer,
  CreateOfferInput,
  NocRequestItem,
  WeeklyReport,
  SubmitWeeklyReportInput,
  EvaluationItem,
  SubmitEvaluationInput,
  InternshipRecommendation,
  ResumeScoreResponse,
  SkillGapResponse,
  CertificateItem,
  PpoItem,
  CreatePpoInput,
  InstitutionalOverview,
  AuditLogItem,
  NotificationItem,
  AdminUserSummary,
  PageResponse,
} from '@/types/vilp.types';

export const publicApi = {
  getDepartments: async (): Promise<ApiResponse<Department[]>> => {
    const res = await axiosInstance.get<ApiResponse<Department[]>>('/public/departments');
    return res.data;
  },
  getSkills: async (): Promise<ApiResponse<Skill[]>> => {
    const res = await axiosInstance.get<ApiResponse<Skill[]>>('/public/skills');
    return res.data;
  },
};

export const studentApi = {
  getMyProfile: async (): Promise<ApiResponse<StudentProfile>> => {
    const res = await axiosInstance.get<ApiResponse<StudentProfile>>('/students/me');
    return res.data;
  },
  createProfile: async (data: CreateStudentProfileInput): Promise<ApiResponse<StudentProfile>> => {
    const res = await axiosInstance.post<ApiResponse<StudentProfile>>('/students/me', data);
    return res.data;
  },
  updateProfile: async (data: Partial<CreateStudentProfileInput>): Promise<ApiResponse<StudentProfile>> => {
    const res = await axiosInstance.put<ApiResponse<StudentProfile>>('/students/me', data);
    return res.data;
  },
  addSkill: async (skillId: number): Promise<ApiResponse<StudentProfile>> => {
    const res = await axiosInstance.post<ApiResponse<StudentProfile>>(`/students/me/skills/${skillId}`);
    return res.data;
  },
  removeSkill: async (skillId: number): Promise<ApiResponse<StudentProfile>> => {
    const res = await axiosInstance.delete<ApiResponse<StudentProfile>>(`/students/me/skills/${skillId}`);
    return res.data;
  },
  listAll: async (page = 0, size = 20, status?: string, q?: string, department?: string): Promise<ApiResponse<PageResponse<StudentProfile>>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.append('status', status);
    if (q) params.append('q', q);
    if (department) params.append('department', department);
    const res = await axiosInstance.get<ApiResponse<PageResponse<StudentProfile>>>(`/students?${params.toString()}`);
    return res.data;
  },
};

export const companyApi = {
  getMyProfile: async (): Promise<ApiResponse<CompanyProfile>> => {
    const res = await axiosInstance.get<ApiResponse<CompanyProfile>>('/companies/me');
    return res.data;
  },
  createProfile: async (data: CreateCompanyInput): Promise<ApiResponse<CompanyProfile>> => {
    const res = await axiosInstance.post<ApiResponse<CompanyProfile>>('/companies', data);
    return res.data;
  },
  updateProfile: async (data: Partial<CreateCompanyInput>): Promise<ApiResponse<CompanyProfile>> => {
    const res = await axiosInstance.put<ApiResponse<CompanyProfile>>('/companies/me', data);
    return res.data;
  },
  listAll: async (page = 0, size = 20, status?: string): Promise<ApiResponse<PageResponse<CompanyProfile>>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.append('status', status);
    const res = await axiosInstance.get<ApiResponse<PageResponse<CompanyProfile>>>(`/companies?${params.toString()}`);
    return res.data;
  },
  verify: async (companyId: string, status: string, notes?: string): Promise<ApiResponse<CompanyProfile>> => {
    const res = await axiosInstance.post<ApiResponse<CompanyProfile>>(`/companies/${companyId}/verify`, { status, notes });
    return res.data;
  },
};

export const internshipApi = {
  listOpen: async (page = 0, size = 20, q?: string, status?: string): Promise<ApiResponse<PageResponse<Internship>>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (q) params.append('q', q);
    if (status) params.append('status', status);
    const res = await axiosInstance.get<ApiResponse<PageResponse<Internship>>>(`/internships?${params.toString()}`);
    return res.data;
  },
  listMine: async (page = 0, size = 20): Promise<ApiResponse<PageResponse<Internship>>> => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<Internship>>>(`/internships/mine?page=${page}&size=${size}`);
    return res.data;
  },
  getById: async (id: string): Promise<ApiResponse<Internship>> => {
    const res = await axiosInstance.get<ApiResponse<Internship>>(`/internships/${id}`);
    return res.data;
  },
  create: async (data: CreateInternshipInput): Promise<ApiResponse<Internship>> => {
    const res = await axiosInstance.post<ApiResponse<Internship>>('/internships', data);
    return res.data;
  },
  publish: async (id: string): Promise<ApiResponse<Internship>> => {
    const res = await axiosInstance.post<ApiResponse<Internship>>(`/internships/${id}/publish`);
    return res.data;
  },
  verify: async (id: string, status: string): Promise<ApiResponse<Internship>> => {
    const res = await axiosInstance.post<ApiResponse<Internship>>(`/internships/${id}/verify`, { status });
    return res.data;
  },
};

export const eligibilityApi = {
  checkMyEligibility: async (internshipId: string): Promise<ApiResponse<EligibilityCheckResponse>> => {
    const res = await axiosInstance.get<ApiResponse<EligibilityCheckResponse>>(`/internships/${internshipId}/eligibility/me`);
    return res.data;
  },
  checkStudentEligibility: async (internshipId: string, studentId: string): Promise<ApiResponse<EligibilityCheckResponse>> => {
    const res = await axiosInstance.post<ApiResponse<EligibilityCheckResponse>>(`/internships/${internshipId}/eligibility/check`, { studentId });
    return res.data;
  },
};

export const applicationApi = {
  apply: async (internshipId: string, coverLetter?: string): Promise<ApiResponse<Application>> => {
    const res = await axiosInstance.post<ApiResponse<Application>>('/applications', { internshipId, coverLetter });
    return res.data;
  },
  myApplications: async (page = 0, size = 20): Promise<ApiResponse<PageResponse<Application>>> => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<Application>>>(`/applications/mine?page=${page}&size=${size}`);
    return res.data;
  },
  listForInternship: async (internshipId: string, status?: string, page = 0, size = 20): Promise<ApiResponse<PageResponse<Application>>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.append('status', status);
    const res = await axiosInstance.get<ApiResponse<PageResponse<Application>>>(`/applications/internship/${internshipId}?${params.toString()}`);
    return res.data;
  },
  updateStatus: async (applicationId: string, status: string, rejectionReason?: string): Promise<ApiResponse<Application>> => {
    const res = await axiosInstance.put<ApiResponse<Application>>(`/applications/${applicationId}/status`, { status, rejectionReason });
    return res.data;
  },
  withdraw: async (applicationId: string): Promise<ApiResponse<string>> => {
    const res = await axiosInstance.delete<ApiResponse<string>>(`/applications/${applicationId}`);
    return res.data;
  },
};

export const offerApi = {
  createOffer: async (data: CreateOfferInput): Promise<ApiResponse<Offer>> => {
    const res = await axiosInstance.post<ApiResponse<Offer>>('/offers', data);
    return res.data;
  },
  respond: async (offerId: string, action: 'ACCEPT' | 'REJECT', notes?: string): Promise<ApiResponse<Offer>> => {
    const res = await axiosInstance.post<ApiResponse<Offer>>(`/offers/${offerId}/respond`, { action, notes });
    return res.data;
  },
  getMyOffers: async (page = 0, size = 20): Promise<ApiResponse<PageResponse<Offer>>> => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<Offer>>>(`/offers/mine?page=${page}&size=${size}`);
    return res.data;
  },
  getCompanyOffers: async (page = 0, size = 20): Promise<ApiResponse<PageResponse<Offer>>> => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<Offer>>>(`/offers/company?page=${page}&size=${size}`);
    return res.data;
  },
};

export const nocApi = {
  getQueue: async (status?: string, page = 0, size = 20): Promise<ApiResponse<PageResponse<NocRequestItem>>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.append('status', status);
    const res = await axiosInstance.get<ApiResponse<PageResponse<NocRequestItem>>>(`/noc/queue?${params.toString()}`);
    return res.data;
  },
  process: async (id: string, decision: 'APPROVED' | 'REJECTED', rejectionReason?: string): Promise<ApiResponse<NocRequestItem>> => {
    const res = await axiosInstance.post<ApiResponse<NocRequestItem>>(`/noc/${id}/process`, { decision, rejectionReason });
    return res.data;
  },
  getByOfferId: async (offerId: string): Promise<ApiResponse<NocRequestItem>> => {
    const res = await axiosInstance.get<ApiResponse<NocRequestItem>>(`/noc/offer/${offerId}`);
    return res.data;
  },
  verifyPublic: async (code: string): Promise<ApiResponse<NocRequestItem>> => {
    const res = await axiosInstance.get<ApiResponse<NocRequestItem>>(`/noc/verify/${code}`);
    return res.data;
  },
};

export const logbookApi = {
  submitReport: async (data: SubmitWeeklyReportInput): Promise<ApiResponse<WeeklyReport>> => {
    const res = await axiosInstance.post<ApiResponse<WeeklyReport>>('/logbooks', data);
    return res.data;
  },
  getMyReports: async (page = 0, size = 50): Promise<ApiResponse<PageResponse<WeeklyReport>>> => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<WeeklyReport>>>(`/logbooks/mine?page=${page}&size=${size}`);
    return res.data;
  },
  getTotalApprovedHours: async (): Promise<ApiResponse<number>> => {
    const res = await axiosInstance.get<ApiResponse<number>>('/logbooks/hours/approved');
    return res.data;
  },
  getReviewQueue: async (status?: string, page = 0, size = 20): Promise<ApiResponse<PageResponse<WeeklyReport>>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.append('status', status);
    const res = await axiosInstance.get<ApiResponse<PageResponse<WeeklyReport>>>(`/logbooks/review-queue?${params.toString()}`);
    return res.data;
  },
  reviewReport: async (id: string, status: string, feedback?: string, rating?: number): Promise<ApiResponse<WeeklyReport>> => {
    const res = await axiosInstance.post<ApiResponse<WeeklyReport>>(`/logbooks/${id}/review`, { status, feedback, rating });
    return res.data;
  },
};

export const evaluationApi = {
  submit: async (data: SubmitEvaluationInput): Promise<ApiResponse<EvaluationItem>> => {
    const res = await axiosInstance.post<ApiResponse<EvaluationItem>>('/evaluations', data);
    return res.data;
  },
  getMyEvaluations: async (): Promise<ApiResponse<EvaluationItem[]>> => {
    const res = await axiosInstance.get<ApiResponse<EvaluationItem[]>>('/evaluations/mine');
    return res.data;
  },
  getForInternship: async (internshipId: string): Promise<ApiResponse<EvaluationItem[]>> => {
    const res = await axiosInstance.get<ApiResponse<EvaluationItem[]>>(`/evaluations/internship/${internshipId}`);
    return res.data;
  },
};

export const aiApi = {
  getRecommendations: async (): Promise<ApiResponse<InternshipRecommendation[]>> => {
    const res = await axiosInstance.get<ApiResponse<InternshipRecommendation[]>>('/ai/recommendations');
    return res.data;
  },
  getResumeScore: async (): Promise<ApiResponse<ResumeScoreResponse>> => {
    const res = await axiosInstance.get<ApiResponse<ResumeScoreResponse>>('/ai/resume-score');
    return res.data;
  },
  getSkillGap: async (internshipId: string): Promise<ApiResponse<SkillGapResponse>> => {
    const res = await axiosInstance.get<ApiResponse<SkillGapResponse>>(`/ai/skill-gap/${internshipId}`);
    return res.data;
  },
};

export const certificateApi = {
  issue: async (studentId: string, internshipId: string, grade: string, totalHoursCompleted: number): Promise<ApiResponse<CertificateItem>> => {
    const res = await axiosInstance.post<ApiResponse<CertificateItem>>('/certificates', { studentId, internshipId, grade, totalHoursCompleted });
    return res.data;
  },
  getMyCertificates: async (): Promise<ApiResponse<CertificateItem[]>> => {
    const res = await axiosInstance.get<ApiResponse<CertificateItem[]>>('/certificates/mine');
    return res.data;
  },
  listAll: async (page = 0, size = 20): Promise<ApiResponse<PageResponse<CertificateItem>>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    const res = await axiosInstance.get<ApiResponse<PageResponse<CertificateItem>>>(`/certificates?${params.toString()}`);
    return res.data;
  },
  verifyPublic: async (certNumber: string): Promise<ApiResponse<CertificateItem>> => {
    const res = await axiosInstance.get<ApiResponse<CertificateItem>>(`/public/certificates/verify/${certNumber}`);
    return res.data;
  },
};

export const ppoApi = {
  create: async (data: CreatePpoInput): Promise<ApiResponse<PpoItem>> => {
    const res = await axiosInstance.post<ApiResponse<PpoItem>>('/ppo', data);
    return res.data;
  },
  respond: async (id: string, action: 'ACCEPT' | 'DECLINE'): Promise<ApiResponse<PpoItem>> => {
    const res = await axiosInstance.post<ApiResponse<PpoItem>>(`/ppo/${id}/respond`, { action });
    return res.data;
  },
  getMyPpos: async (): Promise<ApiResponse<PpoItem[]>> => {
    const res = await axiosInstance.get<ApiResponse<PpoItem[]>>('/ppo/mine');
    return res.data;
  },
  getRegistry: async (status?: string, page = 0, size = 20): Promise<ApiResponse<PageResponse<PpoItem>>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.append('status', status);
    const res = await axiosInstance.get<ApiResponse<PageResponse<PpoItem>>>(`/ppo/registry?${params.toString()}`);
    return res.data;
  },
};

export const analyticsApi = {
  getOverview: async (): Promise<ApiResponse<InstitutionalOverview>> => {
    const res = await axiosInstance.get<ApiResponse<InstitutionalOverview>>('/analytics/overview');
    return res.data;
  },
};

export const auditApi = {
  getLogs: async (action?: string, entityType?: string, page = 0, size = 30): Promise<ApiResponse<PageResponse<AuditLogItem>>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (action) params.append('action', action);
    if (entityType) params.append('entityType', entityType);
    const res = await axiosInstance.get<ApiResponse<PageResponse<AuditLogItem>>>(`/audit?${params.toString()}`);
    return res.data;
  },
};

export const notificationApi = {
  getMyNotifications: async (): Promise<ApiResponse<NotificationItem[]>> => {
    const res = await axiosInstance.get<ApiResponse<NotificationItem[]>>('/notifications');
    return res.data;
  },
  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    const res = await axiosInstance.get<ApiResponse<number>>('/notifications/unread-count');
    return res.data;
  },
  markAsRead: async (id: string): Promise<ApiResponse<string>> => {
    const res = await axiosInstance.put<ApiResponse<string>>(`/notifications/${id}/read`);
    return res.data;
  },
  markAllRead: async (): Promise<ApiResponse<string>> => {
    const res = await axiosInstance.put<ApiResponse<string>>('/notifications/mark-all-read');
    return res.data;
  },
};

export const adminApi = {
  listUsers: async (page = 0, size = 30): Promise<ApiResponse<PageResponse<AdminUserSummary>>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    const res = await axiosInstance.get<ApiResponse<PageResponse<AdminUserSummary>>>(`/admin/users?${params.toString()}`);
    return res.data;
  },
  toggleUserStatus: async (userId: string, enabled: boolean): Promise<ApiResponse<AdminUserSummary>> => {
    const res = await axiosInstance.put<ApiResponse<AdminUserSummary>>(`/admin/users/${userId}/status`, { enabled });
    return res.data;
  },
  updateUserRole: async (userId: string, roleName: string, action: 'ADD' | 'REMOVE'): Promise<ApiResponse<AdminUserSummary>> => {
    const res = await axiosInstance.post<ApiResponse<AdminUserSummary>>(`/admin/users/${userId}/roles`, { roleName, action });
    return res.data;
  },
};

export const documentApi = {
  upload: async (
    entityType: string,
    entityId: string,
    documentType: string,
    file: File
  ): Promise<ApiResponse<DocumentItem>> => {
    const formData = new FormData();
    formData.append('entityType', entityType);
    formData.append('entityId', entityId);
    formData.append('documentType', documentType);
    formData.append('file', file);

    const res = await axiosInstance.post<ApiResponse<DocumentItem>>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getByEntity: async (entityType: string, entityId: string): Promise<ApiResponse<DocumentItem[]>> => {
    const res = await axiosInstance.get<ApiResponse<DocumentItem[]>>(`/documents/entity/${entityType}/${entityId}`);
    return res.data;
  },
};

export const verificationApi = {
  submit: async (entityType: string, entityId: string, verificationType: string, notes?: string): Promise<ApiResponse<VerificationItem>> => {
    const res = await axiosInstance.post<ApiResponse<VerificationItem>>('/verifications', { entityType, entityId, verificationType, notes });
    return res.data;
  },
  getQueue: async (page = 0, size = 20, entityType?: string, status?: string): Promise<ApiResponse<PageResponse<VerificationItem>>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (entityType) params.append('entityType', entityType);
    if (status) params.append('status', status);
    const res = await axiosInstance.get<ApiResponse<PageResponse<VerificationItem>>>(`/verifications/queue?${params.toString()}`);
    return res.data;
  },
  process: async (id: string, status: string, notes?: string, rejectionReason?: string): Promise<ApiResponse<VerificationItem>> => {
    const res = await axiosInstance.post<ApiResponse<VerificationItem>>(`/verifications/${id}/process`, { status, notes, rejectionReason });
    return res.data;
  },
};
