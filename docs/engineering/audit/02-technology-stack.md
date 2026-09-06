# AayurFace — Engineering Reconnaissance Audit
## Document 02: Actual Technology Stack vs. PRD Specification

**Phase:** Phase 00 — Full Repository & System Reconnaissance  
**Date:** 2026-09-03  
**Auditor:** Principal Software Architect & Senior Frontend Engineer  
**Status:** FORENSIC EVIDENCE COLLECTED  

---

### 1. Technology Matrix (Declared vs. Actual)

| Subsystem / Layer | PRD Specification (D:\aayurface prd.txt) | Actual Repository Implementation | Deviation / Status |
|---|---|---|---|
| **Frontend Framework** | React 18 | React 19.2.8 (`package.json`) | Major version jump (React 19). Potential ecosystem incompatibility with legacy libraries. |
| **Bundler / Tooling** | Vite (v5/v6) | Vite 8.2.0 (`vite` & `@vitejs/plugin-react` v6.0.4) | Ahead of standard ecosystem; Vitest config causes TypeScript compilation failures under `tsc -b`. |
| **Language** | TypeScript | TypeScript 6.0.2-dev / ~6.0.2 (`package.json`) | Working. Strict typing partially bypassed with `as any` and `Record<string, unknown>`. |
| **Styling** | Tailwind CSS with design tokens (`tailwind.config.js`) | Tailwind CSS v4.3.3 via `@tailwindcss/vite` | Tailwind v4 removes `tailwind.config.js` and uses `@theme` in `index.css`. Theme colors deviate from PRD palette. |
| **Global Client State** | Zustand (language, session, analysis progress) | `localStorage` and component `useState` | **MISSING**. Zustand is neither in `package.json` nor implemented anywhere in `src/`. |
| **Server State** | TanStack React Query v5 | `@tanstack/react-query` v5.101.4 in `App.tsx` | Installed and wrapped, but **ZERO** `useQuery` or `useMutation` hooks exist in the codebase. |
| **Routing** | React Router v6 | React Router v7.18.2 (`react-router-dom`) | React Router v7 in place. Route param mismatch on `/library/:remedyId` vs `useParams().slug`. |
| **Internationalization** | i18next + react-i18next (EN, HI, MR, TA, TE, BN) | None | **MISSING**. i18n is not installed. All UI text is hardcoded in English. |
| **Client-Side Face Detection** | MediaPipe Face Mesh + TensorFlow.js | `react-webcam` v7.2.0 only | **MISSING**. Neither TensorFlow.js nor MediaPipe is installed. No landmark or quality detection. |
| **Voice Assistant** | Web Speech API (Recognition + Synthesis) | None | **MISSING**. No Web Speech API integration found. |
| **PDF Generation** | jsPDF or react-pdf | None | **MISSING**. Neither jsPDF nor react-pdf is installed. |
| **Charts & Visualization** | Recharts (longitudinal trends) | None | **MISSING**. Recharts is not installed. Progress charts are non-existent. |
| **Form Management** | React Hook Form + Zod | `react-hook-form` v7.84.0 + `zod` v4.4.3 | Installed and used in `LoginPage` and `RegisterPage`. Notice: Zod 4 is a major rewrite. |
| **Icons** | Lucide React | `lucide-react` v1.29.0 | Installed and actively utilized. |
| **Backend Platform** | Supabase (Auth, Postgres, Storage, Edge Functions) | Supabase JS client v2.112.2 installed | Client is unreferenced in app code. Backend is 100% disconnected from UI. |
| **Database** | Supabase Postgres + RLS | `supabase/schema.sql` (7 tables) | Static SQL only. Missing questionnaire, lifestyle, RAG, routine, and progress tables. |
| **Storage** | Supabase Storage (signed URLs) | None | No storage bucket configuration or signed URL generation in code. |
| **AI Orchestration** | Supabase Edge Functions + OpenAI GPT-4o | Deno Edge Functions in `supabase/functions` | Two functions exist (`analyze-skin`, `ayurveda-chat`), but neither is called by the UI. |
| **Vector Store / RAG** | Supabase pgvector + text-embedding-3-small | None | **MISSING**. No pgvector extension, no embeddings, no retrieval pipeline. |

---

### 2. Dependency Audit & Problematic Packages

| Package | Declared Version | Purpose | Usage in Code | Risk Assessment & Recommendation |
|---|---|---|---|---|
| `react` / `react-dom` | `^19.2.8` | Core UI library | Across `src/` | **High Risk**: React 19 is very recent. Older MediaPipe/TensorFlow wrappers and Recharts frequently have peer dependency conflicts with React 19. Recommend verifying ecosystem compatibility before installing MediaPipe. |
| `zod` | `^4.4.3` | Schema validation | `LoginPage`, `RegisterPage` | **Medium Risk**: Zod v4 is an experimental/alpha branch. Standard industry integrations use Zod v3. Recommend standardizing on stable Zod v3 if third-party resolvers misbehave. |
| `@tailwindcss/vite` & `tailwindcss` | `^4.3.3` | Styling framework | `vite.config.ts`, `index.css` | **Medium Risk**: Tailwind v4 configuration differs fundamentally from Tailwind v3. Color tokens in `index.css` contradict PRD hex specifications. |
| `vitest` | `^4.1.10` | Test runner | `vite.config.ts`, `package.json` | **Critical Build Blocker**: Vitest configuration in `vite.config.ts` causes `tsc -b` to fail with TS2769 error because `tsconfig.node.json` lacks Vitest type definitions. |
| `@supabase/supabase-js` | `^2.112.2` | Supabase SDK | `src/lib/supabase.ts` | **Zero Usage**: Installed but dead code in the browser bundle. Needs to be integrated into `AuthContext` and data hooks. |
| `@tanstack/react-query` | `^5.101.4` | Server state | `src/App.tsx` | **Dead Code**: Wraps app with provider but no queries or mutations are defined. |
| `react-webcam` | `^7.2.0` | Camera access | `src/pages/app/ScanPage.tsx` | **Functional Gap**: Renders raw `<Webcam />` feed but capture button does not even call `.getScreenshot()`; uses dummy 3s timer instead. |

---

### 3. Missing Dependencies Required by PRD

The following libraries are specified in `D:\aayurface prd.txt` but are completely absent from `package.json`:

1. `zustand` (PRD Section 3.1 — Global client state)
2. `i18next` & `react-i18next` (PRD Section 3.1 — Multilingual accessibility)
3. `@tensorflow/tfjs` & `@mediapipe/face_mesh` (PRD Section 3.1 — Real-time face quality gateway)
4. `recharts` (PRD Section 3.1 — Longitudinal progress charts)
5. `jspdf` or `@react-pdf/renderer` (PRD Section 3.1 — PDF report generation)
