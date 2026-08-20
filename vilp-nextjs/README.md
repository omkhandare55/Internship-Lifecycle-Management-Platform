# VILP Next.js 14 + Supabase Integration

Official Next.js (App Router, React Server Components, Server Actions & Supabase SSR) integration for the **Verified Internship Lifecycle Platform (VILP)**.

---

## 🚀 Key Architectural Features
1. **`@supabase/ssr` Modern Integration**:
   - **`utils/supabase/server.ts`**: Server Client using `cookies()` for React Server Components and Server Actions.
   - **`utils/supabase/client.ts`**: Browser Client using `createBrowserClient` for interactive components and Realtime subscriptions.
   - **`utils/supabase/middleware.ts`**: Middleware session refresher and route guards.
2. **React Server Components (RSC)**:
   - Queries the live Supabase PostgreSQL database directly on the server without client bundle overhead ([`app/internships/page.tsx`](./app/internships/page.tsx)).
3. **Public SSR Certificate Verifier**:
   - High-performance server-side rendering for token verification ([`app/verify/certificate/[token]/page.tsx`](./app/verify/certificate/[token]/page.tsx)).
4. **Swiss Editorial Design Tokens**:
   - `#723ECF` Purple Heart, `#ED4B86` French Rose, `#F4EEF7` Whisper, `#FEF8E7` Off Yellow, `#171024` Obsidian.

---

## 📦 How to Run

### 1. Install Dependencies
```bash
cd vilp-nextjs
npm install
```

### 2. Run Next.js Dev Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 📂 Project Structure
```
vilp-nextjs/
├── .env.local                  # Supabase live URL & Anon Key
├── middleware.ts               # Request session refresher
├── utils/
│   └── supabase/
│       ├── client.ts           # Browser Supabase client (Client Components)
│       ├── server.ts           # Server Supabase client (RSC & Server Actions)
│       └── middleware.ts       # Middleware session handler
└── app/
    ├── layout.tsx              # Root Layout with Swiss Editorial Navbar
    ├── page.tsx                # Hero Page
    ├── globals.css             # Tailwind + Space Grotesk fonts
    ├── internships/
    │   └── page.tsx            # RSC querying live Supabase opportunities
    └── verify/
        └── certificate/
            └── [token]/
                └── page.tsx    # SSR Public Certificate Verifier
```
