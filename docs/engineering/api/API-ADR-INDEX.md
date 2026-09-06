# AayurFace — Backend Architecture Decision Records (ADRs)
## API Architecture Decision Records Master Index

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Date:** 2026-09-03  
**Status:** AUTHORITATIVE ADR REGISTRY (10 Architecture Decisions)  
**Authority:** Principal Backend Architect, API Architect, Security Architect  

---

## 1. Master ADR Registry

| ADR ID | Title | Status | Impact Area | Key Decision Summary |
|---|---|---|---|---|
| [**ADR-API-001**](file:///D:/Project%20Aayurface/docs/engineering/api/adr/ADR-API-001-architecture-style.md) | API Architectural Style | **ACCEPTED** | API Gateway & Routing | Selected Resource-Oriented RESTful JSON over HTTPS + Asynchronous Job Queues over GraphQL/gRPC. |
| [**ADR-API-002**](file:///D:/Project%20Aayurface/docs/engineering/api/adr/ADR-API-002-identity-authorization.md) | Identity & Authorization Protocol | **ACCEPTED** | Authentication & Security | Server-authoritative RS256 JWT extraction (`auth.uid()`); zero client-supplied identity header trust. |
| [**ADR-API-003**](file:///D:/Project%20Aayurface/docs/engineering/api/adr/ADR-API-003-async-orchestration.md) | Asynchronous Job Orchestration | **ACCEPTED** | AI Processing & Queueing | Decoupled 202 Accepted job dispatch + polling with PostgreSQL `FOR UPDATE SKIP LOCKED`. |
| [**ADR-API-004**](file:///D:/Project%20Aayurface/docs/engineering/api/adr/ADR-API-004-idempotency.md) | Mutation Idempotency Protocol | **ACCEPTED** | Mutation Safety | Mandated IETF `Idempotency-Key` header with 120s TTL caching and payload hash verification. |
| [**ADR-API-005**](file:///D:/Project%20Aayurface/docs/engineering/api/adr/ADR-API-005-error-standard.md) | Universal Error Standard | **ACCEPTED** | Error Governance | Standardized RFC 7807-inspired `{ code, message, details, requestId, retryable }` envelope with zero secret leakage. |
| [**ADR-API-006**](file:///D:/Project%20Aayurface/docs/engineering/api/adr/ADR-API-006-ai-gateway-isolation.md) | AI & CV Subsystem Isolation | **ACCEPTED** | AI Security & Integrity | Zero direct browser-to-OpenAI / browser-to-pgvector access; all AI runs behind edge workers. |
| [**ADR-API-007**](file:///D:/Project%20Aayurface/docs/engineering/api/adr/ADR-API-007-pagination-strategy.md) | API Feed Pagination Strategy | **ACCEPTED** | Query Performance | Selected Keyset Cursor Pagination (`created_at, id`) over offset pagination for $O(1)$ scans. |
| [**ADR-API-008**](file:///D:/Project%20Aayurface/docs/engineering/api/adr/ADR-API-008-rate-limiting.md) | Rate Limiting & Denial-of-Wallet | **ACCEPTED** | Abuse & FinOps Defenses | Multi-tier sliding-window rate limiting; capped expensive AI analyses at 5 scans/user/hour. |
| [**ADR-API-009**](file:///D:/Project%20Aayurface/docs/engineering/api/adr/ADR-API-009-report-generation.md) | PDF Report Compilation Engine | **ACCEPTED** | Reports & Storage | Headless serverless Chromium compilation with ephemeral S3 signed URLs (60s TTL). |
| [**ADR-API-010**](file:///D:/Project%20Aayurface/docs/engineering/api/adr/ADR-API-010-share-tokens.md) | Cryptographic Public Sharing | **ACCEPTED** | Privacy & Collaboration | 256-bit cryptographically secure share tokens with full PII redaction and instant revocation. |
