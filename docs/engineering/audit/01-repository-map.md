# AayurFace — Engineering Reconnaissance Audit
## Document 01: Repository Map & Structural Inventory

**Phase:** Phase 00 — Full Repository & System Reconnaissance  
**Date:** 2026-09-03  
**Auditor:** Principal Software Architect & DevOps/SRE Organization  
**Status:** FORENSIC EVIDENCE COLLECTED  

---

### 1. Repository Root & Workspace Identity

* **Active Workspace Path:** `D:\Project Aayurface`
* **Detected Upstream Git Origin:** `https://github.com/satyamsonar21-gif/Aayurface.git`
* **Current Active Branch:** `main`
* **Commit Baseline:** `a666aec` ("first commit"), `6724256` ("first commit")
* **Associated Knowledge Artifacts:**
  * `D:\aayurface prd.txt` (AayurFace Product Requirements Document v1.0, 1078 lines)
  * `D:\AayurFace Research.pdf` (Technical & Strategic Intelligence Report: Advancing Evidence-Based Multimodal Ayurvedic Skin Analysis)

---

### 2. Complete Repository Tree Structure

```text
D:\Project Aayurface\
├── .env.local                  # Local environment configuration (Supabase URL & Key)
├── .git/                       # Git version control metadata
├── .gitignore                  # Git ignore rules
├── .oxlintrc.json              # Oxlint linter configuration
├── index.html                  # HTML5 entry document
├── package.json                # Project manifest, scripts, and dependencies
├── package-lock.json           # Exact dependency lockfile
├── README.md                   # Vite + React template boilerplate documentation
├── tsconfig.json               # TypeScript project reference root
├── tsconfig.app.json           # Client app TypeScript compilation configuration
├── tsconfig.node.json          # Node/Vite tooling TypeScript compilation configuration
├── vite.config.ts              # Vite 8 bundler and Vitest test runner configuration
│
├── dist/                       # Production build output (generated artifact)
│   ├── index.html
│   └── assets/
│
├── images/                     # Root image directory (Duplicate of public/images)
│   ├── 1.jpg
│   └── 2.jpg
│
├── public/                     # Static assets served at root
│   ├── favicon.svg             # Application favicon
│   ├── icons.svg               # SVG icon spritesheet
│   └── images/                 # App imagery
│       ├── 1.jpg               # Landing page feature image
│       ├── 2.jpg               # Landing page CTA background
│       └── auth-bg.jpg         # Authentication layout background
│
├── src/                        # Primary frontend application source code
│   ├── App.tsx                 # Root React application component (QueryClient & Auth providers)
│   ├── index.css               # Tailwind v4 theme and custom design token styles
│   ├── main.tsx                # DOM hydration entrypoint (createRoot)
│   │
│   ├── assets/                 # Bundled static imports
│   │   ├── hero.png            # Hero section graphic
│   │   └── vite.svg            # Default Vite icon
│   │
│   ├── components/             # Reusable UI component library
│   │   ├── common/             # Atomic & presentational components
│   │   │   ├── AyurCard.tsx         # Accent-bordered card container
│   │   │   ├── LoadingSpinner.tsx   # Custom SVG spinner
│   │   │   ├── Logo.test.tsx        # Logo component unit tests
│   │   │   ├── Logo.tsx             # Brand logo component
│   │   │   ├── SafetyNotice.tsx     # Disclaimer banner with icon
│   │   │   ├── ShimmerCard.tsx      # Skeleton loader placeholder
│   │   │   └── SkinBadge.tsx        # Categorical pill badge
│   │   │
│   │   └── layout/             # Structural frame & navigation components
│   │       ├── AuthLayout.tsx       # Split-screen authentication frame
│   │       ├── BottomNav.tsx        # Mobile sticky bottom navigation bar
│   │       ├── PageTransition.tsx   # Framer Motion page entrance wrapper
│   │       ├── PageWrapper.tsx      # Responsive desktop/mobile viewport container
│   │       ├── Sidebar.tsx          # Desktop collapsible side navigation drawer
│   │       └── TopBar.tsx           # App header with back navigation and title
│   │
│   ├── contexts/               # React Context providers
│   │   └── AuthContext.tsx     # Authentication context (MOCK LocalStorage implementation)
│   │
│   ├── lib/                    # Shared libraries, utilities, and data
│   │   ├── mockData.ts         # 1060-line hardcoded mock dataset (remedies, tips, scan result)
│   │   ├── supabase.ts         # Supabase client initialization (UNREFERENCED BY APP)
│   │   └── utils.ts            # Formatting, base64 conversion, compression helpers
│   │
│   ├── pages/                  # Routed application views
│   │   ├── NotFoundPage.tsx    # 404 error display
│   │   ├── app/                # Authenticated application screens
│   │   │   ├── ChatPage.tsx         # AI chat interface (Hardcoded keyword if-else mock)
│   │   │   ├── EditProfilePage.tsx  # User profile edit form (No-op persistence)
│   │   │   ├── HomePage.tsx         # Main user dashboard
│   │   │   ├── LibraryPage.tsx      # Ayurvedic remedy browser & filter
│   │   │   ├── ProfilePage.tsx      # User profile summary (Hardcoded "Namrata Sen")
│   │   │   ├── RemedyDetailPage.tsx # Single remedy view (BROKEN :remedyId parameter bug)
│   │   │   ├── ResultsPage.tsx      # Scan result display (Hardcoded MOCK_SCAN_RESULT)
│   │   │   └── ScanPage.tsx         # Face capture interface (Mock 3-second setTimeout)
│   │   │
│   │   ├── onboarding/         # Onboarding workflow
│   │   │   └── OnboardingPage.tsx   # 3-step carousel (Skin type + mock camera prompt)
│   │   │
│   │   └── public/             # Unauthenticated public views
│   │       ├── ForgotPasswordPage.tsx # Password reset request form
│   │       ├── LandingPage.tsx        # Marketing landing page
│   │       ├── LoginPage.tsx          # User login form
│   │       └── RegisterPage.tsx       # User registration form
│   │
│   ├── routes/                 # Application routing
│   │   ├── guards.tsx          # ProtectedRoute & PublicRoute route guards
│   │   └── index.tsx           # Route table with lazy page imports
│   │
│   ├── test/                   # Test configuration & setup
│   │   └── setup.ts            # Vitest environment setup (@testing-library/jest-dom)
│   │
│   └── types/                  # TypeScript interface and type definitions
│       └── index.ts            # Domain entity definitions
│
└── supabase/                   # Supabase backend definitions
    ├── schema.sql              # Relational schema DDL (7 tables, triggers, RLS policies)
    └── functions/              # Supabase Edge Functions (Deno)
        ├── analyze-skin/       # Edge function calling OpenAI GPT-4o Vision
        │   └── index.ts
        └── ayurveda-chat/      # Edge function calling OpenAI GPT-4o Chat
            └── index.ts
```

---

### 3. Directory Responsibility Analysis

| Directory | Purpose | Dependencies | Status | Identified Risks |
|---|---|---|---|---|
| `src/components/common` | Presentational atomic widgets | `clsx`, `tailwind-merge`, `lucide-react` | Partially working | UI components lack accessibility tags (ARIA), hardcoded color tokens |
| `src/components/layout` | Responsive page frames & navigation | `framer-motion`, `react-router-dom`, `lucide-react` | Working with visual flaws | Discrepancy between routes (`/` vs `/home`), layout jitter on navigation |
| `src/contexts` | Global authentication state | `localStorage`, `crypto.randomUUID` | Completely Mocked | High Security Risk: Plaintext passwords bypassed; no session expiration; Supabase Auth bypassed |
| `src/lib` | Utility logic and mock stores | `clsx`, `tailwind-merge`, `@supabase/supabase-js` | Disconnected | `supabase.ts` is never imported; `mockData.ts` holds 52KB of unvalidated static mock state |
| `src/pages/app` | Core user application features | `framer-motion`, `react-router-dom`, `mockData.ts` | Partially simulated | Every major page (Scan, Results, Chat, Profile) operates on simulated delays or static mock data |
| `src/pages/onboarding` | User intake and profile bootstrap | `framer-motion`, `react-router-dom` | Incomplete / Stub | Missing 4 of 7 PRD steps: Language selection, Legal Consent, Questionnaire, Lifestyle Context |
| `src/routes` | Client-side routing & auth gates | `react-router-dom`, `AuthContext` | Working | Guard relies entirely on mock `isAuthenticated` flag in `localStorage` |
| `supabase/` | Relational schema & DDL | Supabase PostgreSQL, `auth.users` | Unlinked / Untested | Schema contains 7 tables but lacks 6 PRD-mandated domains (Questionnaire, Lifestyle, RAG, etc.) |
| `supabase/functions` | Server-side AI orchestration | Deno, OpenAI API | Orphaned / Bypassed | Edge functions are never called by frontend; no auth validation; no CV quality gateway; no RAG |

---

### 4. Anomaly & Redundancy Detection

1. **Duplicate Asset Directory:** The root contains an `images/` directory (`1.jpg`, `2.jpg`) which is identical to `public/images/`. In a Vite project, root `images/` is not served and represents dead storage.
2. **Missing Migration Tooling:** The `supabase/` directory contains only a static `schema.sql` script intended for manual copy-pasting into the Supabase web dashboard. There is no `supabase/migrations/` directory or Supabase CLI configuration file (`supabase/config.toml`).
3. **Orphaned Supabase Client:** `src/lib/supabase.ts` instantiates `@supabase/supabase-js`, but search across `src/` confirms zero imports of this client. The entire application operates disconnected from Supabase.
4. **Deleted Environment Template:** Git tracking shows `.env.example` was deleted, leaving incoming developers with no documented variable template.
