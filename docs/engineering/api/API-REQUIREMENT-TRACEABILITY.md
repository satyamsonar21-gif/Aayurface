# Traceability Matrix: API Contract to Requirements & Architecture
## Complete Traceability from PRD Requirements to APIs, Database, AI, Security & Tests

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Requirements Traceability & Governance  
**Status:** `AUTHORITATIVE TRACEABILITY MATRIX`  
**Authority:** Principal Requirements Engineer, Principal Backend Architect  

---

## 1. Full Traceability Matrix

| PRD Req ID | Requirement Summary | Target API Endpoint(s) | Relational Database Entity | AI / CV Subsystem | Security / Auth Invariant | Planned Test ID |
|---|---|---|---|---|---|---|
| **FR-AUTH-01** | User Registration & Profile Initialization | `POST /auth/v1/signup` | `auth.users`, `profiles` | None | Delegated Supabase Auth; Argon2/bcrypt | `TEST-VAL-01`, `TEST-SEC-02` |
| **FR-PROF-01** | Profile Retrieval & Management | `GET /api/v1/profile`, `PUT /api/v1/profile` | `profiles`, `user_preferences` | None | Server-derived `auth.uid()`; RLS | `TEST-SEC-01` |
| **FR-CONS-01** | Granular Consent Management | `GET /api/v1/consents`, `POST /api/v1/consents`| `consents`, `security_audit_events`| None | Append-only ledger; non-repudiation | `TEST-VAL-01` |
| **FR-ONB-01** | 8-Stage Onboarding Progression | `GET /api/v1/onboarding/state`, `POST .../complete` | `profiles.onboarding_completed` | None | Strict FSM state validation | `TEST-VAL-01` |
| **FR-QNR-01** | Prakriti Constitutional Intake | `GET /api/v1/questionnaires/active`, `POST ...` | `questionnaire_templates`, `questionnaire_responses` | Constitutional Scoring | Immutable version pinning | `TEST-VAL-01` |
| **FR-LIFE-01** | Lifestyle & Climate Context | `POST /api/v1/lifestyle/contexts` | `lifestyle_contexts` | Multimodal Fusion Input | Server-derived `auth.uid()` | `TEST-VAL-01` |
| **FR-CAP-01** | Biometric Facial Capture | `POST /api/v1/captures/sessions`, `.../quality` | `captures`, `capture_quality_metrics`| MediaPipe Wasm (Client) | Wasm quality gate; EXIF stripped | `TEST-FUZ-01` |
| **FR-CAP-02** | Secure S3 Image Upload | `POST /api/v1/captures/upload-url` | Private S3 Bucket, `captures` | None | HMAC signed PUT (15m TTL); anti-BOLA | `TEST-SEC-01`, `TEST-FUZ-01` |
| **FR-ANL-01** | Asynchronous Multimodal Analysis | `POST /api/v1/analyses`, `GET .../status` | `analysis_jobs`, `scan_results` | Multi-Stage AI Pipeline | `202 Accepted` queue; Idempotency | `TEST-IDM-01`, `TEST-CON-01` |
| **FR-RES-01** | Analysis Results & Dosha Breakdown | `GET /api/v1/analyses/:id` | `scan_results`, `visual_observations` | Normalized 3NF Results | Kernel RLS `auth.uid() = user_id` | `TEST-SEC-01` |
| **FR-REC-01** | Classical Grounded Recommendations| `GET /api/v1/analyses/:id/recommendations` | `recommendation_items`, `knowledge_chunks` | pgvector Cosine Search | Foreign-key bound classical verses | `TEST-SEC-03` |
| **FR-ROU-01** | Dinacharya Routine Tracking | `GET /api/v1/routines/active`, `POST .../track`| `routines`, `routine_tracking` | None | Unique constraint daily idempotency | `TEST-IDM-01` |
| **FR-HIST-01** | Historical Scan Keyset Feed | `GET /api/v1/history` | `scan_results` | Keyset Cursor Seek | Composite index seek; anti-BOLA | `TEST-SEC-01` |
| **FR-PROG-01** | Longitudinal Checkpoints & Deltas | `GET /api/v1/progress/checkpoints` | `progress_checkpoints` | Trend Delta Engine | Precomputed snapshots; sub-50ms | `TEST-SEC-01` |
| **FR-VOICE-01**| Conversational Voice Guidance | `POST /api/v1/voice/chat` | `chat_messages`, `knowledge_chunks`| LLM + Classical RAG | Zero audio uploaded; regex scrubbed | `TEST-SEC-03` |
| **FR-REP-01** | PDF Summary Compilation | `POST /api/v1/reports/compile`, `GET .../download`| Ephemeral S3 Bucket | Headless PDF Worker | Signed GET URL (60s TTL); 7d auto-purge | `TEST-VAL-01` |
| **FR-SHR-01** | Cryptographic Public Sharing | `POST /api/v1/shares`, `GET /api/v1/shares/:tok`| `shared_reports` | None | 256-bit token; 100% PII excluded | `TEST-SEC-01` |
| **FR-RES-02** | Expert Research Consensus (Post-MVP)| `POST /api/v1/research/annotations` | `research.expert_annotations` | Fleiss' Kappa Engine | Double-blind locking; isolated schema | `TEST-VAL-01` |
