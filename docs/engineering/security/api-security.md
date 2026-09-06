# AayurFace — Security Architecture Specification
## REST API Security, BOLA/IDOR Defense & Mass Assignment Prevention

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Staff Backend Architect, Principal Security Architect, API Lead  

---

### 1. API Attack Surface & Perimeter Defense

All backend capabilities in AayurFace are exposed exclusively via RESTful HTTPS APIs versioned under `/api/v1/...` hosted on Supabase Edge Functions (Deno runtime):

```text
Client Request ──► [1. TLS 1.3 Termination]
                         │
                         ▼
                   [2. Origin & CORS Filter] (Whitelist: https://app.aayurface.in)
                         │
                         ▼
                   [3. Rate Limiting Middleware] (Proposed: 5 analyses/user/hour)
                         │
                         ▼
                   [4. Cryptographic JWT Verification] (Derive `auth.uid()`)
                         │
                         ▼
                   [5. Zod Schema Validation & Mass-Assignment Stripper]
                         │
                         ▼
                   [6. Idempotency Key Gate] (Header: `Idempotency-Key: <UUID>`)
                         │
                         ▼
                   [7. Domain Service Execution & PostgreSQL Kernel RLS]
```

---

### 2. Broken Object Level Authorization (BOLA / IDOR) Defense

BOLA (OWASP API Security #1) is the highest-risk vulnerability in modern API architectures, where an attacker modifies an object identifier in a request (e.g., changing `/api/v1/analysis/111` to `/api/v1/analysis/222`) to view or mutate another tenant's sensitive health records.

#### Mandatory Four-Tier BOLA Defense:
1. **Never Accept `userId` from Request Body:** The server strictly ignores or rejects any `userId` passed in request payloads. The active user ID is derived solely from the validated JWT token (`auth.uid()`).
2. **Explicit Server-Side Ownership Assertion:** In application service code, resource queries must always include an explicit tenant filter:
   ```typescript
   // Target Implementation Standard (Milestone 03)
   const { data, error } = await supabase
     .from('scan_results')
     .select('*')
     .eq('id', resourceId)
     .eq('user_id', authUserId) // Strict Ownership Assertion
     .single();
   ```
3. **Database Kernel RLS Enforcement:** Even if a developer forgets the `.eq('user_id', authUserId)` filter in application code, PostgreSQL Row-Level Security independently drops unauthorized rows at the engine kernel level.
4. **Anti-Enumeration 404 Response:** If User A attempts to request User B's resource ID, the API returns `HTTP 404 Not Found` (never `403 Forbidden`). This conceals the existence of other users' records and thwarts brute-force UUID enumeration.

---

### 3. Mass Assignment Prevention Architecture

Mass assignment occurs when client requests bind un-sanitized JSON properties directly to internal database entity models (e.g., an attacker submitting `{"role": "admin", "is_verified": true}` during a profile update).

#### Defense Standards:
1. **Strict Zod Deserialization:** Every endpoint defines an explicit Zod input schema using `.strict()`, which rejects requests containing unexpected or extraneous fields:
   ```typescript
   // Example Profile Update Schema
   export const UpdateProfileSchema = z.object({
     full_name: z.string().min(2).max(100).optional(),
     language_preference: z.enum(['en', 'hi']).optional(),
     skin_concerns: z.array(z.string()).max(5).optional(),
   }).strict(); // REJECTS unknown keys like 'role' or 'user_id'
   ```
2. **Server-Controlled Fields Allowlist:** Privileged columns (`role`, `is_verified`, `id`, `created_at`, `user_id`) are immutable from client endpoints. Any mutation of these fields requires a dedicated internal service-role administrative process.

---

### 4. Comprehensive API Security Control Matrix

| Threat Category | Attack Scenario | Target Architectural Mitigation | Verification Method |
|---|---|---|---|
| **BOLA / IDOR** | Attacker accesses User B's scan result by altering URL UUID. | Identity derived from JWT; SQL filter `user_id = auth.uid()`; RLS enforcement; HTTP 404 anti-enumeration mask. | Automated BOLA test suite: User A calls User B's scan ID; asserts HTTP 404. |
| **Mass Assignment** | Attacker injects `role: 'admin'` in profile update JSON. | Strict Zod schema strips unwhitelisted fields; database RLS disallows updating `role`. | Automated API fuzzing passing privileged keys; asserts HTTP 422 Unprocessable Entity. |
| **Wildcard CORS** | Malicious site executes cross-origin authenticated fetch. | Strict CORS whitelist (`https://app.aayurface.in`); wildcard `*` strictly blocked in production. | Pre-flight `OPTIONS` verification from untrusted origin asserts absence of allow headers. |
| **Network Replay / Flaky Retries** | Network drops cause client to fire duplicate analysis requests. | `Idempotency-Key` header (UUIDv4) stored with cached response for 120 seconds. | Submitting identical request with same idempotency key returns cached result; does not duplicate AI inference. |
| **Denial-of-Wallet (AI API Abuse)** | Attacker scripts 1,000 rapid analysis calls to deplete OpenAI credits. | Rate-limiting middleware enforcing proposed baseline of 5 analyses/user/hour via sliding window. | Load test firing 10 rapid calls; asserts HTTP 429 Too Many Requests on 6th attempt. |
| **Verbose Error Leakage** | Database failure returns raw SQL stack trace containing table names. | RFC 7807 standard error envelopes; raw internal errors logged to SIEM but masked to client. | Synthetic database error injection asserts client receives clean generic RFC 7807 problem details. |
| **Payload Bombs** | Attacker transmits 100 MB JSON payload to crash edge workers. | Edge Gateway enforces strict `Content-Length <= 1048576` (1 MB for JSON; 5 MB for image uploads). | Sending a 10 MB payload returns HTTP 413 Payload Too Large immediately at edge. |
