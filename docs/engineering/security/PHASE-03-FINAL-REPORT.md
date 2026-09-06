# AayurFace — Phase 03 Final Security Architecture Report
## Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Execution Date:** 2026-09-03  
**Mode:** STRICT SECURITY ARCHITECTURE / THREAT MODELING / DOCUMENTATION ONLY  
**Implementation Status:** NO CODE IMPLEMENTED (Strict Architecture & Threat Modeling Contract)  
**Gate Status:** PHASE 03 — CONDITIONAL PASS  

---

### Table of Contents (51 Required Sections)

1. [Executive Summary](#1-executive-summary)
2. [Security Philosophy & Invariants](#2-security-philosophy--invariants)
3. [Security Posture Baseline (Phase 00 Reconciliation)](#3-security-posture-baseline-phase-00-reconciliation)
4. [Complete Security Asset Inventory Summary](#4-complete-security-asset-inventory-summary)
5. [Formal Data Classification Architecture](#5-formal-data-classification-architecture)
6. [Trust Boundaries & Enclave Model](#6-trust-boundaries--enclave-model)
7. [Identity & Authentication Architecture](#7-identity--authentication-architecture)
8. [Authorization, RBAC & Permissions Architecture](#8-authorization-rbac--permissions-architecture)
9. [Strict Resource Ownership Architecture](#9-strict-resource-ownership-architecture)
10. [PostgreSQL Row-Level Security (RLS) Architecture](#10-postgresql-row-level-security-rls-architecture)
11. [Object Storage Security Architecture](#11-object-storage-security-architecture)
12. [Biometric Facial Data Protection Architecture](#12-biometric-facial-data-protection-architecture)
13. [Privacy by Design Architecture](#13-privacy-by-design-architecture)
14. [Granular Consent Architecture](#14-granular-consent-architecture)
15. [Data Retention Architecture](#15-data-retention-architecture)
16. [Cascading Deletion Architecture](#16-cascading-deletion-architecture)
17. [REST API Security & BOLA/IDOR Defense](#17-rest-api-security--bolaidor-defense)
18. [Mass Assignment Defense Architecture](#18-mass-assignment-defense-architecture)
19. [Frontend & Browser Security Architecture](#19-frontend--browser-security-architecture)
20. [File Upload Security Architecture](#20-file-upload-security-architecture)
21. [AI Threat Model & Defense Architecture](#21-ai-threat-model--defense-architecture)
22. [Direct & Indirect Prompt Injection Defense](#22-direct--indirect-prompt-injection-defense)
23. [Classical Knowledge RAG Security Architecture](#23-classical-knowledge-rag-security-architecture)
24. [Computer Vision Security Architecture](#24-computer-vision-security-architecture)
25. [Conversational Voice Security Architecture](#25-conversational-voice-security-architecture)
26. [PDF Export & Public Sharing Token Security](#26-pdf-export--public-sharing-token-security)
27. [Administrative Security & Governance](#27-administrative-security--governance)
28. [Clinical Research Platform Security Architecture](#28-clinical-research-platform-security-architecture)
29. [Secrets Management & Cryptographic Key Lifecycle](#29-secrets-management--cryptographic-key-lifecycle)
30. [Software Supply Chain & Build Security](#30-software-supply-chain--build-security)
31. [Security Observability & Data Redaction Architecture](#31-security-observability--data-redaction-architecture)
32. [Security Incident Response Architecture](#32-security-incident-response-architecture)
33. [Security Testing Strategy & Taxonomy](#33-security-testing-strategy--taxonomy)
34. [External Penetration Testing Plan](#34-external-penetration-testing-plan)
35. [Third-Party Cloud Boundaries Architecture](#35-third-party-cloud-boundaries-architecture)
36. [Comprehensive STRIDE Threat Model Summary](#36-comprehensive-stride-threat-model-summary)
37. [Formal Security Requirements Catalog](#37-formal-security-requirements-catalog)
38. [Security Acceptance Criteria Summary](#38-security-acceptance-criteria-summary)
39. [Security Control Matrix Summary](#39-security-control-matrix-summary)
40. [Security Risk Register Summary](#40-security-risk-register-summary)
41. [Phased Security Roadmap Mapping](#41-phased-security-roadmap-mapping)
42. [Security Decision Backlog (SEC-DEC-001 through SEC-DEC-010)](#42-security-decision-backlog-sec-dec-001-through-sec-dec-010)
43. [Open Technical Decisions Reconciliation](#43-open-technical-decisions-reconciliation)
44. [Legal & Regulatory Compliance Statements](#44-legal--regulatory-compliance-statements)
45. [Codebase Preservation Verification](#45-codebase-preservation-verification)
46. [Phase Gate Assessment & Justification](#46-phase-gate-assessment--justification)
47. [Known Limitations & Architectural Debt](#47-known-limitations--architectural-debt)
48. [Recommendations for Phase 04 / Future Milestones](#48-recommendations-for-phase-04--future-milestones)
49. [Phase 03 Sign-Off Block](#49-phase-03-sign-off-block)
50. [Appendix A: Security Acronyms & Definitions](#50-appendix-a-security-acronyms--definitions)
51. [Appendix B: Security Architecture Artifacts Manifest](#51-appendix-b-security-architecture-artifacts-manifest)

---

### 1. Executive Summary

Phase 03 transforms the architectural foundation established in Phase 02 into an enterprise-grade, defense-in-depth **Security, Privacy, Threat Modeling, and AI Safety Architecture**. Operating under a strict documentation-only mandate, the engineering organization has delivered 40 formal security specifications and 12 visual Mermaid diagrams without altering a single line of production source code or database migrations.

The architecture directly tackles the unique threat profile of AayurFace: handling high-sensitivity facial biometric captures, derived phenotypic feature vectors, Ayurvedic constitutional health records, and non-deterministic foundation model reasoning. The architecture formally deprecates the prototype's insecure `localStorage` mock auth and wildcard CORS in favor of cryptographic RS256 JWTs, PostgreSQL kernel Row-Level Security (RLS), private S3 bucket storage with HMAC-signed URLs, client WebAssembly landmark quality gating, delimiter-fenced prompt isolation, and an immutable WORM audit trail.

---

### 2. Security Philosophy & Invariants

The security architecture is governed by five absolute engineering axioms:
1. **Never Trust the Client:** The client browser, mobile webview, and DOM are treated as untrusted, hostile environments. All business invariants, ownership validations, and schemas are enforced on the server.
2. **Never Trust Client-Supplied Identity:** The server **NEVER** utilizes `request.body.userId`, URL parameters, or client headers as the source of identity. Identity is derived exclusively from cryptographically verified server-side JWT claims (`auth.uid()`).
3. **Never Trust AI Output:** Foundation models are treated as untrusted computational enclaves. Model outputs must pass strict Zod schema parsing and deterministic non-diagnostic keyword safety checks before presentation.
4. **Never Trust Uploaded Assets:** File uploads undergo client-side EXIF stripping, server-side magic-byte inspection (`FF D8 FF`), dimension limits, and storage isolation with ephemeral HMAC signatures.
5. **Fail-Closed Default:** In any situation where identity, authorization, schema compliance, or rate limits cannot be positively established, the system immediately aborts the transaction with an explicit error and records an audit event.

---

### 3. Security Posture Baseline (Phase 00 Reconciliation)

The Phase 00 reconnaissance revealed severe security vulnerabilities in the existing prototype that are formally logged as **CURRENT SECURITY WEAKNESSES**:
* `src/contexts/AuthContext.tsx`: Mock authentication stores unhashed credentials and plain-text JSON in browser `localStorage`, performs zero password verification, and trusts client identity claims.
* `supabase/functions/analyze-skin/index.ts`: Edge function enforces wildcard `Access-Control-Allow-Origin: *`, allows unauthenticated invocations, reads `userId` directly from the request body, and calls OpenAI GPT-4o without rate limiting or schema validation.
* `supabase/functions/ayurveda-chat/index.ts`: Wildcard CORS, no JWT signature verification.
* `supabase/schema.sql`: 7 relational tables created with zero Row-Level Security (`ENABLE ROW LEVEL SECURITY` missing from 100% of tables).
* **Target Posture:** Phase 03 replaces all five weaknesses with formal architectural designs scheduled for implementation in Milestones 01, 03, 04, and 08.

---

### 4. Complete Security Asset Inventory Summary

The platform defines and governs 24 discrete security assets categorized across eight domains ([`asset-inventory.md`](file:///D:/Project%20Aayurface/docs/engineering/security/asset-inventory.md)):
* **Identity Assets:** `AST-ID-01` (Email Address), `AST-ID-02` (Password Hash), `AST-ID-03` (Access Token JWT), `AST-ID-04` (Refresh Token).
* **Profile Assets:** `AST-PR-01` (User Profile Data), `AST-PR-02` (User Consent Record).
* **Wellness Assets:** `AST-WL-01` (15-Q Intake Answers), `AST-WL-02` (Lifestyle Context), `AST-WL-03` (Daily Routines), `AST-WL-04` (Routine Adherence).
* **Visual Assets:** `AST-VS-01` (Raw Facial Capture), `AST-VS-02` (Derived Visual Observations Vector), `AST-VS-03` (Capture Quality Metrics).
* **AI Assets:** `AST-AI-01` (Master System Prompt), `AST-AI-02` (Analysis Result Snapshot), `AST-AI-03` (Classical Verses RAG Chunks).
* **Research Assets:** `AST-RS-01` (Research Subject Record), `AST-RS-02` (Expert Consensus Annotations).
* **Security Assets:** `AST-SC-01` (Supabase Service Role Key), `AST-SC-02` (OpenAI API Key), `AST-SC-03` (Storage Signing Secret).
* **Operational Assets:** `AST-OP-01` (Structured App Logs), `AST-OP-02` (Security Audit Trail), `AST-OP-03` (Database Encrypted Backups).

---

### 5. Formal Data Classification Architecture

Data assets are organized into five distinct sensitivity tiers ([`data-classification.md`](file:///D:/Project%20Aayurface/docs/engineering/security/data-classification.md)):
* **Tier 5: Highly Sensitive:** Raw Facial Images (`facial-captures/`), Password Hashes (bcrypt), Platform Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`). Strict RAM minimization, zero public reads, zero logging.
* **Tier 4: Sensitive Personal & Wellness Data:** Derived Visual Observations vectors, 15-Question Intake answers, Lifestyle Context, `scan_results` history, User Profile, Consent logs. Mandatory PostgreSQL RLS, TLS 1.3 in-transit encryption.
* **Tier 3: Confidential Business & Research Data:** Double-blind expert annotations, system prompts, security audit logs. RBAC access control, FIDO2 admin MFA, WORM audit vaults.
* **Tier 2: Internal Operational Data:** Routine adherence checkboxes, capture gateway quality metrics, anonymized APM traces. Internal correlation IDs, standard authentication.
* **Tier 1: Public / Vetted Domain Data:** Classical Ayurvedic verses (`knowledge_chunks`), public landing pages, Terms & Privacy Policy, non-diagnostic disclaimers. Public read access, CDN edge caching.
* *Legal Classification Notice:* Statutory classifications under DPDP Act 2023 / GDPR Article 9 are marked **REQUIRES LEGAL REVIEW**.

---

### 6. Trust Boundaries & Enclave Model

Twelve explicit trust boundaries are defined and threat-modeled ([`trust-boundaries.md`](file:///D:/Project%20Aayurface/docs/engineering/security/trust-boundaries.md), [`diagrams/trust-boundaries.mmd`](file:///D:/Project%20Aayurface/docs/engineering/security/diagrams/trust-boundaries.mmd)):
* `TB-01`: User ↔ Browser Runtime (DOM/Wasm isolation, CSP, ephemeral frame memory).
* `TB-02`: Browser ↔ API Edge Functions (TLS 1.3, RS256 JWT, origin whitelisting, rate limiting).
* `TB-03`: Browser ↔ Private Storage S3 (HMAC-SHA256 pre-signed PUT URLs, 15m TTL, max 5 MB).
* `TB-04`: API Gateway ↔ Database Persistence (PostgreSQL RLS, `auth.uid() = user_id`, connection pooling).
* `TB-05`: API Gateway ↔ Private Storage Management (Least-privilege S3 IAM roles, automated lifecycle rules).
* `TB-06`: API Gateway ↔ External AI (OpenAI Zero Data Retention agreement, stateless payloads).
* `TB-07`: AI Orchestrator ↔ RAG Knowledge Base (Read-only `knowledge_chunks`, cosine threshold $\ge 0.75$).
* `TB-08`: AI Engine ↔ Untrusted User Content (XML delimiter fencing, post-inference safety scanner).
* `TB-09`: Administrator ↔ Administrative Operations (FIDO2 MFA, VPN CIDR allowlist, WORM audit log).
* `TB-10`: Research Platform ↔ Research Subjects (Double-blind annotation, de-identification, masked ROIs).
* `TB-11`: Application ↔ Dependencies (Lockfile pinning `npm ci`, automated Dependabot, SBOM).
* `TB-12`: Application ↔ Observability (Pre-serialization regex redaction of base64, tokens, passwords).

---

### 7. Identity & Authentication Architecture

Supabase Auth is selected as the managed identity provider ([`identity-authentication.md`](file:///D:/Project%20Aayurface/docs/engineering/security/identity-authentication.md)):
* Password hashing uses **bcrypt** (work factor $\ge 10$) managed by PostgreSQL `pgcrypto`.
* User sessions utilize asymmetric **RS256 JWTs** (60-minute TTL) containing `sub = userId` and `role = authenticated`.
* Opaque 256-bit refresh tokens feature automatic single-use rotation and replay detection.
* Brute-force and credential-stuffing defenses enforce progressive exponential delays and a 15-minute account lock after 5 consecutive failed login attempts.

---

### 8. Authorization, RBAC & Permissions Architecture

Authorization evaluates role, resource ownership, and active consent ([`authorization-rbac.md`](file:///D:/Project%20Aayurface/docs/engineering/security/authorization-rbac.md)):
* Roles: `anon`, `authenticated`, `admin`, `researcher`.
* Being "authenticated" grants access strictly to one's own data (`auth.uid() = user_id`).
* Administrative endpoints require verified `admin` role and hardware MFA.
* Research annotators access double-blind queues restricted to masked ROIs.

---

### 9. Strict Resource Ownership Architecture

The platform enforces the **Server-Side Identity Derivation Invariant** ([`resource-ownership.md`](file:///D:/Project%20Aayurface/docs/engineering/security/resource-ownership.md)):
* API endpoints reject or ignore client-supplied `userId` parameters.
* Target user identity is derived solely from the cryptographically verified JWT token claim (`auth.uid()`).
* Cross-tenant read attempts return **HTTP 404 Not Found** (anti-enumeration mask) to prevent resource ID enumeration.

---

### 10. PostgreSQL Row-Level Security (RLS) Architecture

Kernel-level multi-tenancy is enforced on all user-owned tables ([`rls-security-model.md`](file:///D:/Project%20Aayurface/docs/engineering/security/rls-security-model.md)):
* `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` enforced across 100% of user-owned tables (`profiles`, `consents`, `questionnaire_responses`, `lifestyle_contexts`, `captures`, `scan_results`, `routines`, `routine_tracking`).
* Atomic scalar policy expression: `USING (auth.uid() = user_id)`.
* `scan_results` and `consents` tables disallow UPDATE operations (immutable append-only history).
* *Status:* Target architectural design; migration and verification pending in Milestone 04.

---

### 11. Object Storage Security Architecture

Private S3 bucket storage eliminates public image scraping ([`object-storage-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/object-storage-security.md)):
* Direct unauthenticated HTTP GET requests return `403 Forbidden`.
* Ingestion uses HMAC-SHA256 pre-signed PUT URLs with proposed 15-minute TTL (SEC-DEC-003).
* Tenant path isolation strictly enforces prefix `facial-captures/{auth.uid()}/{captureId}.jpg`.
* Automated daily worker hard-purges orphaned uploads older than 24 hours.

---

### 12. Biometric Facial Data Protection Architecture

Facial imagery is treated as Highly Sensitive personal data ([`facial-data-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/facial-data-security.md)):
* Continuous video streams execute exclusively in client WebAssembly RAM.
* Single approved frame is frozen, stripped of EXIF/geolocation metadata, and uploaded via signed URL.
* Serverless worker extracts numerical `VisualObservations` vector and decouples it from raw pixels.
* Raw facial capture is hard-purged post-extraction or retained for rolling 30 days under DEC-004.
* Central logger enforces regex sanitizer blocking base64 image strings (`[BIOMETRIC_DATA_REDACTED]`).

---

### 13. Privacy by Design Architecture

Privacy by Design is foundational ([`privacy-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/security/privacy-architecture.md)):
* Implements data minimization, purpose limitation, storage limitation, and user agency.
* Supports statutory rights: Right to Notice, Right to Access & Portability, Right to Correction, Right to Revoke Consent, and Right to Erasure.
* Notice statement: *Designed to support applicable privacy and data-protection obligations; formal legal review required.*

---

### 14. Granular Consent Architecture

Consent is collected unbundled without coercion ([`consent-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/security/consent-architecture.md)):
* Independent toggles for: Biometric Facial Analysis, Routine & History Storage, Ayurvedic Research Sharing, Routine Reminders.
* Stored in append-only `consents` table with policy version, timestamp, status, and client metadata hash.
* Revoking biometric consent triggers immediate purge of stored facial imagery and blocks future scans.

---

### 15. Data Retention Architecture

Formal retention schedule established across all 15 asset categories ([`retention-deletion.md`](file:///D:/Project%20Aayurface/docs/engineering/security/retention-deletion.md)):
* Account, Profile, Routines, and Scan History retained for active account lifespan.
* Biometric facial images subject to OPEN DECISION (DEC-004: Immediate purge vs rolling 30 days).
* PDF reports cached for proposed 7 days; shared report tokens default to 7 days.
* Application logs retained 30 days rolling; security WORM audit logs retained 365 days minimum.

---

### 16. Cascading Deletion Architecture

Account erasure executes via an asynchronous idempotent state machine ([`retention-deletion.md`](file:///D:/Project%20Aayurface/docs/engineering/security/retention-deletion.md)):
* Step 1: User re-authenticates with password/OAuth.
* Step 2: Account marked `PENDING_DELETION`; active sessions invalidated.
* Step 3: Worker deletes S3 facial images in `facial-captures/{userId}/*` and PDF reports.
* Step 4: Worker executes cascading SQL deletion (`DELETE FROM auth.users WHERE id = userId`).
* Step 5: Anonymous tombstone logged to WORM vault: `{ tenant_hash, timestamp }`.
* Backup reconciliation script prevents deleted accounts from being resurrected during disaster recovery.

---

### 17. REST API Security & BOLA/IDOR Defense

Comprehensive API perimeter defenses ([`api-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/api-security.md)):
* TLS 1.3 encryption; origin whitelisting; sliding-window rate limiting.
* Mandatory four-tier BOLA defense: Reject body `userId`, server-side ownership assertion, database kernel RLS, and HTTP 404 anti-enumeration response.
* RFC 7807 standard error envelopes masking internal database error details.

---

### 18. Mass Assignment Defense Architecture

Neutralizes unauthorized field mutation ([`api-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/api-security.md)):
* Strict Zod deserialization (`.strict()`) rejects unexpected JSON properties (e.g., `{"role": "admin"}`).
* Privileged database columns (`role`, `is_verified`, `id`, `created_at`) are immutable via consumer endpoints.

---

### 19. Frontend & Browser Security Architecture

Client runtime sandboxing ([`frontend-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/frontend-security.md)):
* Decommissions insecure `localStorage` mock auth in favor of in-memory RS256 JWTs.
* `localStorage` restricted to non-sensitive UI preferences (theme, language).
* Enterprise Content Security Policy (CSP) blocking unauthorized scripts, clickjacking (`frame-ancestors 'none'`), and restricting hardware camera access strictly to first-party origin.

---

### 20. File Upload Security Architecture

Zero-trust asset ingestion pipeline ([`file-upload-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/file-upload-security.md)):
* Client-supplied filenames and MIME headers are ignored.
* Hard limits: 5 MB payload cap, max $1920 \times 1080$ dimensions.
* Magic-byte inspection (`FF D8 FF`) detects polyglots; serverless worker decodes and re-encodes clean JPEGs.
* Client Canvas strips 100% of EXIF/GPS metadata prior to upload.

---

### 21. AI Threat Model & Defense Architecture

AI treated as an untrusted computational enclave ([`ai-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/ai-security.md)):
* Impermeable privilege firewall: AI possesses zero database credentials, zero SQL tools, zero execution privileges.
* Strongly-typed Zod output schema contract with fail-closed error handling.
* False certainty defense: Inter-modality agreement index $A < 0.60$ caps confidence $< 60\%$ with mandatory advisory notice.

---

### 22. Direct & Indirect Prompt Injection Defense

Multi-tier injection defenses ([`prompt-injection-defense.md`](file:///D:/Project%20Aayurface/docs/engineering/security/prompt-injection-defense.md)):
* Delimiter fencing isolates untrusted user text inside `<user_concerns>...</user_concerns>`.
* Free-text inputs capped at 500 characters; closing tags stripped.
* Post-inference deterministic regex safety filter scans for prohibited disease diagnoses and prescription drugs, dropping violations and serving safe fallback notices.

---

### 23. Classical Knowledge RAG Security Architecture

Grounding generative reasoning in verified literature ([`rag-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/rag-security.md)):
* Four-eyes expert sign-off required for classical chunk ingestion; `knowledge_chunks` table is read-only for application roles.
* Public classical verses isolated from user health data in `pgvector`.
* Runtime cosine similarity threshold gate ($\ge 0.75$; matches $\ge 2$); ungrounded queries abort herbal synthesis cleanly.

---

### 24. Computer Vision Security Architecture

Biometric quality gating ([`cv-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/cv-security.md)):
* Client WebAssembly MediaPipe FaceMesh verifies face count, landmark confidence ($\ge 0.85$), pose angle ($\pm 15^\circ$), centering, illumination ($80 \le \text{luma} \le 220$), and sharpness.
* Serverless feature extraction worker enforces 15-second execution deadline.
* Graceful fallback mode (`FR-FUS-003`) handles image corruption by omitting visual modality without crashing.

---

### 25. Conversational Voice Security Architecture

Audio privacy and spoken injection defenses ([`voice-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/voice-security.md)):
* Web Speech API processes audio locally in browser RAM; zero raw audio transmitted to backend.
* Voice commands restricted to read-only queries; destructive state changes (deletion, consent) mandate manual screen touch.

---

### 26. PDF Export & Public Sharing Token Security

Secure report export and link sharing ([`pdf-sharing-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/pdf-sharing-security.md)):
* Share URLs utilize 256-bit cryptographic entropy tokens stored as SHA-256 hashes at rest.
* Mandatory 7-day default expiration and instant user revocation button.
* `X-Robots-Tag: noindex, nofollow` prevents search engine indexing.
* PDF reports exclude raw facial images; embed non-diagnostic watermarks.

---

### 27. Administrative Security & Governance

Principle of least administrative privilege ([`admin-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/admin-security.md)):
* Admins cannot browse raw consumer facial images or unencrypted health records.
* Functional separation: `admin:knowledge`, `admin:support`, `admin:security`, `admin:superuser`.
* WebAuthn FIDO2 hardware MFA enforced; 100% of admin mutations recorded in WORM audit logs.

---

### 28. Clinical Research Platform Security Architecture

Future post-MVP research isolation ([`research-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/research-security.md)):
* De-identification pipeline strips direct PII, coarsens age brackets, and assigns random `research_uuid`.
* Double-blind annotation queue presents masked ROIs only; annotators cannot see subject identity or peer ratings.
* Exports watermarked and capped at 500 records.

---

### 29. Secrets Management & Cryptographic Key Lifecycle

Platform credential protection ([`secrets-management.md`](file:///D:/Project%20Aayurface/docs/engineering/security/secrets-management.md)):
* Zero secrets in client code, Git, or Vite builds.
* Secrets stored in encrypted cloud vaults; 90-day rotation schedule for service keys and API keys.
* Pre-commit hooks (`gitleaks`) and GitHub Secret Scanning enforce pre-merge quarantine.

---

### 30. Software Supply Chain & Build Security

Dependency and build pipeline defense ([`supply-chain-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/supply-chain-security.md)):
* Strict lockfile integrity enforcement (`npm ci`); pinned package versions.
* Automated Dependabot and SAST scanning in GitHub Actions.
* CycloneDX Software Bill of Materials (SBOM) generated per release tag.
* Zero external script CDNs; all libraries bundled locally within application origin.

---

### 31. Security Observability & Data Redaction Architecture

Telemetry without privacy leakage ([`observability-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/observability-security.md)):
* Automated regex scrubber intercepts base64 images, bearer tokens, passwords, and PII before serialization.
* Segregated streams: Application APM (30d), Threat Telemetry (90d), Immutable Audit Vault (365d WORM).
* Catalog of 15 formal security events (`AUTH_LOGIN_FAILURE`, `RLS_DENIED`, `PROMPT_INJECTION_DETECTED`, etc.).

---

### 32. Security Incident Response Architecture

Formal breach management protocol ([`incident-response.md`](file:///D:/Project%20Aayurface/docs/engineering/security/incident-response.md)):
* Severity classification: P0 Critical (< 15m SLA), P1 High (< 1h SLA), P2 Medium (< 4h SLA), P3 Low (< 24h SLA).
* 10-stage lifecycle: Detect $\rightarrow$ Triage $\rightarrow$ Contain $\rightarrow$ Preserve Evidence $\rightarrow$ Investigate $\rightarrow$ Eradicate $\rightarrow$ Recover $\rightarrow$ Validate $\rightarrow$ Communicate $\rightarrow$ Postmortem.
* Legal notice: Breach notifications to CERT-In / Data Protection Board require legal counsel coordination.

---

### 33. Security Testing Strategy & Taxonomy

Comprehensive future verification taxonomy ([`security-testing-strategy.md`](file:///D:/Project%20Aayurface/docs/engineering/security/security-testing-strategy.md)):
* 14 formal test suites cataloged (`TST-SEC-01` through `TST-SEC-14`).
* Covers Secret Scanning, RLS Fuzzing, BOLA/IDOR Testing, Mass Assignment, Rate Limiting, Polyglots, Prompt Jailbreaks, and Cascading Purges.
* Testing executed in Milestones 01, 04, 08, 11, 12, 13, and 14.

---

### 34. External Penetration Testing Plan

Pre-launch black-box and grey-box assessment plan ([`penetration-test-plan.md`](file:///D:/Project%20Aayurface/docs/engineering/security/penetration-test-plan.md)):
* Scheduled for Milestone 14 pre-launch hardening.
* Evaluates 10 attack categories: Reconnaissance, Auth, BOLA/IDOR, File Upload, Prompt Injection, RAG Poisoning, Mass Assignment, Share Tokens, Storage URLs, and Privilege Escalation.

---

### 35. Third-Party Cloud Boundaries Architecture

External dependency trust models ([`third-party-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/third-party-security.md)):
* Supabase (PostgreSQL, Storage, Auth): Platform partner; encrypted at rest; 30-day backup roll-off.
* OpenAI (GPT-4o): Restricted enclave; Enterprise Zero Data Retention (ZDR) agreement.
* Google Identity (OAuth PKCE): Trusted auth; standard OIDC flows.
* Google MediaPipe: Runs 100% locally in browser Wasm; zero data transmitted.

---

### 36. Comprehensive STRIDE Threat Model Summary

52 granular threats modeled across all system components ([`threat-model.md`](file:///D:/Project%20Aayurface/docs/engineering/security/threat-model.md)):
* 4 Critical Risks: Public S3 Exposure (TH-17), BOLA/IDOR Leakage (TH-18), Identity Parameter Spoofing (TH-01), AI Medical Diagnosis (TH-49).
* 18 High Risks: Credential Stuffing, Session Theft, Prompt Injection, Polyglot Uploads, Secret Leaks, Denial-of-Wallet, Wildcard CORS, Mass Assignment, etc.
* 25 Medium Risks, 5 Low Risks.

---

### 37. Formal Security Requirements Catalog

21 formal security requirements defined ([`security-requirements.md`](file:///D:/Project%20Aayurface/docs/engineering/security/security-requirements.md)):
* `SEC-AUTH-001` (JWT Identity), `SEC-AUTH-002` (bcrypt), `SEC-AUTHZ-001` (RBAC), `SEC-AUTHZ-002` (404 Mask), `SEC-RLS-001` (Kernel RLS), `SEC-STORAGE-001` (Private S3/Signed URLs), `SEC-STORAGE-002` (Biometric Decoupling), `SEC-PRIV-001` (Unbundled Consent), `SEC-PRIV-002` (Cascading Purge), `SEC-AI-001` (Privilege Firewall), `SEC-AI-002` (Zod Schema Contract), `SEC-AI-003` (Safety Filter), `SEC-RAG-001` (Read-Only Store), `SEC-RAG-002` (Cosine Gate $\ge 0.75$), `SEC-CV-001` (Client Wasm Gateway), `SEC-VOICE-001` (Voice Isolation), `SEC-ADMIN-001` (FIDO2 MFA), `SEC-RESEARCH-001` (De-Identification), `SEC-OBS-001` (Logger Redaction), `SEC-INFRA-001` (Strict CORS), `SEC-INFRA-002` (Rate Limiting).

---

### 38. Security Acceptance Criteria Summary

Given/When/Then BDD criteria established ([`security-acceptance-criteria.md`](file:///D:/Project%20Aayurface/docs/engineering/security/security-acceptance-criteria.md)):
* Cross-tenant resource requests return HTTP 404.
* Client-supplied body `userId` mismatches return HTTP 403.
* Polyglot image uploads return HTTP 415 and are dropped.
* Prompt jailbreaks are scrubbed or dropped; fallback rendered.
* Modality clash ($A < 0.60$) caps confidence $< 60\%$.
* Account deletion cascades across S3 and database within 24 hours.

---

### 39. Security Control Matrix Summary

Complete traceability backbone mapping Threat $\rightarrow$ Requirement $\rightarrow$ Control $\rightarrow$ Component $\rightarrow$ Milestone $\rightarrow$ Test $\rightarrow$ Evidence ([`security-control-matrix.md`](file:///D:/Project%20Aayurface/docs/engineering/security/security-control-matrix.md)):
* 23 primary control mappings established.
* Every control linked to concrete test suite and Level 1 evidence standard.

---

### 40. Security Risk Register Summary

15 enterprise security risks scored pre- and post-mitigation ([`security-risk-register.md`](file:///D:/Project%20Aayurface/docs/engineering/security/security-risk-register.md)):
* Pre-mitigation: 4 Critical, 9 High, 2 Medium risks.
* Post-mitigation: 0 Critical, 0 High, 2 Medium, 13 Low residual risks.
* All residual risks assigned to designated architectural owners.

---

### 41. Phased Security Roadmap Mapping

Security controls mapped to future engineering milestones ([`security-roadmap.md`](file:///D:/Project%20Aayurface/docs/engineering/security/security-roadmap.md)):
* Milestones 01–03: Identity & Perimeter Foundation.
* Milestones 04–06: Database Kernel RLS & Consent Ledger.
* Milestones 07–09: Biometric Ingestion & S3 Object Security.
* Milestones 10–12: Classical RAG Grounding & AI Guardrails.
* Milestones 13–14: Cascading Purge, Logger Redaction & Pre-Launch Penetration Testing.
* Milestone 15+: Voice Isolation, Admin FIDO2 MFA & Research Enclave.

---

### 42. Security Decision Backlog (SEC-DEC-001 through SEC-DEC-010)

10 open architectural security decisions documented ([`security-decision-backlog.md`](file:///D:/Project%20Aayurface/docs/engineering/security/security-decision-backlog.md)):
* `SEC-DEC-001`: Biometric Classification under DPDP Act 2023 (`REQUIRES LEGAL REVIEW`).
* `SEC-DEC-002`: Exact Facial Image Retention Duration (`OPEN DECISION` / DEC-004 alignment).
* `SEC-DEC-003`: Signed URL TTL Duration (`PROPOSED`: 15m PUT / 60s GET).
* `SEC-DEC-004`: Analysis Rate Limit Threshold (`PROPOSED`: 5 analyses/user/hour).
* `SEC-DEC-005`: RAG Cosine Similarity Threshold (`TARGET`: $\ge 0.75$; matches $\ge 2$).
* `SEC-DEC-006`: AI Safety Fallback Behavior (`PROPOSED`: Deterministic static card).
* `SEC-DEC-007`: Share Token Lifetime Default (`PROPOSED`: 7 days).
* `SEC-DEC-008`: Admin MFA Enforcement Standard (`TARGET`: WebAuthn FIDO2).
* `SEC-DEC-009`: Research Anonymization vs Pseudonymization (`REQUIRES LEGAL REVIEW`).
* `SEC-DEC-010`: Third-Party AI Data Retention (`TARGET`: OpenAI Zero Data Retention).

---

### 43. Open Technical Decisions Reconciliation

All security decisions directly align with Phase 01 and Phase 02 open decisions:
* `DEC-004` (Raw Facial Image Retention) $\leftrightarrow$ `SEC-DEC-002`.
* `DEC-006` (Analysis Rate Limits) $\leftrightarrow$ `SEC-DEC-004`.
* `DEC-008` (Multimodal Fusion Agreement) $\leftrightarrow$ `SEC-AI-002` / `SAC-07`.
* `DEC-010` (Research Architecture Phase) $\leftrightarrow$ `SEC-DEC-009` / `research-security.md`.

---

### 44. Legal & Regulatory Compliance Statements

* **Compliance Invariant:** The architecture is designed to support applicable privacy, security, and consumer protection principles (including the Indian Digital Personal Data Protection Act 2023 and GDPR). However, **NO CLAIM OF COMPLETED STATUTORY COMPLIANCE IS MADE**.
* Formal legal, regulatory, and compliance review by qualified legal counsel is mandatory prior to commercial production deployment.

---

### 45. Codebase Preservation Verification

Strict git discipline was maintained throughout Phase 03 execution:
* Application source code (`src/**`): **ZERO MODIFICATIONS (0 lines changed)**.
* Supabase configuration & migrations (`supabase/**`): **ZERO MODIFICATIONS (0 lines changed)**.
* Package dependencies (`package.json`, `package-lock.json`): **ZERO MODIFICATIONS (0 lines changed)**.
* Build configuration (`vite.config.ts`, `tsconfig*.json`): **ZERO MODIFICATIONS (0 lines changed)**.
* 100% of Phase 03 work is quarantined within `docs/engineering/security/`.

---

### 46. Phase Gate Assessment & Justification

* **Phase Gate Status:** `PHASE 03 — CONDITIONAL PASS`
* **Justification:** The security, privacy, threat modeling, and AI safety architecture is complete, rigorous, and fully specified across 40 markdown documents and 12 Mermaid diagrams. The "Conditional" status is assigned strictly because:
  1. Statutory data classification and consent terms require formal external legal review (`SEC-DEC-001`, `SEC-DEC-009`).
  2. Security controls are architectural designs whose implementation and empirical verification must be executed in future engineering milestones.

---

### 47. Known Limitations & Architectural Debt

1. **Prototype Insecurities Persist in Code:** The existing prototype files (`src/contexts/AuthContext.tsx`, `supabase/functions/analyze-skin/index.ts`, `supabase/schema.sql`) remain insecure until rewritten in Milestones 03, 04, and 08.
2. **Adversarial Robustness Unverified:** Mathematical robustness against advanced adversarial pixel perturbations is a target design requiring empirical benchmarking in Milestone 07.
3. **Open Retention Durations:** Final facial image retention (DEC-004) remains an open product decision.

---

### 48. Recommendations for Phase 04 / Future Milestones

1. **Milestone 01 Setup:** Enforce `npm ci` lockfile pinning and pre-commit secret scanning immediately upon implementation kickoff.
2. **Milestone 03 Auth:** Decommission `localStorage` mock auth as the very first application code task.
3. **Milestone 04 Database:** Deploy PostgreSQL RLS migration script and execute multi-tenant test suites before building user-facing features.
4. **Legal Review:** Submit `data-classification.md` and `consent-architecture.md` to legal counsel for formal review.

---

### 49. Phase 03 Sign-Off Block

* **Principal Security Architect:** Approved (Target Design)
* **Chief Privacy Officer:** Approved (Pending Formal Legal Review)
* **Platform/SRE Architect:** Approved (Target Infrastructure)
* **Staff Backend Architect:** Approved (Target API & Data Contracts)
* **AI/ML Architect:** Approved (Target Safety & Guardrail Contracts)
* **Principal Software Architect:** Approved (Overall Architecture Coherence)

---

### 50. Appendix A: Security Acronyms & Definitions

* **BOLA / IDOR:** Broken Object Level Authorization / Insecure Direct Object Reference.
* **CSP:** Content Security Policy.
* **FIDO2 / WebAuthn:** Fast Identity Online / Web Authentication hardware cryptographic standard.
* **HMAC:** Hash-based Message Authentication Code.
* **JWT:** JSON Web Token (RS256 asymmetric signature).
* **MFA:** Multi-Factor Authentication.
* **RLS:** Row-Level Security (PostgreSQL kernel multi-tenancy).
* **SBOM:** Software Bill of Materials (CycloneDX standard).
* **STRIDE:** Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege.
* **WORM:** Write Once, Read Many (Immutable audit storage).
* **ZDR:** Zero Data Retention.

---

### 51. Appendix B: Security Architecture Artifacts Manifest

All 40 formal security specifications and 12 Mermaid diagrams are permanently archived under `docs/engineering/security/`:
* Master Index: [`README.md`](file:///D:/Project%20Aayurface/docs/engineering/security/README.md)
* Final Report: [`PHASE-03-FINAL-REPORT.md`](file:///D:/Project%20Aayurface/docs/engineering/security/PHASE-03-FINAL-REPORT.md)
* 38 Core Specifications: `security-architecture.md`, `threat-model.md`, `asset-inventory.md`, `data-classification.md`, `trust-boundaries.md`, `identity-authentication.md`, `authorization-rbac.md`, `resource-ownership.md`, `rls-security-model.md`, `object-storage-security.md`, `facial-data-security.md`, `privacy-architecture.md`, `consent-architecture.md`, `retention-deletion.md`, `api-security.md`, `frontend-security.md`, `file-upload-security.md`, `ai-security.md`, `prompt-injection-defense.md`, `rag-security.md`, `cv-security.md`, `voice-security.md`, `pdf-sharing-security.md`, `admin-security.md`, `research-security.md`, `secrets-management.md`, `supply-chain-security.md`, `observability-security.md`, `incident-response.md`, `security-testing-strategy.md`, `penetration-test-plan.md`, `third-party-security.md`, `abuse-cases.md`, `security-requirements.md`, `security-acceptance-criteria.md`, `security-control-matrix.md`, `security-risk-register.md`, `security-roadmap.md`, `security-decision-backlog.md`, `security-traceability.md`.
* 12 Diagrams (`diagrams/`): `security-context.mmd`, `trust-boundaries.mmd`, `authentication-flow.mmd`, `authorization-flow.mmd`, `rls-flow.mmd`, `secure-image-lifecycle.mmd`, `ai-security-boundary.mmd`, `rag-security.mmd`, `incident-response.mmd`, `security-observability.mmd`, `secure-deletion.mmd`, `attack-tree.mmd`.

---

### Section 73: Execution Summary

=====================================================================
AAYURFACE — PHASE 03 EXECUTION SUMMARY
=====================================================================

Phase Status: COMPLETED
Mode: STRICT SECURITY ARCHITECTURE / THREAT MODELING / DOCUMENTATION ONLY
Implementation: ZERO CODE MODIFICATIONS (Codebase Preserved 100%)

Gate Decision: PHASE 03 — CONDITIONAL PASS

Gate Conditions:
1. Formal legal and regulatory review required for biometric classifications and consent notices (SEC-DEC-001, SEC-DEC-009) prior to public launch.
2. Security controls are architectural specifications; implementation and verification are pending in future engineering milestones (Milestones 01, 03, 04, 08, 11, 12, 13, 14).

Repository Integrity Verification:
- Application source files modified: 0
- Supabase migrations / schema modified: 0
- Package dependencies modified: 0
- Public assets modified: 0

Git Status:
- Untracked directory created: docs/engineering/security/
- Modified files in working tree: 0

Total Security Deliverables Created:
- Master Report: 1 (PHASE-03-FINAL-REPORT.md)
- Core Security Specifications: 39 documents
- Mermaid Architecture Diagrams: 12 files (.mmd)
- Total Files: 52 files

=====================================================================
