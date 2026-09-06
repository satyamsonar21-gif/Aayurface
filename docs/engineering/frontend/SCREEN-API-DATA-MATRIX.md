# AayurFace — Traceability Matrix
## Screen-to-API-to-Database-to-AI Matrix

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** AUTHORITATIVE TRACEABILITY MATRIX  
**Authority:** Principal Frontend Architect, Database Architect, AI Platform Architect  

---

## 1. Full Screen Traceability Matrix

| Screen ID & Route | Primary Phase 05 API ID | Relational Database Entity (Phase 04) | AI / CV Subsystem Dependency | Frontend State Manager | Security / RLS Invariant | Planned Test ID |
|---|---|---|---|---|---|---|
| **SCR-PUB-01 (`/`)** | None (Static) | None | None | None | Public | `TEST-FE-PUB-01` |
| **SCR-AUTH-01 (`/signup`)** | `API-AUTH-001` | `auth.users`, `profiles` | None | React Hook Form | Argon2/bcrypt hashing | `TEST-FE-AUTH-01` |
| **SCR-ONB-02 (`/onboarding/consent`)** | `API-CONS-002` | `consents`, `security_audit_events` | None | TanStack Query Mutation | Append-only ledger | `TEST-FE-CONS-01` |
| **SCR-ONB-03 (`/onboarding/intake`)** | `API-QNR-002` | `questionnaire_responses` | Constitutional Scoring | React Hook Form + Draft | Immutable version pinning | `TEST-FE-QNR-01` |
| **SCR-DASH-01 (`/dashboard`)** | `API-ROU-001`, `API-PROF-001`| `routines`, `profiles` | None | TanStack Query | `auth.uid() = user_id` | `TEST-FE-DASH-01` |
| **SCR-CAP-01 (`/analyze/capture`)** | `API-CAP-001`, `API-CAP-002` | `captures`, S3 Private Bucket | MediaPipe Wasm (Client) | `useCaptureSession` Hook | Signed PUT (15m TTL) | `TEST-FE-CAP-01` |
| **SCR-ANL-01 (`/analyze/processing`)**| `API-ANL-001`, `API-ANL-002` | `analysis_jobs` | Multi-Stage AI Pipeline | TanStack Polling (1.5s) | `Idempotency-Key` lock | `TEST-FE-ANL-01` |
| **SCR-RES-01 (`/analyze/results/:id`)**| `API-RES-001` | `scan_results`, `visual_observations` | Normalized 3NF Results | TanStack Query | RLS `auth.uid() = user_id` | `TEST-FE-RES-01` |
| **SCR-RES-02 (`/analyze/results/:id/explain`)**| `API-RES-002`| `multimodal_fusions` | Explainability Engine | TanStack Query | RLS `auth.uid() = user_id` | `TEST-FE-EXP-01` |
| **SCR-REC-01 (`/analyze/results/:id/recs`)**| `API-REC-001`, `API-REC-002`| `recommendation_items`, `routines` | pgvector Cosine Search | TanStack Query | Grounded chunk foreign-keys | `TEST-FE-REC-01` |
| **SCR-ROU-01 (`/routine`)** | `API-ROU-003` | `routine_tracking` | None | Optimistic TanStack Query | Unique daily constraint | `TEST-FE-ROU-01` |
| **SCR-HIST-01 (`/history`)** | `API-HIST-001` | `scan_results` | Keyset Seek Cursor | `useInfiniteQuery` | Composite index seek | `TEST-FE-HIST-01` |
| **SCR-PROG-01 (`/progress`)** | `API-PROG-001` | `progress_checkpoints` | Trend Delta Engine | TanStack Query | Precomputed snapshots | `TEST-FE-PROG-01` |
| **SCR-VOICE-01 (`/voice`)** | `API-VOICE-001` | `chat_messages` | LLM + Classical RAG | Local Stream + Query | Zero audio uploaded | `TEST-FE-VOICE-01` |
| **SCR-REP-01 (`/reports/:id`)** | `API-REP-001`, `API-REP-002`| Ephemeral S3 Bucket | Headless Chromium PDF Worker | Async Polling Dialog | Signed GET URL (60s TTL) | `TEST-FE-REP-01` |
| **SCR-SHR-01 (`/share/:token`)** | `API-SHR-002` | `shared_reports` | None | TanStack Query | 256-bit token; 100% PII excluded | `TEST-FE-SHR-01` |
| **SCR-PRIV-01 (`/settings/privacy`)**| `API-PROF-004` | `auth.users`, all cascading | None | Critical Confirm Modal | Cascading deletion tombstone | `TEST-FE-PRIV-01` |
