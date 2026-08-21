# 🕸️ VILP Module & Dependency Hierarchy Graph

---

## 1. Core High-Impact Files (Critical System Backbone)

These files govern the core authentication, routing, security, and state contracts across the entire platform. Any uncoordinated changes to these files will impact multiple subsystems.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           BACKEND CRITICAL CORE                          │
│                                                                           │
│  1. SecurityConfig.java         (d:/Team Parsu/vilp-backend/.../config/)  │
│     - Global security filter chain, permitted paths, and CORS patterns.   │
│                                                                           │
│  2. JwtTokenProvider.java       (d:/Team Parsu/vilp-backend/.../security/)│
│     - Token generation, signing, validation, claims parsing.              │
│                                                                           │
│  3. AuthService.java            (d:/Team Parsu/vilp-backend/.../auth/)    │
│     - Registration, login, verification, and BCrypt password encryption. │
│                                                                           │
│  4. OfferService.java           (d:/Team Parsu/vilp-backend/.../offer/)   │
│     - Transactional single-active offer mutex lock & NOC stamping.        │
│                                                                           │
│  5. StudentService.java         (d:/Team Parsu/vilp-backend/.../student/) │
│     - Idempotent student profile upsert and contact hour calculations.    │
└───────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND CRITICAL CORE                           │
│                                                                           │
│  1. axiosInstance.ts            (d:/Team Parsu/vilp-frontend/.../services)│
│     - Base URL normalization, JWT Bearer interceptor, 401 refresh logic.  │
│                                                                           │
│  2. authStore.ts                (d:/Team Parsu/vilp-frontend/.../stores)  │
│     - Zustand persistent authentication state, tokens, role session.      │
│                                                                           │
│  3. router/index.tsx            (d:/Team Parsu/vilp-frontend/.../routes)  │
│     - RoleRoute protected navigation tree across all 5 consoles.          │
│                                                                           │
│  4. vilpApi.ts                  (d:/Team Parsu/vilp-frontend/.../services)│
│     - Strongly typed API contract definition for all 23 backend domains.  │
│                                                                           │
│  5. MultiRoleOnboardingWizard.tsx (d:/Team Parsu/vilp-frontend/.../pages) │
│     - Multi-role KYC intake, dual OTP verification, auto-login routing.   │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Dependency Hierarchy by Layer

### 2.1 Backend Layer Dependency Graph
`Controller` &rarr; `Service` &rarr; `Repository` &rarr; `Entity` &rarr; `PostgreSQL Database`
- **Cross-Cutting Aspects:**
  - `AuditLogAspect` intercepts mutating controller actions to record audit trails in `audit_logs`.
  - `InputSanitizationAdvice` sanitizes JSON string fields using `Jsoup`.
  - `RateLimitingFilter` enforces IP-level token buckets using `Bucket4j`.

### 2.2 Frontend Layer Dependency Graph
`Page Component` &rarr; `TanStack useQuery / useMutation` &rarr; `vilpApi.ts` &rarr; `axiosInstance.ts` &rarr; `Backend REST Endpoint`
- **State Management:**
  - `authStore.ts` (Zustand): Persists user profile, access token, and active role.
  - `@tanstack/react-query`: Caches server state, handles automatic invalidation, and optimizes re-renders.

---

## 3. Safe Modification Guidelines

1. **When updating database entities:**
   - Always create a new Flyway migration script in `vilp-backend/src/main/resources/db/migration/` (`V16__...sql`).
   - Never modify existing executed migration scripts (`V1` to `V15`).
2. **When modifying API contracts:**
   - Update both Backend DTO (`*Dto.java`) and Frontend TypeScript Interface (`vilp.types.ts`).
3. **When updating routes:**
   - Ensure the required role is explicitly whitelisted in `RoleRoute` in `routes/index.tsx`.
