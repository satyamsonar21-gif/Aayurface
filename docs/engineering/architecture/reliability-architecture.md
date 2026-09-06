# AayurFace — Architecture Specification
## Reliability, Fault Tolerance & Graceful Degradation Architecture

**Phase:** Phase 02 — Target System Architecture, ADRs & Implementation Blueprint  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION  
**Authority:** Platform/SRE Architect, Solution Architect  

---

### 1. Architectural Reliability Framework

AayurFace is engineered to withstand network volatility, mobile hardware constraints, and third-party AI outages without presenting broken states or unhandled stack traces. Every critical subsystem implements **Timeouts, Retries with Exponential Backoff, Circuit Breakers, and Safe Degraded Modes**.

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          FAILURE HANDLING & DEGRADATION MATRIX                  │
│                                                                                 │
│   Client Hardware Error (Camera Denied)   ──► Friendly Permission Guide         │
│   Network Flakiness (Upload Drop)         ──► 3x Exponential Backoff Retry      │
│   Edge Pipeline Latency (> 30s)           ──► Realtime Heartbeat / Keep-Alive   │
│   OpenAI API Outage / 5xx                 ──► Circuit Breaker -> Friendly Fallback│
│   pgvector Retrieval Miss (< 2 Chunks)    ──► Safe Limitation Statement (No AI) │
│   Supabase Realtime Disconnection         ──► Automated Polling Fallback (5s)   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Subsystem Fault Recovery Specifications

#### A. Camera & Capture Gateway Faults
* **Permission Denied (`NotAllowedError`):** Client catches error, transitions to `CAMERA_PERMISSION_DENIED` state, renders step-by-step browser setting guide, and presents manual alternative option if enabled.
* **Camera Hardware Missing (`NotFoundError`):** Renders friendly hardware missing card without crashing the React component tree.
* **Low-End Mobile Memory Pressure:** MediaPipe Face Mesh model is dynamically throttled to evaluate every 3rd video frame if frame rendering drops below 10 FPS, preventing mobile browser tab crashes.

#### B. Storage & Network Upload Faults
* **Flaky Cellular Uploads:** Direct S3 PUT uploads utilize a chunked retry handler executing up to 3 attempts with exponential backoff ($t_{wait} = 2^n \times 500\text{ms}$).
* **Orphaned Upload Cleanup:** If an image is successfully uploaded to `facial-captures` but analysis orchestration is never initiated or fails permanently, an automated 24-hour storage lifecycle policy purges the unreferenced file.

#### C. Asynchronous Analysis Pipeline Faults
* **Timeout Guards:** Edge Functions enforce a strict 45-second execution timeout. If OpenAI or CV processing stalls, the function terminates gracefully, updates pipeline state to `FAILED`, and records an RFC 7807 error.
* **Idempotency Recovery:** If a client drops connection during analysis and re-submits with the same `Idempotency-Key`, the orchestrator detects the existing active or completed record in `scan_results` and returns the existing status without re-running AI inference.
* **Degraded Modality Operation (`FR-FUS-003`):** If visual feature extraction encounters an unrecoverable corrupted image but constitutional quiz and lifestyle inputs are valid, the engine computes a degraded score, flags `is_degraded = true`, and presents the result as a provisional constitutional assessment.

#### D. External AI Service Outages (OpenAI Circuit Breaker)
* **Circuit Breaker Policy:** If OpenAI API returns 5xx errors or timeouts on $\ge 5$ consecutive requests within a 2-minute window, the circuit trips to `OPEN`.
* **Behavior in `OPEN` State:** Incoming analysis requests fail fast with a friendly message: *"Our AI analysis service is experiencing temporary delays. Your data is saved; please try again in a few moments."* This prevents unbounded queue backlogs and reduces cloud timeout costs.

#### E. Knowledge Retrieval & Hallucination Defense
* **Retrieval Miss Fallback:** If `pgvector` search returns zero matches above the 0.75 similarity threshold, generative synthesis is aborted. The system injects vetted classical baseline guidelines and appends an explicit limitation disclosure.
* **Output Validation Failure:** If GPT-4o output fails Zod schema parsing (malformed JSON or omitted required citations), the worker retries the completion once with a higher temperature penalty. If failure persists, it falls back to a safe pre-compiled balancing routine.

#### F. Realtime WebSocket Disconnection
* **Automated Fallback to Polling:** If the Supabase Realtime WebSocket drops during `/analysis/processing` and fails to reconnect within 8 seconds, the frontend client automatically activates polling (`GET /api/v1/analysis/:id` every 5 seconds) until completion or timeout.
