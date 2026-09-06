# AayurFace — Engineering Reconnaissance Audit
## Document 12: Requirements Traceability Matrix

**Phase:** Phase 00 — Full Repository & System Reconnaissance  
**Date:** 2026-09-03  
**Auditor:** Principal Architect & Technical Documentation Engineer  
**Status:** FORENSIC EVIDENCE COLLECTED  

---

### Requirements Traceability Matrix (PRD v1.0 vs. Codebase)

| Req ID | PRD Feature Specification | Current Implementation in Repository | Evidence | Status | Gap / Risk | Recommendation |
|---|---|---|---|---|---|---|
| **REQ-2.1** | Multilingual Onboarding & Language Selection (EN, HI, MR, TA, TE, BN) | None. Hardcoded English across all views. | No `i18n` in `package.json` or `src/`. | **MISSING** | Inaccessible to non-English users; core product differentiator absent. | Implement `i18next` with English and Hindi resource bundles in Phase 01. |
| **REQ-2.2** | Granular Informed Consent (Facial Processing, Storage, Research) | Generic disclaimer in onboarding step 3; no checkboxes or DB records. | `OnboardingPage.tsx` lines 180–190. | **MISSING** | Privacy compliance risk; unable to legally process or store face captures. | Build dedicated consent screen with database persistence. |
| **REQ-2.3** | Supabase User Auth & Session Management | LocalStorage mock provider ignoring passwords. | `src/contexts/AuthContext.tsx` lines 52–96. | **BROKEN** | Critical security flaw; unauthenticated sessions; password verification bypassed. | Connect Supabase Auth (`supabase.auth`) immediately. |
| **REQ-2.4** | Ayurvedic Constitutional Questionnaire (Vata/Pitta/Kapha) | None. Single skin-type selection step in onboarding. | `OnboardingPage.tsx` lines 110–148. | **MISSING** | Core constitutional intelligence input absent; cannot calculate Prakriti signal. | Implement structured multi-step dosha questionnaire. |
| **REQ-2.5** | Lifestyle Context Collection (Diet, Sleep, Stress, Climate, Water) | None. | Zero lifestyle components or schema in repository. | **MISSING** | Missing 1 of the 3 fundamental multimodal inputs. | Implement concise lifestyle intake component. |
| **REQ-2.6** | Standard Face Capture with Quality Gateway (TF.js/MediaPipe) | Raw `<Webcam />` feed with CSS circle; 3s timeout capture. | `ScanPage.tsx` lines 17–22. | **SIMULATED** | No blur, lighting, centering, or distance checks; garbage images pass freely. | Integrate client-side face landmarking and quality gateway. |
| **REQ-2.7** | Computer Vision Feature Extraction (Texture, Pigmentation, Symmetry) | None. Direct call to GPT-4o Vision in edge function. | `supabase/functions/analyze-skin/index.ts`. | **MISSING** | Black-box model dependence; no objective biometric feature vectors. | Build feature extraction layer before LLM synthesis. |
| **REQ-2.8** | Multimodal Fusion Engine (Weighted Facial + Quiz + Lifestyle) | None. | No fusion logic exists. | **MISSING** | Core scientific value proposition absent; single-modality output. | Implement weighted fusion algorithm. |
| **REQ-2.9** | Confidence-Aware Intelligence & Conflict Detection | Static `"Mild"` SVG circle in UI. | `ResultsPage.tsx` lines 49–57. | **MISSING** | System cannot detect or communicate inter-modality disagreement. | Implement agreement calculation (High, Moderate, Low). |
| **REQ-2.10** | Explainable AI Layer (Why This Result, What it does NOT mean) | Hardcoded static text. | `src/lib/mockData.ts` lines 1010–1050. | **MOCKED** | Explanations are synthetic and disconnected from real observations. | Implement structured XAI explanation synthesis. |
| **REQ-2.11** | Ayurvedic Knowledge Engine & RAG (pgvector + GPT-4o) | None. OpenAI called with generic prompt. | `supabase/functions/ayurveda-chat/index.ts`. | **MISSING** | High hallucination risk; recommendations ungrounded in classical texts. | Enable `pgvector` in Supabase and construct curated knowledge base. |
| **REQ-2.12** | Personalized Recommendations (Skincare, Herbs, Diet) | Static mock remedies rendered on results. | `ResultsPage.tsx` line 13 (`MOCK_SCAN_RESULT`). | **MOCKED** | Guidance is identical for all users regardless of capture. | Generate dynamic recommendations from fused intelligence. |
| **REQ-2.13** | Personalized Routine (Morning/Evening/Weekly + Tracking) | None. Static preview text in mock results. | Zero routine tracking tables or components. | **MISSING** | Users cannot follow or log adherence to routines. | Build routine tracking schema and dashboard UI. |
| **REQ-2.14** | Voice Assistant (Web Speech API input and output) | None. | No Web Speech API calls in `ChatPage.tsx`. | **MISSING** | Voice accessibility absent. | Add speech recognition and synthesis handlers in chat. |
| **REQ-2.15** | Comprehensive Results Experience | Hardcoded presentation of `MOCK_SCAN_RESULT`. | `ResultsPage.tsx`. | **PARTIAL** | UI shell exists but lacks confidence badges, XAI tabs, and dynamic data. | Wire results view to authenticated scan records. |
| **REQ-2.16** | Analysis History & Longitudinal Snapshots | Static card showing "Aug 14, 2024" in profile. | `ProfilePage.tsx` lines 58–63. | **MOCKED** | Historical analyses are not persisted or retrievable. | Connect to `scan_results` table with immutable snapshot history. |
| **REQ-2.17** | Progress Dashboard (30/60/90-Day Trends) | None. | Recharts not installed; no trend logic. | **MISSING** | Returning users cannot evaluate skin progress over time. | Build progress dashboard with Recharts. |
| **REQ-2.18** | PDF Report Generation | None. | Neither jsPDF nor react-pdf installed. | **MISSING** | Users cannot export or share their wellness reports. | Implement client/server PDF generation. |
| **REQ-2.19** | Notifications & Routine Reminders | None. | No notification settings or service worker. | **MISSING** | Adherence retention mechanisms absent. | Defer to later phase. |
| **REQ-2.20** | Role-Based Admin & Research Controls | None. | No role columns or researcher panels. | **MISSING** | Cannot support expert annotations or consensus datasets. | Add role architecture to database schema. |
| **REQ-2.21** | Row-Level Security & Facial Privacy Infrastructure | Schema defines basic RLS; app does not connect. | `supabase/schema.sql` lines 168–208. | **DORMANT** | RLS exists in SQL file but is unverified in live database. | Deploy schema and verify RLS via integration tests. |
