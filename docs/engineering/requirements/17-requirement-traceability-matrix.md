# AayurFace — Engineering Requirements Specification
## Document 17: Complete End-to-End Requirements Traceability Matrix

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** QA/Test Architect, Principal Requirements Engineer  

---

### 1. Quantitative Verification Metrics

* **Requirement-to-Acceptance-Criteria Coverage:** **100.0%** (25 / 25 major requirements have defined Given/When/Then criteria in Document 06)
* **Requirement-to-Planned-Test Coverage:** **100.0%** (25 / 25 major requirements have mapped planned Test IDs)
* **Implemented Automated Test Coverage:** **0.0%** (0 / 25 functional requirements have automated test files in repository; only `Logo.test.tsx` exists in `src/`)
* **Executed Automated Test Coverage:** **0.0%** (0 / 25 functional requirements have executed automated test suites)
* **Passing Executed Test Coverage:** **NOT ESTABLISHED / PENDING IMPLEMENTATION** (Zero functional tests executed; 2 component tests pass in Logo.test.tsx)

---

### 2. Traceability Matrix

| Req ID | Feature Area | User Story | UI / Screen | API Endpoint | Database Entity | Planned Test ID | Test Implemented? | Test Executed? | Test Result | Priority | Release | Req Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **FR-AUTH-001** | User Registration | US-AUTH-01 | `/auth/signup` | `RegisterPage` | `supabase.auth.signUp` | Supabase Auth Service | `auth.users`, `profiles` | N/A | bcrypt hashing, CSRF | `TEST-AUTH-001` | P0 | MVP | Specified |
| **FR-AUTH-002** | User Login | US-AUTH-02 | `/auth/login` | `LoginPage` | `supabase.auth.signInWithPassword`| Supabase Auth Service | `auth.users` | N/A | Rate limiting, brute-force | `TEST-AUTH-002` | P0 | MVP | Specified |
| **FR-AUTH-003** | Google OAuth | US-AUTH-03 | `/auth/login` | `LoginPage` | `supabase.auth.signInWithOAuth` | Google Identity Service | `auth.users`, `profiles` | N/A | PKCE exchange | `TEST-AUTH-003` | P0 | MVP | Specified |
| **FR-I18N-001** | Multilingual UI | US-I18N-01 | `/onboarding/language` | `LanguageSelector` | N/A (Client State) | i18next Runtime | `profiles.language` | N/A | Sanitized translation | `TEST-I18N-001` | P0 | MVP | Specified |
| **FR-CONSENT-001**| Informed Consent | US-CONS-01 | `/onboarding/consent` | `ConsentForm` | `POST /consents` | Consent Service | `consents` | N/A | Immutable audit log | `TEST-CONS-001` | P0 | MVP | Specified |
| **FR-AYU-001** | Dosha Questionnaire | US-AYU-01 | `/onboarding/questionnaire` | `QuestionnaireWizard` | `POST /submit-questionnaire` | Scoring Engine | `questionnaire_responses` | Vector Scoring | Validation schema | `TEST-AYU-001` | P0 | MVP | Specified |
| **FR-LIFE-001** | Lifestyle Intake | US-LIFE-01 | `/onboarding/lifestyle` | `LifestyleForm` | `POST /submit-lifestyle` | Ingestion Service | `lifestyle_contexts` | Normalizer | Validation schema | `TEST-LIFE-001` | P0 | MVP | Specified |
| **FR-CAP-001** | Camera Permission | US-CAP-01 | `/analysis/capture` | `CameraView` | Browser MediaDevices | N/A (Client) | N/A | N/A | Browser sandbox | `TEST-CAP-001` | P0 | MVP | Specified |
| **FR-CAP-002** | Face Presence Check | US-CAP-02 | `/analysis/capture` | `QualityGateway` | MediaPipe WebAssembly | N/A (Client) | N/A | MediaPipe Face Mesh | RAM-only, no frame leak | `TEST-CAP-002` | P0 | MVP | Specified |
| **FR-CAP-005** | Lighting Gating | US-CAP-03 | `/analysis/capture` | `QualityGateway` | Client Canvas Luma | N/A (Client) | N/A | Luma Evaluator | Ephemeral frame | `TEST-CAP-003` | P0 | MVP | Specified |
| **FR-CAP-006** | Sharpness / Blur Gating| US-CAP-04 | `/analysis/capture` | `QualityGateway` | Client Laplacian Calc | N/A (Client) | N/A | Blur Evaluator | Ephemeral frame | `TEST-CAP-004` | P0 | MVP | Specified |
| **FR-CAP-009** | Secure Capture Upload | US-CAP-05 | `/analysis/capture` | `CaptureUploader` | `POST /capture-upload-url` | Storage Service | `captures` (Storage) | N/A | Signed temporary URL | `TEST-CAP-005` | P0 | MVP | Specified |
| **FR-CV-001** | Feature Extraction | US-CV-01 | `/analysis/processing`| Realtime Status | `POST /analyze-multimodal` | Edge Feature Worker | `scan_results` | Erythema, Texture, Melanin | Private bucket, no PII | `TEST-CV-001` | P0 | MVP | Specified |
| **FR-FUS-001** | Multimodal Fusion | US-FUS-01 | `/analysis/processing`| Realtime Status | `POST /analyze-multimodal` | Fusion Engine | `scan_results` | Weighted Linear Fusion | Idempotent execution | `TEST-FUS-001` | P0 | MVP | Specified |
| **FR-CONF-002** | Agreement Calculation | US-CONF-01 | `/analysis/results/[id]`| `AgreementBadge` | `POST /analyze-multimodal` | Agreement Engine | `scan_results` | Cosine Similarity | Transparent uncertainty | `TEST-CONF-001` | P0 | MVP | Specified |
| **FR-XAI-001** | 5-Part XAI Explanation | US-XAI-01 | `/analysis/results/[id]`| `ExplanationPanel` | `POST /analyze-multimodal` | XAI Synthesizer | `scan_results` | GPT-4o Constrained Prompt| Non-diagnostic guard | `TEST-XAI-001` | P0 | MVP | Specified |
| **FR-RAG-002** | Knowledge Grounding | US-RAG-01 | `/analysis/results/[id]`| `RecommendationCard`| `POST /analyze-multimodal` | RAG Retrieval Service | `knowledge_chunks` | pgvector (text-emb-3) | Zero hallucination check | `TEST-RAG-001` | P0 | MVP | Specified |
| **FR-REC-003** | Patch-Test Advisory | US-REC-01 | `/analysis/results/[id]`| `SafetyNotice` | `POST /analyze-multimodal` | Safety Filter | `scan_results` | Deterministic Rule | Prominent mandatory box | `TEST-REC-001` | P0 | MVP | Specified |
| **FR-ROUT-001** | Personalized Routine | US-ROUT-01 | `/analysis/results/[id]`| `RoutineSchedule` | `GET /routines` | Routine Service | `routines` | GPT-4o Synthesis | RLS isolation | `TEST-ROUT-001` | P0 | MVP | Specified |
| **FR-ROUT-005** | Routine Adherence Log | US-ROUT-02 | `/dashboard` | `RoutineCard` | `POST /routine-tracking` | Tracking Service | `routine_tracking` | N/A | RLS `auth.uid() = user_id`| `TEST-ROUT-002` | P1 | V1 | Specified |
| **FR-HIST-001** | Immutable History View| US-HIST-01 | `/history` | `HistoryTimeline` | `GET /scan-results` | Snapshot Service | `scan_results` | N/A | RLS read isolation | `TEST-HIST-001` | P0 | MVP | Specified |
| **FR-PROG-001** | Progress Trend Charts | US-PROG-01 | `/progress` | `ProgressDashboard` | `GET /progress-trends` | Trend Analytics Service | `progress_checkpoints` | Recharts Trend Engine | Data masking | `TEST-PROG-001` | P2 | V2 | Specified |
| **FR-PDF-001** | PDF Wellness Report | US-PDF-01 | `/analysis/results/[id]`| `DownloadButton` | `POST /generate-pdf-report` | PDF Service | `reports` (Storage) | Client/Server PDF Render| Signed download link | `TEST-PDF-001` | P1 | V1 | Specified |
| **FR-VOICE-001**| Voice Assistant Dialog| US-VOICE-01| `/dashboard`, `/results`| `VoiceAssistantPanel` | `POST /ayurveda-chat` | Conversational Service | `chat_messages` | Web Speech API + GPT-4o | Audio sanitized in RAM | `TEST-VOICE-001`| P2 | V2 | Specified |
| **FR-ADMIN-001**| Admin Knowledge Ingest| US-ADMIN-01| `/admin/knowledge` | `KnowledgeManager` | `POST /admin-knowledge-ingest`| Admin Service | `knowledge_chunks` | pgvector Ingestion | Role check (`role = admin`)| `TEST-ADMIN-001`| P1 | V1 | Specified |
