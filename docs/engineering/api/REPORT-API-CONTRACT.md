# API Contract: PDF Report Compilation & Export
## Asynchronous Headless PDF Generation, Ephemeral S3 Storage & Download URLs

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Reports & Document Generation  
**Status:** `TARGET ARCHITECTURE / PROPOSED (REQUIRES IMPLEMENTATION)`  
**Authority:** Principal Backend Architect, Platform Engineer  

---

## 1. API-REP-001: Request PDF Compilation (`POST /api/v1/reports/compile`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/reports/compile`
* **Actor:** Authenticated User (`auth.uid()`)
* **Execution:** **Asynchronous Dispatch (`202 Accepted`)** via headless Chromium worker.

### Request Body & Zod Schema

```typescript
export const CompileReportSchema = z.object({
  analysisId: z.string().uuid(),
  includeVisualObservables: z.boolean().default(true),
  includeRecommendations: z.boolean().default(true),
  language: z.enum(['en', 'hi']).default('en')
}).strict();
```

### Success Response (`202 Accepted`)

```json
{
  "data": {
    "reportJobId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f8e",
    "status": "COMPILING",
    "statusUrl": "/api/v1/reports/018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f8e/status",
    "estimatedCompletionSeconds": 3
  },
  "meta": {
    "requestId": "req_rep_compile_01",
    "timestamp": "2026-09-03T20:30:00.080Z"
  }
}
```

---

## 2. API-REP-002: Get Ephemeral Download URL (`GET /api/v1/reports/:id/download`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/reports/:id/download`
* **Actor:** Authenticated User (`auth.uid()`)
* **Security:** Issues short-lived HMAC signed GET URL (**60 seconds TTL**). Ephemeral S3 object auto-purges after 7 days.

### Success Response (`200 OK`)

```json
{
  "data": {
    "reportId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f8e",
    "downloadUrl": "https://aayurface-prod-reports.s3.ap-south-1.amazonaws.com/reports/018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f80/pitta_assessment_report.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=60&...",
    "expiresInSeconds": 60,
    "fileSizeBytes": 1428500
  },
  "meta": {
    "requestId": "req_rep_download_01",
    "timestamp": "2026-09-03T20:30:05.100Z"
  }
}
```
