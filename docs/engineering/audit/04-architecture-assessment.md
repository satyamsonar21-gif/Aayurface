# AayurFace — Engineering Reconnaissance Audit
## Document 04: Architecture Assessment & Coupling Analysis

**Phase:** Phase 00 — Full Repository & System Reconnaissance  
**Date:** 2026-09-03  
**Auditor:** Principal Software Architect  
**Status:** FORENSIC EVIDENCE COLLECTED  

---

### 1. Conceptual Architecture vs. Actual Architecture

#### PRD Conceptual Architecture
```text
UI (React 18 + Zustand + i18n)
  ↓ (MediaDevices + MediaPipe / TF.js Quality Gateway)
Client-Side Quality Pass
  ↓ (Base64 / Blob Upload)
Supabase Storage (Private Encrypted Bucket + Signed URLs)
  ↓ (Edge Function Trigger)
Supabase Edge Function (Deno)
  ├── Computer Vision Feature Extractor
  ├── Multimodal Fusion Engine (Facial Signals + Questionnaire + Lifestyle)
  ├── Confidence & Conflict Detection Layer
  ├── RAG Knowledge Retrieval (pgvector + text-embedding-3-small)
  └── OpenAI GPT-4o Synthesis & Safety Filter
  ↓
Supabase Database (Postgres + RLS + Versioned Records)
  ↓ (Supabase Realtime Channel)
UI Live Status & Explainable Results View
```

#### Actual Repository Architecture (Forensic Reality)
```text
UI (React 19 + Local State)
  ├── ScanPage (Webcam dummy view → 3s setTimeout)
  ├── ChatPage (if/else keyword string matching → 2s setTimeout)
  ├── ResultsPage (Hardcoded import MOCK_SCAN_RESULT)
  ├── LibraryPage (In-memory filter on MOCK_REMEDIES)
  └── ProfilePage (Hardcoded string "Namrata Sen")
  ↓
AuthContext (Mock LocalStorage Provider, ignores passwords)
  ↓
[GAP: ZERO DATABASE OR STORAGE CALLS]
  ↓
Supabase Backend (Orphaned `schema.sql` + 2 Uncalled Edge Functions)
```

---

### 2. Layer-by-Layer Coupling & Architectural Defects

#### Defect 1: The Total Disconnection of Frontend and Backend
* **Observation:** The frontend application possesses zero network requests to Supabase or any external backend.
* **Evidence:** `src/lib/supabase.ts` is never imported. `npm run build` and runtime grep show zero API calls (`fetch`, `axios`, or `supabase.from(...)`) in `src/pages` or `src/components`.
* **Impact:** The application currently acts as a standalone interactive wireframe / clickable prototype, not a production software system.

#### Defect 2: Mock State Monolith (`src/lib/mockData.ts`)
* **Observation:** A single 52KB file containing 1060 lines of hardcoded mock objects supplies all application data.
* **Evidence:** `MOCK_REMEDIES` (30 remedies), `MOCK_DAILY_TIPS` (30 tips), and `MOCK_SCAN_RESULT` are statically imported across `ResultsPage`, `LibraryPage`, `HomePage`, and `RemedyDetailPage`.
* **Impact:** High coupling between components and synthetic data structures; prevents dynamic user data, database migrations, or authentic multi-user operation.

#### Defect 3: Absence of State Management Architecture
* **Observation:** The PRD specifies Zustand for global client state and TanStack Query for server state.
* **Evidence:** Zustand is not installed. React Query is instantiated in `App.tsx` but is completely unused. Every page relies on uncoordinated local `useState` hooks or direct mutations to `localStorage`.
* **Impact:** Inability to maintain user session state across refreshes safely; unable to manage asynchronous analysis pipelines; inability to persist questionnaire or lifestyle data across steps.

#### Defect 4: Bypassed Server-Side AI Layer
* **Observation:** Two Supabase Edge Functions exist in `supabase/functions/` (`analyze-skin` and `ayurveda-chat`), but neither is wired to the frontend.
* **Evidence:** `ScanPage.tsx` and `ChatPage.tsx` use client-side timers (`setTimeout`) rather than invoking `supabase.functions.invoke()`.
* **Impact:** The server-side AI implementation is dormant.

#### Defect 5: Architectural Divergence in Theme and Styling
* **Observation:** The codebase adopted Tailwind v4 (`@tailwindcss/vite`), which replaces `tailwind.config.js` with `@theme` in `src/index.css`.
* **Evidence:** Color values defined in `src/index.css` (e.g., `--color-herbal: #4CAF50`) deviate from the PRD Section 4 design specifications (Primary: Deep Terracotta `#C2622D`, Forest Sage Green `#5A7A5C`).
