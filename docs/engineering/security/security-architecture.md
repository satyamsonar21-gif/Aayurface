# AayurFace — Security Architecture Specification
## Enterprise Defense-in-Depth Security Architecture

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Security Architect, Platform/SRE Architect, Staff Backend Architect  
**Classification Notice:** Target Architecture Specification; Zero application code has been modified.  

---

### 1. Executive Summary & Security Philosophy

The AayurFace platform handles sensitive biometric facial data, Ayurvedic wellness assessments, daily lifestyle patterns, and longitudinal health timelines. Security is not an isolated component; it is an omnipresent architectural foundation built upon **Zero Trust** principles:
* **Perimeter Defense is Insufficient:** Every network request, inter-service boundary, and database transaction must independently verify identity, authorization, and data integrity.
* **Server-Side Identity Derivation:** Client-supplied identifiers (`request.body.userId`, query parameters) are strictly rejected as identity claims. User identity is derived exclusively from cryptographically verified JSON Web Tokens (`auth.uid()`).
* **Fail-Closed Default:** If authorization, schema validation, rate-limiting, or AI safety checks cannot be conclusively established, the system immediately terminates the transaction and logs an audit event.

---

### 2. Multi-Layered Defense-in-Depth Model

The platform enforces security across seven concentric defense rings:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ RING 1: CLIENT RUNTIME & BROWSER SANDBOX                                     │
│ • Volatile WebAssembly memory evaluation (MediaPipe FaceMesh in browser RAM) │
│ • Strict Content Security Policy (CSP), Referrer-Policy, Frame-Ancestors    │
│ • Zero local storage of raw biometric frames or plain-text passwords         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ TLS 1.3 / HTTPS
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ RING 2: NETWORK PERIMETER & WAF                                              │
│ • Origin whitelisting (Rejection of wildcard `*` CORS in production)         │
│ • Rate-limiting middleware (Proposed baseline: 5 analyses/user/hour)        │
│ • DDoS mitigation & HTTP request body size limits (max 5 MB for uploads)     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ RING 3: SERVERLESS API & AUTHENTICATION GATEWAY (Deno Edge Functions)        │
│ • Cryptographic RS256 JWT signature verification                             │
│ • Server-side identity extraction (`auth.uid()`)                             │
│ • Zod request payload schema validation & strict mass-assignment guards      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ RING 4: AI & ALGORITHMIC INTEGRITY GATEWAY                                   │
│ • Delimiter fencing (`<user_input>...</user_input>`) to prevent injection    │
│ • Grounded RAG retrieval gate (Cosine similarity >= 0.75; match count >= 2)  │
│ • Post-inference Zod schema validation & non-diagnostic safety guardrails   │
│ • Total AI privilege isolation (AI cannot directly execute DB writes/auth)   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ RING 5: OBJECT STORAGE BOUNDARY (Private S3 Buckets)                         │
│ • Zero public bucket reads (Direct HTTP GET returns 403 Forbidden)          │
│ • Ephemeral HMAC-signed upload/download URLs (Proposed 15-minute TTL)       │
│ • Tenant path isolation: `facial-captures/{userId}/{uuid}.jpg`              │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ RING 6: PERSISTENCE & DATABASE ENGINE (PostgreSQL 15+)                       │
│ • Kernel-enforced Row-Level Security (RLS) on 100% of user-owned tables      │
│ • Atomic isolation expressions (`USING (auth.uid() = user_id)`)             │
│ • Storage of derived numerical vectors only; no raw base64 images in DB      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ RING 7: OBSERVABILITY & AUDIT TRAIL                                          │
│ • End-to-end correlation tracking via `x-correlation-id`                     │
│ • Automated regex redaction of passwords, tokens, and base64 imagery         │
│ • Immutable write-once-read-many (WORM) audit logging for security events   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Core Architectural Security Invariants

1. **Identity Invariant:** Every authenticated endpoint must extract the caller's identity exclusively from the validated JWT claims (`auth.uid()`). Any client-supplied `userId` parameter in a request body or URL path must be strictly verified against `auth.uid()`. If mismatched, the server must reject the request with HTTP 403 or 404.
2. **Biometric Minimization Invariant:** Continuous camera video frames are processed ephemerally in client WebAssembly memory. Only a single quality-verified frame is uploaded to private storage via an ephemeral signed URL. The architecture supports hard-purging raw imagery post-extraction (DEC-004), retaining only derived numerical vectors.
3. **AI Untrusted Invariant:** Generative language models and computer vision pipelines are treated as untrusted computation layers. Models possess zero direct database write permissions, zero execution privileges, and must output strictly validated JSON adhering to predefined Zod schemas.
4. **Data Isolation Invariant:** Multi-tenancy is enforced at the PostgreSQL database engine kernel level via Row-Level Security. Application code bugs or compromised SQL parameters cannot leak cross-tenant records.
5. **Secret Isolation Invariant:** Production secrets (Supabase service-role keys, OpenAI API keys, storage signing secrets) reside exclusively in encrypted serverless environment vaults. Zero secrets are packaged into the frontend client bundle.
