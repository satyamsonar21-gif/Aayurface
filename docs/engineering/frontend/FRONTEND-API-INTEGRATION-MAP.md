# AayurFace — Frontend Architecture Specification
## Frontend-to-Backend API Integration Map

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** API Integration & Contract Mapping  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** API Integration Architect, Principal Backend Architect  

---

## 1. Complete Frontend Action to Phase 05 API Contract Mapping

| Screen / Component | UI Trigger Event | Custom React Query Hook | Phase 05 API ID | Method & Path | Cache Invalidation Target |
|---|---|---|---|---|---|
| `LoginPage.tsx` | Submit Login Form | `useSignInMutation()` | `API-AUTH-002` | `POST /auth/v1/token` | Sets JWT; invalidates `queryKeys.profile.current()` |
| `OnboardingConsent.tsx`| Toggle Consent Switch | `useUpdateConsentMutation()`| `API-CONS-002` | `POST /api/v1/consents` | Invalidate `queryKeys.consents.active()` |
| `QuestionnaireWizard.tsx`| Submit All 15 Answers | `useSubmitQuizMutation()` | `API-QNR-002` | `POST /api/v1/questionnaires/responses`| Invalidate `queryKeys.onboarding.state()` |
| `CaptureViewport.tsx` | Capture Snap Approved | `useIssueUploadUrlMutation()`| `API-CAP-002` | `POST /api/v1/captures/upload-url` | Returns Signed S3 PUT URL |
| `CaptureViewport.tsx` | S3 Upload Completed | `useOrchestrateAnalysisMutation()`| `API-ANL-001` | `POST /api/v1/analyses` (Async 202)| Navigates `/analyze/processing?id=...` |
| `AnalysisProcessing.tsx`| Interval Poll (1.5s) | `useAnalysisStatusQuery(id)` | `API-ANL-002` | `GET /api/v1/analyses/:id/status`| Updates local progress stage |
| `ResultsOverview.tsx` | Page Mount | `useAnalysisResultQuery(id)` | `API-RES-001` | `GET /api/v1/analyses/:id` | Populates Doshic gauge & observables |
| `ExplainabilityView.tsx`| Page Mount | `useExplainabilityQuery(id)` | `API-RES-002` | `GET /api/v1/analyses/:id/explainability`| Populates 7-pillar breakdown |
| `RecommendationList.tsx`| Click "Adopt Ritual" | `useAdoptRecommendationsMutation()`| `API-REC-002` | `POST /api/v1/recommendations/adopt`| Invalidate `queryKeys.routines.active()` |
| `RoutineTimeline.tsx` | Check Off Habit Item | `useTrackRoutineItemMutation()` | `API-ROU-003` | `POST /api/v1/routines/items/:id/track`| Optimistic update `queryKeys.routines.active()` |
| `ScanHistoryFeed.tsx` | Scroll to Bottom | `useInfiniteHistoryQuery()` | `API-HIST-001` | `GET /api/v1/history` (Keyset) | Appends next page to cache |
| `ProgressDashboard.tsx`| Page Mount | `useProgressCheckpointsQuery()`| `API-PROG-001` | `GET /api/v1/progress/checkpoints`| Populates 30/60/90-day trend chart |
| `VoiceGuide.tsx` | Speech Transcript Ready | `useVoiceChatMutation()` | `API-VOICE-001`| `POST /api/v1/voice/chat` | Appends message to chat stream |
| `PDFExportModal.tsx` | Click "Compile PDF" | `useCompileReportMutation()` | `API-REP-001` | `POST /api/v1/reports/compile` (202) | Polling until ready $\rightarrow$ `API-REP-002` |
| `ShareModal.tsx` | Click "Generate Link" | `useCreateShareMutation()` | `API-SHR-001` | `POST /api/v1/shares` | Displays 256-bit URL |
| `PublicShareView.tsx` | Page Mount | `usePublicShareQuery(token)` | `API-SHR-002` | `GET /api/v1/shares/:token` | Populates de-identified summary |
| `PrivacyCenter.tsx` | Confirm Account Delete | `useDeleteAccountMutation()` | `API-PROF-004` | `DELETE /api/v1/profile/account` | Clears all caches $\rightarrow$ Redirect `/` |

---

## 2. API Contract Harmony Certification
* **Total Front-to-Back Endpoints Mapped:** 17 Primary Frontend Hooks mapped to 17 Core Phase 05 Endpoints.
* **API Gaps Detected:** 0 (Zero endpoints required that were not already defined in Phase 05).
