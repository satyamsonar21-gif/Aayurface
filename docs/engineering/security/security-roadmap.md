# AayurFace — Security Architecture Specification
## Phased Security Implementation Roadmap

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Security Architect, Platform/SRE Architect, Engineering Program Manager  

---

### 1. Phased Security Execution Blueprint

Security is not implemented as an isolated post-development hardening exercise. Security controls are systematically threaded into each sequential engineering milestone:

```text
MILESTONES 01-03: IDENTITY & PERIMETER FOUNDATION
• Decommission mock auth • Lockfile pinning • Origin whitelisting • RS256 JWTs

MILESTONES 04-06: DATA ISOLATION & KERNEL RLS
• PostgreSQL RLS on all tables • Unbundled consent ledger • Database pgcrypto

MILESTONES 07-09: BIOMETRIC INGESTION & OBJECT SECURITY
• Client Wasm gateway • S3 private bucket • Magic-byte check • HMAC-signed URLs

MILESTONES 10-12: AI INTEGRITY & PROMPT DEFENSE
• Read-only RAG store • Cosine threshold gate • Prompt fencing • Non-diagnostic filter

MILESTONES 13-14: PRIVACY, PURGE & PRE-LAUNCH HARDENING
• Cascading account purge • 256-bit share tokens • Logger redaction • Penetration test

MILESTONE 15+: ENTERPRISE GOVERNANCE & RESEARCH ISOLATION
• Voice privilege firewall • WebAuthn admin MFA • Double-blind research enclave
```

---

### 2. Milestone-to-Security-Control Mapping

| Engineering Milestone | Scheduled Target Controls | Governing Security Requirements | Target Deliverables & Artifacts |
|---|---|---|---|
| **Milestone 01: Core Architecture & Setup** | • Lockfile pinning (`npm ci`)<br/>• Secret scanning via Gitleaks pre-commit hooks<br/>• Environment variable quarantine (zero server secrets in Vite) | `SEC-INFRA-001`, `SEC-AUTH-001` | Clean CI security scan; verified bundle string audit. |
| **Milestone 02: Design System & UI** | • Content Security Policy (CSP) header definitions<br/>• Clickjacking protection (`frame-ancestors 'none'`)<br/>• DOM XSS prevention in Markdown renderers | `SEC-INFRA-001` | Tested CSP header configuration in edge proxy. |
| **Milestone 03: Authentication & Identity** | • Decommission `localStorage` mock authentication<br/>• Supabase Auth RS256 JWT verification at Edge Gateway<br/>• Server-side identity derivation (`auth.uid()`)<br/>• Origin whitelisting (decommission wildcard `*` CORS) | `SEC-AUTH-001`, `SEC-AUTH-002`, `SEC-INFRA-001` | Supabase Auth integration; automated brute-force tests. |
| **Milestone 04: Database & Kernel RLS** | • PostgreSQL Row-Level Security on 100% of user-owned tables<br/>• Atomic policy expressions `USING (auth.uid() = user_id)`<br/>• Decoupling: zero base64 images in database | `SEC-RLS-001`, `SEC-STORAGE-002` | Executed SQL migration script; multi-tenant RLS test suite. |
| **Milestone 05: Consent Ledger & Onboarding** | • Unbundled, versioned, revocable consent modal<br/>• Immutable append-only `consents` table with metadata hash | `SEC-PRIV-001` | Tested consent tracking service; legal compliance audit trail. |
| **Milestone 06: Questionnaire & Lifestyle** | • Zod payload schema validation on intake submissions<br/>• Scoped RLS policies for `questionnaire_responses` | `SEC-AUTHZ-001` | Strict API deserialization tests; injection prevention. |
| **Milestone 07: Client CV Quality Gateway** | • MediaPipe FaceMesh in browser WebAssembly RAM<br/>• Real-time pose, lighting, blur, and centering gating<br/>• Zero video frame persistence on disk | `SEC-CV-001` | Client Wasm finite state machine; degraded mode tests. |
| **Milestone 08: Secure Biometric Storage** | • Private S3 bucket configuration (zero public reads)<br/>• HMAC-SHA256 pre-signed PUT URLs (15m TTL)<br/>• Magic-byte verification + Canvas EXIF stripping<br/>• Biometric purge policy implementation (DEC-004) | `SEC-STORAGE-001`, `SEC-STORAGE-002` | Storage integration tests; polyglot upload rejection suite. |
| **Milestone 09: Vector Knowledge Store** | • `knowledge_chunks` table configuration in PostgreSQL<br/>• Public read-only RLS policy for application clients | `SEC-RAG-001` | RLS assertions verifying clients cannot write to knowledge store. |
| **Milestone 10: RAG Grounding & Safety Gate** | • Runtime cosine similarity threshold gate ($\ge 0.75$; matches $\ge 2$)<br/>• Fallback non-herb lifestyle advice handler | `SEC-RAG-002` | Automated retrieval test suite evaluating edge-case queries. |
| **Milestone 11: Multimodal Fusion & Limits** | • Harmonic agreement index $A$ calculation<br/>• Confidence capping ($< 60\%$) on conflicting inputs<br/>• Sliding window rate limiter (proposed 5 analyses/user/hour) | `SEC-AI-002`, `SEC-INFRA-002` | Fusion boundary tests; rate-limiting saturation test. |
| **Milestone 12: AI Reasoning & Guardrails** | • XML/Markdown delimiter prompt fencing (`<user_concerns>`)<br/>• Post-inference deterministic medical keyword safety filter<br/>• Zod schema output contract enforcement (fail-closed) | `SEC-AI-001`, `SEC-AI-002`, `SEC-AI-003` | Adversarial jailbreak harness evaluating 25+ injection strings. |
| **Milestone 13: History, Progress & Purge** | • Asynchronous cascading account deletion worker<br/>• Anonymous tombstone logging in WORM vault<br/>• 256-bit cryptographic entropy share tokens with hash-at-rest | `SEC-PRIV-002`, `SEC-AUTHZ-002` | Multi-service cascading purge verification suite. |
| **Milestone 14: Hardening & Pre-Launch Audit** | • Central logger automated regex redaction pipeline<br/>• Third-party external penetration testing execution<br/>• Disaster recovery backup roll-off & reconciliation drill | `SEC-OBS-001`, `SEC-AUTH-001` | Formal penetration test report; zero high/critical vulnerabilities. |
| **Milestone 15+: Voice, Admin & Research** | • Web Speech API ephemeral processing (zero audio egress)<br/>• WebAuthn FIDO2 MFA for administrative routes<br/>• Double-blind de-identified research enclave & RLS | `SEC-VOICE-001`, `SEC-ADMIN-001`, `SEC-RESEARCH-001` | Administrative access audit; research re-identification review. |
