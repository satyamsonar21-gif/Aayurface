# AayurFace — Backend & API Architecture Specification
## Target API Inventory & Master Route Catalog

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Date:** 2026-09-03  
**Status:** TARGET API INVENTORY (42 Endpoints across 18 Domains)  
**Authority:** Principal Backend Architect, API Architect, Security Architect  

---

## 1. Complete API Route Master Inventory

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AAYURFACE API ROUTE DOMAINS                            │
├────┬─────────────────────────────┬────┬────────────────────────────────────┤
│ 01 │ Authentication (Delegated)  │ 10 │ Recommendations (RECS)             │
│ 02 │ User Profile (PROF)         │ 11 │ Dinacharya Routines (ROU)          │
│ 03 │ Consent Management (CONS)   │ 12 │ Analysis History (HIST)            │
│ 04 │ User Onboarding (ONB)       │ 13 │ Longitudinal Progress (PROG)       │
│ 05 │ Intake Questionnaire (QNR)  │ 14 │ Conversational Voice/Chat (VOICE)  │
│ 06 │ Lifestyle Context (LIFE)    │ 15 │ PDF Report Generation (REP)        │
│ 07 │ Biometric Capture (CAP)     │ 16 │ Cryptographic Sharing (SHR)        │
│ 08 │ Analysis Orchestration (ANL)│ 17 │ Classical Knowledge Base (KNOW)    │
│ 09 │ Analysis Results (RES)      │ 18 │ Administration & Research (ADM/RES)│
└────┴─────────────────────────────┴────┴────────────────────────────────────┘
```

| API ID | Method | Path | Domain | Actor | Auth Requirement | Sync / Async | DB Tables Accessed | AI / CV Dependency | Security Class | Target Status | Requirement Traceability |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **API-AUTH-001** | `POST` | `/auth/v1/signup` | Auth | Anonymous | Delegated to Supabase Auth | Sync | `auth.users`, `profiles` | None | Public | `TARGET / DELEGATED` | FR-AUTH-01 |
| **API-AUTH-002** | `POST` | `/auth/v1/token?grant_type=password` | Auth | Anonymous | Delegated to Supabase Auth | Sync | `auth.users` | None | Public | `TARGET / DELEGATED` | FR-AUTH-02 |
| **API-AUTH-003** | `POST` | `/auth/v1/logout` | Auth | Authenticated | Supabase JWT (`Bearer`) | Sync | `auth.sessions` | None | Authenticated | `TARGET / DELEGATED` | FR-AUTH-03 |
| **API-AUTH-004** | `POST` | `/auth/v1/recover` | Auth | Anonymous | Delegated to Supabase Auth | Sync | `auth.users` | None | Public | `TARGET / DELEGATED` | FR-AUTH-04 |
| **API-PROF-001** | `GET` | `/api/v1/profile` | Profile | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `profiles`, `user_preferences` | None | Confidential (Tier 2)| `TARGET` | FR-PROF-01 |
| **API-PROF-002** | `PUT` | `/api/v1/profile` | Profile | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `profiles` | None | Confidential (Tier 2)| `TARGET` | FR-PROF-02 |
| **API-PROF-003** | `PUT` | `/api/v1/profile/preferences` | Profile | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `user_preferences` | None | Confidential (Tier 2)| `TARGET` | FR-PROF-03 |
| **API-PROF-004** | `DELETE`| `/api/v1/profile/account` | Profile | Authenticated | Supabase JWT (`auth.uid()`) | Async Cascade | `auth.users`, all cascading | None | High Conf (Tier 3) | `TARGET` | FR-PRIV-01 |
| **API-CONS-001** | `GET` | `/api/v1/consents` | Consent | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `consents` | None | Confidential (Tier 2)| `TARGET` | FR-CONS-01 |
| **API-CONS-002** | `POST` | `/api/v1/consents` | Consent | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `consents`, `security_audit`| None | High Conf (Tier 3) | `TARGET` | FR-CONS-02 |
| **API-ONB-001** | `GET` | `/api/v1/onboarding/state` | Onboarding | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `profiles.onboarding_completed`| None | Confidential (Tier 2)| `TARGET` | FR-ONB-01 |
| **API-ONB-002** | `POST` | `/api/v1/onboarding/complete` | Onboarding | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `profiles`, `consents` | None | Confidential (Tier 2)| `TARGET` | FR-ONB-02 |
| **API-QNR-001** | `GET` | `/api/v1/questionnaires/active` | Questionnaire | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `questionnaire_templates` | None | Public Vetted (Tier 1)| `TARGET` | FR-QNR-01 |
| **API-QNR-002** | `POST` | `/api/v1/questionnaires/responses` | Questionnaire | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `questionnaire_responses` | None | Confidential (Tier 2)| `TARGET` | FR-QNR-02 |
| **API-QNR-003** | `GET` | `/api/v1/questionnaires/responses/:id`| Questionnaire | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `questionnaire_responses` | None | Confidential (Tier 2)| `TARGET` | FR-QNR-03 |
| **API-LIFE-001** | `POST` | `/api/v1/lifestyle/contexts` | Lifestyle | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `lifestyle_contexts` | None | Confidential (Tier 2)| `TARGET` | FR-LIFE-01 |
| **API-LIFE-002** | `GET` | `/api/v1/lifestyle/contexts/latest` | Lifestyle | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `lifestyle_contexts` | None | Confidential (Tier 2)| `TARGET` | FR-LIFE-02 |
| **API-CAP-001** | `POST` | `/api/v1/captures/sessions` | Capture | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `captures` | MediaPipe Wasm (Client)| Biometric (Tier 4) | `TARGET` | FR-CAP-01 |
| **API-CAP-002** | `POST` | `/api/v1/captures/upload-url` | Capture | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `captures`, S3 Private Bucket | None | Biometric (Tier 4) | `TARGET / PROPOSED` | FR-CAP-02 |
| **API-CAP-003** | `POST` | `/api/v1/captures/:id/quality` | Capture | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `capture_quality_metrics` | Client Wasm metrics | Confidential (Tier 2)| `TARGET` | FR-CAP-03 |
| **API-ANL-001** | `POST` | `/api/v1/analyses` | Analysis | Authenticated | Supabase JWT (`auth.uid()`) | **Async (202)** | `analysis_jobs`, `scan_results`| Multi-Agent AI Pipeline | High Conf (Tier 3) | `TARGET` | FR-ANL-01 |
| **API-ANL-002** | `GET` | `/api/v1/analyses/:id/status` | Analysis | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `analysis_jobs` | None | Confidential (Tier 2)| `TARGET` | FR-ANL-02 |
| **API-RES-001** | `GET` | `/api/v1/analyses/:id` | Results | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `scan_results`, `visual_obs`, `fusions` | None | Confidential (Tier 2)| `TARGET` | FR-RES-01 |
| **API-RES-002** | `GET` | `/api/v1/analyses/:id/explainability`| Results | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `multimodal_fusions`, `scan_results` | Explainability Engine | Confidential (Tier 2)| `TARGET` | FR-RES-02 |
| **API-REC-001** | `GET` | `/api/v1/analyses/:id/recommendations`| Recs | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `recommendation_items`, `knowledge_chunks` | Grounded RAG Citations | Confidential (Tier 2)| `TARGET` | FR-REC-01 |
| **API-REC-002** | `POST` | `/api/v1/recommendations/adopt` | Recs | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `routines`, `routine_items` | None | Confidential (Tier 2)| `TARGET` | FR-REC-02 |
| **API-ROU-001** | `GET` | `/api/v1/routines/active` | Routine | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `routines`, `routine_items` | None | Confidential (Tier 2)| `TARGET` | FR-ROU-01 |
| **API-ROU-002** | `PUT` | `/api/v1/routines/active` | Routine | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `routines`, `routine_items` | None | Confidential (Tier 2)| `TARGET` | FR-ROU-02 |
| **API-ROU-003** | `POST` | `/api/v1/routines/items/:id/track` | Routine | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `routine_tracking` | None | Confidential (Tier 2)| `TARGET` | FR-ROU-03 |
| **API-HIST-001**| `GET` | `/api/v1/history` | History | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `scan_results` (Keyset Paginated) | None | Confidential (Tier 2)| `TARGET` | FR-HIST-01 |
| **API-PROG-001**| `GET` | `/api/v1/progress/checkpoints` | Progress | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `progress_checkpoints` | Trend Analysis Engine | Confidential (Tier 2)| `TARGET` | FR-PROG-01 |
| **API-VOICE-001**| `POST` | `/api/v1/voice/chat` | Voice | Authenticated | Supabase JWT (`auth.uid()`) | Sync / Stream | `chat_messages`, `knowledge_chunks`| LLM + RAG Grounding | Confidential (Tier 2)| `TARGET` | FR-VOICE-01 |
| **API-VOICE-002**| `GET` | `/api/v1/voice/history` | Voice | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `chat_messages` | None | Confidential (Tier 2)| `TARGET` | FR-VOICE-02 |
| **API-REP-001** | `POST` | `/api/v1/reports/compile` | Report | Authenticated | Supabase JWT (`auth.uid()`) | **Async (202)** | `scan_results`, S3 Ephemeral Bucket | Headless PDF Engine | Confidential (Tier 2)| `TARGET / PROPOSED` | FR-REP-01 |
| **API-REP-002** | `GET` | `/api/v1/reports/:id/download` | Report | Authenticated | Supabase JWT (`auth.uid()`) | Sync | S3 Signed GET URL (60s TTL) | None | Confidential (Tier 2)| `TARGET / PROPOSED` | FR-REP-02 |
| **API-SHR-001** | `POST` | `/api/v1/shares` | Share | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `shared_reports` (256-bit hash) | None | Confidential (Tier 2)| `TARGET / PROPOSED` | FR-SHR-01 |
| **API-SHR-002** | `GET` | `/api/v1/shares/:token` | Share | Anonymous | Public Share Token | Sync | `shared_reports`, `scan_results` | None | Public Redacted (Tier 1)| `TARGET / PROPOSED`| FR-SHR-02 |
| **API-SHR-003** | `DELETE`| `/api/v1/shares/:id` | Share | Authenticated | Supabase JWT (`auth.uid()`) | Sync | `shared_reports` (Revocation) | None | Confidential (Tier 2)| `TARGET / PROPOSED` | FR-SHR-03 |
| **API-KNOW-001**| `GET` | `/api/v1/remedies` | Knowledge | Authenticated / Public | Optional JWT | Sync | `remedies` | None | Public Vetted (Tier 1)| `TARGET` | FR-KNOW-01 |
| **API-KNOW-002**| `GET` | `/api/v1/remedies/:slug` | Knowledge | Authenticated / Public | Optional JWT | Sync | `remedies` | None | Public Vetted (Tier 1)| `TARGET` | FR-KNOW-02 |
| **API-RES-003** | `POST` | `/api/v1/research/annotations` | Research | Practitioner | Isolated Practitioner Credential | Sync | `research.expert_annotations` | Fleiss' Kappa Engine | Confidential Research (Tier 3)| `TARGET / POST-MVP` | FR-RES-01 |
| **API-ADM-001** | `GET` | `/api/v1/admin/audit-events` | Admin | Security Admin | Admin MFA Credential (`admin_sec`)| Sync | `security_audit_events` | None | High Conf (Tier 3) | `TARGET / PROPOSED` | FR-ADM-01 |
