# AayurFace — Architecture Specification
## Architectural Traceability Matrix (Requirements → Architecture Blueprint)

**Phase:** Phase 02 — Target System Architecture, ADRs & Implementation Blueprint  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION  
**Authority:** Principal Software Architect, QA/Test Architect  
**Traceability Semantics:** This matrix establishes *Architectural Traceability* (design alignment). It does NOT claim implemented software test passes.  

---

### 1. Architecture Traceability Matrix

| Requirement ID | Requirement Title | Architectural Component | Data Component | API Boundary | AI / CV Boundary | Security Boundary | Planned Verification Method | Architecture Status |
|---|---|---|---|---|---|---|---|---|
| **FR-AUTH-001** | User Registration | `RegisterPage`, `AuthContext` | `auth.users`, `profiles` | `supabase.auth.signUp` | N/A | bcrypt hashing, TLS 1.3 | Unit test mock auth + integration sign-up test | **PLANNED ARCHITECTURE** |
| **FR-AUTH-002** | Password Verification | `LoginPage`, `AuthContext` | `auth.users` | `supabase.auth.signInWithPassword` | N/A | Work factor >= 10, rate limiting | Automated brute-force test + invalid password test | **PLANNED ARCHITECTURE** |
| **FR-AUTH-003** | Google OAuth PKCE | `LoginPage`, `AuthContext` | `auth.users`, `profiles` | `supabase.auth.signInWithOAuth` | N/A | OAuth 2.0 PKCE flow | E2E OAuth redirection smoke test | **PLANNED ARCHITECTURE** |
| **FR-I18N-001** | Multilingual UI (EN/HI)| `LanguageSelector`, `i18nStore` | `profiles.preferred_language` | N/A (Client State) | N/A | Sanitized string map | Visual regression test + missing key fallback test | **PLANNED ARCHITECTURE** |
| **FR-CONSENT-001**| Mandatory Consent Gate | `ConsentForm`, `ConsentGate` | `consents` table | `POST /api/v1/consents` | N/A | Immutable audit log, RLS | Client routing guard test + DB persistence test | **PLANNED ARCHITECTURE** |
| **FR-AYU-001** | 15-Question Intake | `QuestionnaireWizard` | `questionnaire_responses` | `POST /api/v1/questionnaire/submit`| Vector Scorer | Zod schema validation | Unit test Tridosha vector scoring function | **PLANNED ARCHITECTURE** |
| **FR-LIFE-001** | Lifestyle Intake | `LifestyleForm` | `lifestyle_contexts` | `POST /api/v1/lifestyle/submit` | Normalizer | Zod schema validation | Form submission validation test + DB write test | **PLANNED ARCHITECTURE** |
| **FR-CAP-001** | Camera Access Request | `CameraView`, `WebcamAdapter` | N/A | WebRTC MediaDevices API | N/A | Browser sandbox permissions | Browser mock permission grant/denial test | **PLANNED ARCHITECTURE** |
| **FR-CAP-002** | Face Presence Check | `QualityGateway` (Client Wasm) | N/A (Ephemeral RAM) | MediaPipe Face Mesh API | MediaPipe 468-point Mesh | RAM-only evaluation, zero storage | Simulated multi-face & no-face stream tests | **PLANNED ARCHITECTURE** |
| **FR-CAP-005** | Lighting / Glare Check | `QualityGateway` (Luma Calc) | N/A (Ephemeral RAM) | Client Canvas Context | Luma Evaluator | Ephemeral frame buffer | Synthetic dark/bright canvas image feed test | **PLANNED ARCHITECTURE** |
| **FR-CAP-006** | Sharpness / Blur Gate | `QualityGateway` (Laplacian) | N/A (Ephemeral RAM) | Client Canvas Context | Blur Evaluator | Ephemeral frame buffer | Synthetic motion-blurred frame feed test | **PLANNED ARCHITECTURE** |
| **FR-CAP-009** | Encrypted Frame Upload | `CaptureUploader` | `captures` (Private Storage) | `POST /api/v1/capture/upload-url` | N/A | Signed PUT URL (TTL 15m) | Upload mock test + unauthorized read block test | **PLANNED ARCHITECTURE** |
| **FR-CV-001** | Feature Signal Extract | `ImageProcessingSvc` | `scan_results.visual_obs` | `POST /api/v1/analysis/orchestrate`| CIELAB / GLCM Feature Extractor| Private S3 download via signed URL | Unit test mathematical feature extraction formulas | **PLANNED ARCHITECTURE** |
| **FR-FUS-001** | Multimodal Fusion | `FusionEngineSvc` | `scan_results.fused_tend` | `POST /api/v1/analysis/orchestrate`| Configurable Weight Registry | Idempotency key, stateless worker | Unit test weighted vector combination under weights | **PLANNED ARCHITECTURE** |
| **FR-CONF-002**| Agreement Scoring | `AgreementEngineSvc` | `scan_results.agreement_state` | `POST /api/v1/analysis/orchestrate`| Cosine Similarity Matrix | Transparent uncertainty display | Boundary tests for High/Moderate/Low thresholds | **PLANNED ARCHITECTURE** |
| **FR-XAI-001** | 5-Part Explanation | `AiReasoningXaiSvc` | `scan_results.explanation` | `POST /api/v1/analysis/orchestrate`| GPT-4o Constrained Prompt | Zod schema parse + non-diagnostic check | Golden test suite validating 5-part schema adherence | **PLANNED ARCHITECTURE** |
| **FR-RAG-002** | Knowledge Base Ground | `KnowledgeRagSvc` | `knowledge_chunks` (pgvector) | `POST /api/v1/analysis/orchestrate`| pgvector `<=>` Cosine Search | Mandatory classical source citation | Integration test verifying top-k chunk citations | **PLANNED ARCHITECTURE** |
| **FR-REC-003** | Patch-Test Advisory | `RecommendationCard`, SafetySvc | `scan_results.recommendations` | `POST /api/v1/analysis/orchestrate`| Deterministic Safety Rule | Prominent mandatory warning box | Regression test verifying patch test on all herbs | **PLANNED ARCHITECTURE** |
| **FR-ROUT-001**| Personalized Routine | `RoutineSchedule`, RoutineSvc | `routines` table | `GET /api/v1/routines/today` | GPT-4o Routine Formatter | RLS isolation (`auth.uid() = user_id`) | UI snapshot test + DB persistence test | **PLANNED ARCHITECTURE** |
| **FR-ROUT-005**| Routine Adherence Track | `RoutineCard`, RoutineSvc | `routine_tracking` table | `POST /api/v1/routines/track` | N/A | RLS write isolation | Checkbox click toggle test + daily adherence calc | **PLANNED ARCHITECTURE** |
| **FR-HIST-001**| History Timeline | `HistoryTimeline`, HistorySvc | `scan_results` table | `GET /api/v1/analysis/history` | N/A | RLS read isolation | Pagination test + agreement filter query test | **PLANNED ARCHITECTURE** |
| **FR-PROG-001**| Longitudinal Trends | `ProgressDashboard`, TrendSvc | `progress_checkpoints` table | `GET /api/v1/progress/trends` | Recharts Trend Engine | PII stripped; numerical metrics | Multi-scan delta comparison unit test | **PLANNED ARCHITECTURE** |
| **FR-PDF-001** | PDF Wellness Report | `PDFGenerator`, PDFService | `reports` (Storage) | `POST /api/v1/report/generate-pdf` | Client/Server PDF Compiler | Signed download URL (TTL 5m) | PDF binary structure validation test | **PLANNED ARCHITECTURE** |
| **FR-VOICE-001**| Web Speech Assistant | `VoiceAssistantPanel`, ChatSvc| `chat_messages` table | `POST /api/v1/chat/message` | Web Speech API + GPT-4o | Audio processed in browser RAM only | Mock voice transcription test + RAG chat test | **PLANNED ARCHITECTURE** |
| **FR-ADMIN-001**| Admin Knowledge Ingest | `KnowledgeManager`, AdminSvc | `knowledge_chunks` table | `POST /api/v1/admin/knowledge/ingest`| OpenAI text-embedding-3-small | Role check (`profiles.role = 'admin'`) | Admin authorization barrier test (403 for user) | **PLANNED ARCHITECTURE** |
