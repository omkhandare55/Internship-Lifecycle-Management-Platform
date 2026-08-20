# Product Requirements Document (PRD)

## 1. Product Overview

### Product Name
**Verified Internship Lifecycle Platform**

### Product Type
Web-first, mobile-ready Internship Lifecycle Management Platform

### Primary Goal
Build a secure, transparent and data-driven platform that manages the complete internship lifecycle for students, companies, faculty mentors and Training & Placement (T&P) teams—from identity verification and eligibility through application, selection, internship progress, completion and PPO.

The product is designed around the GHR Inter-Track Hackathon requirement to build a working MVP that reduces paperwork, automates eligibility, supports company recruitment, tracks internships, manages documents, provides role-specific visibility and generates useful analytics.

### Core Product Proposition

> **One verified platform for the complete internship journey, from student identity and company verification to internship completion and PPO.**

The platform's primary differentiator is a **Trust + Lifecycle + Intelligence** model:

**Trust:** verified students, companies, internships and documents  
**Lifecycle:** one connected workflow from registration to PPO  
**Intelligence:** eligibility engine, AI recommendations, resume scoring and skill-gap analysis  
**Analytics:** real-time institutional internship insights

---

# 2. Problem Statement

Internship management in educational institutions is frequently fragmented across:

- registration forms
- spreadsheets
- emails
- messaging applications
- manually submitted documents
- disconnected company communication
- paper-based approvals

This creates several problems:

1. Difficulty verifying whether students are genuine and institutionally eligible.
2. Difficulty verifying whether companies and internship opportunities are legitimate.
3. Repeated data entry by students and T&P staff.
4. Manual eligibility checking.
5. Lack of visibility into application and selection status.
6. Difficulty tracking weekly internship progress.
7. Delayed document verification.
8. Poor coordination between students, companies, mentors and T&P.
9. Limited institutional analytics.
10. No single verifiable lifecycle record for an internship.

The hackathon specifically expects the system to reduce manual paperwork, automate eligibility, support company recruitment, track internships, organize documents, provide real-time status and produce useful analytics.

---

# 3. Product Vision

Create a platform that allows a college to manage internships as a **verified digital lifecycle rather than a collection of disconnected activities**.

The system should make it possible to answer:

> **Who is the student?**  
> **Is the student eligible?**  
> **Is the company legitimate?**  
> **Is the internship verified?**  
> **Why was the student eligible or rejected?**  
> **What is the application status?**  
> **Who is responsible for monitoring the student?**  
> **What progress has been made?**  
> **Have the required documents been verified?**  
> **Was the internship completed?**  
> **Was a PPO received?**

---

# 4. Target Users

The platform will support six primary roles.

## 4.1 Student

The student can:

- register and authenticate
- create a profile
- submit identity/academic proof
- request institutional verification
- maintain skills and certifications
- upload resume
- view eligibility
- discover internships
- receive AI recommendations
- apply for internships
- track application status
- receive offer letters
- submit joining documents
- submit weekly progress
- maintain digital internship logbook
- track attendance/progress
- receive mentor/company feedback
- view evaluation results
- receive completion verification
- access verified certificates
- view PPO status

## 4.2 Company

The company can:

- register organization
- complete company verification
- create internship opportunities
- define eligibility criteria
- specify skills
- define stipend
- specify duration and mode
- specify vacancies
- specify application deadline
- view eligible applicants
- shortlist candidates
- evaluate candidates
- select students
- upload offer documentation
- evaluate interns
- upload completion documentation

## 4.3 Faculty Mentor

The mentor can:

- view assigned students
- view student internship details
- monitor weekly reports
- review progress
- record attendance/progress where applicable
- provide feedback
- evaluate students
- flag concerns
- recommend completion

## 4.4 T&P Officer

The T&P officer can:

- verify students
- verify company information
- verify internships
- approve/reject applications where institutionally required
- verify documents
- assign faculty mentors
- monitor internship progress
- manage internship status
- manage exceptions
- view analytics
- audit workflow activity

## 4.5 T&P Head / Institutional Admin

The T&P Head can:

- manage institutional internship operations
- approve high-level verifications
- manage users and permissions
- configure eligibility rules
- review company/internship activity
- monitor department-wise performance
- view organization-wide analytics
- review audit history

## 4.6 Super Admin

The Super Admin is the highest-privilege role and should be highly restricted.

Capabilities:

- system configuration
- role management
- institution configuration
- security configuration
- audit access
- platform-level administration

---

# 5. Product Principles

### Principle 1 — Working functionality over feature count

The hackathon guide explicitly recommends implementing a small number of features properly rather than presenting many incomplete features.

### Principle 2 — Deterministic decisions, AI-assisted recommendations

Critical decisions such as eligibility, verification and access control must use explicit rules.

AI should primarily assist with:

- recommendations
- matching
- scoring
- skill-gap analysis
- suggestions

AI should **not** independently approve students, companies or internships.

### Principle 3 — Every important workflow action should be traceable

The platform should maintain an audit trail for sensitive actions.

### Principle 4 — Mobile-ready architecture

The first implementation will prioritize a responsive web application/PWA while keeping the backend API-first so the same APIs can later support a mobile application.

### Principle 5 — Explain every important decision

Instead of simply displaying:

> Not Eligible

the platform should provide the reason, such as:

> CGPA requirement not satisfied.

> Required skill missing.

This directly follows the hackathon guide.

---

# 6. High-Level User Journey

```text
Registration
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
AI Recommendation
      ↓
Application
      ↓
Company Shortlisting
      ↓
Selection
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

This closely aligns with the internship journey specified by the hackathon guide.

---

# 7. Functional Requirements

## 7.1 Authentication & Registration

### Objective
Ensure that only authenticated and institutionally verified users gain access to relevant platform functionality.

### Requirements

**FR-AUTH-001**
Users shall be able to register using email/password authentication.

**FR-AUTH-002**
Users shall be able to authenticate using Google authentication.

**FR-AUTH-003**
Existing users shall be able to log in.

**FR-AUTH-004**
The system shall implement role-based access control.

**FR-AUTH-005**
A newly registered student shall have an initial status:

`PENDING_VERIFICATION`

**FR-AUTH-006**
The system shall support submission of identity/academic proof.

**FR-AUTH-007**
The system shall allow authorized T&P personnel to verify or reject submitted information.

**FR-AUTH-008**
The system shall record verification actions in an audit log.

### Verification states

```text
REGISTERED
    ↓
DOCUMENT_SUBMITTED
    ↓
UNDER_REVIEW
    ↓
VERIFIED
```

Possible rejection state:

```text
REJECTED
```

### Important MVP decision

DigiLocker should be designed as an **optional integration**, not a hard dependency for the initial hackathon MVP unless a working integration is available and tested.

The MVP can demonstrate institutional verification through authentication, submitted proof and T&P approval.

---

# 8. Student Profile Module

The profile shall contain:

### Personal information

- full name
- email
- phone
- profile photo where appropriate

### Academic information

- student ID
- department
- branch
- semester/year
- CGPA
- backlogs
- passing year

### Professional information

- skills
- certifications
- projects
- experience
- interests
- resume

### Internship information

- current internship
- internship history
- completed internships
- PPO history

The hackathon explicitly expects student profiles to include details such as skills, CGPA, backlogs, resume and internship history.

---

# 9. Company Verification

## Objective

Prevent unverified organizations from publishing potentially fraudulent internship opportunities.

### Company onboarding

```text
Company Registration
        ↓
Company Profile
        ↓
Organization Proof
        ↓
Contact Verification
        ↓
T&P Review
        ↓
VERIFIED COMPANY
```

### Company states

```text
PENDING
UNDER_REVIEW
VERIFIED
REJECTED
SUSPENDED
```

Only `VERIFIED` companies should be permitted to publish internship opportunities in the MVP.

---

# 10. Internship Posting Module

Companies shall be able to create internships with:

- internship title
- description
- company
- location
- work mode
- start date
- end date
- duration
- stipend
- vacancies
- application deadline
- eligible departments
- minimum CGPA
- maximum allowed backlogs
- required skills
- required certifications
- required experience
- passing-year constraints
- additional criteria

These criteria are directly consistent with the challenge's requested company portal and eligibility requirements. 
---

# 11. Eligibility Engine

## Objective

Automatically determine whether a student satisfies internship requirements.

### Example

```text
Internship Requirements

Minimum CGPA: 7.00
Maximum Backlogs: 0
Department: IT
Passing Year: 2028
Required Skills:
- Java
- Spring Boot
```

Student:

```text
CGPA: 7.82
Backlogs: 0
Department: IT
Passing Year: 2028
Skills:
- Java
- SQL
- React
```

Result:

```text
NOT ELIGIBLE

Reason:
Required skill missing: Spring Boot
```

### Rules

The engine must support:

- CGPA
- backlogs
- department/branch
- passing year
- skills
- certifications
- experience
- company-specific criteria

### Output

```json
{
  "status": "NOT_ELIGIBLE",
  "reasons": [
    "Required skill missing: Spring Boot"
  ]
}
```

This must be rules-based and explainable.

---

# 12. AI Internship Recommendation

## Objective

Recommend internships based on student profile and verified internship requirements.

### Inputs

- student skills
- resume
- CGPA
- academic branch
- interests
- certifications
- experience
- internship requirements

### Output

Example:

```text
Recommended Internship

Backend Developer Intern
XYZ Technologies

Match Score: 91%

Why:
✓ Java
✓ SQL
✓ Required CGPA
✓ IT branch
✓ Interest: Backend Development

Skill Gap:
- Spring Boot
```

The hackathon guide specifically suggests AI-based company recommendation and AI skill-gap analysis.

---

# 13. Resume Scoring

The AI service may score resumes against internship requirements.

Example:

```text
Resume Score: 82/100

Technical Skills       35/40
Relevant Experience    18/25
Projects               17/20
Certifications          7/10
Resume Quality          5/5
```

The system should provide improvement suggestions.

Important constraint:

**Resume score must be advisory, not an automatic selection decision.**

---

# 14. Internship Application Module

Students shall be able to:

- view internship details
- view eligibility
- view AI match score
- apply
- withdraw where permitted
- track status

### Application states

```text
APPLIED
SHORTLISTED
INTERVIEW
SELECTED
REJECTED
WITHDRAWN
```

---

# 15. Company Selection Module

Company users shall be able to:

- view applications
- filter candidates
- view eligibility
- view profile
- view resume
- shortlist
- update status
- select/reject candidates

---

# 16. Offer Letter & T&P Verification

After company selection:

```text
Company Selects Student
        ↓
Offer Letter Uploaded
        ↓
T&P Review
        ↓
Internship Verified
```

The offer can move through:

```text
PENDING
T&P_REVIEW
VERIFIED
REJECTED
```

---

# 17. Internship Trust Layer

This is one of the major differentiating features.

Every verified internship should have a unique identifier.

Example:

```text
Internship ID
INT-2026-00452
```

### Verification state

```text
Company Verified       ✓
Student Verified       ✓
Offer Verified         ✓
T&P Approved           ✓
Mentor Assigned        ✓
```

The guide specifically identifies QR-based offer-letter verification as an innovation opportunity.

---

# 18. QR Verification

A QR code shall be generated for verified internship/offer records.

Scanning the QR should open a public verification page containing safe verification information such as:

```text
Internship Authenticity

Internship ID: INT-2026-00452
Company: XYZ Technologies
Student: [Appropriate verified display name]

Company Status: Verified
Internship Status: Verified
T&P Approval: Verified
```

Sensitive private student data should not be exposed through the public endpoint.

---

# 19. Mentor Assignment

T&P users shall be able to assign faculty mentors to selected students.

### Assignment model

```text
Internship
    ↓
Student
    ↓
Faculty Mentor
```

Mentors should see only students assigned to them unless additional permission is explicitly granted.

---

# 20. Digital Internship Logbook

Students shall be able to submit weekly entries containing:

- week number
- work completed
- tasks
- learning
- challenges
- next week's plan
- optional attachments

Example:

```text
Week 3

Tasks:
Implemented authentication API.

Learning:
Spring Security and JWT.

Challenges:
Token refresh handling.

Next:
Implement role-based authorization.
```

---

# 21. Attendance / Progress Tracking

The platform can optionally support:

- weekly attendance
- progress percentage
- milestone tracking
- missed reports
- progress status

Example:

```text
Internship Progress: 64%

Weeks Completed: 7/10
Reports Submitted: 7/7
Attendance: 96%
Mentor Evaluation: Good
```

Attendance should remain a secondary MVP feature unless a reliable data source is available.

---

# 22. Notification & Automation System

n8n shall act as the automation layer.

### Example event

```text
Student Selected
      ↓
Backend Event
      ↓
n8n
      ↓
Student Email
Mentor Email
T&P Notification
```

### Other workflows

**Offer uploaded**

→ notify T&P

**Offer verified**

→ notify student and company

**Mentor assigned**

→ notify mentor and student

**Weekly report overdue**

→ notify student and mentor

**Internship completed**

→ notify T&P and student

**PPO status updated**

→ notify student

---

# 23. Evaluation Module

The system shall support:

### Mentor evaluation

- technical performance
- communication
- discipline
- progress
- comments
- recommendation

### Company evaluation

- performance
- professionalism
- technical contribution
- overall rating
- remarks

---

# 24. Completion Module

Completion requires validation of relevant documents and evaluation.

Example:

```text
Weekly Reports       ✓
Mentor Evaluation    ✓
Company Evaluation   ✓
Completion Document  ✓
T&P Verification     ✓
```

Then:

```text
INTERNSHIP COMPLETED
```

---

# 25. PPO Module

Track:

```text
PPO Offered
PPO Not Offered
Under Review
Accepted
Declined
```

Institutional analytics should include PPO conversions.

The hackathon guide specifically identifies PPO recommendations/conversions as a useful analytics metric.

---

# 26. Certificate Verification

The system shall support verified completion certificates.

Possible workflow:

```text
Completion Approved
        ↓
Certificate Generated/Uploaded
        ↓
Unique Verification ID
        ↓
QR Code
        ↓
Public Verification
```

---

# 27. Dashboards

## 27.1 Student Dashboard

Display:

- verification status
- profile completion
- eligibility summary
- recommended internships
- applications
- active internship
- progress
- notifications
- PPO status

## 27.2 Company Dashboard

Display:

- active internships
- applications
- shortlisted students
- selected students
- pending actions
- internship evaluations

## 27.3 Mentor Dashboard

Display:

- assigned students
- active internships
- pending weekly reports
- progress
- evaluation tasks
- flagged students

## 27.4 T&P Dashboard

Display:

- total students
- verified students
- active internships
- companies
- applications
- selections
- completed internships
- pending verifications
- PPO conversions

The hackathon expects dashboards with meaningful statistics rather than purely decorative graphs.

---

# 28. Analytics Requirements

The system should answer:

- How many students applied?
- How many were selected?
- How many completed internships?
- Which branches have the most internships?
- Which companies hired students?
- Where are students getting internships?
- What is the application-to-selection conversion rate?
- What skills are missing?
- What are the highest/average/lowest stipends?
- How many PPOs were generated?
- Which documents are pending?
- Which internships are pending verification?

These questions are directly aligned with the hackathon's analytics guidance.

---

# 29. Role-Based Access Control

| Role | Student | Company | Mentor | T&P Officer | T&P Head | Super Admin |
|---|---:|---:|---:|---:|---:|---:|
| Own Profile | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Internship Posting | | ✓ | | | ✓ | ✓ |
| Apply | ✓ | | | | | |
| View Assigned Students | | | ✓ | ✓ | ✓ | ✓ |
| Verify Students | | | | ✓ | ✓ | ✓ |
| Verify Companies | | | | ✓ | ✓ | ✓ |
| Verify Internship | | | | ✓ | ✓ | ✓ |
| Assign Mentor | | | | ✓ | ✓ | ✓ |
| View Institution Analytics | | | Limited | ✓ | ✓ | ✓ |
| System Configuration | | | | | Limited | ✓ |

---

# 30. Security Requirements

## Authentication

- secure password authentication
- Google OAuth
- session/token management
- logout
- password reset

## Authorization

Use RBAC and server-side authorization checks.

Never depend only on frontend route protection.

## Data Protection

- encrypted transport using HTTPS
- secure password hashing
- document access control
- signed/authorized file access
- validation of uploaded documents
- file size/type restrictions

## Audit Logging

Track sensitive actions:

```text
actor
timestamp
action
resource
previous status
new status
result
```

## Security controls

Recommended:

- JWT/access tokens
- refresh-token strategy where appropriate
- rate limiting
- CORS policy
- input validation
- SQL injection protection through ORM/parameterized queries
- CSRF protection where applicable
- secure HTTP headers
- least-privilege authorization

The hackathon explicitly includes database/security and responsible data access in its judging criteria.

---

# 31. Technical Architecture

## Frontend

```text
React
TypeScript
Vite
Responsive UI
PWA support
```

## Backend

```text
Java
Spring Boot
Spring Security
REST API
JPA / Hibernate
```

## Database

```text
PostgreSQL
```

## File Storage

Use object/file storage for:

- resumes
- offer letters
- joining letters
- internship reports
- certificates
- verification documents

## AI Layer

Separate AI service/API for:

- internship recommendation
- resume analysis
- skill-gap analysis

## Automation

```text
Spring Boot
     ↓
Webhook
     ↓
n8n
     ↓
Email / Notifications
```

## QR

```text
Verification ID
      ↓
QR Generator
      ↓
Public Verification Endpoint
```

---

# 32. High-Level System Architecture

```text
                    ┌────────────────────┐
                    │   React Web/PWA    │
                    └─────────┬──────────┘
                              │
                         REST / HTTPS
                              │
                    ┌─────────▼──────────┐
                    │    Spring Boot     │
                    │      Backend       │
                    └─────────┬──────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
 PostgreSQL              File Storage          AI Service
        │                                           │
        │                                           │
        └─────────────────────┬─────────────────────┘
                              │
                              ▼
                             n8n
                              │
                     ┌────────┼────────┐
                     ▼        ▼        ▼
                   Email   Alerts   Other channels

                              │
                              ▼
                         QR Verification
```

---

# 33. Core Data Entities

The initial database should contain approximately these core entities:

```text
User
Role
Student
Faculty
Company
TnpOfficer
Department

StudentSkill
Certification
Resume

Internship
InternshipRequirement
Application
Selection

Offer
Document
Verification

MentorAssignment
ProgressLog
Attendance
Evaluation

Completion
PPO

Notification
AuditLog

AIRecommendation
SkillGapReport
```

The schema should remain minimal until the core workflow works end-to-end.

---

# 34. Internship State Machine

The internship lifecycle should use controlled status transitions.

```text
DRAFT
  ↓
PUBLISHED
  ↓
APPLICATION_OPEN
  ↓
APPLICATION_CLOSED
  ↓
STUDENTS_SELECTED
  ↓
OFFER_PENDING
  ↓
TNP_VERIFICATION
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

Invalid status transitions should be rejected by the backend.

---

# 35. MVP Scope for Hackathon

## Must Have

### Authentication
- email login
- Google login
- role-based access

### Verification
- student verification
- company verification
- T&P verification workflow

### Student
- profile
- resume
- skills
- academic information
- eligibility

### Company
- internship creation
- eligibility criteria
- applicant management
- selection

### T&P
- verification
- mentor assignment
- internship monitoring

### Workflow
- application
- shortlist
- selection
- offer
- progress
- evaluation
- completion
- PPO status

### Innovation
At minimum:

1. **AI internship/company recommendation**
2. **QR internship/offer verification**

### Analytics
At least one meaningful institutional dashboard.

### Automation
At least one working n8n workflow.

### Security
- RBAC
- backend authorization
- audit log
- protected documents

The official final checklist explicitly expects working eligibility, company posting, application/selection, document status, progress/completion, dashboard, roles/security, innovation, sample data and a tested live demo.

---

# 36. Post-MVP Features

These should not block the hackathon MVP:

- DigiLocker integration
- advanced WhatsApp integration
- advanced attendance integrations
- real-time chat
- native mobile app
- advanced certificate verification
- advanced company ATS
- predictive analytics
- advanced ML recommendation engine
- multi-institution support
- automated interview scheduling
- external HR integrations

---

# 37. Non-Functional Requirements

## Performance

Target:

- typical API response under 500 ms for simple operations
- pagination for large datasets
- indexed search fields

## Availability

System should remain usable during the hackathon demo even if optional external AI/automation services fail.

## Scalability

Backend should be stateless where practical and expose clean APIs so a mobile client can later use the same services.

## Maintainability

- modular Spring Boot packages
- DTO/service/repository separation
- centralized exception handling
- API documentation
- environment-based configuration

## Accessibility

- keyboard-friendly interface
- readable contrast
- responsive layouts
- clear form validation
- meaningful error messages

---

# 38. UI/UX Requirements

The UI should feel like an institutional product rather than a generic AI dashboard.

### Design priorities

- simple navigation
- role-specific dashboards
- clear status indicators
- timeline-based internship workflow
- progressive disclosure
- minimal unnecessary screens
- clear document states
- responsive design

### Important UI component

The internship detail page should combine:

```text
Company
Internship
Eligibility
AI Match
Skills Required
Stipend
Duration
Mode
Deadline
Verification Status
Application Status
```

This gives students enough information to decide whether to apply.

---

# 39. Key Innovation

The central innovation is not "AI everywhere."

It is:

## Verified Internship Lifecycle

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

AI then operates on top of this trusted data.

This produces a stronger product architecture than adding unrelated AI chatbots.

---

# 40. Hackathon Demo Scenario

The 15-minute jury format gives approximately:

- first 2 minutes: problem + solution
- next 5 minutes: live main workflow
- next 3 minutes: innovation + dashboard
- final 5 minutes: questions.

### Recommended Demo

**Character:** One student + one company + one mentor + one T&P officer.

### Demo flow

```text
1. Student logs in
2. Student verification shown
3. Student profile displayed
4. Eligibility calculated
5. AI recommends internship
6. Student applies
7. Company sees eligible applicant
8. Company selects student
9. Offer uploaded
10. T&P verifies internship
11. Mentor assigned
12. Student submits progress
13. Mentor evaluates
14. Internship marked completed
15. QR verification shown
16. T&P analytics dashboard displayed
```

This demonstrates the strongest parts of the required lifecycle without wasting time on secondary screens.

---

# 41. Success Metrics

### Product metrics

- percentage of verified students
- percentage of verified companies
- internships posted
- application count
- selection rate
- completion rate
- document verification turnaround
- average internship stipend
- PPO conversion rate

### Platform metrics

- successful registration rate
- successful eligibility evaluation rate
- notification delivery rate
- AI recommendation usage
- QR verification requests
- unresolved verification cases

---

# 42. Acceptance Criteria for MVP

The MVP should be considered successful only when a jury can perform the following without manual database manipulation:

### Student

- register
- log in
- submit profile
- view verification status
- view eligibility
- receive recommendations
- apply
- track application
- submit progress

### Company

- log in
- create internship
- define eligibility
- view applicants
- shortlist
- select

### T&P

- verify student
- verify company
- verify internship
- assign mentor
- monitor progress
- view analytics

### Mentor

- view assigned student
- review progress
- evaluate student

### End-to-end

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

# 43. Prioritization

## P0 — Critical

- authentication
- RBAC
- student profile
- company profile
- internship posting
- eligibility engine
- application
- selection
- offer
- T&P verification
- mentor assignment
- progress
- evaluation
- completion
- dashboard

## P1 — High Value

- AI recommendations
- QR verification
- resume scoring
- skill-gap analysis
- n8n notifications
- audit logs

## P2 — Optional

- digital attendance
- advanced certificate verification
- chat
- WhatsApp
- DigiLocker
- mobile application

---

# 44. Risks & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Too many features | High | Freeze P0 scope early |
| AI unavailable | Medium | Core workflow must work without AI |
| n8n failure | Medium | Notifications must not block workflow |
| External verification dependency | High | Make external integrations optional |
| Security gaps | High | Server-side RBAC and validation |
| Fake demo data | Medium | Use clearly structured sample data |
| Database complexity | Medium | Start with core entities |
| UI consumes development time | High | Build workflow-first UI |
| Broken live demo | High | Test complete flow before presentation |

---

# 45. Development Strategy

The correct implementation order is:

```text
Phase 1
Architecture + Database + Authentication

Phase 2
RBAC + Student + Company + T&P

Phase 3
Internship + Eligibility + Application

Phase 4
Selection + Offer + Verification

Phase 5
Mentor + Progress + Evaluation + Completion

Phase 6
Dashboard + Analytics

Phase 7
AI Recommendation + Resume/Skill Analysis

Phase 8
QR Verification + n8n Automation

Phase 9
Security Hardening + Demo Data

Phase 10
Full End-to-End Testing
```

Do not start with AI.

The foundation is the workflow and data model.

---

# 46. Definition of Done

The hackathon MVP is done when:

- all P0 modules are functional
- role-based access works
- eligibility is automatic
- reasons for ineligibility are shown
- company internship posting works
- students can apply
- companies can shortlist/select
- offer documents can be uploaded/status-tracked
- T&P can verify internships
- mentors can be assigned
- weekly progress works
- evaluations work
- completion works
- PPO status can be recorded
- at least one dashboard provides useful analytics
- at least one AI feature works
- QR verification works
- at least one n8n workflow works
- sample data is available
- security controls are demonstrable
- the entire journey can be demonstrated live

This matches the official final checklist and the guide's emphasis on a tested working prototype.

---

# 47. Final Product Positioning

### One-line description

> **A secure and intelligent internship lifecycle platform that verifies students and companies, automates eligibility and internship workflows, tracks progress, and provides trusted internship records from application to PPO.**

### Core differentiator

> **We don't just help students find internships; we create a verifiable digital record of the entire internship lifecycle.**

### Core architecture

```text
             TRUST
               │
               ▼
      ┌─────────────────┐
      │ Verified Users  │
      │ Verified Firms  │
      │ Verified Offers │
      └────────┬────────┘
               │
               ▼
          LIFECYCLE
               │
               ▼
Registration → Eligibility
→ Application → Selection
→ Offer → Verification
→ Mentor → Progress
→ Evaluation → Completion
→ PPO
               │
               ▼
        INTELLIGENCE
               │
               ▼
AI Recommendation
Resume Scoring
Skill Gap Analysis
               │
               ▼
           ANALYTICS
               │
               ▼
Institutional Decisions
```

## Product success criterion

The product should not be judged by the number of screens or AI features.

The strongest demonstration is:

> **A jury member can take one student from registration all the way to a verified completed internship and then see that internship reflected correctly in the institutional analytics dashboard.**

That directly addresses the hackathon's required internship journey, technical implementation, security, analytics, scalability and practical impact criteria.