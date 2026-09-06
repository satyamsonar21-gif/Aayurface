# AayurFace — Security Architecture Specification
## Third-Party Vendor Boundaries & External Dependency Security

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Security Architect, Platform Architect, Privacy Officer  
**Compliance Notice:** Third-party cloud vendor security postures reflect published vendor architecture commitments; **FORMAL VENDOR RISK ASSESSMENTS & ENTERPRISE CONTRACTS REQUIRED**.  

---

### 1. Vendor Boundary Architecture

AayurFace leverages managed cloud platforms and external services to minimize infrastructure operational overhead. Every external integration is assigned a strict trust boundary:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ TRUSTED APPLICATION PERIMETER (AayurFace Controlled)                         │
│ • Client Browser Runtime (React SPA + MediaPipe Wasm)                       │
│ • Serverless Edge Functions (Deno Runtime)                                  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Scoped HTTPS API Integrations
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ EXTERNAL CLOUD ENCLAVES & SERVICE PROVIDERS                                 │
│ [1. Supabase (AWS)] ── Managed Auth, PostgreSQL 15+, pgvector, S3 Storage    │
│ [2. OpenAI Inc.]    ── Foundation Inference (GPT-4o) & Vector Embeddings    │
│ [3. Google Identity]── OAuth 2.0 PKCE Federated Authentication Gateway       │
│ [4. Resend / SMTP]  ── Transactional Verification Emails & Password Resets   │
│ [5. Observability]  ── Distributed Error Tracing & Telemetry (Sentry / Datadog)│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Comprehensive Third-Party Boundary Matrix

| Vendor / Provider | External Component | Data Sent to Provider | Processing Purpose | Trust Level | Primary Security Risk | Target Failure Behavior | Data Retention Standard |
|---|---|---|---|---|---|---|---|
| **Supabase Inc. (AWS us-east-1)** | PostgreSQL DB & Storage Engine | Profile metadata, hashed passwords, encrypted S3 biometrics, RLS tables. | Primary relational data store, auth provider, private S3 object storage. | **HIGH (Platform Partner)** | Database outage; misconfigured RLS policy leaking cross-tenant data. | Circuit breaker returns HTTP 503; client displays offline maintenance card. | Governed by platform retention rules & 30-day encrypted backup rotation. |
| **OpenAI Inc. (US Cloud)** | GPT-4o API & `text-embedding-3-small` | Sanitized user skin concerns, fused dosha scores, classical verse context. | Grounded generative explanation synthesis and knowledge vectorization. | **RESTRICTED ENCLAVE** | Upstream prompt leakage, model downtime, unexpected model behavioral shift. | Circuit breaker trips to OPEN on 5 timeouts; system serves verified fallback notice. | Enterprise Zero Data Retention (ZDR) agreement; prompts not used for model training. |
| **Google LLC** | Google Identity (OAuth 2.0 PKCE) | Email address, OAuth code challenge. | Federated single-click consumer authentication. | **TRUSTED AUTH** | IdP outage blocking user logins; account linking confusion. | Fallback to email/password authentication. | Governed by Google Identity privacy terms. |
| **Google MediaPipe** | Wasm Binary (`@mediapipe/face_mesh`) | **ZERO DATA SENT.** Runs 100% locally in client browser WebAssembly RAM. | Real-time 468 landmark detection, illumination, blur, and centering gating. | **LOCAL COMPUTATION** | Wasm compilation failure on legacy mobile browsers; package supply chain bug. | Client detects Wasm load error; falls back to manual retry guide. | Zero retention (Frames never leave client device memory). |
| **Resend / Postmark** | Transactional Email API | User email, verification link token. | Password resets, account confirmation links. | **RESTRICTED COMM** | Email interception, phishing spoofing. | Auth engine logs delivery failure; user prompted to retry. | Ephemeral transit; zero health data sent in email bodies. |
| **Sentry / APM Provider** | Observability & Error Tracking | Scrubbed JSON error traces, correlation IDs, HTTP status codes. | Operational monitoring, distributed performance tracing, crash diagnostics. | **RESTRICTED TELEMETRY**| Accidental PII or base64 biometric leakage into stack traces. | Logger drops events if telemetry provider is unreachable; does not block user flow. | Automated PII redaction pipeline filters out tokens, passwords, and biometrics. |
