# AayurFace — Backend & API Architecture Specification
## Universal API Contract Standard & Schema Conventions

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Date:** 2026-09-03  
**Status:** AUTHORITATIVE CONTRACT SPECIFICATION  
**Authority:** Principal Backend Architect, API Architect, Security Architect  

---

## 1. Standard Request & Response Structure

All AayurFace HTTP/JSON API endpoints conform to a rigorous, uniform contract standard. No endpoint may deviate from these structural conventions.

### 1.1 Mandatory Request Headers

```http
Authorization: Bearer <supabase_rs256_jwt_token>
Content-Type: application/json; charset=utf-8
X-Request-ID: <uuidv4_or_trace_id>
Idempotency-Key: <optional_or_mandatory_256bit_uuid>
```

### 1.2 Standard Success Envelope (`200 OK` / `201 Created`)

For single resource queries and transactional mutations:

```json
{
  "data": {
    "id": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f80",
    "type": "scan_result",
    "attributes": {
      "dominantDosha": "PITTA",
      "calibratedConfidence": 84.5,
      "createdAt": "2026-09-03T20:30:00.000Z"
    }
  },
  "meta": {
    "requestId": "req_018e3a2b8c4d7ef0",
    "timestamp": "2026-09-03T20:30:00.125Z",
    "apiVersion": "v1.0.0"
  }
}
```

### 1.3 Standard Asynchronous Job Envelope (`202 Accepted`)

For multi-second AI, CV, or PDF generation jobs:

```json
{
  "data": {
    "jobId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f81",
    "status": "QUEUED",
    "resourceType": "analysis",
    "statusUrl": "/api/v1/analyses/018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f81/status",
    "retryAfterSeconds": 2,
    "estimatedDurationSeconds": 6
  },
  "meta": {
    "requestId": "req_018e3a2b8c4d7ef1",
    "timestamp": "2026-09-03T20:30:00.150Z"
  }
}
```

### 1.4 Standard Paginated Keyset Envelope (`200 OK`)

For high-volume list feeds (`/api/v1/history`):

```json
{
  "data": [
    {
      "id": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f80",
      "dominantDosha": "PITTA",
      "createdAt": "2026-09-03T20:30:00.000Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "hasNextPage": true,
    "nextCursor": "ZXlKaGJHY2lPaUpTVXpVbkxh...",
    "totalCountEstimate": 42
  },
  "meta": {
    "requestId": "req_018e3a2b8c4d7ef2",
    "timestamp": "2026-09-03T20:30:00.200Z"
  }
}
```

### 1.5 Standard Error Envelope (RFC 7807 Inspired)

For all 4xx and 5xx failure states:

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "The request payload failed strict schema validation.",
    "details": [
      {
        "field": "lifestyleContext.sleepHours",
        "issue": "Expected number between 0 and 24, received 30"
      }
    ],
    "requestId": "req_018e3a2b8c4d7ef3",
    "retryable": false
  }
}
```

---

## 2. Universal Contract Template

Every individual API contract document in `docs/engineering/api/` follows this mandatory 20-point specification structure:

```markdown
# API Contract: [API-ID] — [Endpoint Title]

## 1. Route Specification
* **HTTP Method:** `GET` | `POST` | `PUT` | `DELETE`
* **Path:** `/api/v1/...`
* **Domain:** [Domain Name]
* **Actor & Role:** [Authenticated User | Anonymous | Admin | Practitioner]
* **Auth Requirement:** [Supabase JWT Bearer Token | Public]
* **Truth Status:** `CURRENT VERIFIED` | `TARGET` | `PROPOSED` | `HYPOTHESIS`

## 2. Business Purpose & Semantics
[Concise explanation of domain action]

## 3. Preconditions & Authorization Invariants
* Precondition 1 (e.g., active consent)
* Server-authoritative ownership rule (`auth.uid() = user_id`)

## 4. Request Parameters & Headers
* Headers: ...
* Path Parameters: ...
* Query Parameters: ...

## 5. Request Body & Zod Schema
[TypeScript / Zod schema definition]

## 6. Execution Semantics (Sync vs Async State Machine)
[Synchronous ACID transaction or Asynchronous Job Dispatch]

## 7. Database Entities & Transaction Boundary
* Tables touched
* Transaction isolation level

## 8. Success Response (`200 OK` / `201 Created` / `202 Accepted`)
[Full JSON schema example]

## 9. Error Responses & Failure Taxonomy
* 400 Bad Request
* 401 Unauthorized
* 403 Forbidden
* 404 Not Found
* 409 Conflict
* 422 Unprocessable Entity
* 429 Too Many Requests
* 500 Internal Server Error

## 10. Idempotency & Rate Limiting Rules
* Idempotency header support
* Rate limit tier (e.g., 5 requests / user / hour)

## 11. Security & Privacy Controls (Anti-BOLA / PII Scrubbing)
* Anti-IDOR validation
* Redaction rules

## 12. Observability & Distributed Tracing
* Structured telemetry payload

## 13. Acceptance Criteria (Given/When/Then)
* Given ... When ... Then ...

## 14. Planned Test Coverage
* Unit, Integration, Security, and Fuzz tests

## 15. Requirement Traceability
* Mapping to PRD Functional Requirement ID
```
