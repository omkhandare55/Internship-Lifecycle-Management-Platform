# 🧭 VILP Complete Route Matrix & Authorization Blueprint

---

## 1. Public & Authentication Routes

| Route | Component File | Purpose | Auth Required |
|---|---|---|---|
| `/` | `LandingPage.tsx` | Platform landing page & features showcase | Public |
| `/auth/login` | `LoginPage.tsx` | Institutional account sign-in & Google OAuth | Public |
| `/auth/register` | `RoleSelectionPage.tsx` | Role matrix selector for onboarding | Public |
| `/onboarding/roles` | `RoleSelectionPage.tsx` | Direct role matrix navigation | Public |
| `/onboarding` | `MultiRoleOnboardingWizard.tsx` | Multi-role KYC & dual OTP onboarding wizard | Public |
| `/auth/forgot-password` | `ForgotPasswordPage.tsx` | Password recovery request | Public |
| `/auth/reset-password` | `ResetPasswordPage.tsx` | Set new password with 6-digit recovery token | Public |
| `/auth/verify-email` | `VerifyEmailPage.tsx` | Email token verification handler | Public |
| `/auth/callback` | `OAuthCallbackPage.tsx` | Google OAuth token exchange handler | Public |
| `/verify/noc/:code` | `PublicNocVerifyPage.tsx` | Public institutional NOC ledger verifier | Public |
| `/verify/certificate/:num`| `PublicCertificateVerifyPage.tsx` | Public accredited certificate verifier | Public |
| `/privacy` | `PrivacyPolicyPage.tsx` | Institutional privacy policy | Public |
| `/terms` | `TermsPage.tsx` | Platform terms and compliance agreement | Public |
| `/unauthorized` | `UnauthorizedPage.tsx` | 403 Access Denied fallback screen | Public |

---

## 2. Protected Student Console (`STUDENT` Role)

| Route | Component File | Purpose | Auth Required |
|---|---|---|---|
| `/student/dashboard` | `StudentDashboard.tsx` | Student progress, 240-hr meter & quick stats | `ROLE_STUDENT` |
| `/student/profile` | `StudentProfilePage.tsx` | Student KYC, skills, and KYC document uploads | `ROLE_STUDENT` |
| `/student/internships` | `StudentInternshipsPage.tsx` | Search open accredited internships & apply | `ROLE_STUDENT` |
| `/student/applications` | `StudentApplicationsPage.tsx` | Track application lifecycle & self-withdrawal | `ROLE_STUDENT` |
| `/student/offers` | `StudentOffersPage.tsx` | Manage offers, accept (single-mutex) & view NOC | `ROLE_STUDENT` |
| `/student/progress` | `StudentProgressPage.tsx` | Submit weekly 40-hr task logbooks | `ROLE_STUDENT` |
| `/student/certificates` | `StudentCertificatesPage.tsx` | View accredited completion certificates | `ROLE_STUDENT` |
| `/student/ai-advisor` | `StudentAiAdvisorPage.tsx` | Live AI ATS resume scanner & skill gap roadmap | `ROLE_STUDENT` |

---

## 3. Protected Recruiter Console (`COMPANY` Role)

| Route | Component File | Purpose | Auth Required |
|---|---|---|---|
| `/company/dashboard` | `CompanyDashboard.tsx` | Recruiter hub, active drives & applicants count | `ROLE_COMPANY` |
| `/company/profile` | `CompanyProfilePage.tsx` | Corporate partner KYC & legal documents | `ROLE_COMPANY` |
| `/company/internships` | `CompanyInternshipsPage.tsx` | Post new opportunities & manage active drives | `ROLE_COMPANY` |
| `/company/applicants` | `CompanyApplicantsPage.tsx` | Review candidate pool & issue formal offers | `ROLE_COMPANY` |
| `/company/billing` | `CompanyBillingPage.tsx` | Corporate partnership tier & invoices | `ROLE_COMPANY` |

---

## 4. Protected Faculty Mentor Console (`MENTOR` Role)

| Route | Component File | Purpose | Auth Required |
|---|---|---|---|
| `/mentor/dashboard` | `MentorDashboard.tsx` | Assigned mentees overview & audit queue | `ROLE_MENTOR` |
| `/mentor/logbooks` | `MentorLogbookReviewPage.tsx` | Review weekly student logs & credit 40 hrs | `ROLE_MENTOR` |
| `/mentor/evaluations` | `MentorEvaluationPage.tsx` | Submit 5-dimension competency rubrics & PPOs | `ROLE_MENTOR` |

---

## 5. Protected Training & Placement Console (`TNP_OFFICER` & `TNP_HEAD` Roles)

| Route | Component File | Purpose | Auth Required |
|---|---|---|---|
| `/tnp/dashboard` | `TnpDashboard.tsx` | Central T&P operations & placement KPIs | `TNP_OFFICER` / `TNP_HEAD` |
| `/tnp/verification` | `TnpVerificationQueuePage.tsx` | KYC review queue (Students & Companies) | `TNP_OFFICER` / `TNP_HEAD` |
| `/tnp/noc` | `TnpNocQueuePage.tsx` | Issue & sign AICTE Institutional NOCs | `TNP_OFFICER` / `TNP_HEAD` |
| `/tnp/ppo` | `TnpPpoRegistryPage.tsx` | University Pre-Placement Offer registry | `TNP_OFFICER` / `TNP_HEAD` |
| `/tnp/students` | `TnpStudentsPage.tsx` | Student batch directory & eligibility | `TNP_OFFICER` / `TNP_HEAD` |
| `/tnp/companies` | `TnpCompaniesPage.tsx` | Corporate partner accreditation registry | `TNP_OFFICER` / `TNP_HEAD` |
| `/tnp/internships` | `TnpInternshipsPage.tsx` | Review & approve company postings | `TNP_OFFICER` / `TNP_HEAD` |
| `/tnp/analytics` | `TnpAnalyticsPage.tsx` | Department CTC distribution & charts | `TNP_OFFICER` / `TNP_HEAD` |
| `/tnp/automation` | `TnpAutomationPage.tsx` | Workflow automation & export engine | `TNP_OFFICER` / `TNP_HEAD` |
| `/tnp/documents` | `TnpDocumentsPage.tsx` | Global institutional document vault | `TNP_OFFICER` / `TNP_HEAD` |
| `/tnp/audit` | `TnpAuditLogsPage.tsx` | System compliance audit log explorer | `TNP_OFFICER` / `TNP_HEAD` |

---

## 6. Protected Super Administrator Console (`SUPER_ADMIN` Role)

| Route | Component File | Purpose | Auth Required |
|---|---|---|---|
| `/admin/dashboard` | `AdminDashboard.tsx` | System governance, lock users & role management | `ROLE_SUPER_ADMIN` |
