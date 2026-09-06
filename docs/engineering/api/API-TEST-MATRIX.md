# Quality Contract: API Test Matrix & Verification Suites
## Planned Unit, Contract, Security, Idempotency & Fuzz Test Specifications

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Quality Assurance & Automated Verification  
**Status:** `PLANNED TEST SPECIFICATIONS (REQUIRES IMPLEMENTATION & EXECUTION IN PHASE 06/07)`  
**Authority:** QA Architect, Security Architect, Principal Backend Architect  

---

## 1. Multi-Tier Test Suite Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PLANNED API TEST PYRAMID                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Tier 1: Unit & Schema Validation Tests (Zod parsing, error envelopes)     │
│ • Tier 2: Consumer-Driven Contract Tests (Pact / OpenAPI Spec Compliance)   │
│ • Tier 3: End-to-End Integration Tests (Deno Edge Functions + PostgreSQL)   │
│ • Tier 4: Security & Penetration Tests (BOLA/IDOR, SQLi, JWT tampering)    │
│ • Tier 5: Concurrency & Idempotency Tests (SKIP LOCKED worker races)        │
│ • Tier 6: Fuzz Testing (Malformed payloads, boundary values, null bytes)   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Planned Test Specifications Matrix

| Test ID | Test Suite Category | Target Endpoint / Mechanism | Test Objective & Verification Method | Expected Outcome |
|---|---|---|---|---|
| **TEST-VAL-01** | Schema Contract | All `/api/v1/*` endpoints | Submit payloads with missing mandatory fields and unknown properties. | `422 Unprocessable Entity` with structured field errors. |
| **TEST-SEC-01** | BOLA / IDOR | `GET /api/v1/analyses/:id` | Authenticated User A queries User B's `analysisId`. | Uniform `404 Not Found`; zero data leak. |
| **TEST-SEC-02** | JWT Signature | `GET /api/v1/profile` | Submit expired token, modified `sub` claim, and altered signature. | `401 Unauthorized` (`AUTH_TOKEN_INVALID`). |
| **TEST-SEC-03** | Injection Defense | `POST /api/v1/voice/chat` | Submit prompt injection attacks (`"Ignore previous instructions..."`). | System instruction primacy preserved; zero command execution. |
| **TEST-IDM-01** | Idempotency | `POST /api/v1/analyses` | Dispatch 10 concurrent requests with identical `Idempotency-Key`. | Exactly 1 job created; 9 requests receive cached `202 Accepted`. |
| **TEST-CON-01** | Queue Locking | Worker Claim Engine | Spawn 5 concurrent background workers claiming from queue. | Zero duplicate claims; PostgreSQL `SKIP LOCKED` prevents race. |
| **TEST-FUZ-01** | Fuzz Testing | `POST /api/v1/captures/upload-url`| Submit negative file sizes, binary shellcode, non-JPEG headers. | `400 Bad Request` / `422 Unprocessable`. |
