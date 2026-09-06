# AayurFace — Backend & API Architecture Specification
## API Architecture & Paradigms Decision

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Date:** 2026-09-03  
**Status:** TARGET ARCHITECTURE DECISION  
**Authority:** Principal Backend Architect, API Architect, Distributed Systems Architect  

---

## 1. Architectural Paradigm Evaluation

To establish a production-grade backend for AayurFace, four primary API communication styles were rigorously evaluated against product constraints, security requirements, and operational complexity:

| Evaluation Dimension | RESTful JSON over HTTPS (Selected) | GraphQL | gRPC / Protocol Buffers | Pure RPC / TRPC |
|---|---|---|---|---|
| **Security & BOLA Defenses** | **High:** Explicit resource URLs (`/api/v1/analyses/:id`) enable straightforward Path-Based and Kernel RLS ownership checks. | **Moderate:** Deep nested queries can bypass resource-level authorization; requires complex query depth/cost analysis. | **High:** Strongly typed schemas, but browser Web clients require `grpc-web` proxy translation layer. | **Moderate:** Function-level authorization can blur resource ownership boundaries. |
| **Caching & Edge Gateway** | **Optimal:** Standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) leverage HTTP status codes, ETags, and edge CDN caches. | **Poor:** Almost all requests are `POST /graphql`, bypassing standard HTTP caching semantics. | **Poor:** Binary HTTP/2 payloads bypass standard HTTP edge CDN caching. | **Moderate:** Custom query routing limits standard CDN edge optimizations. |
| **Asynchronous AI Suitability**| **Optimal:** Natural integration with standard `202 Accepted` job polling and webhook callback patterns. | **Moderate:** Subscriptions require persistent WebSocket connections which increase serverless cold-start overhead. | **High:** Streaming support is excellent for microservices, but overcomplicated for mobile/web SPA clients. | **Moderate:** Long-running AI jobs require complex custom polling wrappers. |
| **Schema Validation & Typing** | **High:** OpenAPI 3.1 / JSON Schema / Zod provide bidirectional runtime contract validation. | **Optimal:** Built-in GraphQL SDL typing. | **Optimal:** Protobuf strict binary contract typing. | **High:** TypeScript end-to-end type sharing. |
| **PostgreSQL / Supabase Fit** | **Optimal:** Directly maps to Supabase Edge Functions (Deno) and RESTful PostgREST patterns. | **Moderate:** Requires maintaining a dedicated GraphQL gateway server (Apollo / Yoga). | **Poor:** Requires custom gRPC daemon; incompatible with serverless edge runtimes. | **Moderate:** Requires unified TypeScript monorepo with tight client-server coupling. |
| **Operational Complexity** | **Low:** Zero custom gateway infrastructure; standard HTTP debugging tools (cURL, Postman, Sentry). | **High:** Schema stitching, N+1 query solving (DataLoader), and query complexity rate limiting required. | **High:** Envoy proxies, binary compilation toolchains, and Protobuf registry required. | **Moderate:** Tight client-server coupling complicates mobile app versioning and independent deployments. |

---

## 2. Decision Outcome & Chosen Architecture

### Primary Decision:
AayurFace adopts a **Resource-Oriented RESTful JSON Architecture over HTTPS** complemented by an **Asynchronous Job Orchestration Protocol** for high-latency AI/CV pipelines, deployed as a **Modular Monolith on Serverless Edge Infrastructure**.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                     TARGET BACKEND SYSTEM TOPOLOGY                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   [ Client Web Application / Mobile SPA ]                                   │
│                     │                                                       │
│                     │ HTTPS / TLS 1.3 (RS256 JWT in Authorization Header)   │
│                     ▼                                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │             SUPABASE EDGE API GATEWAY (Deno Runtime)                │   │
│   │  • RS256 JWT Authentication Verification & `auth.uid()` Derivation  │   │
│   │  • Strict Input Validation (Zod Schema Validation)                  │   │
│   │  • Sliding-Window Rate Limiting & Denial-of-Wallet Defenses         │   │
│   │  • Idempotency Gate (IETF Idempotency-Key Caching)                  │   │
│   │  • Anti-BOLA / IDOR Resource Ownership Validation                   │   │
│   └───────────────────┬───────────────────────────────┬─────────────────┘   │
│                       │                               │                     │
│        Synchronous    │                               │ Asynchronous        │
│        CRUD & State   │                               │ AI Job Dispatch     │
│                       ▼                               ▼                     │
│   ┌─────────────────────────────┐   ┌───────────────────────────────────┐   │
│   │   DOMAIN SERVICES LAYER     │   │     ASYNC ANALYSIS PIPELINE       │   │
│   │ • Profile & Preferences     │   │ • Database Queue (`analysis_jobs`)│   │
│   │ • Consent Ledger            │   │ • Isolated Background Workers     │   │
│   │ • Questionnaires & Answers  │   │ • Computer Vision Feature Engine  │   │
│   │ • Dinacharya Routines       │   │ • Multimodal Fusion Engine        │   │
│   │ • History & Checkpoints     │   │ • Classical RAG & pgvector Search │   │
│   │ • Cryptographic Shares      │   │ • Safety Validation & Zod Parse   │   │
│   └──────────────┬──────────────┘   └─────────────────┬─────────────────┘   │
│                  │                                    │                     │
│                  ▼                                    ▼                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │            POSTGRESQL 15/16 DATABASE ENGINE (Kernel RLS)            │   │
│   │ • 3NF Relational Tables (Profiles, Scans, Fusions, Routines)        │   │
│   │ • pgvector Cosine Distance Semantic Index (HNSW)                    │   │
│   │ • Kernel Row-Level Security (`USING (auth.uid() = user_id)`)        │   │
│   │ • Immutable WORM Security Audit Log (`security_audit_events`)       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Synchronous vs Asynchronous Communication Boundary

To prevent HTTP client timeouts, connection drops, and gateway starvation during complex multi-stage AI inference, all operations are classified by execution latency:

| Interaction Type | Execution Latency Target | Execution Mode | HTTP Status Code | Example API Endpoints |
|---|---|---|---|---|
| **Transactional Data Operations** | $\le 150\text{ ms}$ | **Synchronous** | `200 OK` / `201 Created` | `GET /api/v1/profile`, `POST /api/v1/consents`, `POST /api/v1/routines/items/:id/track` |
| **Signed Upload URL Issuance** | $\le 100\text{ ms}$ | **Synchronous** | `201 Created` | `POST /api/v1/captures/sessions`, `POST /api/v1/captures/upload-url` |
| **Multimodal AI Analysis** | $3\text{s} - 8\text{s}$ | **Asynchronous Job** | `202 Accepted` | `POST /api/v1/analyses` $\rightarrow$ Poll `GET /api/v1/analyses/:id/status` |
| **PDF Report Compilation** | $2\text{s} - 5\text{s}$ | **Asynchronous Job** | `202 Accepted` | `POST /api/v1/reports/compile` $\rightarrow$ Poll `GET /api/v1/reports/:id` |
| **Conversational Chat Turn** | $1\text{s} - 3\text{s}$ | **Synchronous Stream**| `200 OK` (JSON / SSE)| `POST /api/v1/voice/chat` |

---

## 4. Tradeoff Analysis & Architectural Invariants

### 4.1 Anti-Overengineering Rule
* **No Unnecessary Microservices:** The domain services operate as a cohesive modular monolith within Edge Functions, sharing a single PostgreSQL relational engine. This eliminates distributed transaction sagas, cross-network RPC latency, and complex service mesh overhead.
* **No Premature Event Buses:** Job state management is backed directly by PostgreSQL transactional locking (`analysis_jobs` with `FOR UPDATE SKIP LOCKED`), avoiding the cost and operational maintenance of external Kafka/RabbitMQ clusters during early production phases.

### 4.2 Anti-Underengineering Rule
* **No Monolithic `/analyze` Endpoint:** Capture session initialization, image quality validation, upload URL issuance, analysis orchestration, and result retrieval are decoupled into distinct, state-guarded RESTful resources.
* **Zero Browser-to-AI Communication:** Client browsers are strictly forbidden from directly calling OpenAI API endpoints, pgvector vector search functions, or computer vision feature extractors. All AI operations occur exclusively behind the authenticated edge gateway.

---

## 5. Truth-Status Classification
* **Selected RESTful Architecture:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
* **PostgreSQL Queue Strategy:** `PROPOSED / TARGET (REQUIRES IMPLEMENTATION)`
* **Latency Budgets:** `PROPOSED / TARGET OBJECTIVES (REQUIRES LOAD TESTING)`
