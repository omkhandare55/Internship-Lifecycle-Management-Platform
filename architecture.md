# 🏛️ VILP System Architecture & Technical Specification

---

## 1. System Topology & Data Flow

```
+─────────────────────────────────────────────────────────────────────────────+
|                                CLIENT LAYER                                 |
|  • Web Client (React 19 SPA on Vercel)                                      |
|  • Mobile Native Shell (Capacitor for Android & iOS)                        |
|  • Public Verification Consumers (Embassies, Recruiters, External Portals)  |
+──────────────────────────────────────┬──────────────────────────────────────+
                                       │ HTTPS / WSS / TLS 1.3
                                       ▼
+─────────────────────────────────────────────────────────────────────────────+
|                         SECURITY & GATEWAY LAYER                            |
|  • Universal CORS Filter (Whitelisted origins & wildcard preview domains)   |
|  • Bucket4j Sliding-Window Rate Limiting (50 req/min per IP)                |
|  • JwtAuthenticationFilter (Stateless Bearer token validation)              |
|  • InputSanitizationAdvice (Jsoup XSS prevention on request bodies)         |
+──────────────────────────────────────┬──────────────────────────────────────+
                                       │ Dispatched
                                       ▼
+─────────────────────────────────────────────────────────────────────────────+
|                        APPLICATION LOGIC LAYER                              |
|  • 23 REST Controllers with Swagger / OpenAPI Annotations                   |
|  • Service Layer with @Transactional Business Consistency                  |
|  • Single-Active Offer Mutex & Automatic NOC Issuance Engine                |
|  • Rule Engine for Eligibility Auditing (CGPA, Backlogs, Passing Year)      |
|  • Google Gemini 2.0 AI Recommendation & Neural Evaluation Service          |
|  • Real-Time SSE Notification Broker                                        |
+──────────────────────────────────────┬──────────────────────────────────────+
                                       │ HikariCP Connection Pool (SSL)
                                       ▼
+─────────────────────────────────────────────────────────────────────────────+
|                         PERSISTENCE & STORAGE                               |
|  • PostgreSQL 16 Relational Engine (Managed Database Instance)              |
|  • 15 Version-Controlled Flyway Migrations (V1 to V15)                      |
|  • Supabase Object Storage / Secure File System for PDF Documents           |
+─────────────────────────────────────────────────────────────────────────────+
```

---

## 2. Core Subsystems

### 2.1 Identity & Access Governance (RBAC)
- Password hashing using Spring Security's `BCryptPasswordEncoder` (cost factor 10).
- JWT claims carry subject (`userId`) and role (`role`). No sensitive PII is embedded in tokens.
- Stateless authentication with automatic token rotation via `/api/auth/refresh`.

### 2.2 Placement Mutex & NOC Engine
- When an offer is accepted, the system triggers a database transaction that:
  - Updates offer status to `ACCEPTED`.
  - Sets timestamp and student allocation lock.
  - Automatically transitions other student applications to `CANCELLED_OFFER_ACCEPTED`.
  - Automatically stamps a unique alphanumeric verification code (`NOC-2026-XXXXXX`) with SHA-256 hash.

### 2.3 Contact Hour Logbook Accumulator
- Student submits weekly logbook entries with tasks and hours.
- Faculty mentor reviews and approves hours.
- System aggregates approved hours towards the mandatory 240-hour credit requirement.

### 2.4 Document Management & Cryptographic Public Verifiers
- File uploads are verified for MIME type and size (<10MB).
- SHA-256 hashes are computed for file integrity.
- Files are served securely via authenticated stream endpoints (`GET /api/documents/{id}/download`).
- Public verification endpoints for Certificates and NOCs operate fail-closed with 404 responses for invalid tokens.
