# Technical Requirements Document (TRD)

## 1. Document Information

**Product:** Verified Internship Lifecycle Platform  
**Document:** Technical Requirements Document (TRD)  
**Version:** 1.0  
**Architecture:** API-first, web-first, mobile-ready  
**Primary Backend:** Java + Spring Boot  
**Primary Frontend:** React + TypeScript  
**Database:** PostgreSQL  
**Automation:** n8n  
**AI Layer:** Separate AI service/API  
**Target:** GHR Inter-Track Hackathon MVP

The technical design must support the hackathon's required journey from registration and eligibility through application, selection, verification, progress, completion and PPO.

---

# 2. Technical Objective

Build a secure, modular and scalable internship management platform in which:

```text
Users
  ↓
Authentication
  ↓
Role-Based Authorization
  ↓
Verified Profiles
  ↓
Internship Lifecycle
  ↓
Documents + Verification
  ↓
Progress + Evaluation
  ↓
Completion + PPO
  ↓
Analytics
```

The architecture must allow the web application to be extended later into a mobile application without rewriting the backend.

---

# 3. Recommended Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Build Tool | Vite |
| UI | Tailwind CSS + reusable component library |
| State Management | TanStack Query + local state; Zustand where needed |
| Form Handling | React Hook Form |
| Validation | Zod |
| Backend | Java 21 + Spring Boot |
| Security | Spring Security |
| Authentication | JWT + OAuth 2.0 / Google |
| API | REST |
| ORM | Spring Data JPA / Hibernate |
| Database | PostgreSQL |
| Database Migration | Flyway |
| File Storage | S3-compatible object storage |
| Cache | Redis, optional for MVP |
| AI | Separate Python/API service or external model API |
| Automation | n8n |
| Email | SMTP / transactional email provider |
| QR | Server-generated QR code |
| API Documentation | OpenAPI / Swagger |
| Testing | JUnit + Mockito + Testcontainers + Playwright |
| Deployment | Docker |
| CI/CD | GitHub Actions |

### Important architecture decision

Do **not** put AI logic directly inside the React frontend.

Do **not** make n8n the primary business backend.

The system of record should remain:

```text
React
   ↓
Spring Boot
   ↓
PostgreSQL
```

AI and n8n should be supporting services.

---

# 4. System Architecture

```text
                         ┌─────────────────────┐
                         │   React Web / PWA   │
                         └──────────┬──────────┘
                                    │
                              HTTPS / REST
                                    │
                         ┌──────────▼──────────┐
                         │    Spring Boot      │
                         │      Backend        │
                         └──────────┬──────────┘
                                    │
        ┌───────────────────────────┼──────────────────────────┐
        │                           │                          │
        ▼                           ▼                          ▼
┌───────────────┐          ┌────────────────┐         ┌────────────────┐
│  PostgreSQL   │          │ Object Storage │         │   AI Service   │
│   Database    │          │ Documents      │         │ Recommendation │
└───────────────┘          └────────────────┘         └────────────────┘
                                    │
                                    │
                             ┌──────▼──────┐
                             │     n8n     │
                             │ Automation  │
                             └──────┬──────┘
                                    │
                       ┌────────────┼────────────┐
                       ▼            ▼            ▼
                    Email       Alerts       Other APIs

                                    │
                             ┌──────▼──────┐
                             │ QR Verify   │
                             │ Public API  │
                             └─────────────┘
```

---

# 5. Architecture Style

Use a modular monolith for the hackathon.

Do **not** start with microservices.

Recommended structure:

```text
Frontend
    ↓
API Layer
    ↓
Application/Service Layer
    ↓
Repository Layer
    ↓
PostgreSQL
```

With external integrations:

```text
AI Service
n8n
Object Storage
Email Provider
```

### Why modular monolith?

A microservice architecture would introduce:

- service discovery
- network failures
- deployment complexity
- distributed transactions
- extra debugging

The hackathon needs a working MVP, not infrastructure complexity. The guide explicitly says teams do not need to build a huge commercial product.

---

# 6. Frontend Technical Requirements

## 6.1 Application Structure

```text
src/
├── app/
├── components/
├── layouts/
├── pages/
├── features/
│   ├── auth/
│   ├── student/
│   ├── company/
│   ├── internship/
│   ├── applications/
│   ├── verification/
│   ├── mentor/
│   ├── progress/
│   ├── analytics/
│   ├── documents/
│   └── ai/
├── services/
├── hooks/
├── stores/
├── types/
├── utils/
└── routes/
```

## 6.2 Role-Based UI

Routes must be protected according to role.

Example:

```text
/student/*
/company/*
/mentor/*
/tnp/*
/admin/*
```

Frontend protection is only a UX feature.

Actual authorization must happen in Spring Security.

---

# 7. Backend Project Structure

```text
src/main/java/com/internshipplatform/

├── config/
├── security/
├── auth/
├── user/
├── student/
├── company/
├── internship/
├── eligibility/
├── application/
├── selection/
├── verification/
├── documents/
├── mentor/
├── progress/
├── evaluation/
├── completion/
├── ppo/
├── notification/
├── analytics/
├── ai/
├── qr/
├── audit/
├── common/
└── exception/
```

Each module should contain:

```text
controller
service
repository
entity
dto
mapper
validator
```

---

# 8. Authentication Requirements

## Supported authentication

### Method 1 — Email/password

```text
Registration
↓
Email verification
↓
Password setup
↓
Login
```

### Method 2 — Google

```text
Google OAuth
↓
Authentication
↓
User mapping
↓
Role assignment
```

The application must not automatically grant institutional privileges based only on Google authentication.

---

# 9. Authorization

Use:

**RBAC + resource-level authorization**

Roles:

```text
STUDENT
COMPANY
MENTOR
TNP_OFFICER
TNP_HEAD
SUPER_ADMIN
```

Example:

```text
GET /api/students/{id}
```

must verify that the requesting user has permission to access that student's record.

The frontend hiding a button is not sufficient.

---

# 10. JWT Security

Recommended model:

```text
Access Token
Short lifetime
        +
Refresh Token
Longer lifetime
```

The access token contains:

```json
{
  "sub": "USER_ID",
  "roles": ["STUDENT"],
  "iss": "internship-platform",
  "iat": 0,
  "exp": 0
}
```

Do not store sensitive information such as passwords, identity documents or private profile data in JWT claims.

---

# 11. Password Security

Passwords must never be stored as plaintext.

Use:

```text
Argon2id
```

or a properly configured BCrypt implementation.

Additional requirements:

- minimum password policy
- password reset token
- token expiry
- account lock/rate limiting after repeated failures

---

# 12. Core Database Design

## 12.1 users

```text
id
email
password_hash
google_subject
role_id
status
email_verified
created_at
updated_at
```

## 12.2 roles

```text
id
name
description
```

## 12.3 students

```text
id
user_id
student_number
full_name
department_id
branch
semester
cgpa
backlogs
passing_year
phone
verification_status
profile_completion
created_at
updated_at
```

## 12.4 companies

```text
id
user_id
name
description
website
industry
contact_email
contact_phone
verification_status
verification_date
created_at
updated_at
```

## 12.5 internships

```text
id
company_id
title
description
location
mode
duration
start_date
end_date
stipend
vacancies
application_deadline
status
verification_status
created_at
updated_at
```

---

# 13. Internship Requirements Schema

```text
internship_requirements

id
internship_id
minimum_cgpa
maximum_backlogs
department
branch
passing_year
required_experience
required_certifications
```

Skills should be represented through a many-to-many relation:

```text
internships
    ↕
internship_skills
    ↕
skills
```

---

# 14. Application Schema

```text
applications

id
internship_id
student_id
status
applied_at
updated_at
withdrawn_at
rejection_reason
```

Allowed statuses:

```text
APPLIED
SHORTLISTED
INTERVIEW
SELECTED
REJECTED
WITHDRAWN
```

---

# 15. Verification Schema

Use a common verification model.

```text
verifications

id
entity_type
entity_id
verification_type
status
submitted_by
verified_by
verification_notes
rejection_reason
submitted_at
verified_at
```

Possible entity types:

```text
STUDENT
COMPANY
INTERNSHIP
DOCUMENT
OFFER
CERTIFICATE
```

Possible statuses:

```text
PENDING
UNDER_REVIEW
VERIFIED
REJECTED
SUSPENDED
```

---

# 16. Document Management Architecture

Documents should be stored outside PostgreSQL.

Database stores metadata:

```text
documents

id
entity_type
entity_id
document_type
storage_key
original_filename
mime_type
size
uploaded_by
status
verified_by
verification_reason
created_at
updated_at
```

Object storage contains the actual file.

Example:

```text
s3://bucket/internships/INT-2026-00452/offers/offer.pdf
```

The API should issue temporary/signed URLs rather than exposing the storage bucket publicly.

---

# 17. Required Document Types

Based on the hackathon guide, the system must support:

```text
STUDENT_ID_PROOF
ACADEMIC_PROOF
RESUME

COMPANY_PROOF

OFFER_LETTER
ACCEPTANCE_LETTER
JOINING_LETTER

WEEKLY_REPORT
FINAL_INTERNSHIP_REPORT

MENTOR_EVALUATION
COMPANY_EVALUATION

COMPLETION_CERTIFICATE

PPO_DOCUMENT
```

The guide explicitly calls for offer letters, joining letters, acceptance, reports, completion certificates and PPO documents.

Additional identity/company proof types should remain configurable rather than hard-coded.

---

# 18. File Security

Allowed file formats for MVP:

```text
PDF
DOCX
JPG
PNG
```

Requirements:

- maximum upload size
- MIME type validation
- file extension validation
- generated storage filename
- virus/malware scanning where available
- private object storage
- authorization before download
- audit logging

Never trust the filename extension alone.

---

# 19. Eligibility Engine

The eligibility service should be deterministic.

API:

```http
POST /api/internships/{id}/eligibility/check
```

Request:

```json
{
  "studentId": "STU-001",
  "internshipId": "INT-001"
}
```

Response:

```json
{
  "eligible": false,
  "reasons": [
    {
      "rule": "REQUIRED_SKILL",
      "message": "Required skill missing: Spring Boot"
    }
  ]
}
```

Supported rules:

```text
MIN_CGPA
MAX_BACKLOGS
DEPARTMENT
BRANCH
PASSING_YEAR
SKILL
CERTIFICATION
EXPERIENCE
CUSTOM_CRITERIA
```

---

# 20. Eligibility Rule Evaluation Order

Recommended:

```text
1. Account verified?
2. Profile complete?
3. CGPA
4. Backlogs
5. Department
6. Branch
7. Passing year
8. Required certifications
9. Required skills
10. Experience
```

The engine should return all applicable failure reasons rather than stopping at the first failure.

This is important because the guide explicitly requires the platform to explain why a student is not eligible.

---

# 21. AI Architecture

Keep AI behind an internal API.

```text
Spring Boot
      ↓
AI Gateway
      ↓
AI Provider / Model
```

Possible endpoints:

```text
POST /api/ai/recommendations
POST /api/ai/resume-score
POST /api/ai/skill-gap
```

---

# 22. AI Recommendation Requirements

Inputs:

```text
Student Profile
Resume
Skills
Interests
Academic Information

+

Internship Requirements
```

Output:

```json
{
  "internshipId": "INT-001",
  "matchScore": 91,
  "matchedSkills": [
    "Java",
    "SQL"
  ],
  "missingSkills": [
    "Spring Boot"
  ],
  "reasons": [
    "Strong Java match",
    "CGPA meets requirement"
  ]
}
```

AI output should be advisory only.

The backend eligibility engine remains the authoritative source for eligibility.

---

# 23. Resume Scoring

Resume processing pipeline:

```text
Resume Upload
    ↓
Text Extraction
    ↓
Normalization
    ↓
Skill Extraction
    ↓
Internship Requirement Comparison
    ↓
Score
    ↓
Recommendations
```

The AI should not directly decide whether a student is selected.

---

# 24. Skill-Gap Analysis

Example:

```text
Required:
Java
Spring Boot
SQL
Docker

Student:
Java
SQL

Gap:
Spring Boot
Docker
```

Output:

```text
Skill Gap = 2
Match = 50%
```

The system may then recommend learning resources.

---

# 25. QR Verification Architecture

When an internship is verified:

```text
Internship ID
       ↓
Verification Token
       ↓
QR Generator
       ↓
QR Image
```

Public endpoint:

```http
GET /verify/internship/{verificationToken}
```

The public response must expose only safe information.

Example:

```json
{
  "valid": true,
  "company": "XYZ Technologies",
  "internship": "Backend Developer Intern",
  "status": "VERIFIED",
  "verifiedAt": "2026-08-18"
}
```

Never expose:

- student email
- phone
- address
- identity document
- internal IDs
- private evaluations

---

# 26. Internship State Machine

Backend should enforce valid transitions.

```text
DRAFT
 ↓
PUBLISHED
 ↓
APPLICATION_OPEN
 ↓
APPLICATION_CLOSED
 ↓
SELECTION
 ↓
OFFER_PENDING
 ↓
TNP_REVIEW
 ↓
VERIFIED
 ↓
ONGOING
 ↓
COMPLETION_REVIEW
 ↓
COMPLETED
 ↓
PPO_UPDATED
```

Example:

```text
STUDENT
cannot directly change:

TNP_REVIEW → VERIFIED
```

Only an authorized T&P user can perform that transition.

---

# 27. Mentor Assignment

Table:

```text
mentor_assignments

id
mentor_id
student_id
internship_id
assigned_by
assigned_at
status
```

The mentor must only see students assigned to them.

---

# 28. Progress Tracking

Table:

```text
progress_logs

id
internship_id
student_id
week_number
summary
tasks_completed
learning
challenges
next_plan
progress_percentage
status
submitted_at
reviewed_at
```

Possible status:

```text
DRAFT
SUBMITTED
REVIEWED
FLAGGED
```

---

# 29. Evaluation Schema

```text
evaluations

id
internship_id
evaluator_id
evaluator_role
technical_score
communication_score
discipline_score
performance_score
overall_score
comments
submitted_at
```

Supported evaluator roles:

```text
MENTOR
COMPANY
```

---

# 30. Completion Logic

Completion should not happen simply because the end date has passed.

Example completion conditions:

```text
Required Progress Reports = complete
Mentor Evaluation = complete
Company Evaluation = complete
Required Documents = verified
T&P Review = complete
```

Then:

```text
COMPLETION_APPROVED
```

---

# 31. PPO Module

Schema:

```text
ppo_records

id
internship_id
student_id
company_id
status
offered_date
accepted_date
remarks
document_id
```

Statuses:

```text
NOT_OFFERED
OFFERED
ACCEPTED
DECLINED
UNDER_REVIEW
```

---

# 32. Notification Architecture

Application events should be published internally.

Example:

```text
Application Selected
        ↓
Event
        ↓
Notification Service
        ↓
n8n Webhook
        ↓
Email
```

n8n should not be required for the application transaction to succeed.

If n8n is unavailable:

```text
Application = SUCCESS
Notification = RETRY
```

not:

```text
Application = FAILURE
```

---

# 33. n8n Workflows

## Workflow 1 — Student Selected

```text
Webhook
 ↓
Read Event
 ↓
Fetch Student
 ↓
Fetch Internship
 ↓
Send Email
 ↓
Create Notification
```

## Workflow 2 — Weekly Report Reminder

```text
Scheduled Trigger
 ↓
Find Missing Reports
 ↓
Send Reminder
 ↓
Notify Mentor
```

## Workflow 3 — T&P Verification

```text
Verification Approved
 ↓
Student Email
 ↓
Company Email
 ↓
Mentor Assignment Trigger
```

---

# 34. REST API Specification

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

## Students

```http
GET    /api/students/me
PUT    /api/students/me
GET    /api/students/{id}
POST   /api/students/me/skills
DELETE /api/students/me/skills/{skillId}
```

## Companies

```http
POST   /api/companies
GET    /api/companies/{id}
PUT    /api/companies/{id}
POST   /api/companies/{id}/verification
```

## Internships

```http
POST   /api/internships
GET    /api/internships
GET    /api/internships/{id}
PUT    /api/internships/{id}
DELETE /api/internships/{id}
POST   /api/internships/{id}/publish
```

## Eligibility

```http
POST /api/internships/{id}/eligibility/check
GET  /api/internships/{id}/eligibility
```

## Applications

```http
POST /api/internships/{id}/applications
GET  /api/students/me/applications
GET  /api/companies/me/applications
PATCH /api/applications/{id}/status
```

## Documents

```http
POST /api/documents
GET  /api/documents/{id}
DELETE /api/documents/{id}
POST /api/documents/{id}/verify
POST /api/documents/{id}/reject
```

## Verification

```http
POST /api/verifications
GET  /api/verifications/{id}
POST /api/verifications/{id}/approve
POST /api/verifications/{id}/reject
```

## Mentor

```http
POST /api/mentor-assignments
GET  /api/mentors/me/students
```

## Progress

```http
POST /api/progress
GET  /api/internships/{id}/progress
PATCH /api/progress/{id}
```

## Evaluation

```http
POST /api/evaluations
GET  /api/internships/{id}/evaluations
```

## Analytics

```http
GET /api/analytics/tnp
GET /api/analytics/company
GET /api/analytics/mentor
GET /api/analytics/student
```

## QR Verification

```http
GET /api/public/verify/internship/{token}
GET /api/public/verify/certificate/{token}
```

---

# 35. API Standards

Every API should use consistent responses.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Validation error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "fields": {}
  }
}
```

Unauthorized:

```text
401
```

Forbidden:

```text
403
```

Not found:

```text
404
```

Conflict:

```text
409
```

Server failure:

```text
500
```

---

# 36. Database Constraints

The database must enforce integrity wherever possible.

Examples:

```text
users.email UNIQUE
students.student_number UNIQUE
companies.verification identifiers UNIQUE where applicable
applications(student_id, internship_id) UNIQUE
```

Foreign keys must be used for relationships.

Soft deletion should be considered for important institutional records instead of physical deletion.

---

# 37. Audit Logging

Every sensitive action should create an audit event.

Examples:

```text
USER_CREATED
ROLE_CHANGED
STUDENT_VERIFIED
COMPANY_VERIFIED
INTERNSHIP_APPROVED
APPLICATION_STATUS_CHANGED
DOCUMENT_VERIFIED
DOCUMENT_REJECTED
MENTOR_ASSIGNED
EVALUATION_SUBMITTED
COMPLETION_APPROVED
PPO_UPDATED
```

Schema:

```text
audit_logs

id
actor_user_id
action
entity_type
entity_id
old_value
new_value
ip_address
user_agent
created_at
```

---

# 38. Security Requirements

## Mandatory

- HTTPS
- password hashing
- JWT validation
- role-based authorization
- object-level authorization
- input validation
- secure file upload
- rate limiting
- CORS restrictions
- audit logging
- database constraints
- private object storage

## Sensitive Data

Identity documents, student contact data and private evaluations must not be publicly accessible.

Public QR verification should expose only minimum necessary information.

---

# 39. API Security Rules

Every protected endpoint must answer:

```text
Who is calling?
What role do they have?
Which resource are they trying to access?
Are they allowed to access that specific resource?
```

Example:

A mentor cannot access:

```http
GET /api/students/999
```

just because they are a mentor.

They should only access the student if:

```text
student ∈ mentor.assigned_students
```

---

# 40. Logging & Monitoring

Application logs should contain:

```text
timestamp
level
service
request ID
user ID where appropriate
endpoint
execution time
result
```

Never log:

- passwords
- access tokens
- identity document contents
- sensitive personal information

---

# 41. Performance Requirements

For MVP:

### API

Target:

```text
p95 < 500 ms
```

for ordinary CRUD requests under normal demo load.

### Database

Use indexes on:

```text
email
student_number
internship status
company_id
student_id
application status
verification status
created_at
```

### Pagination

Required for:

- internship lists
- application lists
- students
- companies
- audit logs
- documents

Do not load thousands of records into the browser at once.

---

# 42. Search & Filtering

Students should be able to filter internships by:

```text
skill
company
location
mode
stipend
duration
department
deadline
```

Companies should be able to filter applicants by:

```text
CGPA
skills
department
passing year
eligibility
application status
AI match score
```

---

# 43. Analytics Architecture

Do not calculate every dashboard metric by loading every row into Java memory.

Use optimized database queries.

Examples:

```text
COUNT applications
COUNT selected applications
COUNT completed internships
AVG stipend
MIN stipend
MAX stipend
GROUP BY department
GROUP BY company
GROUP BY internship status
```

For MVP, database aggregation queries are sufficient.

---

# 44. Frontend State Strategy

Use:

### Server state

TanStack Query for:

- internships
- applications
- profiles
- analytics
- progress
- documents

### Local state

React/Zustand for:

- UI state
- filters
- modal state
- temporary form state

Avoid putting the entire server database into a global Zustand store.

---

# 45. Responsive / Mobile-Ready Requirements

The web application must support:

```text
Desktop
Tablet
Mobile
```

The most important student workflows must work on mobile:

- login
- profile
- internship discovery
- eligibility
- apply
- progress submission
- document upload

A native mobile app can later reuse the same Spring Boot APIs.

---

# 46. PWA Requirements

For the MVP, optionally support:

- installable web app
- responsive UI
- basic offline shell
- push notifications where practical

Do not make offline synchronization a critical feature.

---

# 47. Testing Strategy

## Unit Testing

Backend:

```text
JUnit
Mockito
```

Test:

- eligibility rules
- permission checks
- state transitions
- service logic
- validation

## Integration Testing

Use:

```text
Testcontainers
```

to test:

- PostgreSQL
- repositories
- API authentication
- transactional workflows

## End-to-End Testing

Use:

```text
Playwright
```

Test the complete workflow:

```text
Register
→ Verify
→ Browse
→ Eligibility
→ Apply
→ Select
→ Offer
→ T&P Verify
→ Mentor
→ Progress
→ Completion
```

---

# 48. Critical Test Cases

### Security

```text
Student cannot access T&P endpoint
Company cannot access another company's private internship
Mentor cannot access unassigned student
Student cannot modify verification result
```

### Eligibility

```text
CGPA below threshold → NOT ELIGIBLE
Backlog above threshold → NOT ELIGIBLE
Wrong department → NOT ELIGIBLE
Missing skill → NOT ELIGIBLE
All requirements satisfied → ELIGIBLE
```

### Applications

```text
Ineligible student cannot apply
Duplicate application rejected
Closed internship cannot accept applications
Rejected student cannot change own selection status
```

### Workflow

```text
Unverified internship cannot become active
Invalid state transition rejected
Only authorized T&P can verify
Only company can issue offer
Only authorized mentor can evaluate assigned student
```

---

# 49. Deployment Architecture

For the hackathon:

```text
                     Internet
                         │
                         ▼
                  React Frontend
                         │
                         ▼
                  Spring Boot API
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
         PostgreSQL   Storage     AI API
                         │
                         ▼
                        n8n
```

Dockerize:

```text
frontend
backend
postgres
```

External managed services can be used for:

- object storage
- AI
- email
- n8n

---

# 50. Environment Configuration

Separate:

```text
development
testing
production
```

Never commit secrets.

Use:

```text
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
JWT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
STORAGE_ACCESS_KEY
STORAGE_SECRET_KEY
AI_API_KEY
N8N_WEBHOOK_SECRET
MAIL_USERNAME
MAIL_PASSWORD
```

Use environment variables or a secrets manager.

---

# 51. CI/CD

Recommended GitHub Actions pipeline:

```text
Push / Pull Request
        ↓
Lint
        ↓
Unit Tests
        ↓
Integration Tests
        ↓
Build
        ↓
Docker Build
        ↓
Deploy
```

The hackathon MVP does not need an elaborate Kubernetes deployment.

---

# 52. Database Migration

Use Flyway.

Example:

```text
V1__create_users.sql
V2__create_roles.sql
V3__create_students.sql
V4__create_companies.sql
V5__create_internships.sql
V6__create_applications.sql
V7__create_documents.sql
V8__create_verifications.sql
V9__create_progress.sql
V10__create_evaluations.sql
V11__create_analytics_support.sql
V12__create_audit_logs.sql
```

Never manually modify the production schema.

---

# 53. Seed Demo Data

The hackathon requires sample/demo data so the jury can test the system.

Seed data should include:

```text
10+ students
3 companies
5 internships
multiple applications
selected candidates
one ongoing internship
one completed internship
mentor assignments
progress reports
evaluations
documents
PPO records
```

Create realistic but fictional data.

---

# 54. Demo Accounts

Prepare predefined accounts:

```text
student.demo@
company.demo@
mentor.demo@
tnp.demo@
admin.demo@
```

Never use real student identity documents in the demo.

---

# 55. Observability During Hackathon

Prepare a fallback mode for:

```text
AI
n8n
email
```

The main workflow must remain functional if an external service fails.

Example:

```text
AI unavailable
   ↓
show:
"AI recommendation temporarily unavailable"
   ↓
normal internship browsing continues
```

Do not allow a third-party API outage to break the main transaction flow.

---

# 56. Technical MVP Boundary

### Must Implement

```text
✓ Authentication
✓ RBAC
✓ Student profile
✓ Company profile
✓ Company verification
✓ Internship posting
✓ Eligibility engine
✓ Application
✓ Selection
✓ Offer document
✓ T&P verification
✓ Mentor assignment
✓ Progress
✓ Evaluation
✓ Completion
✓ PPO
✓ Dashboard
✓ QR verification
✓ At least one AI feature
✓ At least one n8n automation
✓ Audit logging
```

### Should Implement

```text
✓ Resume scoring
✓ Skill-gap analysis
✓ Digital logbook
✓ Advanced document verification
```

### Should Not Block MVP

```text
○ DigiLocker
○ WhatsApp
○ Native Android/iOS application
○ Real-time chat
○ Advanced attendance integration
○ Advanced ML training
○ Microservice migration
```

---

# 57. Recommended Development Sequence

## Phase 1 — Foundation

```text
Spring Boot
PostgreSQL
React
Authentication
RBAC
Database migrations
```

## Phase 2 — Core Entities

```text
Student
Company
Internship
Application
Documents
Verification
```

## Phase 3 — Core Workflow

```text
Eligibility
Application
Selection
Offer
T&P Verification
```

## Phase 4 — Internship Lifecycle

```text
Mentor Assignment
Progress
Evaluation
Completion
PPO
```

## Phase 5 — Intelligence

```text
AI Recommendation
Resume Scoring
Skill Gap
```

## Phase 6 — Trust Layer

```text
QR
Verification Portal
Audit Log
```

## Phase 7 — Operations

```text
n8n
Email
Notifications
Analytics
```

## Phase 8 — Hardening

```text
Security
Testing
Sample Data
Performance
Demo Testing
```

---

# 58. Technical Definition of Done

The implementation is technically ready when:

```text
Authentication works
        AND
RBAC works
        AND
Student verification works
        AND
Company verification works
        AND
Internship posting works
        AND
Eligibility works
        AND
Application works
        AND
Selection works
        AND
Offer workflow works
        AND
T&P verification works
        AND
Mentor assignment works
        AND
Progress works
        AND
Evaluation works
        AND
Completion works
        AND
PPO tracking works
        AND
Dashboard works
        AND
QR verification works
        AND
AI feature works
        AND
n8n workflow works
        AND
Audit logs work
        AND
End-to-end tests pass
```

---

# 59. Final Technical Recommendation

The best technical architecture for the hackathon is:

```text
React + TypeScript
        ↓
Spring Boot REST API
        ↓
Spring Security + JWT
        ↓
PostgreSQL
        ↓
Object Storage

External:
    AI Service
    n8n
    Email

Supporting:
    QR Verification
    Audit Logging
    OpenAPI
    Docker
```

The most important engineering principle is:

> **Build the internship lifecycle as the core transactional system. Treat AI, n8n, QR and external integrations as controlled extensions around that core.**

This keeps the product technically credible while still covering the hackathon's requirements for functionality, security, innovation, analytics and industry readiness.