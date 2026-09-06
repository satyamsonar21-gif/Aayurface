# AayurFace — Engineering Requirements Specification
## Document 16: Conflicts, Gaps & Human Decision Register

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** Principal Requirements Engineer, Product Manager, Solution Architect  

---

### 1. Conflict Register

| Conflict ID | Topic | Source A (PRD / Research) | Source B (Repository Reality) | Impact | Recommended Resolution |
|---|---|---|---|---|---|
| **CONFLICT-001** | React Framework Version | PRD Section 3.1: "React 18 with Vite" | `package.json`: `"react": "^19.2.8"` | High Risk: React 19 may have peer dependency conflicts with MediaPipe/Recharts. | **OPEN DECISION DEC-001:** Test MediaPipe under React 19; if incompatible, downgrade to React 18 LTS. |
| **CONFLICT-002** | Brand Palette Design Tokens | PRD Section 4: Primary Deep Terracotta (`#C2622D`), Mahogany (`#8B3A1A`), Sage (`#5A7A5C`) | `src/index.css`: `--color-herbal: #4CAF50` (Material Green), Cream (`#FAF9F6`) | Visual & Heritage disconnect: Prototype lacks Ayurvedic heritage palette. | **OPEN DECISION DEC-002:** Refactor `@theme` in `src/index.css` to adopt PRD Section 4 color tokens. |
| **CONFLICT-003** | Remedy Detail Routing Parameter | `src/routes/index.tsx`: declares `/library/:remedyId` | `src/pages/app/RemedyDetailPage.tsx`: extracts `useParams().slug` | Active Defect: `slug` is always undefined; every detail page shows remedy #1. | Update route in `src/routes/index.tsx` to `/library/:slug`. |
| **CONFLICT-004** | Authentication Layer | PRD Section 2.3: "Supabase Auth — email/password and Google OAuth" | `src/contexts/AuthContext.tsx`: Mock `localStorage` ignoring passwords | Critical Security Flaw: Zero authentication or password verification. | Replace mock provider with genuine Supabase Auth SDK. |
| **CONFLICT-005** | CV & AI Architecture | PRD Section 2.7 & Research: Server-side CV feature extraction + Multimodal fusion | `supabase/functions/analyze-skin/index.ts`: Direct prompt to GPT-4o Vision | Scientific Credibility: System acts as generic AI wrapper without CV features. | Build dedicated feature extraction and multimodal fusion layer. |
| **CONFLICT-006** | Onboarding Flow Scope | PRD Section 5: 7 distinct onboarding steps (Language, Consent, Profile, Prefs, Quiz, Lifestyle, Ready) | `src/pages/onboarding/OnboardingPage.tsx`: 3 stub steps (Skin type + mock camera) | Critical Gap: Missing 4 core intake modules (Questionnaire, Lifestyle, Consent, Language). | Implement the full 7-step onboarding flow. |

---

### 2. Gap Register

| Gap ID | Omitted Domain | PRD Reference | Severity | Technical & Product Impact |
|---|---|---|---|---|
| **GAP-001** | Ayurvedic Constitutional Questionnaire | PRD Section 2.4 | **CRITICAL** | Core constitutional input missing; cannot compute Prakriti signal. |
| **GAP-002** | Structured Lifestyle Context Intake | PRD Section 2.5 | **CRITICAL** | Missing 1 of 3 multimodal fusion input streams. |
| **GAP-003** | Client-Side MediaPipe Face Mesh Gateway | PRD Section 2.6 | **CRITICAL** | Camera capture is completely simulated with a 3s timer; no quality checks. |
| **GAP-004** | Supabase pgvector RAG Knowledge Base | PRD Section 2.11 | **CRITICAL** | AI recommendations ungrounded in classical texts; high hallucination risk. |
| **GAP-005** | Internationalization Architecture (`i18next`) | PRD Section 2.1 | **HIGH** | Application is English-only; Hindi and regional accessibility blocked. |
| **GAP-006** | Private Supabase Storage Bucket & Signed URLs | PRD Section 2.21 | **HIGH** | Facial images sent as raw base64; no secure storage architecture. |
| **GAP-007** | Recharts Longitudinal Progress Tracking | PRD Section 2.17 | **MEDIUM** | Returning users cannot view 30/60/90-day visual or adherence trends. |
| **GAP-008** | PDF Wellness Report Export Library | PRD Section 2.18 | **MEDIUM** | Users cannot download or print structured analysis reports. |
| **GAP-009** | Automated CI/CD & Production Build Guard | Phase 00 Audit | **HIGH** | Build errors in `vite.config.ts` break automated production deployment. |
| **GAP-010** | Structured Telemetry & Privacy Logging | Phase 00 Audit | **MEDIUM** | Zero error tracking, latency metrics, or capture failure telemetry. |

---

### 3. Human Decision Register

| Decision ID | Topic | Current Options & Evidence | Architectural Impact | Decision Owner | Classification & Status |
|---|---|---|---|---|---|
| **DEC-001** | **Target React Framework Version** | **Option A:** Conduct toolchain compatibility check for MediaPipe, Recharts, and React-PDF against React 19.2.8 before deciding.<br>**Option B:** Downgrade to React 18 LTS if incompatible peer dependencies arise.<br>*Evidence:* `package.json` has React 19.2.8; `npx vite build` succeeds; no evidence establishes React 18 superiority yet. | High: Affects dependency resolution and build toolchain. | Technical Lead / Solution Architect | **OPEN DECISION** |
| **DEC-002** | **Brand Color Palette Harmonization** | **Option A:** Adopt PRD Section 4 palette (Deep Terracotta `#C2622D`, Sage `#5A7A5C`).<br>**Option B:** Retain current Material Green (`#4CAF50`) from prototype.<br>*Evidence:* `src/index.css` vs `D:\aayurface prd.txt:270-310`. | Medium: Affects design tokens, aesthetics, and brand identity. | Product Manager / Design Lead | **OPEN DECISION** |
| **DEC-003** | **Minimum Age Eligibility** | **Option A:** Enforce age $\ge 18$ for standalone consumer consent.<br>**Option B:** Allow ages 13–17 with explicit parental/guardian consent toggle.<br>*Evidence:* Indian DPDP Act 2023 mandates verifiable parental consent for minors. | Critical: Legal liability and biometric data processing legality. | Legal / Compliance Analyst | **OPEN DECISION** |
| **DEC-004** | **Biometric Facial Image Retention** | **Option A:** Delete raw image immediately after feature extraction (zero image retention).<br>**Option B:** Retain images for 30 days for user visual progress comparison.<br>**Option C:** User opt-in retention toggle in privacy settings.<br>*Evidence:* Longitudinal tracking tracks derived numerical features (`VisualObservations`), not raw images. | Critical: Biometric privacy compliance and cloud storage cost. | Privacy Officer / Product Manager | **OPEN DECISION** |
| **DEC-005** | **Multimodal Fusion Weight Distribution** | **Option A:** Configurable, versioned weighting architecture supporting empirical calibration.<br>**Option B:** Initial prototyping hypothesis (Visual 40%, Quiz 35%, Lifestyle 25%).<br>*Evidence:* `AayurFace Research.pdf` establishes multimodal concept, but provides no empirical proof of 40/35/25 weights. | High: Directly determines constitutional score accuracy. | AI/ML Architect & Ayurvedic Analyst | **OPEN / RESEARCH VALIDATION REQUIRED** |
| **DEC-006** | **OpenAI Quota & Cost Protection** | **Option A:** Configurable rate-limiting policy in Edge Functions (proposed baseline: 5 analyses/hour).<br>**Option B:** Dynamic queue and cost capping per tenant.<br>*Evidence:* OpenAI API operational costs ($0.03-$0.08 per multimodal analysis). | High: Protects cloud operating budget. | DevOps / Finance / Product Manager | **PROPOSED POLICY** |
| **DEC-007** | **MVP Language Scope** | **Option A:** Launch MVP with English and Hindi (`en`, `hi`); add Marathi and Tamil in V1.<br>**Option B:** Launch MVP with all 6 regional Indian languages simultaneously.<br>*Evidence:* PRD Section 2.1 designates English + Hindi as primary core. | Medium: Translation bundle creation and QA effort. | Product Manager / Localization Lead | **OPEN DECISION** |
| **DEC-008** | **Manual Image Upload Fallback** | **Option A:** Disable manual photo upload in MVP; require real-time webcam capture to guarantee quality gateway integrity.<br>**Option B:** Permit photo upload with asynchronous quality gating.<br>*Evidence:* PRD Section 5.12 marks manual upload as disabled in v1, but desktop accessibility trade-offs exist. | High: Data standardization vs user accessibility. | Computer Vision Lead / Product Manager | **OPEN DECISION** |
| **DEC-009** | **PDF Report Generation Architecture** | **Option A:** Client-side generation via `@react-pdf/renderer` (zero server load).<br>**Option B:** Server-side Deno Edge Function with headless PDF generation.<br>*Evidence:* Bundle size and mobile memory considerations. | Low: Compute cost and bundle size trade-off. | Frontend Architect / Backend Architect | **PROPOSED** |
| **DEC-010** | **Clinical Research & Expert Annotation Workflow** | **Option A:** Scope expert consensus annotation tools to a dedicated post-MVP Research Phase.<br>**Option B:** Implement expert consensus annotation tools in MVP.<br>*Evidence:* Aligns with PRD phased delivery; pending clinical partnerships. | High: Focuses MVP engineering resources on consumer engine. | Solution Architect / Medical Advisor | **PROPOSED** |
