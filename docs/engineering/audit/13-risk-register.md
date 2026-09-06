# AayurFace — Engineering Reconnaissance Audit
## Document 13: Risk Register & Threat Matrix

**Phase:** Phase 00 — Full Repository & System Reconnaissance  
**Date:** 2026-09-03  
**Auditor:** Principal Architect & Security Engineer  
**Status:** FORENSIC EVIDENCE COLLECTED  

---

### Risk Register

| Risk ID | Category | Description | Probability | Impact | Severity | Evidence | Mitigation Strategy | Target Phase |
|---|---|---|---|---|---|---|---|---|
| **RSK-001** | Architecture / Build | `npm run build` fails with TS2769 error on `vite.config.ts`. | High (100%) | High | **CRITICAL** | Compiler error in `vite.config.ts(14,3)`. | Fix Vitest type definitions in `tsconfig.node.json` or adjust `defineConfig` import. | Phase 01 Blocker |
| **RSK-002** | Security | Authentication bypass via mock `localStorage` ignoring passwords. | High (100%) | High | **CRITICAL** | `src/contexts/AuthContext.tsx`. | Migrate to Supabase Auth (`supabase.auth`) with secure session cookies/tokens. | Phase 01 Blocker |
| **RSK-003** | Security / API | Edge Functions callable anonymously without JWT verification. | High (100%) | High | **CRITICAL** | `supabase/functions/analyze-skin/index.ts`. | Enforce Supabase JWT authentication header checks on all edge functions. | Phase 01 Blocker |
| **RSK-004** | AI / Compliance | LLM hallucination and pseudo-science diagnoses without RAG grounding. | High | High | **HIGH** | `supabase/functions/ayurveda-chat/index.ts` calls GPT-4o ungrounded. | Implement Supabase `pgvector` RAG pipeline with curated, cited Ayurvedic texts. | Phase 02 |
| **RSK-005** | Computer Vision | Quality gateway absent; blurry, dark, off-center faces accepted into pipeline. | High | High | **HIGH** | `ScanPage.tsx` uses 3s `setTimeout` without validation. | Implement client-side TensorFlow.js / MediaPipe quality gateway checks. | Phase 02 |
| **RSK-006** | Privacy / Legal | Facial images sent as base64 without storage access control or explicit consent records. | Medium | High | **HIGH** | No consent table; image sent directly in request body. | Implement private Supabase Storage buckets, signed temporary URLs, and consent tracking. | Phase 01 |
| **RSK-007** | Product / Scientific | Core multimodal fusion absent; system behaves as a generic skin scanner. | High | High | **HIGH** | Research paper identifies fusion as primary moat; zero fusion code exists. | Develop weighted multimodal fusion algorithm (Face + Questionnaire + Lifestyle). | Phase 02 |
| **RSK-008** | Testing / QA | Near-zero test coverage (only 2 unit tests for Logo); high risk of regression. | High | High | **HIGH** | `Logo.test.tsx` is the sole test file; 34s Vitest run. | Establish automated unit test suite for auth, router, validation, and domain logic. | Phase 01 |
| **RSK-009** | Frontend / UX | Navigation bug on `/library/:remedyId` permanently displays first remedy. | High (100%) | Medium | **MEDIUM** | `useParams().slug` vs `:remedyId` mismatch in `RemedyDetailPage.tsx`. | Align route parameter name to `:slug` in `src/routes/index.tsx`. | Phase 01 |
| **RSK-010** | Performance | Inefficient bundling ships 52KB static mock data and un-treeshaken icons to clients. | High | Medium | **MEDIUM** | `npx vite build` output analysis. | Replace mock data with dynamic database fetching; optimize Lucide imports. | Phase 02 |
| **RSK-011** | Accessibility | Language selection and multilingual localization completely absent. | High | High | **HIGH** | Zero i18n tooling; hardcoded English. | Install `i18next` and establish localization structure. | Phase 01 |
| **RSK-012** | Database / DevOps | Database lacks migration tooling; manual SQL paste required. | Medium | Medium | **MEDIUM** | Only `schema.sql` exists; no Supabase CLI migration directory. | Initialize Supabase CLI migrations (`supabase/migrations/`). | Phase 01 |
