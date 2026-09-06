# AayurFace — Frontend Architecture Specification
## Current Repository Frontend Audit & Provenance Analysis

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** CURRENT VERIFIED AUDIT  
**Authority:** Principal Frontend Architect, Staff UX Engineer, QA Architect  

---

## 1. Executive Summary

A comprehensive empirical audit of the existing frontend codebase (`src/`, `package.json`, `index.html`, `vite.config.ts`) was conducted to document current reality versus target architecture.

### Key Reconnaissance Findings:
1. **Framework & Dependencies:** The repository is configured with **React 19.2.8**, **Vite 8.2.0**, **Tailwind CSS 4.3.3** (using `@tailwindcss/vite`), **React Router DOM 7.18.2**, **Framer Motion 13.0.0**, and **Lucide React 1.29.0**.
2. **Data Fetching & State:** `@tanstack/react-query 5.101.4` and `zod 4.4.3` are present in `package.json`, but the current UI pages rely on mock in-memory state, `localStorage`, and raw `setTimeout` delays.
3. **Authentication Mock (`src/contexts/AuthContext.tsx`):** Complete simulation of user signup, login, session persistence, and profile updates in `localStorage` (`aayurface_users`, `aayurface_session`).
4. **Camera & Capture Simulation (`src/pages/app/ScanPage.tsx`):** `react-webcam` captures a canvas frame, but analysis execution is mocked via a client-side `setTimeout(() => navigate('/results/demo-scan'), 3000)` transition.
5. **Conversational Assistant Simulation (`src/pages/app/ChatPage.tsx`):** Keyword regex pattern matching on local strings without backend or LLM communication.
6. **Visual Design & Typography:** Tailwind v4 `@theme` in `src/index.css` defines an initial palette (Herbal green, Sandalwood, Turmeric, Cream, Charcoal) with Google Fonts `Playfair Display` and `Poppins`.

---

## 2. Current Frontend Artifacts & Disposition Matrix

| Component / Artifact | File Location | Current Role / Mechanism | Deficiencies & Gaps in Production Context | Target Disposition | Target Architecture Replacement |
|---|---|---|---|---|---|
| **Package Manifest** | `package.json` | Dependencies definition | Modern packages present; React 19 compatibility verified with ecosystem. | **KEEP & HARDEN** | Retain React 19 + Vite 8 + TanStack Query 5 + Tailwind v4 stack. |
| **Theme & Tokens** | `src/index.css` | Tailwind v4 `@theme` | Hardcoded colors; missing semantic design tokens; fonts (`Playfair/Poppins`) differ from target `Cormorant/Manrope`. | **REWORK** | Replace with authoritative semantic tokens (`DESIGN-TOKENS.md`, `TYPOGRAPHY-SYSTEM.md`). |
| **Routing Tree** | `src/routes/index.tsx` | React Router route definitions | Flat routing; missing nested layouts; missing report/share/progress routes. | **REPLACE** | Domain-structured routing tree with layout shells (`ROUTE-ARCHITECTURE.md`). |
| **Route Guards** | `src/routes/guards.tsx` | Public/Protected route gating | Checks local mock user object; lacks JWT expiry and onboarding FSM validation. | **REPLACE** | Authenticated session guards tied to Supabase JWT and onboarding state. |
| **Auth Provider** | `src/contexts/AuthContext.tsx` | Mock auth with `localStorage` | Insecure unhashed plaintext credentials; client-generated UUIDs. | **REPLACE** | Supabase Auth client integration + server-authoritative JWT session store. |
| **Camera View** | `src/pages/app/ScanPage.tsx` | `react-webcam` capture | Lacks client-side MediaPipe Wasm quality gate; mocks processing with 3s timeout. | **REPLACE** | Full Wasm quality-guided capture experience (`CAPTURE-UX-SPEC.md`). |
| **Results View** | `src/pages/app/ResultsPage.tsx` | Mock scan result presentation | Displays static hardcoded scores; lacks explainability and harmonic agreement. | **REPLACE** | Grounded results view with 7-point explainability (`RESULTS-UX-SPEC.md`). |
| **Chat Assistant** | `src/pages/app/ChatPage.tsx` | Local keyword pattern match | Ungrounded; no RAG citations; no medical term safety filtering. | **REPLACE** | Grounded conversational assistant (`VOICE-UX-SPEC.md`). |
| **Mock Dataset** | `src/lib/mockData.ts` | Static JSON data arrays | Static demo data bundle. | **REMOVE** | Replaced by TanStack Query hooks fetching from Phase 05 API contracts. |
| **Supabase Client** | `src/lib/supabase.ts` | `@supabase/supabase-js` init | Correctly initialized from env vars; currently unused by pages. | **KEEP & HARDEN** | Authoritative Supabase client with token auto-refresh. |

---

## 3. Current Technical Debt & Limitations

1. **DEBT-FE-01 (Absence of Server State Management):** React Query is installed but zero custom hooks (`useQuery`, `useMutation`) exist; components manage fetch state via local `useState`.
2. **DEBT-FE-02 (Inconsistent Typography):** `src/index.css` imports `Playfair Display` and `Poppins`, whereas target luxury editorial requirements specify `Cormorant Garamond` (Display) and `Manrope` (Application UI).
3. **DEBT-FE-03 (Missing Error Boundaries):** No React Error Boundaries exist around routes or async components; unhandled runtime exceptions trigger blank white screens.
4. **DEBT-FE-04 (Zero Accessibility Instrumentation):** Missing ARIA live regions for capture feedback, missing focus visible rings, and unverified contrast ratios on turmeric/sandalwood tokens.
