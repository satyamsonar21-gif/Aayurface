# AayurFace — Database Architecture Specification
## Requirements-to-Data Traceability Matrix

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Requirements Engineer, Principal Database Architect  

---

### 1. Requirements-to-Data Traceability Matrix

| Requirement ID (PRD / Phase 01) | Requirement Description | Mapped Relational Entities & Columns | Database Constraints & Invariants | RLS Enforcement Policy | Automated Test Criteria |
|---|---|---|---|---|---|
| **REQ-ONB-01** | User Registration & Profile | `profiles(id, email, full_name, role)` | PK references `auth.users(id)`; UNIQUE on `email`. | `auth.uid() = id`; role updates blocked. | `vitest run tests/auth/profile.test.ts` |
| **REQ-CON-01** | Granular Unbundled Consent | `consents(user_id, scope, policy_version, status)`| Scope CHECK constraint; append-only design. | `auth.uid() = user_id`; UPDATE/DELETE blocked. | `vitest run tests/privacy/consent.test.ts` |
| **REQ-INT-01** | 15-Question Constitutional Intake | `questionnaire_templates`, `questionnaire_responses` | `raw_answers NOT NULL`; scores between 0.0 and 1.0. | `auth.uid() = user_id`; immutable snapshot. | `vitest run tests/intake/quiz.test.ts` |
| **REQ-LIF-01** | Dynamic Lifestyle Context | `lifestyle_contexts(sleep_hours, stress_level, ...)`| CHECK `sleep_hours BETWEEN 0 AND 24`. | `auth.uid() = user_id`; immutable snapshot. | `vitest run tests/intake/lifestyle.test.ts` |
| **REQ-CAP-01** | Biometric Capture & Quality | `captures`, `capture_quality_metrics` | `file_size_bytes <= 5242880`; `face_count = 1`. | `auth.uid() = user_id`; private S3 pre-signed. | `vitest run tests/capture/upload.test.ts` |
| **REQ-JOB-01** | Asynchronous Job Queue | `analysis_jobs(status, idempotency_key, deadline)` | UNIQUE on `(user_id, idempotency_key)`. | `auth.uid() = user_id`; worker skip locked. | `vitest run tests/jobs/queue.test.ts` |
| **REQ-ANA-01** | Multimodal Skin Analysis | `scan_results`, `visual_observations` | Dominant dosha enum; CIELAB floats NOT NULL. | `auth.uid() = user_id`; immutable snapshot. | `vitest run tests/analysis/scan.test.ts` |
| **REQ-FUS-01** | Multimodal Fusion & Agreement | `multimodal_fusions`, `fusion_configurations` | Weights sum to 1.0; agreement index $\in [0, 1]$. | `auth.uid() = user_id` via scan_id join. | `vitest run tests/fusion/engine.test.ts` |
| **REQ-CONF-01**| Calibrated Confidence & Capping | `scan_results(calibrated_confidence, agreement_state)`| Confidence capped $< 60\%$ on `LOW_AGREEMENT`. | `auth.uid() = user_id`; engine clamped. | `vitest run tests/fusion/confidence.test.ts` |
| **REQ-RAG-01** | Classical Ayurvedic RAG | `knowledge_sources`, `knowledge_chunks` | HNSW cosine index; chunk status CHECK. | Public read for `ACTIVE` chunks only. | `vitest run tests/rag/retrieval.test.ts` |
| **REQ-ROUT-01**| Dinacharya Daily Routine | `routines`, `routine_items` | `is_active BOOLEAN`; timing enum CHECK. | `auth.uid() = user_id`; items cascade. | `vitest run tests/routine/active.test.ts` |
| **REQ-ADH-01** | Daily Ritual Adherence | `routine_tracking(tracking_date, is_completed)` | UNIQUE `(user_id, routine_item_id, tracking_date)`. | `auth.uid() = user_id`; idempotent upsert. | `vitest run tests/routine/adherence.test.ts` |
| **REQ-LON-01** | Longitudinal Progress Tracking | `progress_checkpoints(erythema_delta, texture_delta)`| Interval CHECK; version mismatch boolean. | `auth.uid() = user_id`; immutable snapshot. | `vitest run tests/progress/timeline.test.ts` |
| **REQ-SHR-01** | Cryptographic Report Sharing | `shared_reports(token_hash, expires_at, is_revoked)`| UNIQUE `token_hash`; view_count tracking. | Token hash match & unrevoked & unexpired. | `vitest run tests/share/report.test.ts` |
| **REQ-VOI-01** | Ephemeral Voice Assistant | `chat_sessions`, `chat_messages` | Zero audio storage; text role CHECK. | `auth.uid() = user_id`; hard purged on erase. | `vitest run tests/chat/voice.test.ts` |
| **REQ-PUR-01** | Account Erasure & Tombstoning | `deletion_tombstones`, S3 purge | Multi-service cascade; anonymous hash recorded. | System service role; bypasses RLS for purge. | `vitest run tests/privacy/purge.test.ts` |
