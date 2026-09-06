# AayurFace — Security Architecture Specification
## Trust Boundary Model & Security Enclaves

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Security Architect, Platform/SRE Architect, Staff Backend Architect  

---

### 1. The Trust Boundary Framework

A trust boundary is an architectural demarcation where data traverses between environments with differing levels of trust, privilege, or security isolation. The AayurFace architecture formalizes twelve explicit trust boundaries:

```text
 [Untrusted User] ──(TB-01)──► [Client Browser / RAM] ──(TB-02)──► [Edge API Gateway] ──(TB-04)──► [Postgres DB (RLS)]
                                       │                                     │
                                    (TB-03)                               (TB-05)
                                       │                                     │
                                       ▼                                     ▼
                          [Private S3 Bucket Storage] ◄──────────────────────┘
                                       ▲
                                    (TB-06)
                                       ▼
                       [External AI Enclave (OpenAI)] ──(TB-07)──► [pgvector Knowledge Store]
```

---

### 2. Trust Boundary Analysis (TB-01 through TB-12)

#### TB-01: User ↔ Browser Runtime
* **Description:** Transition between the physical human user and the browser DOM/WebAssembly execution context.
* **Threats:** Malicious browser extensions, shoulder surfing, unencrypted local caches, clipboard tampering.
* **Required Controls:** Content Security Policy (CSP) blocking unauthorized script execution; strict autocomplete controls on sensitive inputs; ephemeral WebAssembly frame memory management.
* **Validation:** Browser CSP violation reports, DOM inspection tests.
* **Failure Behavior:** Terminate camera stream; render error boundary.
* **Logging:** Client-side telemetry logs `CAMERA_PERMISSION_DENIED` or `CSP_VIOLATION`.
* **Residual Risk:** Compromised end-user host machine with active keylogger or screen-recording malware.

#### TB-02: Browser ↔ API Edge Functions Gateway
* **Description:** Public internet network transition between the client Single-Page Application and the serverless API.
* **Threats:** Man-in-the-middle (MitM) eavesdropping, replay attacks, spoofed `userId` parameters, rate-limit exhaustion, wildcard CORS exploitation.
* **Required Controls:** Mandatory TLS 1.3 encryption; RS256 JWT signature verification; strict origin whitelisting; rate-limiting middleware (proposed baseline: 5 analyses/user/hour).
* **Validation:** Automated TLS cipher suite checks; synthetic API fuzzing with forged JWTs.
* **Failure Behavior:** Return HTTP 401 Unauthorized or HTTP 429 Rate Limit Exceeded; terminate immediately.
* **Logging:** Emits `AUTH_JWT_INVALID`, `RATE_LIMIT_EXCEEDED` with IP hash and correlation ID.
* **Residual Risk:** Mobile client operating on compromised, root-installed SSL inspection proxies.

#### TB-03: Browser ↔ Private Object Storage (S3)
* **Description:** Direct client-to-storage ingestion of approved facial capture frames using pre-signed upload URLs.
* **Threats:** Malicious file upload (executables, image bombs, SVG scripts), path traversal, cross-tenant file overwriting.
* **Required Controls:** HMAC-SHA256 pre-signed PUT URLs with proposed 15-minute TTL; path isolation strictly constrained to `facial-captures/{userId}/{captureId}.jpg`; maximum body size capped at 5 MB.
* **Validation:** Integration test attempting direct unauthenticated PUT/GET to S3 bucket.
* **Failure Behavior:** HTTP 403 Forbidden on expired or forged signatures; storage layer rejects invalid payload lengths.
* **Logging:** S3 access logs stream to security SIEM; logs `S3_PUT_SIGNED_SUCCESS`.
* **Residual Risk:** User uploads an image containing non-human or adversarial patterns (handled downstream by feature extraction).

#### TB-04: API Gateway ↔ Database Persistence (PostgreSQL)
* **Description:** Communication between serverless Deno edge workers and the PostgreSQL relational engine.
* **Threats:** Cross-tenant data leakage (BOLA/IDOR), SQL injection, privilege escalation, unencrypted queries.
* **Required Controls:** PostgreSQL Row-Level Security (RLS) enabled on all user-owned tables; parameterized SQL via Supabase client; database connection pooling over encrypted TLS; atomic policy expressions `USING (auth.uid() = user_id)`.
* **Validation:** Automated RLS fuzzing test suite verifying User A cannot SELECT, UPDATE, or DELETE User B's rows.
* **Failure Behavior:** Database kernel returns 0 rows; transaction aborts if constraint violated.
* **Logging:** Emits `RLS_CROSS_TENANT_BLOCKED` in PostgreSQL audit logs.
* **Residual Risk:** Performance degradation under complex nested RLS joins (mitigated by indexed `user_id` columns).

#### TB-05: API Gateway ↔ Private Object Storage Management
* **Description:** Serverless workers generating signed URLs and orchestrating biometric image purges via S3 API.
* **Threats:** Orphaned image accumulation, leakage of long-lived bucket credentials, unauthorized bulk deletion.
* **Required Controls:** Least-privilege S3 IAM roles; serverless functions access storage via scoped short-lived service tokens; automated lifecycle rule deleting unreferenced objects older than 24 hours.
* **Validation:** Automated audit of storage IAM policies; verification that public read permissions remain permanently disabled.
* **Failure Behavior:** Storage API returns error; orchestration marks analysis as `FAILED_STORAGE`.
* **Logging:** Logs `SIGNED_URL_GENERATED`, `STORAGE_OBJECT_PURGED`.
* **Residual Risk:** Cloud provider S3 API temporary outage or control-plane throttling.

#### TB-06: API Gateway ↔ External AI Enclaves (OpenAI API)
* **Description:** Egress of prompt payloads to external foundation models for inference and vector embeddings.
* **Threats:** Upstream data retention, model prompt extraction, API key theft, cross-user context contamination.
* **Required Controls:** Enterprise Zero-Data-Retention (ZDR) agreement; OpenAI API key stored in serverless vault; stateless per-request prompts with zero persistent session memory; outbound payload sanitization.
* **Validation:** Network egress inspection confirming payload contains no raw facial imagery or unhashed PII.
* **Failure Behavior:** Circuit breaker trips to OPEN on 5 consecutive timeouts; fallback to safe Ayurvedic guidelines.
* **Logging:** Logs `AI_INFERENCE_INVOKED`, model snapshot version, latency, and token count (prompt contents redacted).
* **Residual Risk:** Upstream OpenAI outage or unilateral model behavioral shift.

#### TB-07: AI Orchestrator ↔ RAG Knowledge Base (`pgvector`)
* **Description:** Semantic retrieval of classical Ayurvedic literature chunks to ground generative reasoning.
* **Threats:** Knowledge poisoning (injection of toxic herbal remedies), out-of-date verse retrieval, cross-tenant vector leakage.
* **Required Controls:** Knowledge chunks table is read-only for application roles; vectors ingested exclusively through authenticated admin pipelines; cosine similarity threshold gate ($\ge 0.75$; matches $\ge 2$).
* **Validation:** Unit tests verifying application client roles cannot INSERT, UPDATE, or DELETE `knowledge_chunks`.
* **Failure Behavior:** Fallback mode triggered: generative herbal synthesis disabled; general lifestyle advice rendered.
* **Logging:** Logs `RAG_RETRIEVAL_SUCCESS`, top chunk IDs, and similarity distance scores.
* **Residual Risk:** Classical verse translation nuance leading to user misinterpretation (mitigated by 24h patch-test notices).

#### TB-08: AI Engine ↔ Untrusted User Content
* **Description:** Ingestion of user-supplied free-text concerns or chat queries into the LLM context window.
* **Threats:** Direct prompt injection ("Ignore previous rules..."), jailbreaking to emit prescription drugs, system prompt extraction.
* **Required Controls:** XML/Markdown delimiter fencing (`<user_input>...</user_input>`); input length limits ($\le 500$ chars); post-inference Zod schema validation; deterministic safety filter scrubbing medical claims.
* **Validation:** Adversarial prompt injection test suite (evaluating 25+ jailbreak variants).
* **Failure Behavior:** LLM output rejected if non-compliant; safe Ayurvedic fallback response returned.
* **Logging:** Logs `PROMPT_INJECTION_DETECTED`, `AI_SAFETY_GUARDRAIL_TRIPPED`.
* **Residual Risk:** Highly novel semantic linguistic obfuscation bypassing keyword filters (contained by zero-privilege boundary).

#### TB-09: Administrator ↔ Administrative Operations
* **Description:** Administrative personnel accessing platform telemetry, knowledge ingestion, and operational controls.
* **Threats:** Privilege escalation, credential stuffing, insider data browsing, unauthorized bulk exports.
* **Required Controls:** Dedicated `admin` role in database; hardware-backed Multi-Factor Authentication (MFA); admin actions restricted to internal VPN/IP allowlists; 100% of admin actions written to immutable WORM audit logs.
* **Validation:** Role-based access control tests verifying standard `authenticated` JWTs cannot invoke `/admin/*` routes.
* **Failure Behavior:** HTTP 403 Forbidden; security alert dispatched to Slack/PagerDuty.
* **Logging:** Emits `ADMIN_PRIVILEGE_INVOKED`, `ADMIN_ACTION_AUDIT` with admin ID, action, and target entity.
* **Residual Risk:** Malicious insider with legitimate administrative credentials (contained by auditability and four-eyes review).

#### TB-10: Research Platform ↔ Research Participants
* **Description:** Ayurvedic research practitioners accessing de-identified datasets for double-blind consensus labeling.
* **Threats:** Re-identification of research subjects, bulk dataset scraping, annotation tampering.
* **Required Controls:** Dedicated research enclave; stripping of direct PII (name, email); assignment of ephemeral `research_uuid`; restricted export controls; double-blind annotation queues.
* **Validation:** Re-identification vulnerability assessment on exported dataset schemas.
* **Failure Behavior:** Access blocked if user lacks verified `researcher` role; dataset exports capped at 50 records.
* **Logging:** Logs `RESEARCH_DATASET_ACCESSED`, `EXPERT_ANNOTATION_SUBMITTED`.
* **Residual Risk:** Reconstruction attacks combining high-dimensional phenotypic vectors with external public datasets.

#### TB-11: Application ↔ Third-Party Software Dependencies
* **Description:** Integration of third-party open-source npm/Deno packages into the application and build pipeline.
* **Threats:** Malicious package injection, dependency typosquatting, prototype pollution, vulnerable transitive dependencies.
* **Required Controls:** Lockfile integrity verification (`package-lock.json`); automated dependency vulnerability scanning via GitHub Dependabot; pinned package versions; zero remote untrusted script imports.
* **Validation:** CI/CD pipeline gate: automated `npm audit` and SAST security scanner.
* **Failure Behavior:** CI build immediately fails if critical or high vulnerabilities are detected.
* **Logging:** Build pipeline logs dependency integrity hashes.
* **Residual Risk:** Zero-day supply chain compromise in an established package prior to CVE publication.

#### TB-12: Application ↔ Observability & Telemetry Sinks
* **Description:** Egress of application metrics, traces, and structured JSON logs to observability platforms.
* **Threats:** Accidental leakage of plain-text passwords, base64 facial imagery, access tokens, or sensitive health data into logs.
* **Required Controls:** Automated pre-serialization regex scrubber intercepting base64 image strings, bearer tokens, passwords, and PII; strict allowlist field schemas for log events; segregated security audit vaults.
* **Validation:** Automated test verifying that logging a mock user object with a password field results in `[REDACTED]`.
* **Failure Behavior:** Logger drops unparseable or oversized payloads (> 64 KB).
* **Logging:** Health ping of observability pipeline.
* **Residual Risk:** Novel, unstructured log messages authored by developers inadvertently including sensitive variables.
