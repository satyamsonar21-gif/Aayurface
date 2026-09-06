# AayurFace — Backend & API Architecture Specification
## 20 Core API Engineering Principles & Invariants

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Date:** 2026-09-03  
**Status:** AUTHORITATIVE ARCHITECTURAL STANDARD  
**Authority:** Principal Backend Architect, API Architect, Security Architect, AI Platform Architect  

---

## 1. The 20 Authoritative Principles

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AAYURFACE 20 CORE API PRINCIPLES                         │
├────┬───────────────────────────────┬────┬───────────────────────────────────┤
│ 01 │ API-First Contract Design     │ 11 │ Explicit Asynchronous Semantics   │
│ 02 │ Server-Authoritative Identity │ 12 │ Zero Direct Browser-to-AI Access  │
│ 03 │ Explicit Authorization        │ 13 │ Zero Direct Browser-to-Vector DB  │
│ 04 │ Resource Ownership Enforcement│ 14 │ Zero Client Authorization Spoofing│
│ 05 │ Fail-Closed Security          │ 15 │ Versioned API Contracts           │
│ 06 │ Strict Input Validation (Zod) │ 16 │ Privacy-Aware Telemetry & Scrubbing│
│ 07 │ Structured Output Validation  │ 17 │ Safe Fallback & Graceful Failure  │
│ 08 │ Consistent Error Semantics    │ 18 │ Observable Operations & Tracing   │
│ 09 │ Explicit State Transitions    │ 19 │ Strict Backward Compatibility     │
│ 10 │ Idempotency for Mutations     │ 20 │ Single Contract Ownership         │
└────┴───────────────────────────────┴────┴───────────────────────────────────┘
```

---

### Principle 01: API-First Contract Design
All endpoint interfaces, headers, request bodies, query parameters, response structures, and error codes are formally specified and versioned in machine-readable contracts (OpenAPI 3.1 & Zod schemas) before backend implementation begins. No engineer or agent may implement uncontracted endpoints.

### Principle 02: Server-Authoritative Identity
Caller identity is derived exclusively by the backend gateway through cryptographic verification of the RS256 JWT signature issued by Supabase Auth (`auth.uid()`). Client-supplied identity fields in request bodies or query parameters (`userId`, `profileId`, `ownerId`) are completely disregarded and stripped during input parsing.

### Principle 03: Explicit Authorization
Every protected endpoint must define an explicit authorization policy. Access is never granted by default; every request must satisfy explicit Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC) rules prior to executing domain logic.

### Principle 04: Resource Ownership Enforcement (Anti-BOLA / IDOR)
Every query and mutation touching a user-owned entity must verify that `resource.user_id === auth.uid()`. Cross-user access attempts must fail closed with standard `404 Not Found` (to prevent ID enumeration) or `403 Forbidden` according to security policy.

### Principle 05: Fail-Closed Security
If any security check, token verification, consent check, rate-limiting gate, or input validation step fails or encounters an unhandled runtime exception, the request must immediately abort with an appropriate HTTP 4xx/5xx error. It must never fail open.

### Principle 06: Strict Input Validation
All incoming HTTP payloads must pass strict schema validation (Zod). Unknown, unwhitelisted, or malformed JSON fields are automatically rejected. SQL injection, XSS vectors, and malformed strings are sanitized at the gateway layer.

### Principle 07: Structured Output Validation
All responses returned to clients—including LLM generative outputs—must conform to strict, pre-compiled JSON schemas. Raw, unparsed markdown strings or unvalidated LLM output payloads are strictly forbidden from entering database persistence or client payloads.

### Principle 08: Consistent Error Semantics
All error responses adhere to a unified, RFC 7807-inspired JSON envelope (`{ code, message, details, requestId, retryable }`). HTTP status codes must strictly match standard semantic definitions (400, 401, 403, 404, 409, 422, 429, 500, 503).

### Principle 09: Explicit State Transitions
Domain entities with lifecycles (`analysis_jobs`, `captures`, `onboarding`, `routines`) operate as formal Finite State Machines (FSMs). Illegal or out-of-order state transitions (e.g., transitioning an analysis from `QUEUED` directly to `COMPLETED` without intermediate processing) are rejected with `409 Conflict`.

### Principle 10: Idempotency for Retry-Sensitive Mutations
All mutation endpoints subject to network retries (`POST /api/v1/analyses`, `POST /api/v1/reports`, `POST /api/v1/routines/items/:id/track`) require or support the standard `Idempotency-Key` HTTP header. Duplicate requests within a 120-second window return the cached response without re-executing expensive AI workloads.

### Principle 11: Explicit Asynchronous Semantics
Long-running AI, CV, or report generation workloads ($\ge 500\text{ ms}$) return `202 Accepted` with a tracking resource URL (`/api/v1/analyses/:id/status`). Synchronous execution of multi-second LLM or CV pipelines inside HTTP request-response cycles is strictly prohibited.

### Principle 12: Zero Direct Browser-to-AI Access
Client browsers and SPAs must never possess API keys or direct network connectivity to LLM providers (OpenAI, Anthropic), computer vision extractors, or external AI models. All AI interactions occur exclusively via authenticated, rate-limited backend workers.

### Principle 13: Zero Direct Browser-to-Vector DB Access
Client applications must never directly query `pgvector` or embedding storage. Semantic similarity lookups are encapsulated inside backend domain services that validate caller identity, intent, and classical knowledge filters.

### Principle 14: Zero Client-Controlled Authorization Identity
Headers like `X-User-Id`, `X-Admin-Override`, or query parameters claiming administrative privilege are treated as hostile untrusted inputs and ignored or rejected. Privilege escalation is blocked at the gateway.

### Principle 15: Versioned API Contracts
All public endpoints are explicitly namespaced under `/api/v1/`. Breaking contract changes require a new major version path (`/api/v2/`) and a formal 90-day deprecation notice. Non-breaking additive changes (new optional response fields) are permitted within `/api/v1/`.

### Principle 16: Privacy-Aware Telemetry & Scrubbing
Loggers, APM monitors, and exception trackers (Datadog, Sentry) must automatically redact passwords, auth tokens, HMAC signed URLs, raw base64 biometric images, and user-identifiable health vectors. IP addresses must be truncated to `/24` subnets.

### Principle 17: Safe Fallback & Graceful Failure
If an external AI dependency (e.g., OpenAI API outage) or semantic retrieval gate fails (e.g., $< 2$ vetted classical chunks), the system must execute an automated safe fallback—serving verified standard Ayurvedic lifestyle recommendations rather than terminating with an unhandled exception.

### Principle 18: Observable Operations & Tracing
Every request entering the backend receives a unique `X-Request-ID` and standard W3C `traceparent` header. Distributed traces track execution timing across the API gateway, database queries, vector searches, and AI inference.

### Principle 19: Strict Backward Compatibility Policy
No minor release or patch may remove fields, alter enum values, or change error formats consumed by active mobile or web client builds.

### Principle 20: Single Contract Ownership
Every API contract is owned by a specific bounded domain context (Identity, Capture, Analysis, Routine, Knowledge). Cross-domain mutations must interact via formal domain services rather than direct cross-table SQL writes.
