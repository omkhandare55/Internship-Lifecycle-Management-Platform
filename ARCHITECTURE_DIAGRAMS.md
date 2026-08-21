# 🏛️ VILP System Architecture & Flowcharts
### *Verified Internship Lifecycle Platform — Technical Architecture Blueprint*

---

## 1. High-Level 4-Tier System Architecture

```mermaid
graph TB
    subgraph Tier1 ["1. Client Presentation Tier (SPA)"]
        direction LR
        S_UI["🎓 Student Portal<br/>(React 18 + Vite)"]
        C_UI["🏢 Recruiter Portal<br/>(Tailwind + Lucide)"]
        M_UI["👨‍🏫 Mentor Portal<br/>(TanStack Query)"]
        T_UI["🏛️ T&P Officer Portal<br/>(Telemetry Analytics)"]
        A_UI["⚡ Super Admin Portal<br/>(RBAC Management)"]
    end

    subgraph Tier2 ["2. Security & API Gateway Tier"]
        direction TB
        CORS["🌐 CORS & Rate Limiter<br/>(Sliding Window Bucket)"]
        Auth_Filter["🔐 JwtAuthenticationFilter<br/>(Stateless Bearer Token)"]
        Sanitizer["🛡️ InputSanitizationAdvice<br/>(XSS & HTML Defense)"]
        RBAC_Gate["🔒 Spring Security Method Gate<br/>(@PreAuthorize RBAC)"]
    end

    subgraph Tier3 ["3. Backend Core Domain Engines (Spring Boot 3.3 + Java 21)"]
        direction TB
        Auth_Service["🔑 AuthService & Sync<br/>(Firebase OAuth + JWT)"]
        Rule_Engine["⚡ Deterministic Eligibility Engine<br/>(CGPA, Backlogs, Branch)"]
        NOC_Service["📜 Digital NOC Approval Engine<br/>(Multi-tier Workflow)"]
        Logbook_Service["📝 Telemetry & Logbook Service<br/>(Weekly Grading & Heatmap)"]
        Cert_Service["🔏 Cryptographic Certificate Service<br/>(QR Code & SHA-256 Hash)"]
        AI_Service["🤖 AI Career Advisor Engine<br/>(Gemini 2.0 Flash / Groq)"]
    end

    subgraph Tier4 ["4. Data, Cloud & Storage Tier"]
        direction TB
        Hikari["⚡ HikariCP Connection Pool<br/>(PgBouncer Safe, prepareThreshold=0)"]
        Postgres[("🐘 PostgreSQL Relational DB<br/>(Supabase Cloud Engine)")]
        Firebase_Auth["🔥 Firebase Auth & Identity Service"]
        Firebase_Storage["☁️ Firebase Cloud Storage<br/>(Resumes, NOCs, Certificates)"]
    end

    %% Client to Gateway
    Tier1 --> CORS
    CORS --> Auth_Filter
    Auth_Filter --> Sanitizer
    Sanitizer --> RBAC_Gate

    %% Gateway to Backend Services
    RBAC_Gate --> Auth_Service
    RBAC_Gate --> Rule_Engine
    RBAC_Gate --> NOC_Service
    RBAC_Gate --> Logbook_Service
    RBAC_Gate --> Cert_Service
    RBAC_Gate --> AI_Service

    %% Backend to Database & Cloud
    Auth_Service <--> Firebase_Auth
    Rule_Engine --> Hikari
    NOC_Service --> Hikari
    Logbook_Service --> Hikari
    Cert_Service --> Hikari
    Cert_Service --> Firebase_Storage
    Hikari --> Postgres
```

---

## 2. End-to-End Internship Lifecycle Workflow Flowchart

```mermaid
flowchart TD
    Start([🚀 Opportunity Posting]) --> Step1["🏢 Recruiter posts Internship Offering (Status: DRAFT)"]
    Step1 --> Step2["🏛️ T&P Cell audits company credentials & approves listing (Status: PUBLISHED)"]
    
    Step2 --> Step3{"🎓 Student views opportunity & clicks Apply"}
    Step3 --> RuleCheck{"⚡ Deterministic Rule Engine Check:<br/>• CGPA >= Minimum?<br/>• Backlogs <= Max Allowed?<br/>• Branch & Department Match?"}
    
    RuleCheck -- ❌ Failed Criteria --> Rejected["🚫 Instant Rejection with Explanatory Reason & AI Skill Advice"]
    RuleCheck -- ✅ Passed Criteria --> Step4["📄 Auto-generate Verified Application with Institutional Profile"]
    
    Step4 --> Step5["🏢 Recruiter reviews applicants in Kanban pipeline & issues Digital Offer Letter"]
    Step5 --> Step6["📜 Student initiates Digital NOC Application Request"]
    
    Step6 --> Step7["🏛️ T&P Cell reviews & digitally signs NOC -> Assigns Faculty Mentor"]
    Step7 --> Step8["💼 Internship Commences (Status: ONGOING)"]
    
    subgraph Weekly_Loop ["🔁 Weekly Progress Telemetry Cycle"]
        Step9["📝 Student logs weekly tasks & deliverables"] --> Step10["👨‍🏫 Faculty Mentor evaluates logbook (1-5★) & writes feedback"]
        Step10 --> Step11["📊 Telemetry Heatmap & Attendance records updated in real-time"]
    end
    
    Step8 --> Weekly_Loop
    Weekly_Loop --> Step12["🏢 Company submits Final Performance Rating & PPO Decision"]
    
    Step12 --> Step13["🏛️ T&P Cell issues Cryptographic QR-Verifiable Certificate"]
    Step13 --> PublicVerify["🌐 Public QR Verification Engine:<br/>Anyone scans QR code -> Validates instantly via /verify-certificate/{id}"]
    PublicVerify --> Finish([🏁 Lifecycle Complete & Academic Credits Synced])
```

---

## 3. Dual-Layer Authentication & Security Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Client as 🌐 React Client
    participant Firebase as 🔥 Firebase Auth
    participant Spring as ⚙️ Spring Boot Backend
    participant DB as 🐘 PostgreSQL (Supabase)

    alt Google 1-Click OAuth Flow
        Client->>Firebase: signInWithPopup(GoogleAuthProvider)
        Firebase-->>Client: Firebase User Credentials (UID, Email, ID Token)
        Client->>Spring: POST /api/auth/firebase-login {email, uid, idToken, role}
        Spring->>DB: Check if User exists (findByEmail)
        opt User not found
            Spring->>DB: Auto-provision User + Verified Profile Entity (Student/Company)
        end
        Spring-->>Client: Issue VILP JWT Pair (Access Token: 30m, Refresh Token: 7d)
    else Institutional Email/Password Flow
        Client->>Spring: POST /api/auth/login {email, password}
        Spring->>DB: Verify BCrypt / Argon2id Password Hash
        Spring-->>Client: Issue VILP JWT Pair
    end

    Note over Client,Spring: Subsequent API Requests carry Header: Authorization: Bearer <access_token>
    Client->>Spring: GET /api/internships/mine
    Spring->>Spring: JwtAuthenticationFilter validates signature & extracts Role
    Spring-->>Client: 200 OK with Data
```

---

## 4. Deterministic Academic Eligibility Rule Engine Architecture

```mermaid
graph LR
    subgraph Student_State ["Student Academic State"]
        S1["🎓 CGPA (e.g. 8.42)"]
        S2["⚠️ Active Backlogs (e.g. 0)"]
        S3["🏢 Department (e.g. CSE)"]
        S4["📅 Passing Year (e.g. 2026)"]
    end

    subgraph Rule_Engine ["⚡ Deterministic Rule Engine"]
        R1["Rule 1: CGPA >= Required (8.00)"]
        R2["Rule 2: Backlogs <= Maximum (0)"]
        R3["Rule 3: Department Allowed (CSE/IT)"]
        R4["Rule 4: Batch Allowed (2026)"]
        
        Logic["🧠 Boolean Conjunctive Evaluator<br/>(R1 ∧ R2 ∧ R3 ∧ R4)"]
        
        R1 --> Logic
        R2 --> Logic
        R3 --> Logic
        R4 --> Logic
    end

    subgraph Result ["Output Action"]
        Pass["✅ ELIGIBLE &rarr; 1-Click Instant Apply"]
        Fail["❌ INELIGIBLE &rarr; Real-time AI Gap Analysis & Guidance"]
    end

    Student_State --> Rule_Engine
    Logic -- True --> Pass
    Logic -- False --> Fail
```
