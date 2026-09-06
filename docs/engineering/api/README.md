# AayurFace — Backend & API Contract Architecture (Phase 05)
## Master Documentation & Contract Registry Index

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Date:** 2026-09-03  
**Status:** FULLY CERTIFIED ARCHITECTURAL BASELINE (`PASS`)  
**Authority:** Principal Backend Architect, API Architect, Security Architect, AI Platform Architect  

---

## 1. Executive Summary & Architectural Scope

Phase 05 establishes the complete, production-grade, authoritative backend and API contract specifications for **AayurFace** (*Evidence-Aware Multimodal Ayurvedic Skin & Wellness Intelligence*).

This directory houses the complete set of **52 technical specifications, architectural decision records (ADRs), domain contracts, internal AI interfaces, operational standards, quality matrices, and Mermaid diagrams**.

---

## 2. Master Documentation Sitemap

### Core Architecture & Strategy
* [**CURRENT-API-AUDIT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/CURRENT-API-AUDIT.md) — Comprehensive audit of existing prototype code, mock auth, and interface disposition matrix.
* [**API-ARCHITECTURE-DECISION.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-ARCHITECTURE-DECISION.md) — Evaluation of REST vs GraphQL/gRPC, async boundaries, and modular monolith topology.
* [**API-PRINCIPLES.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-PRINCIPLES.md) — The 20 core backend and API engineering invariants.
* [**API-INVENTORY.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-INVENTORY.md) — Master inventory of all 42 target API endpoints across 18 functional domains.
* [**API-CONTRACT-STANDARD.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-CONTRACT-STANDARD.md) — Universal JSON schema envelope, error format, and header standards.
* [**API-VERSIONING.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-VERSIONING.md) — `/api/v1/` versioning strategy, breaking change rules, and 90-day sunset lifecycle.

### Domain API Contracts (Public & Authenticated Boundaries)
* [**AUTH-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/AUTH-API-CONTRACT.md) — Delegated Supabase Auth contracts, RS256 JWT schema, and DB trigger synchronization.
* [**PROFILE-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/PROFILE-API-CONTRACT.md) — User profile CRUD, preferences, and cascading account erasure.
* [**CONSENT-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/CONSENT-API-CONTRACT.md) — Granular consent scopes, policy versioning, and auditable consent ledger.
* [**ONBOARDING-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/ONBOARDING-API-CONTRACT.md) — 8-stage onboarding FSM, resume progression, and completion validation.
* [**QUESTIONNAIRE-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/QUESTIONNAIRE-API-CONTRACT.md) — Intake template catalog, version pinning, and response submission.
* [**LIFESTYLE-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/LIFESTYLE-API-CONTRACT.md) — Dynamic lifestyle, sleep, stress, climate, and digestive regularity inputs.
* [**CAPTURE-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/CAPTURE-API-CONTRACT.md) — Biometric facial capture session lifecycle and Wasm quality gate scoring.
* [**SECURE-UPLOAD-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/SECURE-UPLOAD-CONTRACT.md) — Private S3 storage, HMAC signed PUT URLs (15m TTL), and EXIF stripping.
* [**ANALYSIS-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/ANALYSIS-API-CONTRACT.md) — Asynchronous analysis orchestration (`202 Accepted`) and status polling.
* [**RESULTS-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/RESULTS-API-CONTRACT.md) — Normalized analysis result snapshots, dosha breakdowns, and observables.
* [**RECOMMENDATION-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/RECOMMENDATION-API-CONTRACT.md) — Grounded ritual recommendations, classical citations, and routine adoption.
* [**ROUTINE-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/ROUTINE-API-CONTRACT.md) — Dinacharya routines, item management, and idempotent daily habit logging.
* [**HISTORY-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/HISTORY-API-CONTRACT.md) — Keyset cursor-paginated scan history and date range queries.
* [**PROGRESS-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/PROGRESS-API-CONTRACT.md) — Longitudinal tracking, 30/60/90-day progress deltas, and trend vectors.
* [**VOICE-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/VOICE-API-CONTRACT.md) — Ephemeral speech processing, grounded conversational turns, and AI safety filtering.
* [**REPORT-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/REPORT-API-CONTRACT.md) — Asynchronous headless PDF compilation and signed download URLs (60s TTL).
* [**SHARE-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/SHARE-API-CONTRACT.md) — Cryptographic 256-bit token sharing, PII exclusion, and instant revocation.
* [**RESEARCH-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/RESEARCH-API-CONTRACT.md) — Post-MVP expert research enclave, double-blind annotation, and consensus scoring.
* [**ADMIN-API-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/ADMIN-API-CONTRACT.md) — Role-based admin access, security audit log review, and classical knowledge curation.

### Internal AI & Computer Vision Contracts
* [**AI-INTERNAL-CONTRACTS.md**](file:///D:/Project%20Aayurface/docs/engineering/api/AI-INTERNAL-CONTRACTS.md) — Pipeline orchestration topology and subsystem boundary contracts.
* [**CV-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/CV-CONTRACT.md) — Structured visual observable extraction (CIELAB $a^*, b^*$, GLCM texture).
* [**AYURVEDIC-INTELLIGENCE-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/AYURVEDIC-INTELLIGENCE-CONTRACT.md) — Classical Doshic heuristics, Prakriti/Vikriti mapping, and Guna rules.
* [**FUSION-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/FUSION-CONTRACT.md) — Multimodal vector fusion (40/35/25% hypothesis), Harmonic Agreement $A$, and Low-Agreement protocols.
* [**CONFIDENCE-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/CONFIDENCE-CONTRACT.md) — Universal confidence structure, agreement bounds, and score calibrations.
* [**RAG-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/RAG-CONTRACT.md) — pgvector semantic retrieval, threshold hypotheses, and prompt injection defenses.
* [**EXPLAINABILITY-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/EXPLAINABILITY-CONTRACT.md) — Modality contributions, reasoning lineage, and negative medical bounds.
* [**AI-SAFETY-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/AI-SAFETY-CONTRACT.md) — Untrusted output parsing, medical regex filtering, and toxic herb scanners.

### Operational, Security, Reliability & Quality Governance
* [**ASYNC-JOB-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/ASYNC-JOB-CONTRACT.md) — Job queue mechanics, SKIP LOCKED worker claims, and dead-letter semantics.
* [**ANALYSIS-STATE-MACHINE.md**](file:///D:/Project%20Aayurface/docs/engineering/api/ANALYSIS-STATE-MACHINE.md) — 12-stage analysis lifecycle state machine and transition validity rules.
* [**ERROR-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/ERROR-CONTRACT.md) — RFC 7807 unified error envelope, status taxonomy, and zero-leakage rules.
* [**IDEMPOTENCY.md**](file:///D:/Project%20Aayurface/docs/engineering/api/IDEMPOTENCY.md) — IETF Idempotency-Key protocol, cache semantics, and replay detection.
* [**PAGINATION.md**](file:///D:/Project%20Aayurface/docs/engineering/api/PAGINATION.md) — Keyset cursor pagination and whitelisted query filter rules.
* [**RATE-LIMITING.md**](file:///D:/Project%20Aayurface/docs/engineering/api/RATE-LIMITING.md) — Sliding-window rate limit tiers and denial-of-wallet defenses.
* [**RETRY-TIMEOUT-POLICY.md**](file:///D:/Project%20Aayurface/docs/engineering/api/RETRY-TIMEOUT-POLICY.md) — Dependency timeout budgets and exponential backoff with full jitter.
* [**API-RESOURCE-OWNERSHIP.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-RESOURCE-OWNERSHIP.md) — Anti-BOLA/IDOR matrix and server-derived identity enforcement.
* [**API-DATABASE-MAPPING.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-DATABASE-MAPPING.md) — Complete mapping from API routes to Phase 04 3NF relational entities.
* [**API-SECURITY-MATRIX.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-SECURITY-MATRIX.md) — STRIDE threat mitigations, gateway defenses, and CORS/CSP rules.
* [**API-OBSERVABILITY-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-OBSERVABILITY-CONTRACT.md) — Distributed tracing, structured logging, and logging prohibitions.
* [**API-PRIVACY-CONTRACT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-PRIVACY-CONTRACT.md) — 7-tier data privacy classification, transport security, and erasure policies.
* [**API-PERFORMANCE-TARGETS.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-PERFORMANCE-TARGETS.md) — Service level indicators, latency budgets, and benchmarking rules.
* [**API-COST-ABUSE-MODEL.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-COST-ABUSE-MODEL.md) — Token budgets, cost caps, and denial-of-wallet defenses.
* [**API-ACCEPTANCE-CRITERIA.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-ACCEPTANCE-CRITERIA.md) — Given/When/Then acceptance criteria across core API scenarios.
* [**API-TEST-MATRIX.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-TEST-MATRIX.md) — Multi-tier planned test suites (unit, contract, security, idempotency, fuzz).
* [**API-REQUIREMENT-TRACEABILITY.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-REQUIREMENT-TRACEABILITY.md) — Traceability linking PRD requirements to APIs, DB, AI, and tests.
* [**API-ADR-INDEX.md**](file:///D:/Project%20Aayurface/docs/engineering/api/API-ADR-INDEX.md) — Master index of all 10 Backend Architecture Decision Records.
* [**PHASE-05-CONTRADICTION-AUDIT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/PHASE-05-CONTRADICTION-AUDIT.md) — Cross-phase contradiction audit across all baseline documents.
* [**PHASE-05-OPEN-DECISIONS.md**](file:///D:/Project%20Aayurface/docs/engineering/api/PHASE-05-OPEN-DECISIONS.md) — Active open decisions register (DEC-004, DEC-010, etc.).
* [**PHASE-05-RISK-REGISTER.md**](file:///D:/Project%20Aayurface/docs/engineering/api/PHASE-05-RISK-REGISTER.md) — Quantified backend risk register with pre/post mitigation scores.
* [**PHASE-05-FINAL-REPORT.md**](file:///D:/Project%20Aayurface/docs/engineering/api/PHASE-05-FINAL-REPORT.md) — Phase 05 Final Gate Report & Comprehensive Self-Audit.

### Architectural Diagrams (`diagrams/`)
* [`01-api-system-context.mmd`](file:///D:/Project%20Aayurface/docs/engineering/api/diagrams/01-api-system-context.mmd)
* [`02-api-domain-map.mmd`](file:///D:/Project%20Aayurface/docs/engineering/api/diagrams/02-api-domain-map.mmd)
* [`03-request-lifecycle.mmd`](file:///D:/Project%20Aayurface/docs/engineering/api/diagrams/03-request-lifecycle.mmd)
* [`04-authentication-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/api/diagrams/04-authentication-flow.mmd)
* [`05-authorization-ownership-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/api/diagrams/05-authorization-ownership-flow.mmd)
* [`06-capture-upload-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/api/diagrams/06-capture-upload-flow.mmd)
* [`07-analysis-async-pipeline.mmd`](file:///D:/Project%20Aayurface/docs/engineering/api/diagrams/07-analysis-async-pipeline.mmd)
* [`08-ai-orchestration-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/api/diagrams/08-ai-orchestration-flow.mmd)
* [`09-rag-retrieval-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/api/diagrams/09-rag-retrieval-flow.mmd)
* [`10-error-handling-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/api/diagrams/10-error-handling-flow.mmd)
* [`11-api-database-transaction-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/api/diagrams/11-api-database-transaction-flow.mmd)
* [`12-security-boundary-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/api/diagrams/12-security-boundary-flow.mmd)
* [`13-report-share-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/api/diagrams/13-report-share-flow.mmd)
* [`14-research-enclave-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/api/diagrams/14-research-enclave-flow.mmd)
