# AayurFace — Engineering Reconnaissance Audit
## Document 14: Preliminary Target Architecture & Engineering Roadmap

**Phase:** Phase 00 — Full Repository & System Reconnaissance  
**Date:** 2026-09-03  
**Auditor:** Principal Software Architect & Full Engineering Organization  
**Status:** ARCHITECTURAL PROPOSAL — NO IMPLEMENTATION IN PHASE 00  

---

### 1. Target System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER (React 19)                       │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌──────────────────┐ │
│  │   Zustand Store       │  │  TanStack Query v5    │  │  i18next (EN/HI) │ │
│  │  (Session, Language,  │  │  (Server State, Cache,│  │  (Multilingual    │ │
│  │   Capture Guidance)   │  │   Mutations, Realtime)│  │   UI Strings)    │ │
│  └───────────────────────┘  └───────────────────────┘  └──────────────────┘ │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                         CAPTURE & QUALITY GATEWAY
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLIENT-SIDE QUALITY GATEWAY (Browser)                    │
│  MediaDevices API ──► Canvas Stream ──► MediaPipe Face Mesh (468 points)    │
│  Evaluates in Real-Time:                                                    │
│  ├── Lighting Adequacy (Luma histogram: 80–220 range)                      │
│  ├── Face Centering (Bounding box within oval bounds: ±15%)                 │
│  ├── Distance Adequacy (Inter-pupillary distance: 90–180 px)                │
│  └── Sharpness / Blur (Laplacian variance > threshold)                      │
│                                                                             │
│  Decision: [FAIL] ──► On-screen guidance ("Move closer", "More light")      │
│            [PASS] ──► Upload approved frame to Supabase Storage             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Secure Temporary Signed URL
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BACKEND LAYER (Supabase Platform)                     │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      SUPABASE EDGE FUNCTIONS (Deno)                   │  │
│  │                                                                       │  │
│  │  1. Ingestion & Quality Audit (Verifies caller JWT & storage signed URL│  │
│  │  2. Computer Vision Feature Extractor:                                │  │
│  │     - Micro-vascular redness / Erythema score                         │  │
│  │     - Melanin / Pigmentation uniformity index                         │  │
│  │     - Surface texture entropy & Pore prominence                       │  │
│  │     - Morphological indicators (Eye shape, lip volume, jaw symmetry)  │  │
│  │                                                                       │  │
│  │  3. Multimodal Fusion Engine:                                         │  │
│  │     Fuses: Visual Vector (40%) + Constitutional Quiz (35%) +          │  │
│  │            Lifestyle Context (25%)                                    │  │
│  │                                                                       │  │
│  │  4. Confidence & Agreement Engine:                                    │  │
│  │     Calculates inter-modality cosine similarity:                      │  │
│  │     - High Agreement (Confidence >= 80%)                              │  │
│  │     - Moderate Agreement (Confidence 60–79%)                          │  │
│  │     - Low Agreement (Flagged uncertainty, requests clarification)     │  │
│  │                                                                       │  │
│  │  5. RAG Retrieval Engine (pgvector):                                  │  │
│  │     Queries vector store using text-embedding-3-small for verified    │  │
│  │     Ayurvedic classical texts (Charaka / Sushruta Samhita citations)  │  │
│  │                                                                       │  │
│  │  6. Generative Synthesis & Safety Filter (OpenAI GPT-4o):             │  │
│  │     Synthesizes personalized routines and XAI explanations            │  │
│  │     Enforces "What this does NOT mean" non-diagnostic boundary       │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                  PERSISTENCE LAYER (PostgreSQL + RLS)                 │  │
│  │  ├── auth.users (Managed Auth with JWT tokens)                        │  │
│  │  ├── profiles (Extended user preferences, dosha, language, role)      │  │
│  │  ├── consents (Granular consent audit logs)                           │  │
│  │  ├── questionnaire_responses (Normalized constitutional inputs)        │  │
│  │  ├── lifestyle_contexts (Normalized non-visual variables)             │  │
│  │  ├── scan_results (Immutable analysis snapshots with confidence)      │  │
│  │  ├── knowledge_base (pgvector embeddings, text chunks, citations)     │  │
│  │  ├── routines & routine_tracking (Daily/weekly task adherence)        │  │
│  │  └── progress_checkpoints (30/60/90 day comparative metrics)          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Architectural Trade-Off Analysis

| Architectural Decision | Option Considered | Recommended Choice | Rationale & Trade-Off |
|---|---|---|---|
| **Face Quality Gateway** | Server-side CV vs. Client-side MediaPipe | **Client-side MediaPipe Face Mesh** | **Why:** Eliminates network latency for real-time framing guidance; saves server compute and bandwidth; only quality-approved images reach the server. **Trade-off:** Adds ~3MB client model download; requires efficient initialization. |
| **Authentication Engine** | Custom JWT / LocalStorage vs. Supabase Auth | **Supabase Auth** | **Why:** Secure HTTP-only cookie/JWT session lifecycle, out-of-the-box Google OAuth, cryptographic password hashing (bcrypt), and seamless integration with PostgreSQL Row-Level Security. **Trade-off:** Vendor dependency on Supabase. |
| **State Management** | Redux Toolkit vs. Zustand + TanStack Query | **Zustand + TanStack Query** | **Why:** Clean separation of client UI state (Zustand: language, camera stream status, active step) and server asynchronous data (React Query: cache, retry, invalidate). Minimal boilerplate. **Trade-off:** Requires maintaining two specialized state libraries. |
| **Knowledge Grounding** | Direct Prompt Engineering vs. RAG with pgvector | **RAG with Supabase pgvector** | **Why:** Essential to eliminate hallucinations and secure scientific credibility. Recommendations link directly to cited Ayurvedic literature. **Trade-off:** Requires text ingestion pipeline and embedding generation overhead. |

---

### 3. Recommended Phased Engineering Sequence

* **Phase 00:** Forensic Reconnaissance & Audit Documentation (**CURRENT — COMPLETE**).
* **Phase 01:** Foundation Stabilization & Security Hardening:
  * Fix `vite.config.ts` build breaker (`npm run build`).
  * Replace mock `AuthContext` with genuine Supabase Auth.
  * Establish Supabase database migration tooling and deploy baseline schema with verified RLS.
  * Connect `src/lib/supabase.ts` to application data flows.
  * Fix `/library/:remedyId` routing bug.
  * Integrate `i18next` for English and Hindi localization.
* **Phase 02:** Core Intelligence & Capture Pipeline:
  * Implement client-side MediaPipe Face Mesh quality gateway (centering, lighting, blur).
  * Build multi-step Ayurvedic Constitutional Questionnaire and Lifestyle intake forms.
  * Build Supabase Storage private image bucket with signed upload URLs.
  * Implement Multimodal Fusion & Confidence Engine in Supabase Edge Functions.
  * Implement Supabase `pgvector` knowledge base and RAG retrieval.
* **Phase 03:** User Experience & Longitudinal Progress:
  * Rebuild `ResultsPage` with progressive disclosure, XAI explanations, and confidence badges.
  * Build personalized Morning/Evening/Weekly routine generator and daily adherence tracker.
  * Build 30/60/90-day progress comparison dashboard with Recharts.
  * Implement authenticated PDF report export.
  * Integrate Web Speech API for voice assistant in chat.
* **Phase 04:** Research Platform & Production Hardening:
  * Build Expert Consensus / Triple-Practitioner Annotation portal.
  * End-to-end integration testing and automated CI/CD deployment pipeline.
  * Performance profiling and mobile camera optimization.
