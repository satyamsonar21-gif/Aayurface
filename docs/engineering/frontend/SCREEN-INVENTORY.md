# AayurFace — Frontend Architecture Specification
## Target Screen Master Inventory & Specification Catalog

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET SCREEN INVENTORY (24 Screens)  
**Authority:** Staff UX Engineer, Principal Frontend Architect  

---

## 1. Complete Screen Master Catalog

| Screen ID | Screen Name | Route Path | Primary User Goal | Primary Action | Secondary Action | Phase 05 API Dependency | Responsive Layout |
|---|---|---|---|---|---|---|---|
| **SCR-PUB-01** | Landing Page | `/` | Understand value proposition & trust pillars | Click "Begin Wellness Journey" (`/signup`) | Explore "How It Works" | None (Static) | Hero + Feature Cards + Editorial Showcase |
| **SCR-PUB-02** | How It Works | `/how-it-works` | Understand multimodal AI + Ayurvedic science | Click "Start Assessment" | Read Safety FAQ | `GET /api/v1/questionnaires/active` | Editorial long-form article format |
| **SCR-PUB-03** | Safety & Trust | `/safety` | Review non-diagnostic boundaries & disclaimer | Review clinical boundaries | Return to Home | None | High-trust policy card layout |
| **SCR-PUB-04** | Privacy Policy | `/privacy` | Review DPDP/GDPR biometric data handling | Review deletion rights | Contact Privacy Officer | None | Structured legal accordions |
| **SCR-AUTH-01**| Registration | `/signup` | Create new account with email & password | Submit Signup Form | "Already have account? Sign in" | `POST /auth/v1/signup` | Centered Luxury Auth Card |
| **SCR-AUTH-02**| Login | `/login` | Authenticate with existing credentials | Submit Login Form | "Forgot password?" | `POST /auth/v1/token` | Centered Luxury Auth Card |
| **SCR-ONB-01** | Onboarding Intro | `/onboarding` | Select preferred language & start journey | Select Language & Proceed | Review Privacy Summary | `GET /api/v1/onboarding/state` | Minimalist Stepper Wizard |
| **SCR-ONB-02** | Consent Ledger | `/onboarding/consent` | Grant unbundled biometric & wellness consents | Review & Grant Consents | Review Legal FAQ | `POST /api/v1/consents` | Interactive Toggle Consent Cards |
| **SCR-ONB-03** | Prakriti Intake | `/onboarding/intake` | Complete 15-question constitutional intake | Submit Questionnaire | Previous Question | `POST /api/v1/questionnaires/responses` | One-question-at-a-time Carousel |
| **SCR-DASH-01**| Home Dashboard | `/dashboard` | View daily Dinacharya, recent dosha & status | Check Off Morning Ritual | Click "New Facial Scan" | `GET /api/v1/routines/active`, `GET /api/v1/profile` | Responsive 3-Column Grid (Desktop) / Vertical Stream (Mobile) |
| **SCR-CAP-01** | Camera Capture | `/analyze/capture` | Capture standardized facial image with guidance | Hold Position for Capture | Switch to Upload Photo | `POST /api/v1/captures/sessions`, `.../quality` | Fullscreen Camera Viewport with Wasm Guide |
| **SCR-ANL-01** | Analysis Status | `/analyze/processing` | View transparent 12-stage analysis progress | Observe Live Stage Progress | Cancel Analysis | `GET /api/v1/analyses/:id/status` | Serene Circular Breathing Animation |
| **SCR-RES-01** | Results Overview | `/analyze/results/:id` | Review dosha breakdown & calibrated confidence | Explore Recommendations | View Explainability | `GET /api/v1/analyses/:id` | Editorial Summary Card + Doshic Gauge |
| **SCR-RES-02** | Explainability | `/analyze/results/:id/explain` | Understand modality contribution & evidence | Review Cited Verses | Download PDF Report | `GET /api/v1/analyses/:id/explainability` | 7-Question Breakdown Accordions |
| **SCR-REC-01** | Recommendations | `/analyze/results/:id/recs` | Review personalized lepa, diet & rituals | Click "Adopt to Routine" | Filter by Category | `GET /api/v1/analyses/:id/recommendations` | Grounded Ritual Recipe Cards |
| **SCR-ROU-01** | Routine Schedule | `/routine` | Manage and track daily Dinacharya rituals | Check Off Active Item | Edit Routine Schedule | `GET /api/v1/routines/active`, `POST .../track` | Timeline Feed (Morning, Afternoon, Evening) |
| **SCR-HIST-01**| Scan History | `/history` | Browse past scans with keyset pagination | Select Past Scan Detail | Filter by Date Range | `GET /api/v1/history` | Chronological Card Stream with Infinite Scroll |
| **SCR-PROG-01**| Longitudinal Prog | `/progress` | Review 30/60/90-day progress delta vectors | Select Checkpoint Interval | Compare Baseline vs Current | `GET /api/v1/progress/checkpoints` | Multi-Metric Trend Charts & Observation Deltas |
| **SCR-VOICE-01**| Voice Guide | `/voice` | Ask Ayurvedic questions via voice or text | Speak into Microphone | Type Question Text | `POST /api/v1/voice/chat` | Conversational Stream with Audio Visualizer |
| **SCR-REP-01** | PDF Export | `/reports/:id` | Generate and download formal PDF report | Click "Download PDF" | Create Public Share Link | `POST /api/v1/reports/compile`, `GET .../download` | High-Fidelity Document Preview Modal |
| **SCR-SHR-01** | Public Share View | `/share/:token` | View de-identified public assessment report | Explore AayurFace Platform | Download Shared PDF | `GET /api/v1/shares/:token` | Redacted Editorial Wellness View (Zero PII) |
| **SCR-PROF-01**| Profile & Account | `/profile` | Manage name, age, language & preferences | Save Profile Changes | Change Password | `GET /api/v1/profile`, `PUT /api/v1/profile` | 2-Column Settings Layout |
| **SCR-PRIV-01**| Privacy Center | `/settings/privacy` | Review active consents, export data, erase | Click "Delete My Account" | Revoke Specific Consent | `POST /api/v1/consents`, `DELETE .../account` | High-Security Privacy Command Panel |
| **SCR-ERR-01** | Error Boundary | `*` (Fallback) | Recover from network or unhandled errors | Click "Retry" | Return to Dashboard | None | Elegant Error State with Support Request ID |
