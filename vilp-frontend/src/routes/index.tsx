import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Layouts
import { AuthLayout } from '@/layouts/AuthLayout';
import { StudentLayout } from '@/layouts/StudentLayout';
import { CompanyLayout } from '@/layouts/CompanyLayout';
import { MentorLayout } from '@/layouts/MentorLayout';
import { TnpLayout } from '@/layouts/TnpLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

// Auth pages
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';

// Dashboards & Core Entity Pages
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { StudentProfilePage } from '@/pages/student/StudentProfilePage';
import { StudentInternshipsPage } from '@/pages/student/StudentInternshipsPage';
import { StudentApplicationsPage } from '@/pages/student/StudentApplicationsPage';
import { StudentOffersPage } from '@/pages/student/StudentOffersPage';
import { StudentProgressPage } from '@/pages/student/StudentProgressPage';
import { StudentAiAdvisorPage } from '@/pages/student/StudentAiAdvisorPage';
import { StudentCertificatesPage } from '@/pages/student/StudentCertificatesPage';

import { CompanyDashboard } from '@/pages/company/CompanyDashboard';
import { CompanyProfilePage } from '@/pages/company/CompanyProfilePage';
import { CompanyInternshipsPage } from '@/pages/company/CompanyInternshipsPage';
import { CompanyApplicantsPage } from '@/pages/company/CompanyApplicantsPage';
import { CompanyBillingPage } from '@/pages/company/CompanyBillingPage';
import { PrivacyPolicyPage } from '@/pages/public/PrivacyPolicyPage';
import { TermsPage } from '@/pages/public/TermsPage';

import { MentorDashboard } from '@/pages/mentor/MentorDashboard';
import { MentorLogbookReviewPage } from '@/pages/mentor/MentorLogbookReviewPage';
import { MentorEvaluationPage } from '@/pages/mentor/MentorEvaluationPage';

import { TnpDashboard } from '@/pages/tnp/TnpDashboard';
import { TnpVerificationQueuePage } from '@/pages/tnp/TnpVerificationQueuePage';
import { TnpNocQueuePage } from '@/pages/tnp/TnpNocQueuePage';
import { TnpPpoRegistryPage } from '@/pages/tnp/TnpPpoRegistryPage';
import { TnpStudentsPage } from '@/pages/tnp/TnpStudentsPage';
import { TnpCompaniesPage } from '@/pages/tnp/TnpCompaniesPage';
import { TnpInternshipsPage } from '@/pages/tnp/TnpInternshipsPage';
import { TnpAnalyticsPage } from '@/pages/tnp/TnpAnalyticsPage';
import { TnpAuditLogsPage } from '@/pages/tnp/TnpAuditLogsPage';
import { TnpAutomationPage } from '@/pages/tnp/TnpAutomationPage';
import { TnpDocumentsPage } from '@/pages/tnp/TnpDocumentsPage';

import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { PublicNocVerifyPage } from '@/pages/public/PublicNocVerifyPage';
import { PublicCertificateVerifyPage } from '@/pages/public/PublicCertificateVerifyPage';
import { LandingPage } from '@/pages/public/LandingPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';

/**
 * Application Router
 * Role-based route protection per TRD §6.2
 */
import { OAuthCallbackPage } from '@/pages/auth/OAuthCallbackPage';
import { RoleSelectionPage } from '@/features/onboarding/pages/RoleSelectionPage';
import { MultiRoleOnboardingWizard } from '@/features/onboarding/pages/MultiRoleOnboardingWizard';

export const router = createBrowserRouter([
  // ── Public auth & multi-role onboarding routes ──────────────────────────
  { path: '/auth/callback', element: <OAuthCallbackPage /> },
  { path: '/auth/register', element: <RoleSelectionPage /> },
  { path: '/onboarding/roles', element: <RoleSelectionPage /> },
  { path: '/onboarding', element: <MultiRoleOnboardingWizard /> },
  {
    element: <AuthLayout />,
    children: [
      { path: '/auth/login', element: <LoginPage /> },
      { path: '/auth/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/auth/reset-password', element: <ResetPasswordPage /> },
      { path: '/auth/verify-email', element: <VerifyEmailPage /> },
    ],
  },

  // ── Public Legal & Verification ────────────────────────────────────────
  { path: '/privacy', element: <PrivacyPolicyPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '/verify/noc/:code', element: <PublicNocVerifyPage /> },
  { path: '/verify/certificate/:certificateNumber', element: <PublicCertificateVerifyPage /> },

  // ── Protected: Student ──────────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['STUDENT']} />,
        children: [
          {
            element: <StudentLayout />,
            children: [
              { path: '/student/dashboard', element: <StudentDashboard /> },
              { path: '/student/profile', element: <StudentProfilePage /> },
              { path: '/student/internships', element: <StudentInternshipsPage /> },
              { path: '/student/applications', element: <StudentApplicationsPage /> },
              { path: '/student/offers', element: <StudentOffersPage /> },
              { path: '/student/progress', element: <StudentProgressPage /> },
              { path: '/student/ai-advisor', element: <StudentAiAdvisorPage /> },
              { path: '/student/certificates', element: <StudentCertificatesPage /> },
            ],
          },
        ],
      },

      // ── Protected: Company ─────────────────────────────────────────────
      {
        element: <RoleRoute allowedRoles={['COMPANY']} />,
        children: [
          {
            element: <CompanyLayout />,
            children: [
              { path: '/company/dashboard', element: <CompanyDashboard /> },
              { path: '/company/profile', element: <CompanyProfilePage /> },
              { path: '/company/internships', element: <CompanyInternshipsPage /> },
              { path: '/company/applicants', element: <CompanyApplicantsPage /> },
              { path: '/company/billing', element: <CompanyBillingPage /> },
            ],
          },
        ],
      },

      // ── Protected: Mentor ──────────────────────────────────────────────
      {
        element: <RoleRoute allowedRoles={['MENTOR']} />,
        children: [
          {
            element: <MentorLayout />,
            children: [
              { path: '/mentor/dashboard', element: <MentorDashboard /> },
              { path: '/mentor/logbooks', element: <MentorLogbookReviewPage /> },
              { path: '/mentor/evaluations', element: <MentorEvaluationPage /> },
            ],
          },
        ],
      },

      // ── Protected: T&P ────────────────────────────────────────────────
      {
        element: <RoleRoute allowedRoles={['TNP_OFFICER', 'TNP_HEAD']} />,
        children: [
          {
            element: <TnpLayout />,
            children: [
              { path: '/tnp/dashboard', element: <TnpDashboard /> },
              { path: '/tnp/verification', element: <TnpVerificationQueuePage /> },
              { path: '/tnp/noc', element: <TnpNocQueuePage /> },
              { path: '/tnp/ppo', element: <TnpPpoRegistryPage /> },
              { path: '/tnp/students', element: <TnpStudentsPage /> },
              { path: '/tnp/companies', element: <TnpCompaniesPage /> },
              { path: '/tnp/internships', element: <TnpInternshipsPage /> },
              { path: '/tnp/analytics', element: <TnpAnalyticsPage /> },
              { path: '/tnp/automation', element: <TnpAutomationPage /> },
              { path: '/tnp/documents', element: <TnpDocumentsPage /> },
              { path: '/tnp/audit', element: <TnpAuditLogsPage /> },
            ],
          },
        ],
      },

      // ── Protected: Super Admin ─────────────────────────────────────────
      {
        element: <RoleRoute allowedRoles={['SUPER_ADMIN']} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: '/admin/dashboard', element: <AdminDashboard /> },
            ],
          },
        ],
      },
    ],
  },

  // ── Utility pages ───────────────────────────────────────────────────────
  { path: '/unauthorized', element: <UnauthorizedPage /> },

  // ── Root landing page ───────────────────────────────────────────────────
  { path: '/', element: <LandingPage /> },
  { path: '*', element: <UnauthorizedPage /> },
], {
  future: {
    v7_relativeSplatPath: true,
  },
});
