# AayurFace — UX Specification: Analysis Progress & Orchestration
## Honest Stage-Based Progress, Serene Waiting Experience & Transparent Polling

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Analysis UX & Orchestration  
**Status:** `TARGET UX SPECIFICATION (REQUIRES IMPLEMENTATION)`  
**Authority:** Staff UX Engineer, Principal Frontend Architect  

---

## 1. Zero Fake Progress Percentage Invariant

* **Anti-Pattern Prohibited:** Fabricated linear progress bars (e.g. counting from 1% to 100% on a fake timer) are strictly forbidden.
* **Honest Stage-Based Progression:** The UI displays the actual backend processing stage returned by `GET /api/v1/analyses/:id/status` mapped to serene, human-friendly titles:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HONEST STAGE PROGRESSION LABELS                          │
├─────────┬─────────────────────────────┬─────────────────────────────────────┤
│ Stage # │ Backend Stage Key           │ User-Facing Presentation Label      │
├─────────┼─────────────────────────────┼─────────────────────────────────────┤
│ Stage 1 │ `VALIDATING`                │ "Verifying capture & consents..."   │
│ Stage 2 │ `PREPROCESSING`             │ "Preparing image for analysis..."   │
│ Stage 3 │ `CV_PROCESSING`             │ "Observing surface skin qualities..."│
│ Stage 4 │ `AYURVEDIC_PROCESSING`      │ "Synthesizing constitutional context"│
│ Stage 5 │ `FUSION_PROCESSING`         │ "Harmonizing multimodal signals..." │
│ Stage 6 │ `CONFIDENCE_EVALUATION`     │ "Evaluating agreement & confidence" │
│ Stage 7 │ `RAG_RETRIEVAL`             │ "Consulting classical treatises..." │
│ Stage 8 │ `SAFETY_VALIDATION`         │ "Applying safety & wellness checks" │
│ Stage 9 │ `COMPLETED`                 │ "Your insights are ready."          │
└─────────┴─────────────────────────────┴─────────────────────────────────────┘
```

---

## 2. Cancellation & Resilience Behaviors

* **Background Navigation:** If the user navigates away to `/dashboard` while analysis is in-flight, a persistent subtle banner notifies them: *"Your Ayurvedic analysis is processing. We'll alert you when it's ready."*
* **Timeout Handling:** If polling exceeds **45 seconds** without reaching a terminal status, the UI transitions to a gentle timeout state: *"Analysis is taking longer than expected. We are continuing in the background; your results will appear in your Scan History."*
