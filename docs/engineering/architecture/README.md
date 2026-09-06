# AayurFace — Target System Architecture Documentation
## Master Architecture Index & Navigation Guide

**Phase:** Phase 02 — Target System Architecture, ADRs & Implementation Blueprint  
**Date:** 2026-09-03  
**Status:** ENGINEERING ARCHITECTURE CONTRACT  
**Authority:** Principal Software Architect, Staff Backend Architect, Staff Frontend Architect, AI/ML Architect, Data Architect, Security Architect, Platform/SRE Architect  
**Implementation Constraint:** STRICTLY ZERO FEATURE IMPLEMENTATION (Architecture & Documentation Only)  

---

### 1. Document Index

This directory contains the complete target system architecture specifications, Architecture Decision Records (ADRs), and visual system blueprints for the AayurFace platform.

| Document | Focus & Description |
|---|---|
| [`target-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/target-architecture.md) | High-level system architecture, architectural principles, style evaluation, and core patterns |
| [`system-context.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/system-context.md) | System Context Diagram (C4 Level 1), trust boundaries, and external system integrations |
| [`container-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/container-architecture.md) | Container Architecture (C4 Level 2) and 26 logical bounded contexts/modules |
| [`component-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/component-architecture.md) | Component Architecture (C4 Level 3) for Frontend layers and Backend service layers |
| [`data-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/data-architecture.md) | Domain entity models, schema blueprints, sensitivity classifications, and data lifecycles |
| [`api-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/api-architecture.md) | Serverless API specifications, request/response contracts, versioning, and rate-limiting |
| [`security-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/security-architecture.md) | Security boundaries, Supabase Auth, RLS enforcement, private buckets, and signed URLs |
| [`privacy-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/privacy-architecture.md) | Biometric data minimization, DPDP Act 2023 design, unbundled consent lifecycle, and purge triggers |
| [`ai-cv-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/ai-cv-architecture.md) | Model-agnostic 2-tier CV pipeline, MediaPipe gateway, feature extraction, and model registry |
| [`ayurvedic-intelligence-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/ayurvedic-intelligence-architecture.md) | Structured Ayurvedic domain reasoning, Tridosha signal mapping, and safety guardrails |
| [`fusion-confidence-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/fusion-confidence-architecture.md) | Configurable multimodal fusion, cosine agreement scoring, and calibrated confidence |
| [`rag-knowledge-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/rag-knowledge-architecture.md) | Knowledge ingestion, `pgvector` chunking, semantic retrieval, citations, and prompt safety |
| [`voice-multilingual-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/voice-multilingual-architecture.md) | Multilingual localization (EN/HI) and hands-free conversational voice assistant pipeline |
| [`longitudinal-intelligence-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/longitudinal-intelligence-architecture.md) | 30/60/90-day progress delta tracking, routine adherence, and non-clinical trend interpretation |
| [`research-validation-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/research-validation-architecture.md) | Post-MVP research portal, Triple-Practitioner consensus pipeline, and Fitzpatrick bias audits |
| [`observability-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/observability-architecture.md) | Telemetry, correlation IDs, structured logging, audit trails, and biometric redaction |
| [`reliability-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/reliability-architecture.md) | Fault tolerance, circuit breakers, graceful degradation, and failure recovery protocols |
| [`performance-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/performance-architecture.md) | Target performance budgets, empirical benchmark protocols, and pipeline parallelization |
| [`deployment-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/deployment-architecture.md) | Environments (Local, Dev, Staging, Prod), CI/CD pipelines, and secret isolation |
| [`migration-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/migration-architecture.md) | 14-milestone migration blueprint and 44-file codebase classification (KEEP, REWORK, REPLACE, REMOVE) |
| [`technology-decision-matrix.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/technology-decision-matrix.md) | Objective evaluation of frontend, backend, database, AI, and infrastructure options |
| [`architecture-traceability.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/architecture-traceability.md) | Traceability from Requirements → Components → Data → APIs → AI/CV → Security → Verification |
| [`architecture-risk-register.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/architecture-risk-register.md) | Comprehensive architectural risk assessment, detection methods, and mitigation strategies |
| [`architecture-decision-backlog.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/architecture-decision-backlog.md) | Unresolved decision backlog (DEC-001 through DEC-010) carried forward with dependencies |
| [`PHASE-02-FINAL-REPORT.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/PHASE-02-FINAL-REPORT.md) | Comprehensive 38-section Phase 02 Final Architecture Report & Phase Gate Decision |
| [`PHASE-02-C-TRUTH-AUDIT.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/PHASE-02-C-TRUTH-AUDIT.md) | Forensic 18-section Architecture Truth, Consistency & Claim Reconciliation Audit Report |
| [`PHASE-02-C-FINAL-REPORT.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/PHASE-02-C-FINAL-REPORT.md) | Comprehensive 25-section Phase 02-C Final Gate Report & Frozen Baseline Certification |

---

### 2. Architecture Decision Records (ADRs)

All material architectural decisions are formalized under [`adr/`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/):

* [`ADR-001-architecture-style.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-001-architecture-style.md): Modular Monolith Frontend with Serverless Asynchronous Orchestration
* [`ADR-002-frontend-stack.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-002-frontend-stack.md): React & Vite Client Architecture with Conditional Major Version Retention
* [`ADR-003-backend-strategy.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-003-backend-strategy.md): Supabase Edge Functions (Deno/TypeScript) with Worker Abstraction
* [`ADR-004-database-strategy.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-004-database-strategy.md): PostgreSQL with Row-Level Security (RLS) & `pgvector`
* [`ADR-005-object-storage.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-005-object-storage.md): Private S3-Compatible Buckets with Ephemeral Cryptographic Signed URLs
* [`ADR-006-ai-cv-boundary.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-006-ai-cv-boundary.md): Two-Tier Computer Vision Pipeline (Client Gateway + Server Extraction)
* [`ADR-007-ai-model-abstraction.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-007-ai-model-abstraction.md): Model-Agnostic Interface & Foundation Model Version Panning
* [`ADR-008-multimodal-fusion-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-008-multimodal-fusion-architecture.md): Configurable, Versioned Weighting Strategy with Agreement Gating
* [`ADR-009-confidence-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-009-confidence-architecture.md): Calibrated Multi-Dimensional Confidence & Uncertainty Presentation
* [`ADR-010-rag-knowledge-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-010-rag-knowledge-architecture.md): `pgvector` Semantic Retrieval with Classical Literature Attribution
* [`ADR-011-async-processing.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-011-async-processing.md): Idempotent Analysis Processing Pipeline with Realtime State Streaming
* [`ADR-012-auth-boundary.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-012-auth-boundary.md): Supabase Cryptographic Auth & Server-Side Token Ownership Enforcement
* [`ADR-013-realtime-communication.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-013-realtime-communication.md): Supabase Realtime Channels for Long-Running Analysis Telemetry
* [`ADR-014-observability.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-014-observability.md): Structured Correlation Logging with Biometric Data Redaction
* [`ADR-015-deployment-strategy.md`](file:///D:/Project%20Aayurface/docs/engineering/architecture/adr/ADR-015-deployment-strategy.md): GitOps CI/CD with Isolated Multi-Stage Environments

---

### 3. Architecture Diagrams

Mermaid source diagrams are maintained under [`diagrams/`](file:///D:/Project%20Aayurface/docs/engineering/architecture/diagrams/):

1. `system-context.mmd`: C4 Level 1 System Context Diagram
2. `container.mmd`: C4 Level 2 Container Architecture Diagram
3. `component.mmd`: C4 Level 3 Component Breakdown Diagram
4. `data-flow.mmd`: End-to-End Multimodal Data Flow
5. `face-analysis.mmd`: Capture Gateway & CV Feature Extraction Pipeline
6. `fusion.mmd`: Multimodal Fusion & Cosine Agreement Engine
7. `rag.mmd`: RAG Retrieval, Citation & Verification Pipeline
8. `auth-flow.mmd`: Authentication, Session Lifecycle & RLS Enforcement
9. `async-analysis.mmd`: Asynchronous Analysis Pipeline & State Machine
10. `deployment.mmd`: Multi-Environment Infrastructure & CI/CD Architecture
11. `migration.mmd`: Phased Current → Transition → Target Migration Blueprint
