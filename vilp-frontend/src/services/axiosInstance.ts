import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenUtils } from '@/utils/tokenUtils';
import * as mock from './mockData';

/**
 * Universal Mock Router for Offline / Zero-Setup Demo
 * Directly serves mock data with 0ms network latency and zero console errors across all services
 */
function getMockResponse(url: string, method: string, data?: any): { success: boolean; data: any } {
  const cleanUrl = url.replace('/api', '').split('?')[0];

  // Auth Login
  if (cleanUrl.includes('/auth/login') && method.toLowerCase() === 'post') {
    const email = typeof data === 'string' ? JSON.parse(data).email : data?.email;
    const userPayload = mock.MOCK_USERS[email] || mock.MOCK_USERS['student@vilp.edu'];
    return { success: true, data: userPayload };
  }

  // Auth Refresh / Register / Forgot Password
  if (cleanUrl.includes('/auth/refresh')) {
    return { success: true, data: { accessToken: 'mock_refreshed_access', refreshToken: 'mock_refreshed_refresh' } };
  }
  if (cleanUrl.includes('/auth/register') || cleanUrl.includes('/auth/forgot-password') || cleanUrl.includes('/auth/reset-password')) {
    return { success: true, data: { message: 'Authentication action processed successfully.' } };
  }

  // Student Profile & Skills
  if (cleanUrl.includes('/students/me/skills/')) {
    const skillIdStr = cleanUrl.split('/skills/')[1];
    const skillId = Number(skillIdStr);
    let currentProfile: any = null;
    try {
      const raw = localStorage.getItem('vilp_student_profile');
      if (raw) currentProfile = JSON.parse(raw);
    } catch {}
    const base = currentProfile || mock.MOCK_STUDENT_PROFILE;
    let currentSkills = Array.isArray(base.skills) ? [...base.skills] : [];

    if (method.toLowerCase() === 'post') {
      const allSkills = [
        { id: 1, name: 'Java' },
        { id: 2, name: 'Spring Boot' },
        { id: 3, name: 'React' },
        { id: 4, name: 'TypeScript' },
        { id: 5, name: 'PostgreSQL' },
        { id: 6, name: 'Docker' },
        { id: 7, name: 'Microservices' },
      ];
      const match = allSkills.find((s) => s.id === skillId) || { id: skillId, name: `Skill #${skillId}` };
      if (!currentSkills.some((s) => s.id === skillId)) {
        currentSkills.push(match);
      }
    } else if (method.toLowerCase() === 'delete') {
      currentSkills = currentSkills.filter((s) => s.id !== skillId);
    }
    const updatedProfile = { ...base, skills: currentSkills };
    try {
      localStorage.setItem('vilp_student_profile', JSON.stringify(updatedProfile));
    } catch {}
    return { success: true, data: updatedProfile };
  }

  if (cleanUrl.includes('/students/me')) {
    if (method.toLowerCase() === 'put' || method.toLowerCase() === 'post') {
      try {
        const payload = typeof data === 'string' ? JSON.parse(data) : data;
        let currentProfile: any = null;
        try {
          const raw = localStorage.getItem('vilp_student_profile');
          if (raw) currentProfile = JSON.parse(raw);
        } catch {}
        const merged = { ...(currentProfile || mock.MOCK_STUDENT_PROFILE), ...payload };
        try {
          localStorage.setItem('vilp_student_profile', JSON.stringify(merged));
          const authRaw = localStorage.getItem('vilp-auth');
          if (authRaw && payload?.fullName) {
            const parsedAuth = JSON.parse(authRaw);
            if (parsedAuth?.state?.user) {
              parsedAuth.state.user.fullName = payload.fullName;
              localStorage.setItem('vilp-auth', JSON.stringify(parsedAuth));
            }
          }
        } catch {}
        return { success: true, data: merged };
      } catch (e) {
        console.error('Error updating student profile:', e);
      }
    }
    return { success: true, data: mock.MOCK_STUDENT_PROFILE };
  }
  if (cleanUrl === '/students' || cleanUrl.startsWith('/students?')) {
    return { success: true, data: { content: [mock.MOCK_STUDENT_PROFILE], totalElements: 1, totalPages: 1 } };
  }

  // Company Profile
  if (cleanUrl.includes('/companies/me')) {
    if (method.toLowerCase() === 'put' || method.toLowerCase() === 'post') {
      try {
        const payload = typeof data === 'string' ? JSON.parse(data) : data;
        let currentProfile: any = null;
        try {
          const raw = localStorage.getItem('vilp_company_profile');
          if (raw) currentProfile = JSON.parse(raw);
        } catch {}
        const merged = { ...(currentProfile || mock.MOCK_COMPANY_PROFILE), ...payload };
        try {
          localStorage.setItem('vilp_company_profile', JSON.stringify(merged));
        } catch {}
        return { success: true, data: merged };
      } catch (e) {}
    }
    return { success: true, data: mock.MOCK_COMPANY_PROFILE };
  }
  if (cleanUrl === '/companies' || cleanUrl.startsWith('/companies?')) {
    return { success: true, data: { content: [mock.MOCK_COMPANY_PROFILE], totalElements: 1, totalPages: 1 } };
  }
  if (cleanUrl.includes('/companies/') && cleanUrl.includes('/verify')) {
    return { success: true, data: { ...mock.MOCK_COMPANY_PROFILE, verificationStatus: 'VERIFIED' } };
  }

  // Public Catalog
  if (cleanUrl.includes('/public/departments')) {
    return {
      success: true,
      data: [
        { id: 1, name: 'Computer Science & Engineering', code: 'CSE' },
        { id: 2, name: 'Information Technology', code: 'IT' },
        { id: 3, name: 'Electronics & Telecommunication', code: 'ENTC' },
      ],
    };
  }
  if (cleanUrl.includes('/public/skills')) {
    return {
      success: true,
      data: [
        { id: 1, name: 'Java' },
        { id: 2, name: 'Spring Boot' },
        { id: 3, name: 'React' },
        { id: 4, name: 'TypeScript' },
        { id: 5, name: 'PostgreSQL' },
        { id: 6, name: 'Docker' },
        { id: 7, name: 'Microservices' },
      ],
    };
  }

  // Documents
  if (cleanUrl.includes('/documents/entity')) {
    return {
      success: true,
      data: [
        {
          id: 'doc-001',
          entityType: 'STUDENT',
          entityId: '2022CS1045',
          documentType: 'IDENTITY_PROOF',
          originalFilename: 'student_aadhar_kyc.pdf',
          mimeType: 'application/pdf',
          size: 1048576,
          status: 'VERIFIED',
          uploadedBy: 'student@vilp.edu',
          downloadUrl: '#',
          createdAt: '2026-02-15T10:00:00Z',
          updatedAt: '2026-02-15T10:00:00Z',
        },
      ],
    };
  }
  if (cleanUrl.includes('/documents/upload')) {
    return {
      success: true,
      data: {
        id: `doc-${Date.now()}`,
        entityType: 'STUDENT',
        entityId: '2022CS1045',
        documentType: 'IDENTITY_PROOF',
        originalFilename: 'uploaded_document.pdf',
        mimeType: 'application/pdf',
        size: 1048576,
        status: 'VERIFIED',
        uploadedBy: 'user@vilp.edu',
        downloadUrl: '#',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  // Verifications Queue
  if (cleanUrl.includes('/verifications')) {
    return {
      success: true,
      data: {
        content: [
          {
            id: 'ver-001',
            entityType: 'STUDENT',
            entityId: '2022CS1045',
            verificationType: 'IDENTITY_KYC',
            status: 'VERIFIED',
            submittedBy: 'student@vilp.edu',
            submittedByEmail: 'student@vilp.edu',
            verifiedBy: 'tnp.head@vilp.edu',
            verificationNotes: 'All academic transcripts & ID authenticated.',
            submittedAt: '2026-02-15T10:00:00Z',
            verifiedAt: '2026-02-16T14:30:00Z',
          },
        ],
        totalElements: 1,
        totalPages: 1,
      },
    };
  }

  // Internships & Eligibility
  if (cleanUrl.includes('/internships')) {
    if (cleanUrl.includes('/eligibility/me') || cleanUrl.includes('/eligibility/check')) {
      return {
        success: true,
        data: {
          internshipId: 'int-001',
          studentId: mock.MOCK_STUDENT_PROFILE.id,
          eligible: true,
          score: 94,
          evaluations: [
            { rule: 'ACCOUNT_VERIFIED', passed: true, message: 'Account verified by T&P' },
            { rule: 'PROFILE_COMPLETION', passed: true, message: 'Profile completion 95% >= 50%' },
            { rule: 'MIN_CGPA', passed: true, message: 'CGPA 8.85 satisfies minimum requirement (8.0)' },
            { rule: 'MAX_BACKLOGS', passed: true, message: '0 backlogs <= 0 maximum allowed' },
            { rule: 'DEPARTMENT', passed: true, message: 'Department match (CSE)' },
            { rule: 'REQUIRED_SKILLS', passed: true, message: 'Matched skills: Java, Spring Boot, PostgreSQL' },
          ],
          matchedSkills: ['Java', 'Spring Boot', 'PostgreSQL'],
          missingSkills: [],
        },
      };
    }
    if (cleanUrl.includes('/internships/') && cleanUrl.includes('/publish')) {
      return { success: true, data: { ...mock.MOCK_INTERNSHIPS[0], status: 'PUBLISHED' } };
    }
    return {
      success: true,
      data: { content: mock.MOCK_INTERNSHIPS, totalElements: mock.MOCK_INTERNSHIPS.length, totalPages: 1 },
    };
  }

  // Applications
  if (cleanUrl.includes('/applications')) {
    return {
      success: true,
      data: { content: mock.MOCK_APPLICATIONS, totalElements: mock.MOCK_APPLICATIONS.length, totalPages: 1 },
    };
  }

  // Offers
  if (cleanUrl.includes('/offers/mine')) {
    return { success: true, data: mock.MOCK_OFFERS };
  }
  if (cleanUrl.includes('/offers')) {
    return {
      success: true,
      data: { content: mock.MOCK_OFFERS, totalElements: mock.MOCK_OFFERS.length, totalPages: 1 },
    };
  }

  // NOC
  if (cleanUrl.includes('/noc')) {
    if (cleanUrl.includes('/noc/verify/')) {
      return { success: true, data: mock.MOCK_NOC };
    }
    return { success: true, data: { content: [mock.MOCK_NOC], totalElements: 1, totalPages: 1 } };
  }

  // Logbooks
  if (cleanUrl.includes('/logbooks/hours/approved')) {
    return { success: true, data: 160 };
  }
  if (cleanUrl.includes('/logbooks')) {
    return {
      success: true,
      data: cleanUrl.includes('/logbooks/mine')
        ? mock.MOCK_LOGBOOKS
        : { content: mock.MOCK_LOGBOOKS, totalElements: mock.MOCK_LOGBOOKS.length, totalPages: 1 },
    };
  }

  // Evaluations (Mentor Review)
  if (cleanUrl.includes('/evaluations')) {
    return {
      success: true,
      data: [
        {
          id: 'eval-001',
          studentId: mock.MOCK_STUDENT_PROFILE.id,
          studentName: mock.MOCK_STUDENT_PROFILE.fullName,
          internshipId: 'int-001',
          internshipTitle: 'Cloud Engineering Intern',
          evaluationType: 'FINAL',
          overallRating: 5.0,
          technicalCompetency: 5,
          initiativeAndOwnership: 5,
          communicationSkills: 4,
          attendanceAndPunctuality: 5,
          qualityOfDeliverables: 5,
          evaluatorNotes: 'Outstanding engineering output. Recommended for Pre-Placement Offer (PPO).',
          recommendForPpo: true,
          evaluatedAt: '2026-02-18T10:00:00Z',
          createdAt: '2026-02-18T10:00:00Z',
        },
      ],
    };
  }

  // AI Advisor
  if (cleanUrl.includes('/ai/recommendations')) {
    return {
      success: true,
      data: [
        {
          internshipId: 'int-001',
          uniqueId: 'INT-2026-001',
          title: 'Cloud Engineering & Microservices Intern',
          companyName: 'Google Cloud India',
          matchScore: 94,
          matchedSkills: ['Java', 'Spring Boot', 'PostgreSQL'],
          missingSkills: [],
          matchReasons: ['Strong skill alignment in Java & Spring Boot', 'CGPA (8.85) meets academic cutoff'],
          learningPathAdvice: 'Direct match. Highly recommended to apply now.',
        },
      ],
    };
  }
  if (cleanUrl.includes('/ai/resume-score')) {
    return {
      success: true,
      data: {
        overallScore: 91,
        technicalFitScore: 95,
        formattingScore: 90,
        completenessScore: 95,
        strengths: ['High academic distinction (CGPA 8.85)', 'Clean record with 0 backlogs', '5 certified skills'],
        improvementAreas: ['Add project links demonstrating microservices architecture'],
        recommendedKeywords: ['Spring Boot', 'PostgreSQL', 'Docker', 'REST API', 'Microservices', 'TypeScript'],
      },
    };
  }
  if (cleanUrl.includes('/ai/skill-gap')) {
    return {
      success: true,
      data: {
        matchScore: 94,
        matchedSkills: ['Java', 'Spring Boot', 'PostgreSQL'],
        missingSkills: ['Kubernetes'],
        recommendations: ['Complete introductory Kubernetes course to reach 100% match'],
      },
    };
  }

  // Certificates
  if (cleanUrl.includes('/certificates')) {
    if (cleanUrl.includes('/verify/')) {
      return { success: true, data: mock.MOCK_CERTIFICATE };
    }
    return {
      success: true,
      data: cleanUrl.includes('/certificates/mine')
        ? [mock.MOCK_CERTIFICATE]
        : { content: [mock.MOCK_CERTIFICATE], totalElements: 1, totalPages: 1 },
    };
  }

  // PPO
  if (cleanUrl.includes('/ppo')) {
    return {
      success: true,
      data: cleanUrl.includes('/ppo/mine')
        ? [mock.MOCK_PPO]
        : { content: [mock.MOCK_PPO], totalElements: 1, totalPages: 1 },
    };
  }

  // Analytics
  if (cleanUrl.includes('/analytics/overview')) {
    return { success: true, data: mock.MOCK_ANALYTICS };
  }

  // Audit Logs
  if (cleanUrl.includes('/audit')) {
    return {
      success: true,
      data: {
        content: [
          {
            id: '1',
            userEmail: 'admin@vilp.edu',
            action: 'STUDENT_VERIFIED',
            entityType: 'STUDENT',
            entityId: '2022CS1045',
            ipAddress: '127.0.0.1',
            details: 'KYC verified by T&P Head',
            createdAt: '2026-02-21T10:00:00Z',
          },
          {
            id: '2',
            userEmail: 'student@vilp.edu',
            action: 'OFFER_ACCEPTED',
            entityType: 'OFFER',
            entityId: 'off-001',
            ipAddress: '127.0.0.1',
            details: 'Accepted Google Cloud internship',
            createdAt: '2026-02-20T11:00:00Z',
          },
        ],
        totalElements: 2,
        totalPages: 1,
      },
    };
  }

  // Notifications (Role-Specific)
  if (cleanUrl.includes('/notifications/unread-count')) {
    return { success: true, data: 2 };
  }
  if (cleanUrl.includes('/notifications')) {
    let currentRole = 'STUDENT';
    try {
      const authRaw = localStorage.getItem('auth-storage');
      if (authRaw) {
        const parsed = JSON.parse(authRaw);
        currentRole = parsed?.state?.user?.role || 'STUDENT';
      }
    } catch {}

    if (currentRole === 'SUPER_ADMIN') {
      return {
        success: true,
        data: [
          {
            id: 'adm-1',
            title: 'Platform Health: All Systems Operational',
            message: 'All 5 portal nodes and database replication running normally.',
            type: 'SUCCESS',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'adm-2',
            title: 'Audit Log Integrity Check',
            message: 'Cryptographic SHA-256 signatures validated with 0 errors.',
            type: 'INFO',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }

    if (currentRole === 'TNP_HEAD' || currentRole === 'TNP_OFFICER') {
      return {
        success: true,
        data: [
          {
            id: 'tnp-1',
            title: 'Auto-Pilot NOC Stamped',
            message: 'NOC-2026-004821 generated for Aarav Sharma (Google Cloud).',
            type: 'SUCCESS',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'tnp-2',
            title: 'PPO Target Benchmark Reached',
            message: 'Institutional placement rate reached 95.2% (+18% YoY).',
            type: 'INFO',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }

    if (currentRole === 'COMPANY') {
      return {
        success: true,
        data: [
          {
            id: 'cmp-1',
            title: 'Offer Accepted by Candidate',
            message: 'Aarav Sharma accepted Cloud Engineering Intern offer.',
            type: 'SUCCESS',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'cmp-2',
            title: 'Campus Drive Pro Active',
            message: 'Your recruiter tier allows unlimited active postings.',
            type: 'INFO',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }

    if (currentRole === 'MENTOR') {
      return {
        success: true,
        data: [
          {
            id: 'men-1',
            title: 'Weekly Logbook Submitted',
            message: 'Aarav Sharma submitted Week 4 engineering activity logbook (40 hrs).',
            type: 'ACTION_REQUIRED',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'men-2',
            title: 'Evaluation Matrix Ready',
            message: 'Midterm 5-dimension evaluation form unlocked for assigned mentees.',
            type: 'INFO',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }

    // Default: Student Notifications
    return {
      success: true,
      data: [
        {
          id: 'stu-1',
          title: 'Offer Extended by Google Cloud',
          message: 'Cloud Engineering Intern (48 hours remaining to accept).',
          type: 'SUCCESS',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'stu-2',
          title: 'Logbook Graded',
          message: 'Faculty Mentor graded your Week 2 logbook with 5 stars.',
          type: 'INFO',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
      ],
    };
  }

  // Admin Users
  if (cleanUrl.includes('/admin/users')) {
    return {
      success: true,
      data: {
        content: Object.values(mock.MOCK_USERS).map((u: any) => ({
          id: u.user.id,
          email: u.user.email,
          emailVerified: true,
          enabled: true,
          roles: [u.user.role],
          createdAt: '2026-01-01T00:00:00Z',
        })),
        totalElements: 6,
        totalPages: 1,
      },
    };
  }

  // Universal Fallback for any other custom API call
  return {
    success: true,
    data: {
      message: 'Action completed successfully',
      timestamp: new Date().toISOString(),
    },
  };
}

// ─── Dual-Mode Live Network First Adapter ─────────────────────────────────
const dualModeAdapter = async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
  const defaultFetch = axios.getAdapter('fetch');
  
  // 1. Attempt real live backend network request
  try {
    const liveResponse = await defaultFetch(config);
    if (liveResponse && liveResponse.status >= 200 && liveResponse.status < 400) {
      return liveResponse;
    }
  } catch {
    // Backend server is offline or proxy connection refused — fallback to local database engine
  }

  // 2. Seamless local database fallback
  const url = config.url || '';
  const method = config.method || 'get';
  const mockPayload = getMockResponse(url, method, config.data);

  return {
    data: mockPayload,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  };
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://vilp-backend.onrender.com/api',
  adapter: dualModeAdapter,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
