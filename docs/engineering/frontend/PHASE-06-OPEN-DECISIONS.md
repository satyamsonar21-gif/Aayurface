# AayurFace — Open Architectural Decisions Registry
## Phase 06 Open Decisions & Carried-Forward Frontend Registries

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** ACTIVE OPEN DECISIONS REGISTRY  
**Authority:** Principal Frontend Architect, Staff UX Engineer  

---

## 1. Carried-Forward & Active Open Frontend Decisions

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                 ACTIVE OPEN FRONTEND ARCHITECTURAL DECISIONS                │
├─────────┬───────────────────────────────────┬──────────────┬────────────────┤
│ ID      │ Title                             │ Status       │ Target Phase   │
├─────────┼───────────────────────────────────┼──────────────┼────────────────┤
│ DEC-004 │ Biometric Raw Image Retention     │ OPEN DECISION│ Phase 06 / Pre │
│ DEC-010 │ Post-MVP Expert Research Enclave  │ DEFERRED     │ Milestone 18   │
│ DEC-014 │ MediaPipe Wasm vs Native WebCam   │ TARGET (Wasm)│ Phase 07 Impl  │
│ DEC-015 │ Exact Color Swatch Validation     │ PROPOSED     │ Design Sign-off│
│ DEC-016 │ Client-Side PDF (jsPDF) vs Backend│ TARGET (Back)│ Phase 07 Impl  │
└─────────┴───────────────────────────────────┴──────────────┴────────────────┘
```

### DEC-004: Biometric Raw Image Retention (Immediate vs 30-Day)
* **Frontend Impact:** If Immediate Purge is selected, the History view renders abstract geometric/vector face abstractions instead of past thumbnail photos. If 30-Day Rolling is selected, ephemeral signed GET URLs display past captures for 30 days.

### DEC-014: MediaPipe Face Mesh Integration Strategy
* **Description:** Executing MediaPipe Face Mesh Wasm in a Dedicated Web Worker vs main thread canvas rendering.
* **Status:** `TARGET (DEDICATED WEB WORKER PROPOSED)`.

### DEC-015: Exact Palette Swatch Calibration
* **Description:** Formal brand approval of exact hex swatches (`#FAF8F5`, `#1E3A2F`, `#C5A059`) via accessibility lab testing.
* **Status:** `PROPOSED (REQUIRES DESIGN SIGN-OFF)`.

### DEC-016: PDF Generation Strategy (Serverless Chromium vs Client jsPDF)
* **Description:** Backend Headless Chromium (`API-REP-001`) vs client-side `jsPDF` rendering.
* **Status:** `TARGET (BACKEND HEADLESS CHROMIUM FOR HIGH-FIDELITY TYPOGRAPHY)`.
