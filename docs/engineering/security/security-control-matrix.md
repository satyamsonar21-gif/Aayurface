# AayurFace — Security Architecture Specification
## Security Control Matrix & Traceability Backbone

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Security Architect, Requirements Architect, QA/Test Architect  

---

### 1. Control Traceability Framework

This matrix serves as the central traceability backbone, mapping every primary threat from the STRIDE model to its governing security requirement, architectural control, target component, future implementation milestone, and test verification suite:

| Threat ID & Name | Security Requirement ID | Target Architectural Control | Target Component | Implementation Milestone | Test Verification Suite | Target Evidence Standard |
|---|---|---|---|---|---|---|
| **TH-01: Identity Spoofing** | `SEC-AUTH-001` | Derive identity exclusively from verified JWT `auth.uid()`; reject body `userId`. | Edge Gateway (`/api/v1/*`) | Milestone 03 | `TST-SEC-05` (BOLA/Spoof Test) | Level 1: HTTP 403 test output log |
| **TH-02: Credential Stuffing** | `SEC-AUTH-002` | Supabase Auth bcrypt hashing + progressive exponential login delays. | Supabase Auth (`auth.users`) | Milestone 03 | `TST-SEC-01` (Auth Brute Force) | Level 1: Rate-limiting verification log |
| **TH-05: S3 Upload Forgery** | `SEC-STORAGE-001` | HMAC-SHA256 pre-signed PUT URLs with proposed 15m TTL. | Supabase Storage API | Milestone 08 | Direct S3 PUT without signature | Level 1: HTTP 403 Forbidden log |
| **TH-06: Snapshot Tampering** | `SEC-RLS-001` | PostgreSQL RLS policy disallowing UPDATE on `scan_results`. | PostgreSQL Engine | Milestone 04 | `TST-SEC-04` (Immutability Test) | Level 1: SQL UPDATE returns 0 rows |
| **TH-09: Prompt Injection** | `SEC-AI-003` | Delimiter fencing (`<user_concerns>`) + deterministic safety filter. | Edge AI Orchestrator | Milestone 12 | `TST-SEC-10` (Jailbreak Harness) | Level 1: Adversarial injection test report |
| **TH-10: Knowledge Poisoning** | `SEC-RAG-001` | Read-only RLS on `knowledge_chunks` + four-eyes expert sign-off. | PostgreSQL / Admin Portal | Milestone 10 | Consumer role INSERT attempt | Level 1: SQL permission denied error |
| **TH-11: Polyglot Upload** | `SEC-STORAGE-001` | Magic-byte verification (`FF D8 FF`) + canvas decode/re-encode. | Serverless Extraction Worker | Milestone 08 | `TST-SEC-08` (Polyglot Test) | Level 1: HTTP 415 error on upload |
| **TH-13: Consent Repudiation**| `SEC-PRIV-001` | Immutable append-only `consents` table with metadata hash. | PostgreSQL (`consents`) | Milestone 05 | Consent grant and inspect test | Level 1: SQL query confirming log record |
| **TH-17: Public S3 Exposure** | `SEC-STORAGE-001` | Private S3 bucket configuration (zero public reads). | Supabase Storage API | Milestone 08 | Direct unauthenticated HTTP GET | Level 1: S3 HTTP 403 response log |
| **TH-18: BOLA / IDOR Leak** | `SEC-AUTHZ-002` | Server identity derivation + PostgreSQL RLS + 404 mask. | PostgreSQL RLS / API | Milestone 04 & 11 | `TST-SEC-05` (BOLA Cross-Read) | Level 1: HTTP 404 anti-enumeration log |
| **TH-19: Secret Leak in Logs** | `SEC-OBS-001` | Pre-serialization regex redaction intercepting tokens/keys. | Central Logger (`logger.ts`) | Milestone 14 | `TST-SEC-14` (Redaction Test) | Level 1: Test log asserts `[REDACTED]` |
| **TH-20: Client Secret Leak** | `SEC-AUTH-001` | Pinned environment variables; zero service keys in Vite. | Build Pipeline (`vite.config.ts`) | Milestone 01 | `TST-SEC-01` (Bundle Scan) | Level 1: Bundle string audit report |
| **TH-23: Share Link Guessing**| `SEC-AUTHZ-002` | 256-bit cryptographic entropy tokens + hash-at-rest. | Edge API (`/share/*`) | Milestone 13 | High-volume 404 fuzzing test | Level 1: Zero successful brute-force hits |
| **TH-24: Biometric Log Leak** | `SEC-OBS-001` | Regex scrubber stripping `data:image/*` base64 strings. | Central Logger (`logger.ts`) | Milestone 14 | `TST-SEC-14` (Biometric Redact) | Level 1: Test asserts `[BIOMETRIC_REDACTED]` |
| **TH-25: Denial-of-Wallet** | `SEC-INFRA-002` | Sliding window rate limiter (proposed 5 analyses/user/hour). | Edge Function Middleware | Milestone 11 | `TST-SEC-07` (Rate Limit Test) | Level 1: HTTP 429 response on 6th request |
| **TH-30: Mass Assignment** | `SEC-AUTHZ-001` | Strict Zod input schema rejecting extraneous/privileged keys. | Edge Gateway Deserializer | Milestone 11 | `TST-SEC-06` (Mass Assignment) | Level 1: HTTP 422 Unprocessable Entity |
| **TH-35: Wildcard CORS** | `SEC-INFRA-001` | Production origin whitelist (`https://app.aayurface.in`). | Edge Gateway CORS Handler | Milestone 03 | Untrusted origin pre-flight | Level 1: Absence of allow-origin headers |
| **TH-38: Citation Fake** | `SEC-RAG-002` | Post-inference cross-check against retrieved chunk IDs. | AI Validation Gateway | Milestone 12 | `TST-SEC-11` (Citation Audit) | Level 1: Validator drops fabricated verses |
| **TH-43: Spoken Injection** | `SEC-VOICE-001` | Delimiter fencing + voice commands barred from mutations. | Client Web Speech / API | Milestone 15 | Voice mutation attempt test | Level 1: UI mandates manual screen tap |
| **TH-46: Admin Takeover** | `SEC-ADMIN-001` | Hardware-backed WebAuthn FIDO2 MFA on admin routes. | Supabase Auth / Admin Portal | Milestone 17 | Admin login without FIDO2 | Level 1: HTTP 401 MFA Challenge required |
| **TH-47: Deletion Failure** | `SEC-PRIV-002` | Asynchronous multi-service cascading purge state machine. | SRE Deletion Worker | Milestone 13 | `TST-SEC-13` (Purge Verification)| Level 1: DB and S3 zero-record query audit |
| **TH-49: Medical Diagnosis** | `SEC-AI-003` | Post-inference deterministic medical keyword safety filter. | Edge AI Service | Milestone 12 | `TST-SEC-10` (Medical Advice Test) | Level 1: Prescription terms blocked log |
| **TH-51: False Certainty** | `SEC-AI-002` | Harmonic agreement $A$; caps confidence $< 60\%$ on clash. | Multimodal Fusion Engine | Milestone 11 | Conflicting modality test | Level 1: Calibrated confidence capped < 60%|
