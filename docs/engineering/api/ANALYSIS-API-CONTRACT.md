# API Contract: Analysis Orchestration & Status Polling
## Asynchronous Analysis Dispatch, Job Queueing & Lifecycle Status

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Analysis Orchestration  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Principal Backend Architect, AI Platform Architect, Distributed Systems Architect  

---

## 1. API-ANL-001: Orchestrate New Analysis (`POST /api/v1/analyses`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/analyses`
* **Actor:** Authenticated User (`auth.uid()`)
* **Execution Semantics:** **Asynchronous Dispatch (`202 Accepted`)**
* **Idempotency Header:** `Idempotency-Key: <uuidv4>` (Mandatory)
* **Rate Limit:** 5 requests / user / hour (**PROPOSED POLICY / REQUIRES VALIDATION**)

### Preconditions:
1. `auth.uid()` has active `FACIAL_BIOMETRIC_PROCESSING` and `WELLNESS_DATA_PROCESSING` consents.
2. `captureSessionId` exists, belongs to `auth.uid()`, and image is verified in S3.
3. User has completed at least one valid `questionnaire_responses` record.

### Request Body & Zod Schema

```typescript
export const OrchestrateAnalysisSchema = z.object({
  captureSessionId: z.string().uuid(),
  lifestyleContextId: z.string().uuid().optional(), // If omitted, uses latest
  questionnaireResponseId: z.string().uuid().optional() // If omitted, uses latest
}).strict();
```

### Success Response (`202 Accepted`)

```json
{
  "data": {
    "analysisId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f87",
    "jobId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f88",
    "status": "QUEUED",
    "statusUrl": "/api/v1/analyses/018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f87/status",
    "retryAfterSeconds": 2,
    "estimatedCompletionSeconds": 6,
    "createdAt": "2026-09-03T20:30:00.000Z"
  },
  "meta": {
    "requestId": "req_anl_orch_01",
    "timestamp": "2026-09-03T20:30:00.080Z"
  }
}
```

---

## 2. API-ANL-002: Get Analysis Processing Status (`GET /api/v1/analyses/:id/status`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/analyses/:id/status`
* **Actor:** Authenticated User (`auth.uid()`)
* **Ownership Invariant:** Server asserts `analysis_jobs.user_id = auth.uid()`.

### Success Response (`200 OK` — In Progress)

```json
{
  "data": {
    "analysisId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f87",
    "status": "FUSION_PROCESSING",
    "stage": 6,
    "totalStages": 11,
    "stageName": "Multimodal Vector Fusion & Harmonic Agreement",
    "isTerminal": false,
    "retryAfterSeconds": 1
  },
  "meta": {
    "requestId": "req_anl_status_01",
    "timestamp": "2026-09-03T20:30:02.100Z"
  }
}
```

### Success Response (`200 OK` — Completed)

```json
{
  "data": {
    "analysisId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f87",
    "status": "COMPLETED",
    "isTerminal": true,
    "resultsUrl": "/api/v1/analyses/018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f87",
    "completedAt": "2026-09-03T20:30:05.420Z",
    "durationMs": 5420
  },
  "meta": {
    "requestId": "req_anl_status_02",
    "timestamp": "2026-09-03T20:30:05.450Z"
  }
}
```

### Failure Response (`200 OK` — Terminal Job Failure)

```json
{
  "data": {
    "analysisId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f87",
    "status": "FAILED_TERMINAL",
    "isTerminal": true,
    "failureReason": "IMAGE_DECODE_ERROR",
    "userMessage": "We could not extract facial features from your capture. Please retake your scan under clear lighting.",
    "canRetry": true
  },
  "meta": {
    "requestId": "req_anl_status_03",
    "timestamp": "2026-09-03T20:30:03.000Z"
  }
}
```
