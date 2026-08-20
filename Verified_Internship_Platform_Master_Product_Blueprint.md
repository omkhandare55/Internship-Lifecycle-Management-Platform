# Verified Internship Lifecycle Platform

## Master Product Blueprint

> **Product:** Verified Internship Lifecycle Platform (VILP)  
> **Platform:** Web + Android + iOS  
> **Primary Backend:** Java + Spring Boot  
> **Database:** PostgreSQL  
> **Automation:** n8n  
> **AI:** Separate AI service/API  
> **Architecture:** API-first, modular monolith, mobile-ready

---

## 1. Executive Summary

The Verified Internship Lifecycle Platform is a secure, transparent and intelligent platform for managing the complete internship lifecycle across students, companies, faculty mentors and Training & Placement (T&P) teams.

The platform connects the entire journey:

```text
Registration
    ↓
Identity / Academic Verification
    ↓
Profile Verification
    ↓
Eligibility Check
    ↓
Internship Discovery
    ↓
AI Recommendation
    ↓
Application
    ↓
Shortlisting / Selection
    ↓
Offer Letter
    ↓
T&P Verification
    ↓
Mentor Assignment
    ↓
Joining
    ↓
Weekly Progress / Logbook
    ↓
Mentor + Company Evaluation
    ↓
Completion Verification
    ↓
Certificate
    ↓
PPO Status
    ↓
Institutional Analytics
```

The hackathon guide explicitly expects a working internship-management MVP covering student profiles, eligibility, company internships, applications, lifecycle tracking, documents, evaluation, dashboards and role/security management. fileciteturn0file0L40-L56

---

# 2. Problem Statement

Internship management is often distributed across forms, emails, spreadsheets, messages and documents. This creates:

- repeated data entry
- manual eligibility checking
- difficulty verifying students
- difficulty verifying companies and internships
- fragmented application tracking
- poor mentor visibility
- document-management problems
- delayed approvals
- weak internship analytics
- difficulty tracking completion and PPOs

The platform will provide a single system of record for the entire internship lifecycle.

---

# 3. Product Vision

> **Create a trusted digital internship ecosystem where student identity, company authenticity, eligibility, applications, approvals, progress, documents, completion and PPO status are connected in one verifiable lifecycle.**

The primary product pillars are:

1. **Trust** — verified users, companies, internships and documents
2. **Lifecycle** — one workflow from registration to PPO
3. **Intelligence** — eligibility engine, AI recommendations, resume analysis and skill-gap analysis
4. **Automation** — notifications and workflows using n8n
5. **Analytics** — useful institutional insights

---

# 4. Target Users and Roles

## 4.1 Student

Capabilities:

- register and authenticate
- complete profile
- submit identity/academic proof
- request verification
- maintain skills and certifications
- upload resume
- view eligibility
- discover internships
- receive AI recommendations
- apply for internships
- track applications
- receive offer letters
- upload joining/weekly documents
- submit digital logbook entries
- track progress
- view mentor/company feedback
- view completion status
- view certificates
- track PPO status

## 4.2 Company

Capabilities:

- register organization
- complete company verification
- create internship opportunities
- define eligibility criteria
- specify skills, stipend, duration and vacancies
- view applicants
- shortlist candidates
- select candidates
- upload offer documents
- evaluate interns
- upload completion documentation
- manage PPO decisions

## 4.3 Faculty Mentor

Capabilities:

- view assigned students
- monitor progress
- review weekly reports
- review logbook
- record feedback
- evaluate students
- flag concerns
- recommend completion

## 4.4 T&P Officer

Capabilities:

- verify students
- verify companies
- verify internships
- review documents
- assign mentors
- monitor active internships
- manage workflow exceptions
- view analytics
- audit activities

## 4.5 T&P Head

Capabilities:

- oversee institutional internship operations
- approve high-level actions
- manage T&P officers
- configure institutional rules
- view organization-wide analytics
- review verification/audit information

## 4.6 Super Admin

Capabilities:

- system configuration
- role/permission management
- institutional setup
- security configuration
- platform-level audit
- AI/service configuration

> Use **Super Admin** instead of an informal “Author/Main” role.

---

# 5. Product Principles

## 5.1 Working Functionality Over Feature Count

The hackathon guide explicitly states that a small feature that works well is better than many impressive-sounding features that do not work. fileciteturn0file0L92-L104

## 5.2 Deterministic Decisions, AI Assistance

Critical decisions such as:

- authentication
- authorization
- eligibility
- verification
- workflow transitions

must be controlled by deterministic backend rules.

AI is advisory for:

- recommendations
- resume scoring
- skill-gap analysis
- matching
- suggestions

## 5.3 Security by Default

Frontend visibility is not security. Every sensitive action must be authorized at the backend/resource level.

## 5.4 API-First

Web and mobile clients must use the same backend APIs.

## 5.5 Mobile-Ready

The initial implementation is web-first, but the backend must support future Android/iOS clients without redesigning the business layer.

---

# 6. Core User Journey

The primary demo and product workflow is:

```text
Student Registration
      ↓
Authentication
      ↓
Identity / Academic Verification
      ↓
Profile Verification
      ↓
Student Profile
      ↓
Eligibility Engine
      ↓
Internship Discovery
      ↓
AI Recommendations
      ↓
Student Applies
      ↓
Company Shortlists
      ↓
Company Selects
      ↓
Offer Letter
      ↓
T&P Verification
      ↓
Mentor Assignment
      ↓
Joining
      ↓
Weekly Progress
      ↓
Mentor + Company Evaluation
      ↓
Completion
      ↓
Certificate
      ↓
PPO
      ↓
Analytics
```

This closely follows the internship journey specified in the hackathon guide. fileciteturn0file0L58-L65

---

# 7. Functional Requirements

## 7.1 Authentication & Registration

### Requirements

- Email/password registration
- Google OAuth login
- Email verification
- Password reset
- Existing-user login
- Secure session/token management
- Role assignment
- Account status management

### Student registration flow

```text
Register
  ↓
Email / Google Authentication
  ↓
Basic Profile
  ↓
Identity / Academic Proof
  ↓
Submit Verification
  ↓
T&P Review
  ↓
VERIFIED STUDENT
```

### Verification states

```text
REGISTERED
DOCUMENT_SUBMITTED
UNDER_REVIEW
VERIFIED
REJECTED
```

### Important scope decision

DigiLocker should be an optional integration unless a fully working and tested integration is available. It should not become a hard dependency of the MVP.

---

# 8. Student Profile

## Personal Information

- full name
- email
- phone
- profile photo, where appropriate

## Academic Information

- student number
- department
- branch
- semester/year
- CGPA
- active backlogs
- passing year

## Professional Information

- skills
- certifications
- projects
- experience
- interests
- resume

## Internship Information

- current internship
- previous internships
- completion history
- PPO history

The hackathon guide explicitly expects student profiles to contain details such as skills, CGPA, backlogs, resume and internship history. fileciteturn0file0L43-L45

---

# 9. Company Verification

## Flow

```text
Company Registration
      ↓
Company Profile
      ↓
Organization Proof
      ↓
Authorized Contact Verification
      ↓
T&P Review
      ↓
VERIFIED COMPANY
```

## Company States

```text
PENDING
UNDER_REVIEW
VERIFIED
REJECTED
SUSPENDED
```

Only a verified company should be allowed to publish internships in the MVP.

---

# 10. Internship Posting

A company can create an internship with:

- title
- description
- department/branch
- location
- work mode
- start date
- end date
- duration
- stipend
- vacancies
- application deadline
- minimum CGPA
- maximum backlogs
- required skills
- required certifications
- required experience
- passing-year requirements
- custom criteria

These requirements align with the challenge's company portal and eligibility expectations. fileciteturn0file0L46-L49 fileciteturn0file0L66-L78

---

# 11. Eligibility Engine

The eligibility engine must be deterministic and explainable.

## Rules

Support:

- minimum CGPA
- maximum backlogs
- department/branch
- passing year
- required skills
- certifications
- experience
- company-specific criteria

## Example

```text
Internship Requirements
-----------------------
Minimum CGPA: 7.00
Backlogs: 0
Department: IT
Passing Year: 2028
Required Skills: Java, Spring Boot
```

Student:

```text
CGPA: 7.82
Backlogs: 0
Department: IT
Passing Year: 2028
Skills: Java, SQL, React
```

Result:

```text
NOT ELIGIBLE

Reason:
Required skill missing: Spring Boot
```

The hackathon explicitly says the system should explain why a student is not eligible, rather than simply showing “Not Eligible.” fileciteturn0file0L79-L80

---

# 12. Internship Discovery

Students can filter internships by:

- skill
- company
- location
- work mode
- stipend
- duration
- deadline
- department
- eligibility

Internship cards should display:

```text
Company
Internship Title
Mode
Location
Stipend
Duration
Deadline
Eligibility
AI Match Score
Verification Status
```

---

# 13. Application Management

## Student

- view details
- view eligibility
- view AI recommendation
- apply
- withdraw where permitted
- track application status

## Application states

```text
APPLIED
SHORTLISTED
INTERVIEW
SELECTED
REJECTED
WITHDRAWN
```

## Rules

- ineligible students cannot apply
- duplicate applications must be rejected
- closed internships cannot accept new applications
- students cannot modify company/T&P decisions

---

# 14. Company Selection

Company users can:

- view applicants
- filter applicants
- view eligible students
- view resumes
- shortlist
- update interview status
- select
- reject

AI ranking may assist the recruiter but must not replace company decision-making.

---

# 15. Offer Letter & T&P Verification

Workflow:

```text
Company Selects Student
        ↓
Offer Letter Uploaded
        ↓
T&P Review
        ↓
Verified / Rejected
```

Offer states:

```text
PENDING
TNP_REVIEW
VERIFIED
REJECTED
```

---

# 16. Internship Trust Layer

Every approved internship gets a unique verification identity.

Example:

```text
Internship ID: INT-2026-00452
Company: XYZ Technologies
T&P Status: VERIFIED
Student Status: VERIFIED
Offer Status: VERIFIED
```

The hackathon specifically suggests QR-based offer-letter verification and certificate verification as innovation opportunities. fileciteturn0file0L92-L103

---

# 17. QR Verification

QR codes can be generated for:

- verified internship
- offer letter
- completion certificate

Public verification page:

```text
Internship Authenticity
-----------------------
Internship ID: INT-2026-00452
Company: XYZ Technologies
Status: VERIFIED
T&P Approval: VERIFIED
```

Do not expose private:

- phone numbers
- email addresses
- identity documents
- private evaluations
- internal administrative identifiers

---

# 18. Mentor Assignment

T&P assigns a faculty mentor after T&P verification.

```text
Internship
   ↓
Student
   ↓
Faculty Mentor
```

Mentors should normally see only students assigned to them.

---

# 19. Digital Internship Logbook

Each weekly entry can contain:

- week number
- tasks completed
- work summary
- learning
- challenges
- next-week plan
- optional attachment
- progress percentage

Statuses:

```text
DRAFT
SUBMITTED
REVIEWED
FLAGGED
```

---

# 20. Progress & Attendance

Optional MVP-supported fields:

- weekly attendance
- progress percentage
- milestones
- missed reports
- mentor feedback

Example:

```text
Progress: 64%
Weeks: 7/10
Reports: 7/7
Attendance: 96%
```

Attendance should remain secondary if there is no reliable source of attendance data.

---

# 21. Evaluation System

## Mentor Evaluation

- technical performance
- communication
- discipline
- progress
- teamwork
- problem solving
- comments

## Company Evaluation

- performance
- professionalism
- technical contribution
- communication
- overall rating
- remarks

Evaluation status is stored as part of the internship lifecycle.

---

# 22. Completion

Completion should require relevant workflow conditions, such as:

```text
Required Progress Reports ✓
Mentor Evaluation         ✓
Company Evaluation        ✓
Required Documents        ✓
T&P Review                ✓
```

Then:

```text
INTERNSHIP COMPLETED
```

---

# 23. PPO Management

Statuses:

```text
NOT_OFFERED
OFFERED
ACCEPTED
DECLINED
UNDER_REVIEW
```

Track:

- company
- student
- offer date
- acceptance date
- PPO document
- remarks

The hackathon guide explicitly identifies PPO recommendations/conversions as useful analytics. fileciteturn0file0L81-L91

---

# 24. Document Management

## Core documents

### Student

- college/student ID proof
- academic proof
- resume
- certifications where applicable

### Company

- organization/business proof
- authorized contact proof

### Internship

- offer letter
- acceptance letter
- joining letter
- weekly reports
- final internship report
- mentor evaluation
- company evaluation
- completion certificate
- PPO document

The hackathon guide explicitly names offer letter, joining letter, acceptance, reports, completion certificate and PPO as documents to manage. fileciteturn0file0L50-L55

## Document metadata

Each record should include:

```text
Document ID
Document Type
Related Entity
Uploaded By
Uploaded At
Version
Status
Verified By
Verified At
Rejection Reason
Storage Key
```

## Document states

```text
UPLOADED
UNDER_REVIEW
VERIFIED
REJECTED
EXPIRED
```

---

# 25. AI Features

## 25.1 AI Internship / Company Recommendation

Inputs:

- student skills
- resume
- academic profile
- interests
- certifications
- experience
- internship requirements

Outputs:

```text
Match Score
Matched Skills
Missing Skills
Why Recommended
```

Example:

```text
Backend Developer Intern
Match: 91%

Matched:
✓ Java
✓ SQL
✓ IT Branch
✓ Required CGPA

Missing:
• Spring Boot
```

The guide explicitly suggests AI-based company recommendation. fileciteturn0file0L92-L96

## 25.2 Resume Scoring

Pipeline:

```text
Resume Upload
   ↓
Text Extraction
   ↓
Skill Extraction
   ↓
Requirement Comparison
   ↓
Score
   ↓
Improvement Suggestions
```

The guide explicitly suggests AI resume scoring/improvement. fileciteturn0file0L94-L96

## 25.3 Skill-Gap Analysis

```text
Required Skills
      −
Student Skills
      =
Skill Gap
```

Output:

- missing skills
- priority
- learning suggestions

The guide explicitly suggests AI skill-gap analysis. fileciteturn0file0L94-L96

## 25.4 AI Governance

AI output must be advisory.

It must not directly:

- approve users
- verify companies
- verify internships
- override eligibility rules
- override T&P decisions
- make final hiring decisions

---

# 26. Notification & Automation

n8n will be the automation layer.

Architecture:

```text
Spring Boot Event
      ↓
n8n Webhook
      ↓
Email / In-App / Push / Other Automation
```

## Workflows

### Student Selected

```text
Selection Event
 ↓
n8n
 ├── Student email
 ├── Mentor notification
 └── T&P notification
```

### Weekly Report Reminder

```text
Schedule Trigger
 ↓
Find Missing Reports
 ↓
Notify Student
 ↓
Notify Mentor
```

### Verification Approved

```text
T&P Approval
 ↓
Student Notification
 ↓
Company Notification
 ↓
Next Workflow Action
```

n8n failure must not break core transactions. Notifications should be retried separately.

---

# 27. Analytics

The dashboards should answer decisions rather than just display charts. The guide explicitly asks for analytics around applications, selections, departments, companies, stipends, skills, pending verification and PPOs. fileciteturn0file0L81-L91

## Student Dashboard

- profile completion
- verification status
- recommended internships
- applications
- active internship
- progress
- notifications
- PPO status

## Company Dashboard

- active internships
- applicants
- shortlisted candidates
- selected candidates
- pending tasks
- evaluations

## Mentor Dashboard

- assigned students
- pending weekly reports
- progress status
- evaluation tasks
- flagged students

## T&P Dashboard

- total students
- verified students
- verified companies
- active internships
- applications
- selections
- completed internships
- pending verifications
- PPO conversions
- average/highest/lowest stipend
- branch-wise internship distribution
- skill gaps

---

# 28. Technical Architecture

## Architecture Style

Use a **modular monolith** for the MVP.

Do not start with microservices.

```text
React Web / PWA
        │
        ▼
Spring Boot REST API
        │
 ┌──────┼──────────┐
 ▼      ▼          ▼
Postgres Object   AI Service
         Storage
             │
             ▼
             n8n
```

The API-first design supports future mobile clients:

```text
            Spring Boot API
                  │
      ┌───────────┼───────────┐
      ▼           ▼           ▼
    React      React Native  Future Clients
     Web        Android/iOS
```

---

# 29. Recommended Technology Stack

| Layer | Technology |
|---|---|
| Web | React + TypeScript |
| Build | Vite |
| Mobile | React Native + Expo |
| UI | Tailwind CSS + component library |
| Backend | Java + Spring Boot |
| Security | Spring Security |
| Auth | JWT + Google OAuth |
| ORM | Spring Data JPA / Hibernate |
| Database | PostgreSQL |
| Migration | Flyway |
| Storage | S3-compatible object storage |
| AI | Separate AI API/service |
| Automation | n8n |
| Email | SMTP / transactional provider |
| QR | Server-generated QR |
| API Docs | OpenAPI / Swagger |
| Testing | JUnit, Mockito, Testcontainers, Playwright |
| Deployment | Docker |
| CI/CD | GitHub Actions |

---

# 30. Backend Structure

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
└── common/
```

---

# 31. Frontend Structure

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

---

# 32. Database Design

## Core entities

```text
User
Role
Student
Faculty
Company
Department

Skill
StudentSkill
Certification
Resume

Internship
InternshipRequirement
InternshipSkill
Application
Selection

Verification
Document
Offer

MentorAssignment
ProgressLog
Attendance
Evaluation

Completion
Certificate
PPORecord

Notification
AuditLog

AIRecommendation
SkillGapReport
```

## Key relationships

```text
User
  ├── Student
  ├── Company
  ├── Faculty
  └── T&P/Admin roles

Company
  └── Internship
        └── Application
              └── Student

Student
  └── MentorAssignment
        └── Faculty

Internship
  ├── Documents
  ├── ProgressLogs
  ├── Evaluations
  ├── Completion
  └── PPO
```

---

# 33. Key Database Fields

## users

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

## students

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

## companies

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

## internships

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

## applications

```text
id
internship_id
student_id
status
applied_at
updated_at
withdrawn_at
rejection_reason
```

## documents

```text
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

## verifications

```text
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

## audit_logs

```text
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

# 34. API Specification

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
POST /api/companies
GET  /api/companies/{id}
PUT  /api/companies/{id}
POST /api/companies/{id}/verification
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
POST  /api/internships/{id}/applications
GET   /api/students/me/applications
GET   /api/companies/me/applications
PATCH /api/applications/{id}/status
```

## Documents

```http
POST   /api/documents
GET    /api/documents/{id}
DELETE /api/documents/{id}
POST   /api/documents/{id}/verify
POST   /api/documents/{id}/reject
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
POST  /api/progress
GET   /api/internships/{id}/progress
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

## AI

```http
POST /api/ai/recommendations
POST /api/ai/resume-score
POST /api/ai/skill-gap
```

## QR Verification

```http
GET /api/public/verify/internship/{token}
GET /api/public/verify/certificate/{token}
```

---

# 35. API Standards

Use consistent HTTP status codes:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

Example success:

```json
{
  "success": true,
  "data": {}
}
```

Example error:

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

---

# 36. Security Architecture

## Authentication

- JWT access token
- refresh token
- Google OAuth
- email verification
- secure logout
- password reset

## Password Security

Passwords must never be stored in plaintext.

Use Argon2id or a properly configured BCrypt implementation.

## Authorization

Use:

```text
RBAC
+
Resource-Level Authorization
```

Every protected request must verify:

1. Who is calling?
2. What role do they have?
3. What resource are they accessing?
4. Are they authorized for that resource?

## Other Controls

- HTTPS
- secure HTTP headers
- CORS policy
- input validation
- rate limiting
- object-level authorization
- secure file upload
- audit logs
- database constraints
- private object storage

---

# 37. File Security

Allowed MVP types:

```text
PDF
DOCX
JPG
PNG
```

Requirements:

- file size limits
- MIME validation
- extension validation
- generated storage filenames
- malware scanning where available
- private object storage
- authorized downloads only
- audit logging

Never trust only the file extension.

---

# 38. Internship State Machine

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

Invalid state transitions must be rejected by the backend.

---

# 39. Audit Logging

Log sensitive actions such as:

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

Never log:

- passwords
- access tokens
- private document contents
- unnecessary sensitive personal information

---

# 40. Performance Requirements

For the MVP target:

- ordinary CRUD request p95 < 500 ms under normal demo load
- pagination for large lists
- database indexes on search/filter fields
- efficient aggregation for dashboards
- no loading of thousands of rows into browser memory

Recommended indexes include:

```text
users.email
students.student_number
internships.status
internships.company_id
applications.student_id
applications.status
verifications.status
created_at
```

---

# 41. Mobile Application Requirements

Use **React Native + Expo** with the same backend APIs.

Must support:

- login
- profile
- internship search
- eligibility
- apply
- document upload
- progress/logbook
- notifications
- mentor feedback
- PPO status

The mobile app must not have its own business logic separate from the backend.

---

# 42. UI/UX Requirements

The product should look like a professional institutional platform, not a generic AI dashboard.

## UX Principles

- role-specific navigation
- clear status indicators
- timeline-based internship workflow
- strong form validation
- minimal unnecessary screens
- mobile-responsive design
- clear document statuses
- readable analytics
- accessible UI

## Core Screens

### Shared

- login
- registration
- forgot password
- notifications
- profile

### Student

- dashboard
- profile
- internship discovery
- internship details
- eligibility
- applications
- active internship
- progress/logbook
- documents
- certificate
- PPO

### Company

- dashboard
- company profile
- verification
- create internship
- internship management
- applicants
- candidate profile
- selection
- offer management
- evaluations

### Mentor

- dashboard
- assigned students
- student detail
- weekly reports
- evaluations

### T&P

- dashboard
- verification queue
- students
- companies
- internships
- document verification
- mentor assignment
- analytics
- audit logs

---

# 43. Analytics Specification

## Core KPIs

```text
Total Students
Verified Students
Verified Companies
Active Internships
Applications
Selections
Completion Rate
Average Stipend
Highest Stipend
Lowest Stipend
PPO Count
PPO Conversion Rate
Pending Verifications
Skill Gaps
```

## Department Analysis

- internships by branch
- selections by branch
- completion by branch
- PPO by branch

## Company Analysis

- applicants per company
- selection rate
- completion rate
- PPO rate

---

# 44. Testing Strategy

## Unit Tests

Use:

- JUnit
- Mockito

Test:

- eligibility rules
- workflow transitions
- permission checks
- validations
- business logic

## Integration Tests

Use Testcontainers for:

- PostgreSQL
- repository tests
- authentication
- API workflows

## End-to-End Tests

Use Playwright.

Primary test:

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

# 45. Critical Test Cases

## Security

- student cannot access T&P endpoints
- company cannot access another company's private data
- mentor cannot access unassigned students
- student cannot approve their own verification

## Eligibility

- CGPA below threshold → not eligible
- too many backlogs → not eligible
- wrong department → not eligible
- missing skill → not eligible
- all conditions satisfied → eligible

## Applications

- ineligible student cannot apply
- duplicate application rejected
- closed internship rejects application
- student cannot modify company decision

## Workflow

- unverified internship cannot become active
- invalid status transition rejected
- only authorized T&P can verify
- only company can issue offer
- only assigned mentor can evaluate

---

# 46. Deployment Architecture

```text
Internet
   ↓
React Web / PWA
   ↓
Spring Boot API
   ├── PostgreSQL
   ├── Object Storage
   ├── AI Service
   └── n8n
```

## Containers

At minimum:

```text
frontend
backend
postgres
```

External managed services can provide:

- object storage
- email
- AI
- n8n

---

# 47. Environment Management

Environments:

```text
development
testing
production
```

Secrets must never be committed to Git.

Example variables:

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

---

# 48. Database Migration

Use Flyway.

Example sequence:

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

---

# 49. Demo Data

The hackathon guide explicitly expects sample/demo data so the jury can test the system. fileciteturn0file0L105-L109

Seed:

- 10+ students
- 3 companies
- 5 internships
- applications
- shortlisted candidates
- selected candidates
- one ongoing internship
- one completed internship
- mentor assignments
- progress reports
- evaluations
- verified/rejected documents
- PPO records

Use fictional data only.

---

# 50. Demo Accounts

Prepare separate demonstration roles, for example:

```text
student.demo
company.demo
mentor.demo
tnp.demo
admin.demo
```

Never use real personal identity documents in the public demo environment.

---

# 51. Resilience & External Dependencies

AI, n8n, email and other third-party services must not break the core lifecycle.

Example:

```text
AI unavailable
    ↓
AI recommendation unavailable message
    ↓
Student can still browse and apply
```

Similarly:

```text
n8n unavailable
    ↓
Core transaction succeeds
    ↓
Notification is queued/retried
```

---

# 52. Agile Development Plan

## Phase 1 — Foundation

- repository setup
- React application
- Spring Boot application
- PostgreSQL
- Flyway
- authentication
- RBAC

## Phase 2 — Core Entities

- student
- company
- internship
- documents
- verification
- application

## Phase 3 — Core Workflow

- eligibility
- application
- shortlist
- selection
- offer
- T&P verification

## Phase 4 — Internship Lifecycle

- mentor assignment
- progress
- logbook
- evaluation
- completion
- PPO

## Phase 5 — Intelligence

- AI recommendation
- resume scoring
- skill-gap analysis

## Phase 6 — Trust Layer

- QR verification
- public verification page
- audit logs

## Phase 7 — Operations

- n8n
- notifications
- analytics

## Phase 8 — Hardening

- security testing
- E2E testing
- sample data
- performance testing
- demo rehearsal

---

# 53. MVP Prioritization

## P0 — Must Have

```text
Authentication
RBAC
Student Profile
Company Profile
Company Verification
Internship Posting
Eligibility Engine
Applications
Selection
Offer Letter
T&P Verification
Mentor Assignment
Progress
Evaluation
Completion
PPO Tracking
Dashboard
Audit Logs
```

## P1 — High Value

```text
AI Internship Recommendation
Resume Scoring
Skill-Gap Analysis
QR Verification
n8n Notification Workflow
```

## P2 — Optional / Later

```text
DigiLocker
WhatsApp
Real-time Chat
Advanced Attendance Integration
Native-specific features
Advanced Certificate Verification
Advanced ML
```

---

# 54. Mobile Roadmap

## Version 1

Responsive web/PWA.

## Version 2

React Native + Expo:

```text
Student App
Mentor App
Company App
```

## Version 3

Add:

- push notifications
- camera-based document capture
- QR scanning
- offline support where justified

---

# 55. Non-Functional Requirements

## Performance

- p95 ordinary API response under 500 ms for MVP workloads
- pagination
- indexed queries

## Security

- HTTPS
- password hashing
- RBAC
- resource-level authorization
- secure file access
- audit trail

## Scalability

- stateless backend where practical
- API-first design
- asynchronous notification handling
- object storage for large files

## Reliability

- transaction management
- retries for external integrations
- database constraints
- meaningful error handling

## Maintainability

- modular backend
- clear package boundaries
- DTO/service/repository separation
- centralized exceptions
- API documentation
- automated tests

## Usability

- responsive UI
- accessible forms
- clear validation
- simple role-specific navigation

---

# 56. Acceptance Criteria

The MVP is acceptable when a jury can complete the following without direct database manipulation:

### Student

- register
- log in
- submit profile
- submit verification information
- view verification status
- view eligibility
- receive AI recommendation
- apply
- track application
- submit progress

### Company

- log in
- create company profile
- complete verification
- create internship
- define eligibility
- view applicants
- shortlist
- select
- upload offer

### T&P

- verify student
- verify company
- verify internship
- verify documents
- assign mentor
- monitor internships
- view analytics

### Mentor

- view assigned students
- review progress
- evaluate student

### End-to-End

```text
Student
→ Internship
→ Eligibility
→ Application
→ Selection
→ Offer
→ T&P Verification
→ Mentor Assignment
→ Progress
→ Evaluation
→ Completion
→ QR Verification
→ Analytics
```

must work using demonstration data.

---

# 57. Hackathon Demo Strategy

The guide allocates approximately:

- 2 minutes: problem + solution
- 5 minutes: live demo
- 3 minutes: innovation + dashboard
- 5 minutes: jury questions. fileciteturn0file0L116-L123

## Recommended Story

Use one fictional student, one company, one mentor and one T&P officer.

### Demo

```text
1. Student logs in
2. Verification status is shown
3. Student profile is shown
4. Eligibility is calculated
5. AI recommends internships
6. Student applies
7. Company reviews eligible candidates
8. Company selects student
9. Offer letter is uploaded
10. T&P verifies internship
11. Mentor is assigned
12. Student submits progress
13. Mentor evaluates
14. Internship is completed
15. QR verification is demonstrated
16. T&P dashboard updates
```

Do not spend the demo showing disconnected pages. Tell one complete lifecycle story.

---

# 58. Success Metrics

## Product Metrics

- verified students
- verified companies
- internships posted
- application volume
- selection rate
- completion rate
- PPO conversion rate
- document verification turnaround
- average stipend
- AI recommendation usage
- QR verification requests

## Platform Metrics

- registration success rate
- eligibility evaluation success rate
- notification delivery rate
- failed workflow rate
- verification backlog

---

# 59. Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Scope explosion | High | Freeze P0 before coding |
| Fake/invalid verification | High | T&P-controlled verification states |
| Data breach | Critical | RBAC, private storage, audit logs |
| AI API outage | Medium | Core workflow independent of AI |
| n8n outage | Medium | Async/retry notification architecture |
| UI consumes development time | High | Workflow-first development |
| Database complexity | Medium | Start with core entities |
| Broken live demo | High | Full E2E rehearsal |
| External identity dependency | High | Optional DigiLocker integration |
| Poor mobile experience | Medium | Responsive web + API-first design |

---

# 60. Open Decisions

These should be decided before implementation:

1. Exact identity-proof rules for the institution
2. Whether DigiLocker is available and technically feasible
3. Exact T&P approval hierarchy
4. Which AI provider/model will be used
5. Object-storage provider
6. Email provider
7. Whether WhatsApp is required later
8. Attendance source and ownership
9. Data-retention policy
10. Institution-specific eligibility rules

These items are not fully specified by the supplied hackathon guide and therefore must be confirmed separately before production implementation.

---

# 61. Product Boundaries

The platform is **not** initially intended to become:

- a general-purpose job marketplace
- a full enterprise HRMS
- a complete ATS replacement
- a payment platform
- an academic ERP
- an all-purpose social network

The core focus remains internship lifecycle management.

---

# 62. Final Product Positioning

> **A secure and intelligent internship lifecycle platform that verifies students and companies, automates eligibility and internship workflows, tracks progress, and creates a trusted digital internship record from application to PPO.**

## Key Differentiator

```text
Verified Student
      +
Verified Company
      +
Verified Internship
      +
Verified Offer
      +
Verified Progress
      +
Verified Completion
      ↓
Trusted Internship Record
```

AI operates on top of this trusted workflow instead of replacing the institutional verification process.

---

# 63. Final Technical Blueprint

```text
                    ┌───────────────────────┐
                    │ React Web / PWA       │
                    └──────────┬────────────┘
                               │
                    ┌──────────▼────────────┐
                    │ React Native Mobile   │
                    │ Android + iOS         │
                    └──────────┬────────────┘
                               │
                         HTTPS / REST
                               │
                    ┌──────────▼────────────┐
                    │ Java Spring Boot      │
                    │ API + Business Logic  │
                    └──────────┬────────────┘
                               │
          ┌────────────────────┼─────────────────────┐
          │                    │                     │
          ▼                    ▼                     ▼
     PostgreSQL          Object Storage          AI Service
          │                                          │
          └────────────────────┬─────────────────────┘
                               │
                              n8n
                               │
                   ┌───────────┼───────────┐
                   ▼           ▼           ▼
                 Email      Alerts      Other APIs

                               │
                         QR Verification
                               │
                      Public Verification API
```

---

# 64. Definition of Done

The product is considered technically ready for the hackathon when:

```text
Authentication works
AND RBAC works
AND Student verification works
AND Company verification works
AND Internship posting works
AND Eligibility works
AND Application works
AND Selection works
AND Offer workflow works
AND T&P verification works
AND Mentor assignment works
AND Progress works
AND Evaluation works
AND Completion works
AND PPO tracking works
AND Dashboard works
AND QR verification works
AND At least one AI feature works
AND At least one n8n workflow works
AND Audit logging works
AND End-to-end tests pass
```

---

# 65. Source Alignment

This blueprint is primarily derived from the supplied **GHR Inter-Track Hackathon Guide**, especially its:

- problem statement and goals fileciteturn0file0L9-L25
- user roles fileciteturn0file0L26-L34
- required core modules fileciteturn0file0L40-L56
- internship journey fileciteturn0file0L58-L65
- eligibility criteria fileciteturn0file0L66-L80
- analytics guidance fileciteturn0file0L81-L91
- innovation ideas fileciteturn0file0L92-L104
- demo requirements fileciteturn0file0L105-L123
- judging criteria fileciteturn0file0L124-L135
- participant rules and final checklist fileciteturn0file0L136-L160

Where this blueprint goes beyond the guide—especially the exact technical stack, APIs, database structure, security mechanisms, mobile architecture, testing, deployment and engineering practices—those are **product/engineering recommendations**, not stated hackathon requirements.
