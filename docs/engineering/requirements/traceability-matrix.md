# AayurFace — Phase 01-C Requirements Engineering Audit
## Document: Corrected End-to-End Requirements Traceability Matrix

**Phase:** Phase 01-C — Requirements Evidence Reconciliation, Claim Correction & Quality Hardening  
**Date:** 2026-09-03  
**Status:** AUDITED & RECONCILED  
**Core Invariant:** "Mapped to planned test" $\neq$ "Test implemented" $\neq$ "Test executed" $\neq$ "Test passed". Distinguish these six states explicitly.  

---

### 1. Quantitative Verification Metrics

* **Major Functional Requirements Audited:** 25 core specifications
* **Requirement-to-Acceptance-Criteria Coverage:** **100.0%** (25 / 25 requirements have defined Given/When/Then criteria in Document 06)
* **Requirement-to-Planned-Test Coverage:** **100.0%** (25 / 25 requirements have mapped planned Test IDs)
* **Implemented Automated Test Coverage:** **0.0%** (0 / 25 functional requirements have automated test files in `src/` or backend; only `Logo.test.tsx` exists in repository)
* **Executed Automated Test Coverage:** **0.0%** (0 / 25 functional requirements have executed automated test suites)
* **Passing Executed Test Coverage:** **NOT ESTABLISHED / PENDING IMPLEMENTATION** (Zero functional requirement tests executed)

---

### 2. Comprehensive Traceability Matrix

| Req ID | Requirement Title | Source Document | Priority | Acceptance Criteria IDs | Planned Test IDs | Test Implemented? | Test Executed? | Test Result | UI Component | API Endpoint | DB Entity | AI / CV Module | Security Control | Req Status | Empirical Evidence in Repo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **FR-AUTH-001** | User Registration | PRD 2.3 | P0 | `AC-AUTH-1.1`, `1.2` | `TEST-AUTH-001` | **NO** | **NO** | `PENDING` | `RegisterPage` | `supabase.auth.signUp` | `auth.users`, `profiles` | N/A | bcrypt hash, CSRF | BASELINED | `src/pages/auth/RegisterPage.tsx:1-50` |
| **FR-AUTH-002** | Password Verification | PRD 2.3 | P0 | `AC-AUTH-1.1`, `1.2` | `TEST-AUTH-002` | **NO** | **NO** | `PENDING` | `LoginPage` | `supabase.auth.signInWithPassword` | `auth.users` | N/A | Rate limit, brute force | BASELINED | `src/contexts/AuthContext.tsx:52` (Mock) |
| **FR-AUTH-003** | Google OAuth PKCE | PRD 2.3 | P0 | `AC-AUTH-1.1` | `TEST-AUTH-003` | **NO** | **NO** | `PENDING` | `LoginPage` | `supabase.auth.signInWithOAuth` | `auth.users`, `profiles` | N/A | PKCE flow | BASELINED | `src/contexts/AuthContext.tsx:75` (Mock) |
| **FR-I18N-001** | Multilingual UI (EN/HI) | PRD 2.1 | P0 | `AC-I18N-1.1` | `TEST-I18N-001` | **NO** | **NO** | `PENDING` | `LanguageSelector` | N/A (Client State) | `profiles.language` | N/A | Sanitized string map | BASELINED | Missing (`package.json` lacks i18n) |
| **FR-CONSENT-001**| Mandatory Consent Gate | PRD 2.2 | P0 | `AC-CONS-2.1`, `2.2` | `TEST-CONS-001` | **NO** | **NO** | `PENDING` | `ConsentForm` | `POST /consents` | `consents` | N/A | Immutable audit log | BASELINED | Missing in `src/pages/onboarding/` |
| **FR-AYU-001** | 15-Question Intake | PRD 2.4 | P0 | `AC-AYU-3.1` | `TEST-AYU-001` | **NO** | **NO** | `PENDING` | `QuestionnaireWizard` | `POST /submit-questionnaire` | `questionnaire_responses` | Vector Scorer | Zod payload schema | BASELINED | Missing in `src/pages/onboarding/` |
| **FR-LIFE-001** | Lifestyle Intake Form | PRD 2.5 | P0 | `AC-LIFE-4.1` | `TEST-LIFE-001` | **NO** | **NO** | `PENDING` | `LifestyleForm` | `POST /submit-lifestyle` | `lifestyle_contexts` | Context Normalizer | Zod payload schema | BASELINED | Missing in `src/pages/onboarding/` |
| **FR-CAP-001** | Camera Access Request | PRD 2.6 | P0 | `AC-CAP-5.1` | `TEST-CAP-001` | **NO** | **NO** | `PENDING` | `CameraView` | WebRTC MediaDevices | N/A (Client) | N/A | Browser permission | BASELINED | `src/pages/app/ScanPage.tsx:1-40` |
| **FR-CAP-002** | Face Presence & Count | PRD 2.6 | P0 | `AC-CAP-5.1`, `5.3` | `TEST-CAP-002` | **NO** | **NO** | `PENDING` | `QualityGateway` | MediaPipe WebAssembly | N/A (Client) | MediaPipe Face Mesh | RAM-only evaluation | BASELINED | Missing (No MediaPipe package) |
| **FR-CAP-005** | Lighting / Glare Gating | PRD 2.6 | P0 | `AC-CAP-5.2` | `TEST-CAP-003` | **NO** | **NO** | `PENDING` | `QualityGateway` | Client Canvas Luma | N/A (Client) | Luma Evaluator | Ephemeral frame | BASELINED | Missing in `ScanPage.tsx` |
| **FR-CAP-006** | Sharpness / Blur Gating | PRD 2.6 | P0 | `AC-CAP-5.1` | `TEST-CAP-004` | **NO** | **NO** | `PENDING` | `QualityGateway` | Client Laplacian Calc | N/A (Client) | Blur Evaluator | Ephemeral frame | BASELINED | Missing in `ScanPage.tsx` |
| **FR-CAP-009** | Encrypted Frame Upload | PRD 2.6 | P0 | `AC-CAP-5.1` | `TEST-CAP-005` | **NO** | **NO** | `PENDING` | `CaptureUploader` | `POST /capture-upload-url` | `captures` (Storage) | N/A | Signed URL (TTL 15m) | BASELINED | Missing in `ScanPage.tsx` |
| **FR-CV-001** | Feature Signal Extract | PRD 2.7 | P0 | `AC-CV-6.1` | `TEST-CV-001` | **NO** | **NO** | `PENDING` | `AnalysisProcessing` | `POST /analyze-multimodal` | `scan_results` | Erythema, Texture, Tone | Private bucket, no PII | BASELINED | `supabase/functions/analyze-skin` |
| **FR-FUS-001** | Multimodal Fusion Ingest | PRD 2.8 | P0 | `AC-FUS-7.1`, `7.2` | `TEST-FUS-001` | **NO** | **NO** | `PENDING` | `AnalysisProcessing` | `POST /analyze-multimodal` | `scan_results` | Linear Vector Fusion | Idempotent token | BASELINED | Missing in repo |
| **FR-CONF-002**| Agreement Scoring | PRD 2.9 | P0 | `AC-CONF-8.1`, `8.2`| `TEST-CONF-001` | **NO** | **NO** | `PENDING` | `AgreementBadge` | `POST /analyze-multimodal` | `scan_results` | Cosine Similarity | Transparent uncertainty | BASELINED | `src/pages/app/ResultsPage.tsx` |
| **FR-XAI-001** | 5-Part Explanation | PRD 2.10 | P0 | `AC-XAI-9.1` | `TEST-XAI-001` | **NO** | **NO** | `PENDING` | `ExplanationPanel` | `POST /analyze-multimodal` | `scan_results` | GPT-4o Constrained | Non-diagnostic guard | BASELINED | `src/data/mockData.ts:50-98` |
| **FR-RAG-002** | Knowledge Base Ground | PRD 2.11 | P0 | `AC-RAG-10.1`, `10.2`| `TEST-RAG-001` | **NO** | **NO** | `PENDING` | `RecommendationCard`| `POST /analyze-multimodal` | `knowledge_chunks` | pgvector (text-emb-3) | Classical citation | BASELINED | `supabase/schema.sql` (No vector) |
| **FR-REC-003** | Patch-Test Advisory | PRD 2.12 | P0 | `AC-REC-11.1` | `TEST-REC-001` | **NO** | **NO** | `PENDING` | `SafetyNotice` | `POST /analyze-multimodal` | `scan_results` | Deterministic Rule | Mandatory 24h warning | BASELINED | `src/components/app/SafetyNotice.tsx`|
| **FR-ROUT-001**| Personalized Routine | PRD 2.13 | P0 | `AC-ROUT-12.1` | `TEST-ROUT-001` | **NO** | **NO** | `PENDING` | `RoutineSchedule` | `GET /routines` | `routines` | GPT-4o Routine Synthesizer| RLS isolation | BASELINED | `src/pages/app/ResultsPage.tsx` |
| **FR-ROUT-005**| Routine Adherence Track | PRD 2.13 | P1 | `AC-ROUT-12.2` | `TEST-ROUT-002` | **NO** | **NO** | `PENDING` | `RoutineCard` | `POST /routine-tracking` | `routine_tracking` | N/A | RLS `auth.uid() = user_id`| DEFERRED | Missing in repo |
| **FR-HIST-001**| History Snapshot Browsing| PRD 2.16 | P0 | `AC-HIST-13.1` | `TEST-HIST-001` | **NO** | **NO** | `PENDING` | `HistoryTimeline` | `GET /scan-results` | `scan_results` | N/A | RLS read isolation | BASELINED | `src/pages/app/HistoryPage.tsx` |
| **FR-PROG-001**| Longitudinal Trends | PRD 2.17 | P2 | `AC-PROG-14.1` | `TEST-PROG-001` | **NO** | **NO** | `PENDING` | `ProgressDashboard` | `GET /progress-trends` | `progress_checkpoints` | Recharts Trend Engine | PII stripped | DEFERRED | `src/pages/app/ProgressPage.tsx` |
| **FR-PDF-001** | Downloadable PDF Report | PRD 2.18 | P1 | `AC-PDF-15.1` | `TEST-PDF-001` | **NO** | **NO** | `PENDING` | `DownloadButton` | `POST /generate-pdf-report` | `reports` (Storage) | Client/Server PDF Render | Signed download URL | DEFERRED | Missing in repo |
| **FR-VOICE-001**| Web Speech Assistant | PRD 2.15 | P2 | `AC-VOICE-16.1` | `TEST-VOICE-001` | **NO** | **NO** | `PENDING` | `VoiceAssistantPanel`| `POST /ayurveda-chat` | `chat_messages` | Web Speech API | RAM-only audio | DEFERRED | Missing in repo |
| **FR-ADMIN-001**| Admin Knowledge Ingest | PRD 2.20 | P1 | `AC-ADMIN-17.1` | `TEST-ADMIN-001` | **NO** | **NO** | `PENDING` | `KnowledgeManager` | `POST /admin-knowledge-ingest`| `knowledge_chunks` | pgvector Ingestion | Role check (`role = admin`) | DEFERRED | Missing in repo |
