# AayurFace — Engineering Requirements Specification
## Document 12: Complete System State Taxonomy & Finite State Models

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** Solution Architect, Frontend Architect, QA/Test Architect  

---

### 1. Authentication Lifecycle State Model

```text
               ┌───────────────────────┐
               │    UNAUTHENTICATED    │
               └───────────┬───────────┘
                           │ User enters credentials / OAuth
                           ▼
               ┌───────────────────────┐
               │     AUTHENTICATING    │
               └─────┬───────────┬─────┘
    Auth Failure     │           │ Auth Success
    ┌────────────────┘           └──────────────┐
    ▼                                           ▼
┌──────────────┐                       ┌───────────────────┐
│  AUTH_ERROR  │                       │   AUTHENTICATED   │
└──────────────┘                       └─────────┬─────────┘
                                                 │
                                 ┌───────────────┴───────────────┐
                                 │ Token Expired (Refresh Fails) │ User Signs Out
                                 ▼                               ▼
                       ┌───────────────────┐           ┌───────────────────┐
                       │  SESSION_EXPIRED  │           │    LOGGED_OUT     │
                       └───────────────────┘           └───────────────────┘
```

* **States:** `UNAUTHENTICATED`, `AUTHENTICATING`, `AUTHENTICATED`, `SESSION_EXPIRED`, `AUTH_ERROR`, `LOGGED_OUT`.
* **Invariants:** Protected routes strictly accessible ONLY when state is `AUTHENTICATED`.

---

### 2. Standardized Capture & Quality Gateway State Model

```text
┌────────────────────────┐
│     INITIALIZING       │ Camera stream loading, WebAssembly model loading
└───────────┬────────────┘
            │ Permission Prompt
            ▼
┌────────────────────────┐    Permission Denied    ┌────────────────────────┐
│  PERMISSION_REQUIRED   ├────────────────────────►│   PERMISSION_DENIED    │
└───────────┬────────────┘                         └────────────────────────┘
            │ Permission Granted
            ▼
┌────────────────────────┐
│      CAMERA_READY      │ Video stream rendering
└───────────┬────────────┘
            │ Continuous Evaluator
            ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       GATEWAY EVALUATION STATES                        │
│                                                                        │
│  • NO_FACE_DETECTED       (Count = 0)                                  │
│  • MULTIPLE_FACES         (Count > 1)                                  │
│  • POOR_CENTERING         (Face centroid outside oval bounds > 15%)    │
│  • POOR_DISTANCE_CLOSE    (Inter-pupillary distance > D_max)           │
│  • POOR_DISTANCE_FAR      (Inter-pupillary distance < D_min)           │
│  • POOR_LIGHTING_DARK     (ROI luminance < 80)                         │
│  • POOR_LIGHTING_BRIGHT   (ROI luminance > 220)                        │
│  • MOTION_BLUR            (Laplacian variance < tau_blur)              │
│  • OCCLUSION_DETECTED     (Landmark confidence < 0.85)                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ All Checks PASS
                                    ▼
┌────────────────────────┐
│      GATEWAY_PASS      │ "Capture" button enabled
└───────────┬────────────┘
            │ User Clicks Capture
            ▼
┌────────────────────────┐
│       CAPTURING        │ Freezes frame, executes encryption
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐    Upload Failed       ┌────────────────────────┐
│       UPLOADING        ├───────────────────────►│      UPLOAD_ERROR      │
└───────────┬────────────┘                        └────────────────────────┘
            │ Upload Success
            ▼
┌────────────────────────┐
│    CAPTURE_COMPLETE    │ Hands off to Analysis Pipeline
└────────────────────────┘
```

---

### 3. Analysis Pipeline State Model (Real-Time Orchestration)

```text
┌─────────────────┐
│     QUEUED      │ Ingestion token verified, job placed in queue
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   EXTRACTING    │ Computing micro-vascular redness, texture, pigmentation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     FUSING      │ Merging Visual + Questionnaire + Lifestyle vectors
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ASSESSING_CONF │ Evaluating inter-modality agreement (High/Moderate/Low)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   RETRIEVING    │ Querying pgvector for classical Ayurvedic citations
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   SYNTHESIZING  │ GPT-4o generating XAI explanation and routines
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     FILTERING   │ Safety check & non-diagnostic disclaimer verification
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    COMPLETED    │ Snapshot persisted in scan_results; results rendered
└─────────────────┘
```

* **Terminal Failure States:** `PIPELINE_ERROR` (Triggers non-diagnostic friendly fallback).

---

### 4. Knowledge Retrieval State Model

* `KNOWLEDGE_IDLE`: Retrieval service standby.
* `KNOWLEDGE_SEARCHING`: Querying `pgvector` with query embedding.
* `KNOWLEDGE_RETRIEVED`: Top-$k$ chunks found above similarity threshold ($0.75$).
* `KNOWLEDGE_INSUFFICIENT`: Zero or $<2$ chunks matched threshold (Triggers limitation fallback).
* `KNOWLEDGE_ERROR`: Database connection timeout or vector service failure.

---

### 5. Report Generation State Model

* `REPORT_IDLE`: User viewing completed results.
* `REPORT_GENERATING`: Assembling vector graphics, typography, disclaimers.
* `REPORT_READY`: PDF binary generated and signed URL delivered.
* `REPORT_ERROR`: Generation timeout or memory constraint.
