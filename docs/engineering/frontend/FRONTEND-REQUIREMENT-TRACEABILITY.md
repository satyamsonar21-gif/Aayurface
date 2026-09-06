# AayurFace — Traceability Matrix
## Complete Frontend Requirement & Architecture Traceability

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Requirements Traceability & Governance  
**Status:** `AUTHORITATIVE TRACEABILITY MATRIX`  
**Authority:** Principal Requirements Engineer, Principal Frontend Architect  

---

## 1. Full Traceability Matrix

| PRD Req ID | Phase 01 Req | Target Screen ID | Target Component | Phase 05 API ID | State Manager | Security / Privacy Control | Planned Test ID |
|---|---|---|---|---|---|---|---|
| **FR-AUTH-01** | REQ-AUTH-01 | `SCR-AUTH-01` | `SignupForm` | `API-AUTH-001` | React Hook Form | Supabase Auth; Argon2 | `E2E-FE-02` |
| **FR-PROF-01** | REQ-PROF-01 | `SCR-PROF-01` | `ProfileEditor` | `API-PROF-001`, `002`| TanStack Query | Server-derived `auth.uid()` | `TEST-FE-PROF-01` |
| **FR-CONS-01** | REQ-CONS-01 | `SCR-ONB-02` | `ConsentPanel` | `API-CONS-001`, `002`| TanStack Mutation | Unbundled scopes; audit ledger | `E2E-FE-03` |
| **FR-ONB-01** | REQ-ONB-01 | `SCR-ONB-01` | `OnboardingWizard`| `API-ONB-001`, `002` | Zustand + Query | 8-Stage FSM validation | `E2E-FE-02`, `04` |
| **FR-QNR-01** | REQ-QNR-01 | `SCR-ONB-03` | `IntakeCarousel` | `API-QNR-001`, `002` | React Hook Form + Draft | Version pinned templates | `E2E-FE-04` |
| **FR-LIFE-01** | REQ-LIFE-01 | `SCR-ONB-03` | `LifestyleForm` | `API-LIFE-001` | React Hook Form | Server-derived `auth.uid()` | `TEST-FE-LIFE-01` |
| **FR-CAP-01** | REQ-CAP-01 | `SCR-CAP-01` | `FaceCaptureFrame`| `API-CAP-001`, `003` | `useCaptureSession` | Wasm quality gate; EXIF strip | `E2E-FE-06` |
| **FR-CAP-02** | REQ-CAP-02 | `SCR-CAP-01` | `S3UploadManager` | `API-CAP-002` | TanStack Mutation | Signed S3 PUT (15m TTL) | `E2E-FE-06` |
| **FR-ANL-01** | REQ-ANL-01 | `SCR-ANL-01` | `ScanProgress` | `API-ANL-001`, `002` | TanStack Polling (1.5s)| `Idempotency-Key` header | `E2E-FE-07` |
| **FR-RES-01** | REQ-RES-01 | `SCR-RES-01` | `DoshaTriGauge` | `API-RES-001` | TanStack Query | Kernel RLS `auth.uid()` | `E2E-FE-08` |
| **FR-REC-01** | REQ-REC-01 | `SCR-REC-01` | `RecommendationCard`| `API-REC-001`, `002`| TanStack Query | Grounded classical chunks | `E2E-FE-11` |
| **FR-ROU-01** | REQ-ROU-01 | `SCR-ROU-01` | `RoutineHabitCard`| `API-ROU-001`, `003` | Optimistic TanStack | Unique daily constraint | `E2E-FE-12` |
| **FR-HIST-01**| REQ-HIST-01| `SCR-HIST-01`| `ScanHistoryFeed`| `API-HIST-001` | `useInfiniteQuery` | Keyset cursor seek ($O(1)$) | `E2E-FE-13` |
| **FR-PROG-01**| REQ-PROG-01| `SCR-PROG-01`| `TrendDeltaChart`| `API-PROG-001` | TanStack Query | Precomputed snapshots | `E2E-FE-14` |
| **FR-VOICE-01**|REQ-VOICE-01| `SCR-VOICE-01`| `VoiceAssistant` | `API-VOICE-001` | Local Stream + Query | Zero audio uploaded | `E2E-FE-15` |
| **FR-REP-01** | REQ-REP-01 | `SCR-REP-01` | `PDFExportModal` | `API-REP-001`, `002` | Async Polling Dialog | Ephemeral signed GET (60s TTL) | `TEST-FE-REP-01` |
| **FR-SHR-01** | REQ-SHR-01 | `SCR-SHR-01` | `ShareModal` | `API-SHR-001`, `002` | TanStack Mutation | 256-bit token; 100% PII excluded | `E2E-FE-16` |
| **FR-PRIV-01**| REQ-PRIV-01| `SCR-PRIV-01`| `PrivacyCenter` | `API-PROF-004` | Critical Modal | Cascading purge + tombstone | `E2E-FE-17` |
