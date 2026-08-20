# Verified Internship Lifecycle Platform (VILP)

> **AICTE §7.2 & NEP-2020 Accredited Institutional Internship Lifecycle, Document Vault & Verification Ecosystem**

---

## 🏛️ Executive Summary

The **Verified Internship Lifecycle Platform (VILP)** is an enterprise-grade university internship management ecosystem engineered to standardize, streamline, and cryptographically verify the complete internship lifecycle across five institutional stakeholders: **Students**, **Corporate Recruiters**, **Faculty Mentors**, **Training & Placement (T&P) Officers**, and **University Administrators**.

VILP enforces strict compliance with **AICTE (All India Council for Technical Education)** and **NEP-2020** mandates, featuring a **240 contact-hour degree credit accumulator**, **single-active mutex allocation locks**, **48-hour offer decision windows**, **AI-powered ATS resume matching**, **5-dimension faculty mentorship rubrics**, and **SHA-256 tamper-proof credential verification**.

---

## ⚡ Multi-Platform Architecture

```
                                  VILP MULTI-PLATFORM ECOSYSTEM
       ┌──────────────────────────────────────┬──────────────────────────────────────┐
       │   React Web Portal (Port 5173)       │   Next.js 14 SSR (Port 3000)         │
       │   • Swiss Editorial Design System    │   • React Server Components (RSC)    │
       │   • Live Supabase Realtime Chimes    │   • Server Actions & SSR Verifiers   │
       │   • Shimmer Skeletons & Boundaries   │   • Edge Session Refresher           │
       └──────────────────┬───────────────────┴──────────────────┬───────────────────┘
                          │                                      │
                          │        Flutter 3 Mobile App          │
                          │   • Clean Architecture / Material 3  │
                          │   • 240h Meter & 5-D Mentor Rubrics  │
                          │   • Stamped AICTE NOC QR Modal       │
                          └──────────────────┬───────────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
             Spring Boot 3.3.5 Backend                 Supabase Cloud Platform
         • Argon2/JWT Multi-Role Auth              • PostgreSQL 16 (22 Tables)
         • Bulk University Ingestion Engine        • 4 Storage Buckets (Vault)
         • 48h Offer Auto-Expiry Cron              • 3 Automated Database Triggers
         • Cryptographic SHA-256 PDF Stamping      • Row Level Security (RLS)
```

---

## 🚀 Key Functional Modules

### 1. 🎓 AICTE 240-Hour Degree Credit Accumulator
- Tracks weekly student logbooks submitted with task summaries and skill tags.
- Enforces a strict weekly cap of 40 hours to satisfy institutional contact-hour guidelines.
- Auto-increments verified degree credit gauges via PostgreSQL database triggers upon faculty mentor approval.

### 2. 🔒 Single-Active Allocation Lock (Mutex Engine)
- Prevents students from holding multiple simultaneous offers.
- When an offer is accepted, all other pending applications and interview queues for that student are automatically closed.

### 3. ⏱️ 48-Hour Decision Window & Auto-Expiry Scheduler
- Offer acceptance countdown with live tick-by-tick visual timers.
- Background Spring Boot scheduler auto-expires unaccepted offers past the 48-hour deadline and releases interview locks.

### 4. 🤖 AI ATS Resume Radar & Skill Gap Analyzer
- Evaluates candidate resumes against institutional eligibility criteria and required competencies.
- Computes deterministic **0–100 ATS scores**, technical fit percentages, and actionable learning roadmaps.

### 5. 🔏 Cryptographic SHA-256 Ledger & Public QR Verifiers
- Issues digital **AICTE Institutional NOC Clearances** and **Degree Completion Certificates**.
- Embeds unique verification hashes and QR codes linking to public SSR verification endpoints (`/verify/certificate/:token` and `/verify/noc/:code`).

### 6. 🔔 Real-Time Event Streaming & Web Audio Chimes
- Realtime WebSocket change subscriptions on PostgreSQL tables.
- Synthesizes harmonic two-tone audio chimes (587.33Hz $\rightarrow$ 880Hz) via the browser Web Audio API on incoming dispatches.

---

## 📁 Repository Structure

```
d:/Team Parsu/
├── vilp-frontend/              # React 18 / Vite / TypeScript Web Application
│   ├── src/
│   │   ├── features/           # Auth, Roles, Profile, and Opportunities
│   │   ├── components/         # Editorial Skeletons, Modals, ErrorBoundary
│   │   ├── hooks/              # useDebounce, useThrottle, useRealtime
│   │   ├── pages/              # Student, Company, Mentor, T&P, Admin Dashboards
│   │   ├── services/           # Supabase Client, Storage & API Handlers
│   │   └── routes/             # Role-Protected Route Matrix
│   └── package.json
│
├── vilp-nextjs/                # Next.js 14 App Router + Supabase SSR Portal
│   ├── app/
│   │   ├── internships/        # React Server Component (RSC) Opportunity Catalog
│   │   ├── verify/certificate/ # High-Performance SSR Public Verifier
│   │   └── layout.tsx          # Editorial Layout & Brand Status Ribbon
│   ├── utils/supabase/         # SSR Server, Client & Middleware Helpers
│   ├── middleware.ts           # Edge Session Refresher
│   └── package.json
│
├── vilp_mobile/                # Flutter 3 Cross-Platform Mobile Application
│   ├── lib/
│   │   ├── core/               # Theme, Constants, Dio Client, Storage & Supabase
│   │   ├── shared/             # MultiProvider State & Navigation
│   │   └── features/           # 5-Tab Student Command, Mentor Rubric & NOC Modals
│   └── pubspec.yaml
│
├── vilp-backend/               # Spring Boot 3.3.5 Enterprise Microservice
│   ├── src/main/java/com/vilp/ # 23 Domain Packages (Auth, AI, Admin, Eligibility)
│   ├── src/main/resources/
│   │   ├── db/migration/       # 13 Flyway SQL Migrations
│   │   └── application.yml     # Database & Security Configuration
│   └── pom.xml
│
└── scripts/                    # Database Migrations & Seeding Utilities
    ├── migrate_supabase.js     # Applies Flyway migrations to Supabase
    └── seed_full_ecosystem.js  # Seeds sample data across all 22 tables
```

---

## 🎨 Swiss Editorial Design Tokens

VILP utilizes a **Swiss Editorial Design System** engineered for clarity, academic authority, and visual hierarchy:

| Token Name | Hex Code | Semantic Purpose |
| :--- | :---: | :--- |
| **Purple Heart** | `#723ECF` | Primary Brand Color, Action Buttons, Active Navigation |
| **French Rose** | `#ED4B86` | Badges, Highlights, Warnings, Critical Alerts |
| **Whisper Light** | `#F4EEF7` | Neutral Backgrounds, Subtle Container Borders |
| **Off Yellow** | `#FEF8E7` | Header Ribbons, Demo Matrix Callouts, Status Indicators |
| **Obsidian Dark** | `#171024` | Primary Typography, High-Contrast Score Meters |

---

## 🔑 Demo Authentication Matrix

Use any of the pre-configured credentials below to test different role permissions:

| Role | Email | Password | Access Scope |
| :--- | :--- | :---: | :--- |
| **Student** | `student@vilp.edu` | `Password@123` | Opportunities, AI Radar, Logbooks, Offers, NOC |
| **Company Recruiter** | `recruiter@google.com` | `Password@123` | Post Jobs, Shortlist Applicants, Issue 48h Offers |
| **Faculty Mentor** | `mentor@vilp.edu` | `Password@123` | Logbook Review, 5-D Evaluation Rubrics, PPO Endorsements |
| **T&P Officer** | `tnp.officer@vilp.edu` | `Password@123` | Verification Queue, NOC Approvals, PPO Registry |
| **T&P Head** | `tnp.head@vilp.edu` | `Password@123` | University Placement Analytics, Compliance Exporter |
| **Super Admin** | `admin@vilp.edu` | `Password@123` | User Governance, Role Assignment, Bulk Ingestion |

---

## 🛠️ Local Setup & Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Java Development Kit (JDK)**: `v21` or higher
- **Flutter SDK**: `v3.x` (for mobile)
- **Supabase Account / Project**: PostgreSQL credentials

---

### 1. React Web Portal (`vilp-frontend`)

```bash
cd vilp-frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
# Portal will be available at http://localhost:5173
```

---

### 2. Next.js 14 App Router + Supabase SSR (`vilp-nextjs`)

```bash
cd vilp-nextjs

# Install dependencies
npm install

# Run development server
npm run dev
# Next.js portal will run on http://localhost:3000

# Run production build validation
npm run build
```

---

### 3. Flutter Mobile Application (`vilp_mobile`)

```bash
cd vilp_mobile

# Fetch Flutter dependencies
flutter pub get

# Run on connected device, emulator, or Chrome
flutter run
```

---

### 4. Spring Boot Backend (`vilp-backend`)

```bash
cd vilp-backend

# Build with Maven
mvn clean package -DskipTests

# Run Spring Boot application
mvn spring-boot:run
# REST API documentation available at http://localhost:8080/swagger-ui.html
```

---

## ☁️ Supabase Cloud Configuration

- **Supabase URL**: `https://pabrkfwturuzewbkswwu.supabase.co`
- **Database Engine**: PostgreSQL 16 (22 Relational Tables)
- **Storage Buckets**:
  - `resumes` (Student PDF resumes)
  - `kyc-documents` (Identity proofs with 1-hour signed URLs)
  - `certificates` (Accredited degree completion certificates)
  - `stamped-nocs` (AICTE clearance letters with SHA-256 seals)

---

## 📜 Compliance & Institutional Standards

- **AICTE §7.2**: Contact-Hour Logbook & Faculty Mentorship Standards
- **NEP-2020**: National Higher Education Internship Guidelines
- **RFC 7807**: Problem Details for HTTP APIs (Standardized Error Payloads)
- **FIPS 180-4**: SHA-256 Cryptographic Hash Stamping for Verification Seals

---

## 👥 Contributors & Maintainers
- **Engineering Team**: Team Parsu
- **Project**: Verified Internship Lifecycle Platform (VILP)
