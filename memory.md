# 🧠 VILP Codebase Memory & Permanent Intelligence Bank
**Verified Internship Lifecycle Platform (VILP)**  
*AICTE / UGC Compliant Enterprise Campus Internship & Credit Management Architecture*

---

## 1. Project Overview & Business Purpose

### 1.1 The Core Problem
University internship management is traditionally fragmented across paper logbooks, unverified corporate offers, lack of continuous progress auditing, manual NOC approvals, and unaccredited certificate issuance. This causes:
- **Zero Proof of Attendance & Work:** Fraudulent completion certificates and unmonitored student engagement.
- **Offer Hoarding & Multiple Placements:** High-performing students hoarding multiple offers while other candidates get zero, distorting placement metrics.
- **Accreditation Gaps:** Inability for universities and autonomous colleges to audit the mandatory **240 contact hours** required by AICTE/UGC for graduation credits.
- **Recruiter Fraud:** Unverified fake entities issuing low-quality or unpaid exploitation internships without institutional vetting.

### 1.2 The VILP Solution
VILP is an enterprise-grade multi-tenant platform designed to digitize and govern the full lifecycle of student corporate internships with cryptographic verifiability, real-time progress auditing, and role-based access governance.

---

## 2. Platform Persona & Multi-Role Governance (RBAC)

The platform enforces 6 distinct security roles across 5 dedicated dashboard consoles:

| Role Identifier | Institutional Persona | Permissions & Scope |
|---|---|---|
| `STUDENT` | Undergraduate / Postgraduate | Profile KYC, AI ATS Resume Scanning, Search Internships, Apply with Cover Letter, Single-Active Offer Acceptance, Weekly 40-hr Logbook Submission, Public Certificates. |
| `COMPANY` | Corporate Partner / Recruiter | Enterprise KYC, Post Accredited Internships, Filter Applicants, Schedule Drives, Issue Formal Offers, Issue PPOs. |
| `MENTOR` | Department Faculty Advisor | Track Assigned Mentees, Audit Weekly Logbooks, Approve 40-hr Contact Blocks, Submit 5-Dimension Competency Rubrics, Endorse PPOs. |
| `TNP_OFFICER` | Placement Officer | Vet Student KYC, Verify Company Credentials, Approve Internship Postings, Issue Digitally Stamped AICTE NOCs, Manage Drive Schedules. |
| `TNP_HEAD` | Training & Placement Director | Institutional Placement KPIs, Department-wise Placement Analytics, Salary CTC Distribution, Export Audit Reports. |
| `SUPER_ADMIN` | System Administrator / Registrar | Full System Governance, RBAC Role Management, User Status Locking/Unlocking, Audit Log Inspection, Platform Settings. |

---

## 3. Technology Stack & Infrastructure Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                               FRONTEND                                 │
│  React 19 • TypeScript • Vite 8 • Tailwind CSS v4 • Bootstrap 5       │
│  React Router v6 • TanStack Query v5 • Zustand v5 • Lucide Icons      │
│  Host: Vercel (https://internship-lifecycle-management-pla.vercel.app) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST / SSE Stream
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                                BACKEND                                 │
│  Spring Boot 3.3.4 • Java 21 • Spring Security 6 • JJWT (HS256)        │
│  Hibernate 6 / JPA • Flyway Migrations • Bucket4j (Rate Limiting)      │
│  Jsoup (XSS Sanitizer) • Google Gemini 2.0 Flash REST Client          │
│  Host: Render Cloud (https://vilp-backend.onrender.com/api)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ TCP / SSL Pooled (HikariCP)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              DATABASE                                  │
│  PostgreSQL 16 (Relational Ledger & Flyway Versioned Migrations)       │
│  Storage: Supabase Storage / Local Disk Hybrid                         │
│  Host: Supabase Cloud Database                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Key Architectural Patterns & Guarantees

### 4.1 Single-Active Offer Mutex Lock
Under university placement regulations, when a student accepts an offer:
1. `POST /api/offers/{id}/respond` executes inside a transactional lock.
2. The selected offer is marked `ACCEPTED`.
3. All other active applications for that student are automatically marked `CANCELLED_OFFER_ACCEPTED`.
4. All other open offers received by the student are marked `REVOKED`.
5. An autonomous **Institutional No Objection Certificate (NOC)** is immediately generated and stamped with a unique alphanumeric verification code (`NOC-YYYY-XXXXXX`).

### 4.2 240-Hour AICTE Degree Accumulation Meter
- Students log weekly industrial tasks with hours worked (`POST /api/logbooks/weekly`).
- Faculty mentors review, provide feedback, grade 1–5 stars, and approve (`POST /api/logbooks/{id}/review`).
- The system maintains an aggregated ledger of approved contact hours (`GET /api/logbooks/hours/approved`) until reaching the mandatory 240-hour threshold.

### 4.3 Public Cryptographic Verifiers (Fail-Closed)
- **NOC Verifier (`/verify/noc/:code`):** Anyone (embassies, companies, recruiters) can verify student clearance without login. Returns institutional seal or fail-closed 404.
- **Certificate Verifier (`/verify/certificate/:num`):** Public verification of degree completion certificates with tamper-proof SHA-256 digital signature hashes.

### 4.4 Neural ATS Resume Scanner & Entity Extractor
- Client-side text stream parser for `.pdf`, `.docx`, and `.txt` files.
- Extracts candidate name, email, phone, branch, CGPA, graduation year, and technical skills against a 150+ keyword dictionary.
- Computes real-time ATS match readiness and syncs extracted attributes to the student's backend profile.

---

## 5. Directory Structure Map

```
d:/Team Parsu
├── memory.md                                # Permanent Codebase Intelligence (This File)
├── architecture.md                          # Full Architectural Specification
├── routes.md                                # Frontend Route Matrix & Security Guards
├── api-map.md                               # Complete REST API Inventory
├── database-map.md                          # Relational Schema & Entity Relationships
├── dependency-graph.md                      # Module & Dependency Hierarchy
│
├── vilp-backend/                            # Spring Boot 3.3.4 Java Backend
│   ├── pom.xml                              # Maven Dependencies (Security, JPA, Flyway, Bucket4j)
│   ├── Dockerfile                           # Multi-stage Container Build
│   └── src/main/
│       ├── java/com/vilp/
│       │   ├── admin/                       # User Governance & Bulk Data Ingestion
│       │   ├── ai/                          # Gemini AI Recommendation & Resume Evaluation
│       │   ├── analytics/                   # Placement KPIs & Department Aggregate Metrics
│       │   ├── application/                 # Internship Applications & Status Lifecycles
│       │   ├── audit/                       # AOP System Activity & Security Logs
│       │   ├── auth/                        # JWT Auth, Refresh Tokens & Dual-OTP Engine
│       │   ├── certificate/                 # Accredited Certificate Generation & Verification
│       │   ├── common/                      # DTO Envelopes, Sanitization & Public Endpoints
│       │   ├── company/                     # Corporate Partner Profiles & KYC Auditing
│       │   ├── config/                      # SecurityConfig, CORS, RateLimiting & AOP
│       │   ├── documents/                   # Multipart File Upload, Hashing & Blob Stream
│       │   ├── eligibility/                 # CGPA, Backlog & Department Rule Engine
│       │   ├── evaluation/                  # Mentor 5-Dimension Competency Rubrics
│       │   ├── internship/                  # Internship Postings, Deadlines & Work Modes
│       │   ├── logbook/                     # Weekly 40-hr Task Submission & Mentor Review
│       │   ├── notification/                # SSE Streaming & In-App Alerts
│       │   ├── offer/                       # Single-Active Offer Mutex & Autonomous NOCs
│       │   ├── ppo/                         # Pre-Placement Offer (PPO) Registry
│       │   ├── security/                    # Custom UserDetails, JWT Filter & Token Provider
│       │   ├── student/                     # Student Profile KYC & Technical Skill Mapping
│       │   ├── user/                        # User, Role & Password Entities
│       │   └── verification/                # Institutional KYC Review Queue
│       └── resources/
│           ├── application.yml              # Database, JWT, Actuator & Mail Config
│           └── db/migration/                # 15 Versioned Flyway SQL Migration Scripts
│
└── vilp-frontend/                           # React 19 / TypeScript / Vite Single-Page App
    ├── package.json                         # Scripts & Client Dependencies
    ├── vite.config.ts                       # Build Configuration & Path Aliases (@/*)
    ├── scripts/
    │   └── test-loop.mjs                    # Automated Continuous E2E Test Runner Loop
    └── src/
        ├── features/
        │   ├── auth/                        # Login, Register, Forgot Password, Reset Password
        │   └── onboarding/                  # Multi-Role Onboarding Wizard & ATS Parser
        ├── pages/
        │   ├── student/                     # Student Dashboard, Profile, Offers, Logbooks
        │   ├── company/                     # Recruiter Dashboard, Postings, Applicants, Billing
        │   ├── mentor/                      # Faculty Mentor Dashboard, Logbook Reviews, Rubrics
        │   ├── tnp/                         # Placement Dashboard, NOC Queue, PPO Registry
        │   ├── admin/                       # Admin User Management & System Logs
        │   └── public/                      # Landing Page, Public NOC & Certificate Verifiers
        ├── services/
        │   ├── axiosInstance.ts             # Axios HTTP Client with JWT Token Interceptors
        │   └── vilpApi.ts                   # Strongly Typed API Domain SDK
        └── stores/
            └── authStore.ts                 # Zustand Authentication & Session State Store
```

---

## 6. Authentication & Session Flow

```
1. User submits credentials via /api/auth/login or completes /onboarding wizard
2. Backend validates BCrypt hash & verifies email_verified == true
3. JwtTokenProvider generates:
   - Access Token: 30 minutes expiry, HS256 signed with userId & role
   - Refresh Token: 7 days expiry, stored in database for rotation
4. Frontend tokenUtils stores tokens in localStorage
5. Axios Interceptor automatically attaches "Authorization: Bearer <token>"
6. On 401 response, Axios interceptor automatically requests /api/auth/refresh
7. If refresh fails, tokens are cleared and user is redirected to /auth/login
```
