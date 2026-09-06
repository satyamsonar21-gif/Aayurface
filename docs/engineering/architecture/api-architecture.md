# AayurFace — Architecture Specification
## Target API Architecture, Serverless Contracts & Transport Protocols

**Phase:** Phase 02 — Target System Architecture, ADRs & Implementation Blueprint  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION  
**Authority:** Staff Backend Architect, Solution Architect  

---

### 1. API Architecture Principles

1. **Protocol Standards:** HTTPS RESTful interfaces deployed as Supabase Edge Functions with standard JSON request/response payloads.
2. **Deterministic Versioning:** All endpoints are strictly prefixed with a major version identifier (`/api/v1/...`) to guarantee backwards compatibility.
3. **Identity Derivation:** Endpoints NEVER trust client-supplied `userId` parameters. The serverless middleware extracts caller identity exclusively from verified JWT bearer claims (`auth.uid()`).
4. **Idempotency:** State-mutating analytical requests accept an `Idempotency-Key` header (UUIDv4) to guarantee safe retries across flaky cellular networks without duplicate analysis creation or double inference charges.
5. **Configurable Rate Limiting:** All endpoints pass through rate-limiting middleware (DEC-006) enforcing configurable window policies to prevent cloud cost exhaustion and brute-force abuse.
6. **Standardized Error Envelope:** Errors strictly follow RFC 7807 Problem Details for HTTP APIs.

---

### 2. Standard Serverless API Inventory

#### A. Ingestion & Onboarding APIs
* **`POST /api/v1/capture/upload-url`**
  * *Purpose:* Issues a cryptographically signed, short-lived S3 upload URL for direct browser-to-storage frame upload.
  * *Actor:* Authenticated Consumer (`auth.uid()`).
  * *Headers:* `Authorization: Bearer <jwt>`, `Content-Type: application/json`.
  * *Input Schema:* `{ "contentType": "image/jpeg", "qualityGatewayToken": "string" }`.
  * *Output Schema (200 OK):* `{ "uploadUrl": "string", "storagePath": "string", "expiresInSeconds": 900 }`.
  * *Rate Limit:* 10 requests / user / hour.
* **`POST /api/v1/questionnaire/submit`**
  * *Purpose:* Ingests 15-question constitutional answers, computes Tridosha vector ($V+P+K=1.0$), stores record.
  * *Input Schema:* `{ "answers": { [questionId: string]: string }, "version": "v1.0" }`.
  * *Output Schema (200 OK):* `{ "questionnaireId": "uuid", "scores": { "vata": 0.6, "pitta": 0.25, "kapha": 0.15 }, "dominantTendency": "Vata", "completeness": 1.0 }`.
* **`POST /api/v1/lifestyle/submit`**
  * *Purpose:* Ingests lifestyle habits, environmental exposures, sleep, and hydration parameters.
  * *Input Schema:* `{ "dietType": string, "sleepQuality": string, "sleepHours": number, "stressLevel": string, "climate": string, "waterIntakeLiters": number, "activityLevel": string, "exposures": string[] }`.
  * *Output Schema (200 OK):* `{ "lifestyleId": "uuid", "normalizedFactors": { "heat_aggravation": 0.7, "dryness_aggravation": 0.6 } }`.

#### B. Analysis Orchestration & Query APIs
* **`POST /api/v1/analysis/orchestrate`**
  * *Purpose:* Asynchronously coordinates the complete multimodal analysis pipeline (Storage frame verification, CV feature extraction, multimodal fusion, RAG retrieval, XAI synthesis, and immutable snapshot creation).
  * *Headers:* `Authorization: Bearer <jwt>`, `Idempotency-Key: <uuid>`.
  * *Input Schema:* `{ "storagePath": string, "questionnaireId": "uuid", "lifestyleId": "uuid", "language": "en" | "hi" }`.
  * *Output Schema (202 Accepted):* `{ "analysisId": "uuid", "status": "QUEUED", "estimatedDurationSeconds": 25 }`.
  * *Rate Limit:* Proposed baseline 5 requests / user / hour (DEC-006).
* **`GET /api/v1/analysis/:id`**
  * *Purpose:* Retrieves full immutable analysis snapshot by ID. Enforces RLS ownership check.
  * *Output Schema (200 OK):* Complete `AnalysisResultContract` JSON (Document 07).
  * *Errors:* `404 Not Found` (Zero disclosure of other users' records).
* **`GET /api/v1/analysis/history`**
  * *Purpose:* Retrieves paginated list of past user analyses with agreement badges and confidence levels.
  * *Query Params:* `?page=1&limit=10&agreementState=ALL|HIGH|MODERATE|LOW`.
  * *Output Schema (200 OK):* `{ "items": AnalysisSummary[], "total": number, "page": number }`.

#### C. Personalization & Conversational APIs
* **`GET /api/v1/routines/today`**
  * *Purpose:* Retrieves active daily rituals (Morning, Evening, Weekly) for current user.
  * *Output Schema (200 OK):* `{ "morning": RoutineItem[], "evening": RoutineItem[], "weekly": RoutineItem[] }`.
* **`POST /api/v1/routines/track`**
  * *Purpose:* Records daily completion check for a routine item.
  * *Input Schema:* `{ "routineId": "uuid", "completedDate": "YYYY-MM-DD" }`.
  * *Output Schema (200 OK):* `{ "success": true, "updatedAdherenceRate": 0.85 }`.
* **`POST /api/v1/chat/message`**
  * *Purpose:* RAG-grounded conversational assistant endpoint. Queries `pgvector` classical knowledge and returns cited guidance.
  * *Input Schema:* `{ "messages": Message[], "analysisId": "uuid?", "language": "en" | "hi" }`.
  * *Output Schema (200 OK):* `{ "reply": string, "citations": ClassicalCitation[], "safetyNotice": string }`.
  * *Rate Limit:* 30 queries / user / hour.

#### D. Administration & Reporting APIs
* **`POST /api/v1/report/generate-pdf`**
  * *Purpose:* Generates signed download URL for compiled PDF wellness report.
  * *Input Schema:* `{ "analysisId": "uuid" }`.
  * *Output Schema (200 OK):* `{ "downloadUrl": string, "expiresInSeconds": 300 }`.
* **`POST /api/v1/admin/knowledge/ingest`**
  * *Purpose:* Administrative ingestion of classical literature chunks into `pgvector`.
  * *Actor:* Administrator (`role = 'admin'`).
  * *Input Schema:* `{ "sourceTitle": string, "chapter": string, "verseReference": string, "domain": string, "content": string, "version": string }`.
  * *Output Schema (201 Created):* `{ "chunkId": "uuid", "embedded": true, "dimensions": 1536 }`.
  * *Errors:* `403 Forbidden` for non-admin callers.

---

### 3. RFC 7807 Standard Error Envelope

All API errors return standard RFC 7807 Problem Details:

```json
{
  "type": "https://aayurface.app/errors/ERR-RATE-001",
  "title": "Rate Limit Exceeded",
  "status": 429,
  "detail": "You have reached the maximum number of analyses for this hour. Please retry after 14:00 UTC.",
  "instance": "/api/v1/analysis/orchestrate",
  "correlationId": "req_8f1a7b4c9e",
  "retryAfter": 1800
}
```
