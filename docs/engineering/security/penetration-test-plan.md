# AayurFace — Security Architecture Specification
## External Penetration Testing Plan & Vulnerability Assessment

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Security Architect, Compliance Lead  
**Execution Notice:** This document establishes the scope, rules of engagement, and attack vectors for a third-party penetration test scheduled for **MILESTONE 14 (FUTURE VALIDATION)** prior to public commercial launch.  

---

### 1. Scope & Rules of Engagement

* **Target Systems in Scope:**
  * Production Staging Web Application: `https://staging.app.aayurface.in`
  * Serverless Edge API Endpoints: `/api/v1/*`
  * Authentication & Session Infrastructure: Supabase Auth endpoints
  * Private Object Storage: Supabase S3 bucket `facial-captures`
  * PostgreSQL Relational Database & `pgvector` store (RLS multi-tenancy)
  * AI & RAG Orchestration pipelines
* **Out of Scope (Excluded):**
  * Direct physical attacks on AWS/Supabase cloud datacenters
  * Volumetric volumetric network DDoS attacks exceeding 10 Gbps
  * Social engineering or phishing targeting company employees
* **Testing Window:** Pre-launch hardening phase (Milestone 14).

---

### 2. Penetration Testing Attack Vector Matrix

| Attack Category | Specific Penetration Test Scenario | Target Security Barrier Being Tested | Expected System Defense Behavior |
|---|---|---|---|
| **Reconnaissance & OSINT** | Subdomain enumeration, public bucket discovery, directory brute-forcing. | S3 private bucket policy; edge routing masks. | Direct bucket queries return HTTP 403; internal admin routes invisible. |
| **Authentication Attacks** | Credential stuffing, brute-forcing login endpoints, token replay, expired JWT re-use. | Supabase Auth progressive delays; RS256 token signature & expiration checks. | IP throttled with HTTP 429; expired/tampered JWTs rejected with HTTP 401. |
| **BOLA / IDOR Attacks** | Authenticated User A attempting to fetch User B's `/analysis/{id}` and `/profile/{id}`. | Server-side identity extraction; PostgreSQL kernel Row-Level Security. | Server returns HTTP 404 Not Found; zero cross-tenant data returned. |
| **File Upload Exploits** | Submitting polyglot JPEGs containing PHP/JS; submitting 50 MB pixel bombs; path traversal. | Magic-byte validator; 5 MB size gate; Canvas re-encoder; UUID path isolation. | File dropped; HTTP 413/415 returned; zero executable script persistence. |
| **Direct Prompt Injection** | Submitting adversarial jailbreak strings to force the LLM to emit prescription drugs or diagnose diseases. | Delimiter fencing (`<user_concerns>`); post-inference Zod schema; deterministic medical keyword filter. | AI output scrubbed or rejected; safe generic Ayurvedic fallback rendered. |
| **RAG Poisoning / Injection** | Attempting to execute prompt injection through search queries or custom input strings into the vector store. | Read-only permissions on `knowledge_chunks`; cosine similarity threshold gate. | Injected strings cannot mutate vector store; irrelevant queries fail similarity gate. |
| **Mass Assignment** | Submitting `{"role": "admin"}` or `{"is_verified": true}` in profile update payloads. | Strict Zod input schemas; database RLS disallowing mutation of privileged fields. | Server rejects payload with HTTP 422; database role remains `authenticated`. |
| **Share Link Enumeration** | Automated brute-force guessing of shared report URLs (`/share/{token}`). | 256-bit cryptographic entropy tokens; database hash-at-rest (`token_hash`). | Mathematically zero successful guesses; rate-limiting blocks rapid attempts. |
| **Biometric Image Access** | Attempting to forge S3 pre-signed upload or download URLs without valid HMAC secrets. | HMAC-SHA256 signature verification with millisecond timestamp expiration. | S3 storage engine returns HTTP 403 Forbidden on invalid or expired signatures. |
| **Privilege Escalation** | Standard consumer user attempting to invoke administrative endpoints (`/api/v1/admin/*`). | Role-Based Access Control middleware verifying `app_metadata.role = 'admin'`. | Server returns HTTP 403 Forbidden; logs high-severity `AUTHZ_DENIED` event. |
