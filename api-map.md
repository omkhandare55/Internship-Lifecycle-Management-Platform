# 📡 VILP REST API Inventory & Contract Map

---

## 1. Authentication & Security Endpoints (`/api/auth`)

| Method | Endpoint | Description | Role / Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Email/password login, returns JWT pair | Public |
| `POST` | `/api/auth/refresh` | Exchange refresh token for new access token | Public |
| `POST` | `/api/auth/forgot-password` | Request password reset token | Public |
| `POST` | `/api/auth/reset-password` | Reset password using 6-digit recovery code | Public |
| `POST` | `/api/auth/verify-email` | Verify email token | Public |
| `POST` | `/api/auth/otp/send-email` | Dispatch 6-digit verification code to email | Public |
| `POST` | `/api/auth/otp/send-mobile`| Dispatch SMS OTP to mobile number | Public |
| `POST` | `/api/auth/otp/verify` | Validate 6-digit OTP code against target | Public |
| `DELETE`| `/api/auth/logout` | Revoke user session and refresh token | Authenticated |

---

## 2. Student Endpoints (`/api/students`)

| Method | Endpoint | Description | Role / Auth |
|---|---|---|---|
| `GET` | `/api/students/me` | Retrieve authenticated student profile | `STUDENT` |
| `POST` | `/api/students/me` | Create student profile (idempotent upsert) | `STUDENT` |
| `PUT` | `/api/students/me` | Update student profile | `STUDENT` |
| `GET` | `/api/students/{id}` | Get student profile by ID | `TNP_*`, `MENTOR`, `SUPER_ADMIN` |
| `GET` | `/api/students` | List all students with pagination & filters | `TNP_*`, `SUPER_ADMIN` |
| `POST` | `/api/students/me/skills/{id}`| Add technical skill to student profile | `STUDENT` |
| `DELETE`| `/api/students/me/skills/{id}`| Remove technical skill from profile | `STUDENT` |

---

## 3. Company & Recruiter Endpoints (`/api/companies`)

| Method | Endpoint | Description | Role / Auth |
|---|---|---|---|
| `GET` | `/api/companies/me` | Retrieve authenticated recruiter profile | `COMPANY` |
| `POST` | `/api/companies` | Create recruiter profile (idempotent upsert) | `COMPANY` |
| `PUT` | `/api/companies/me` | Update company profile | `COMPANY` |
| `GET` | `/api/companies/{id}` | Get company profile by ID | Authenticated |
| `GET` | `/api/companies` | List accredited companies with pagination | Authenticated |
| `POST` | `/api/companies/{id}/verify`| Verify corporate partner KYC status | `TNP_OFFICER`, `TNP_HEAD` |

---

## 4. Internship Endpoints (`/api/internships`)

| Method | Endpoint | Description | Role / Auth |
|---|---|---|---|
| `GET` | `/api/internships` | List open internships with search & filters | Authenticated |
| `GET` | `/api/internships/{id}` | Get internship posting details by ID | Authenticated |
| `POST` | `/api/internships` | Create new internship posting | `COMPANY` |
| `PUT` | `/api/internships/{id}` | Update existing internship posting | `COMPANY` |
| `POST` | `/api/internships/{id}/publish`| Publish draft internship posting | `COMPANY` |
| `POST` | `/api/internships/{id}/verify` | T&P verify & approve internship posting | `TNP_OFFICER`, `TNP_HEAD` |

---

## 5. Application Endpoints (`/api/applications`)

| Method | Endpoint | Description | Role / Auth |
|---|---|---|---|
| `POST` | `/api/applications` | Apply for an internship with cover letter | `STUDENT` |
| `GET` | `/api/applications/mine` | List all applications submitted by student | `STUDENT` |
| `DELETE`| `/api/applications/{id}` | Student withdraws active application | `STUDENT` |
| `GET` | `/api/applications/internship/{id}`| List candidate applicants for posting | `COMPANY`, `TNP_*` |
| `PUT` | `/api/applications/{id}/status` | Update candidate status (`SELECTED`, etc.) | `COMPANY` |

---

## 6. Offer & NOC Endpoints (`/api/offers` & `/api/noc`)

| Method | Endpoint | Description | Role / Auth |
|---|---|---|---|
| `POST` | `/api/offers` | Issue corporate internship offer | `COMPANY` |
| `GET` | `/api/offers/mine` | Student views received offers | `STUDENT` |
| `POST` | `/api/offers/{id}/respond` | Accept/Reject offer (triggers single mutex) | `STUDENT` |
| `GET` | `/api/noc/queue` | Placement NOC review & approval queue | `TNP_OFFICER`, `TNP_HEAD` |
| `POST` | `/api/noc/{id}/process` | Approve or reject NOC request | `TNP_OFFICER`, `TNP_HEAD` |
| `GET` | `/api/noc/verify/{code}` | Public verification of student NOC code | Public |

---

## 7. Logbook & Faculty Evaluation Endpoints (`/api/logbooks` & `/api/evaluations`)

| Method | Endpoint | Description | Role / Auth |
|---|---|---|---|
| `POST` | `/api/logbooks/weekly` | Submit weekly industrial task report | `STUDENT` |
| `GET` | `/api/logbooks/mine` | List student submitted weekly reports | `STUDENT` |
| `GET` | `/api/logbooks/hours/approved` | Get accumulated approved contact hours | `STUDENT` |
| `GET` | `/api/logbooks/review-queue` | Faculty mentor logbook audit queue | `MENTOR` |
| `POST` | `/api/logbooks/{id}/review` | Mentor approves/requests revisions (40 hrs) | `MENTOR` |
| `POST` | `/api/evaluations` | Submit 5-dimension competency evaluation | `MENTOR`, `COMPANY` |
| `GET` | `/api/evaluations/student/{id}` | Get evaluation history for student | Authenticated |

---

## 8. Document & Public Ledger Endpoints (`/api/documents` & `/api/public`)

| Method | Endpoint | Description | Role / Auth |
|---|---|---|---|
| `POST` | `/api/documents/upload` | Multipart file upload with SHA-256 hash | Authenticated |
| `GET` | `/api/documents/{id}/download` | Stream authenticated file blob | Authenticated |
| `GET` | `/api/documents/entity/{type}/{id}`| List documents associated with an entity | Authenticated |
| `GET` | `/api/public/departments` | Public list of university departments | Public |
| `GET` | `/api/public/skills` | Public directory of 150+ technical skills | Public |
| `GET` | `/api/public/certificates/verify/{num}` | Public certificate verification | Public |

---

## 9. Analytics, Audit & Admin Endpoints (`/api/analytics`, `/api/audit`, `/api/admin`)

| Method | Endpoint | Description | Role / Auth |
|---|---|---|---|
| `GET` | `/api/analytics/overview` | Institutional placement overview KPIs | `TNP_*`, `SUPER_ADMIN` |
| `GET` | `/api/audit` | System compliance audit log explorer | `TNP_*`, `SUPER_ADMIN` |
| `GET` | `/api/admin/users` | List users with RBAC roles & statuses | `SUPER_ADMIN` |
| `PUT` | `/api/admin/users/{id}/status` | Lock or unlock user account | `SUPER_ADMIN` |
| `POST` | `/api/admin/users/{id}/roles` | Assign or remove user role | `SUPER_ADMIN` |
| `POST` | `/api/admin/bulk-ingestion/students`| Bulk CSV/JSON student batch import | `SUPER_ADMIN`, `TNP_HEAD` |
