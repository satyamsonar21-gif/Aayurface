# AayurFace — Security Architecture Specification
## Security Testing Strategy & Verification Taxonomy

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal QA/Test Architect, Security Architect, Lead Backend Architect  
**Implementation Constraint:** This document specifies the future security test taxonomy. Security test suite execution occurs in **MILESTONES 04, 11, AND 14**.  

---

### 1. Multi-Tier Security Testing Taxonomy

Security assurance requires continuous automated validation across unit, integration, end-to-end, and adversarial levels:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 1: CONTINUOUS STATIC & SUPPLY CHAIN SCANNING (CI/CD PR Gate)           │
│ • Secret Scanning (Gitleaks) • Dependency Vulnerability Audit (`npm audit`) │
│ • Static Application Security Testing (SAST via Oxlint security rules)      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ TIER 2: AUTOMATED DATABASE & KERNEL RLS FUZZING (Milestone 04)              │
│ • Automated multi-tenant cross-read assertions (User A selects User B rows) │
│ • Atomic policy constraint assertions (Immutable scan_results UPDATE drops)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ TIER 3: API, BOLA & INPUT INTEGRATION TESTS (Milestone 11)                   │
│ • BOLA / IDOR path tampering test suites (Assert HTTP 404 anti-enumeration)  │
│ • Mass-assignment payload injection tests (Disallow role elevation)         │
│ • Rate-limiting sliding window saturation tests (Assert HTTP 429)            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ TIER 4: ADVERSARIAL AI & PROMPT INJECTION HARNESS (Milestones 11 & 12)       │
│ • Direct jailbreak fuzzing (Evaluating 25+ prompt injection test strings)    │
│ • Output contract fuzzing (Asserting fail-closed on malformed LLM outputs)  │
│ • Cosine similarity RAG threshold gating verification                        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ TIER 5: PRIVACY & DELETION FORENSIC VERIFICATION (Milestone 14)             │
│ • Cascading deletion verification (Assert zero rows in DB, zero S3 objects) │
│ • Pre-serialization log redaction tests (Asserting zero base64/tokens logged)│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Concrete Security Test Suites Catalog

| Test Suite ID | Target Test Scope | Test Methodology & Execution Trigger | Target Pass Criteria | Implementation Milestone |
|---|---|---|---|---|
| **TST-SEC-01** | Secret Scanning | Gitleaks scanner running in GitHub Actions PR check. | Zero high-entropy keys or cloud credentials in git diff. | Milestone 01 |
| **TST-SEC-02** | Dependency Vulnerabilities | `npm audit --audit-level=high` in CI workflow. | Zero High or Critical CVSS vulnerabilities in dependencies. | Milestone 01 |
| **TST-SEC-03** | RLS Multi-Tenancy Isolation | Vitest integration suite executing multi-user SQL queries under separate JWT contexts. | User A query for User B records returns exactly 0 rows. | Milestone 04 |
| **TST-SEC-04** | Immutability Protection | SQL test executing UPDATE on `scan_results` and `consents`. | UPDATE returns 0 rows; database record remains unmodified. | Milestone 04 |
| **TST-SEC-05** | BOLA / IDOR Defense | API integration test sending authenticated requests for another user's UUID. | Server returns HTTP 404 Not Found (anti-enumeration mask). | Milestone 11 |
| **TST-SEC-06** | Mass Assignment Prevention | API test passing `{"role": "admin"}` in `PUT /api/v1/profile`. | Server returns HTTP 422; database role remains unchanged. | Milestone 11 |
| **TST-SEC-07** | Rate Limiting Enforcement | Script firing 10 consecutive analysis requests within 60 seconds. | Requests 1–5 return HTTP 200/202; requests 6–10 return HTTP 429. | Milestone 11 |
| **TST-SEC-08** | Polyglot File Rejection | Upload test submitting an executable disguised with JPEG headers. | Magic-byte inspector drops file; returns HTTP 415. | Milestone 08 |
| **TST-SEC-09** | EXIF Geolocation Stripping | Test inspecting uploaded frame with binary metadata extractor. | 100% of GPS coordinates, camera serials, and timestamps stripped. | Milestone 08 |
| **TST-SEC-10** | Prompt Injection Jailbreak | Adversarial suite submitting 25 jailbreak strings in `skin_concerns`. | 100% of outputs reject medical diagnosis; disclaimers preserved. | Milestone 12 |
| **TST-SEC-11** | Output Schema Compliance | Fuzzer passing malformed, non-JSON, or uncited mock LLM responses. | Parser fails closed; renders safe fallback Ayurvedic notice. | Milestone 12 |
| **TST-SEC-12** | RAG Cosine Threshold Gate | Retrieval test with irrelevant query (similarity < 0.75). | Generative herb synthesis aborted; safe fallback guidelines triggered. | Milestone 10 |
| **TST-SEC-13** | Cascading Account Purge | Test initiating account deletion; verifies S3 and DB state. | Zero records in profiles, scans, routines; zero objects in S3. | Milestone 13 |
| **TST-SEC-14** | Automated Telemetry Redaction | Unit test passing `{ password: 'foo', image: 'data:image/...' }` to logger. | Log output sanitizes values to `[REDACTED]` and `[BIOMETRIC_REDACTED]`. | Milestone 14 |
