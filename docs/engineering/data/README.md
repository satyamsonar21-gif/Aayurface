# AayurFace — Database & Data Architecture
## Authoritative Master Data Architecture Index & Navigation Guide

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION & DATA BLUEPRINT  
**Authority:** Principal Database Architect, Data Architect, AI Data Architect, Data Security Architect, Production Systems Architect  
**Implementation Constraint:** STRICTLY DOCUMENTATION & ARCHITECTURAL MODELING ONLY (Zero SQL Executed, Zero Application Code Modified)  

---

### 1. Executive Mission & Data Philosophy

AayurFace is a privacy-first, multimodal, AI-enabled Ayurvedic skin wellness intelligence platform. The data architecture bridges physical biometric observations, self-reported constitutional lifestyle inquiries, non-deterministic foundation model reasoning, and verified classical Ayurvedic literature.

The platform's data engineering principles are anchored in five core tenets:
1. **Truth Over Completion:** Every data asset, relationship, index, and constraint is categorized by its factual empirical status (`CURRENT VERIFIED`, `TARGET`, `PROPOSED`, `HYPOTHESIS`, `OPEN DECISION`, `UNVERIFIED`, `REQUIRES VALIDATION`, `REQUIRES IMPLEMENTATION`, `REQUIRES LEGAL REVIEW`). Prototype artifacts are never conflated with production data architectures.
2. **Kernel Multi-Tenancy & Server-Derived Identity:** Tenant isolation is enforced at the PostgreSQL database engine kernel via Row-Level Security (RLS) policies evaluated against verified JWT claims (`auth.uid()`). Client-supplied identity keys (`request.body.userId`) are strictly rejected.
3. **Decoupled Biometric Storage & Minimization:** Raw facial imagery resides exclusively in private, non-public object storage with short-lived pre-signed access (target: 15-minute upload TTL) and is subject to immediate post-extraction purging or rolling retention (DEC-004). Only derived numerical phenotypic vectors (`VisualObservations`) are persisted in relational tables.
4. **Reproducible AI & Knowledge Grounding:** Generative reasoning is strictly versioned and traceable across model snapshots, system prompt versions, multimodal fusion weights, and classical literature chunk embeddings in `pgvector`. Uncertainty is treated as a first-class citizen and preserved across low agreement states.
5. **Zero Implementation in Architecture Phase:** No SQL scripts are executed, no tables created or dropped, no database migrations run, and no application code modified. This phase establishes the definitive blueprints for future implementation in Milestone 04 and subsequent milestones.

---

### 2. Master Data Architecture Index

The specifications within `docs/engineering/data/` establish the complete enterprise data architecture:

| # | Document | Purpose & Architectural Scope |
|---|---|---|
| 01 | [`CURRENT-DATABASE-AUDIT.md`](file:///D:/Project%20Aayurface/docs/engineering/data/CURRENT-DATABASE-AUDIT.md) | Forensic non-destructive audit of existing prototype `supabase/schema.sql`, mock data, and API payloads |
| 02 | [`DOMAIN-MODEL.md`](file:///D:/Project%20Aayurface/docs/engineering/data/DOMAIN-MODEL.md) | Comprehensive business domain data model across Identity, Wellness, Biometrics, AI, RAG, and Research |
| 03 | [`ENTITY-CATALOG.md`](file:///D:/Project%20Aayurface/docs/engineering/data/ENTITY-CATALOG.md) | Exhaustive catalog of all 28 target persistent and ephemeral entities with field-level constraints and ownership |
| 04 | [`LOGICAL-DATA-MODEL.md`](file:///D:/Project%20Aayurface/docs/engineering/data/LOGICAL-DATA-MODEL.md) | Formal logical relational model, normalization analysis (1NF/2NF/3NF), and justified denormalizations |
| 05 | [`RELATIONSHIPS.md`](file:///D:/Project%20Aayurface/docs/engineering/data/RELATIONSHIPS.md) | Structural relationships, cardinality, foreign key constraints, and relational dependency graph |
| 06 | [`IDENTIFIER-STRATEGY.md`](file:///D:/Project%20Aayurface/docs/engineering/data/IDENTIFIER-STRATEGY.md) | Identifier architecture: UUIDv4 vs UUIDv7 analysis, enumeration resistance, and public vs internal keys |
| 07 | [`DATA-CLASSIFICATION.md`](file:///D:/Project%20Aayurface/docs/engineering/data/DATA-CLASSIFICATION.md) | Formal 5-tier sensitivity model mapping storage locations, encryption, logging restrictions, and legal review |
| 08 | [`DATA-OWNERSHIP.md`](file:///D:/Project%20Aayurface/docs/engineering/data/DATA-OWNERSHIP.md) | Data ownership rules, principal-agent boundaries, and server-side token identity derivation |
| 09 | [`RLS-DATA-OWNERSHIP-MATRIX.md`](file:///D:/Project%20Aayurface/docs/engineering/data/RLS-DATA-OWNERSHIP-MATRIX.md) | Row-Level Security policy matrix specifying SELECT, INSERT, UPDATE, and DELETE rules for every entity |
| 10 | [`CONSTRAINTS-INTEGRITY.md`](file:///D:/Project%20Aayurface/docs/engineering/data/CONSTRAINTS-INTEGRITY.md) | Database constraints (PK, FK, CHECK, UNIQUE, NOT NULL), range bounds, and business invariant mappings |
| 11 | [`INDEXING-STRATEGY.md`](file:///D:/Project%20Aayurface/docs/engineering/data/INDEXING-STRATEGY.md) | Comprehensive query-driven indexing strategy: B-tree, GIN, HNSW, cardinality, write costs, and justification |
| 12 | [`QUERY-PATTERNS.md`](file:///D:/Project%20Aayurface/docs/engineering/data/QUERY-PATTERNS.md) | Architectural specification of high-frequency and critical operational query patterns across all features |
| 13 | [`TRANSACTION-CONCURRENCY.md`](file:///D:/Project%20Aayurface/docs/engineering/data/TRANSACTION-CONCURRENCY.md) | ACID transaction boundaries, isolation levels, optimistic locking, and race condition prevention |
| 14 | [`IDEMPOTENCY.md`](file:///D:/Project%20Aayurface/docs/engineering/data/IDEMPOTENCY.md) | Idempotency key architecture, deduplication mechanisms, and resilient network retry contracts |
| 15 | [`DATA-LIFECYCLE.md`](file:///D:/Project%20Aayurface/docs/engineering/data/DATA-LIFECYCLE.md) | End-to-end data lifecycle: Ingestion, Processing, Active State, Archival, Deletion, and Tombstoning |
| 16 | [`RETENTION-DELETION.md`](file:///D:/Project%20Aayurface/docs/engineering/data/RETENTION-DELETION.md) | Master retention schedule, cascading purge state machines, backup roll-off, and tombstone auditing |
| 17 | [`VERSIONING.md`](file:///D:/Project%20Aayurface/docs/engineering/data/VERSIONING.md) | Schema versioning, prompt versioning, model snapshot tracking, and knowledge versioning architecture |
| 18 | [`FACIAL-DATA-ARCHITECTURE.md`](file:///D:/Project%20Aayurface/docs/engineering/data/FACIAL-DATA-ARCHITECTURE.md) | Storage, lifecycle, and access architecture for facial images, capture attempts, and quality metadata |
| 19 | [`ANALYSIS-DATA-MODEL.md`](file:///D:/Project%20Aayurface/docs/engineering/data/ANALYSIS-DATA-MODEL.md) | Deep schema model for historical analyses, observations, confidence scores, and reproducibility metadata |
| 20 | [`AYURVEDIC-DATA-MODEL.md`](file:///D:/Project%20Aayurface/docs/engineering/data/AYURVEDIC-DATA-MODEL.md) | Non-diagnostic data structures representing Prakriti, Vikriti, Tridosha distributions, and classical signals |
| 21 | [`FUSION-CONFIDENCE-DATA-MODEL.md`](file:///D:/Project%20Aayurface/docs/engineering/data/FUSION-CONFIDENCE-DATA-MODEL.md) | Multimodal fusion weights, harmonic agreement index $A$, confidence calibration, and uncertainty states |
| 22 | [`RECOMMENDATION-ROUTINE-MODEL.md`](file:///D:/Project%20Aayurface/docs/engineering/data/RECOMMENDATION-ROUTINE-MODEL.md) | Dynamic and classical recommendations, Dinacharya routine templates, item scheduling, and adherence logs |
| 23 | [`LONGITUDINAL-DATA-MODEL.md`](file:///D:/Project%20Aayurface/docs/engineering/data/LONGITUDINAL-DATA-MODEL.md) | Progress tracking, 30/60/90-day checkpoint snapshots, baseline comparisons, and trend vectors |
| 24 | [`VOICE-DATA-MODEL.md`](file:///D:/Project%20Aayurface/docs/engineering/data/VOICE-DATA-MODEL.md) | Conversational voice assistant data model: ephemeral client processing vs minimal text session logging |
| 25 | [`PDF-SHARE-DATA-MODEL.md`](file:///D:/Project%20Aayurface/docs/engineering/data/PDF-SHARE-DATA-MODEL.md) | PDF export metadata, cryptographically secure share tokens, expirations, access tracking, and revocation |
| 26 | [`RAG-KNOWLEDGE-DATA-MODEL.md`](file:///D:/Project%20Aayurface/docs/engineering/data/RAG-KNOWLEDGE-DATA-MODEL.md) | Classical Ayurvedic literature schema: sources, documents, sections, vetted chunks, and approval status |
| 27 | [`PGVECTOR-STRATEGY.md`](file:///D:/Project%20Aayurface/docs/engineering/data/PGVECTOR-STRATEGY.md) | pgvector indexing (HNSW vs IVFFlat), dimensions, distance metrics, threshold gates, and re-embedding |
| 28 | [`RESEARCH-DATA-MODEL.md`](file:///D:/Project%20Aayurface/docs/engineering/data/RESEARCH-DATA-MODEL.md) | Post-MVP clinical research schema: de-identified subjects, Fitzpatrick stratifications, and cohort datasets |
| 29 | [`EXPERT-CONSENSUS-MODEL.md`](file:///D:/Project%20Aayurface/docs/engineering/data/EXPERT-CONSENSUS-MODEL.md) | Double-blind practitioner annotations, Fleiss' Kappa inter-rater agreement, and consensus adjudication |
| 30 | [`AUDIT-DATA-MODEL.md`](file:///D:/Project%20Aayurface/docs/engineering/data/AUDIT-DATA-MODEL.md) | Dedicated WORM security audit log schema, event categorization, tamper-evidence, and retention |
| 31 | [`ASYNC-JOB-DATA-MODEL.md`](file:///D:/Project%20Aayurface/docs/engineering/data/ASYNC-JOB-DATA-MODEL.md) | Asynchronous analysis job processing state machine, retry semantics, deadlines, and failure modes |
| 32 | [`API-DATA-MAPPING.md`](file:///D:/Project%20Aayurface/docs/engineering/data/API-DATA-MAPPING.md) | Bidirectional mapping from Phase 05 REST API endpoints to entities, operations, RLS, and transactions |
| 33 | [`DATA-CONTRACTS.md`](file:///D:/Project%20Aayurface/docs/engineering/data/DATA-CONTRACTS.md) | Formal logical schemas and data exchange contracts across all major subsystem boundaries |
| 34 | [`DATA-LINEAGE.md`](file:///D:/Project%20Aayurface/docs/engineering/data/DATA-LINEAGE.md) | End-to-end data lineage from raw input capture through fusion to final recommendations and routines |
| 35 | [`DATA-SECURITY-MAPPING.md`](file:///D:/Project%20Aayurface/docs/engineering/data/DATA-SECURITY-MAPPING.md) | Mapping database architectural mechanisms to STRIDE threats, BOLA mitigations, and Phase 03 controls |
| 36 | [`DATA-PRIVACY-BY-DESIGN.md`](file:///D:/Project%20Aayurface/docs/engineering/data/DATA-PRIVACY-BY-DESIGN.md) | Privacy by Design technical implementation: minimization, purpose limitation, and user rights |
| 37 | [`BACKUP-RECOVERY.md`](file:///D:/Project%20Aayurface/docs/engineering/data/BACKUP-RECOVERY.md) | Backup architecture, Point-in-Time Recovery (PITR), disaster recovery, and post-restore reconciliation |
| 38 | [`MIGRATION-STRATEGY.md`](file:///D:/Project%20Aayurface/docs/engineering/data/MIGRATION-STRATEGY.md) | Phased database migration strategy: tooling, versioning, zero-downtime guidelines, and rollback plans |
| 39 | [`SEED-REFERENCE-DATA.md`](file:///D:/Project%20Aayurface/docs/engineering/data/SEED-REFERENCE-DATA.md) | Classification of static reference, seeded classical knowledge, demo data, and production baseline seeds |
| 40 | [`ENVIRONMENT-SEPARATION.md`](file:///D:/Project%20Aayurface/docs/engineering/data/ENVIRONMENT-SEPARATION.md) | Data isolation across Development, Testing, Staging, and Production; credential boundary controls |
| 41 | [`PERFORMANCE-CAPACITY-ESTIMATES.md`](file:///D:/Project%20Aayurface/docs/engineering/data/PERFORMANCE-CAPACITY-ESTIMATES.md) | Mathematical capacity models: storage growth, row volume, IOPS, vector indices, and bandwidth projections |
| 42 | [`OBSERVABILITY.md`](file:///D:/Project%20Aayurface/docs/engineering/data/OBSERVABILITY.md) | Database observability: telemetry metrics, slow query thresholds, lock contention, and connection health |
| 43 | [`FAILURE-SCENARIOS.md`](file:///D:/Project%20Aayurface/docs/engineering/data/FAILURE-SCENARIOS.md) | Detailed failure mode analysis (FMEA) across 12 catastrophic data failure scenarios and recovery protocols |
| 44 | [`DATA-RISK-REGISTER.md`](file:///D:/Project%20Aayurface/docs/engineering/data/DATA-RISK-REGISTER.md) | Formal data risk register scoring 17 critical data architecture risks pre- and post-mitigation |
| 45 | [`DATA-DECISION-REGISTER.md`](file:///D:/Project%20Aayurface/docs/engineering/data/DATA-DECISION-REGISTER.md) | Open data decision backlog carrying forward unresolved technical decisions with owners and revisit gates |
| 46 | [`DATA-TRACEABILITY-MATRIX.md`](file:///D:/Project%20Aayurface/docs/engineering/data/DATA-TRACEABILITY-MATRIX.md) | End-to-end traceability matrix linking PRD requirements to entities, constraints, RLS, and test criteria |
| 47 | [`CONTRADICTION-AUDIT.md`](file:///D:/Project%20Aayurface/docs/engineering/data/CONTRADICTION-AUDIT.md) | Cross-phase reconciliation auditing contradictions between PRD, Phase 01-C, Phase 02-C, Phase 03, and 04 |
| 48 | [`PHASE-04-FINAL-REPORT.md`](file:///D:/Project%20Aayurface/docs/engineering/data/PHASE-04-FINAL-REPORT.md) | Comprehensive 48-section Phase 04 Final Database Architecture Report & Gate Certification |
| 49 | [`PHASE-04-C-TRUTH-AUDIT.md`](file:///D:/Project%20Aayurface/docs/engineering/data/PHASE-04-C-TRUTH-AUDIT.md) | Phase 04-C Truth Audit: Claims inventory, 9-label taxonomy, threshold hypotheses, and boundaries |
| 50 | [`PHASE-04-C-FINAL-REPORT.md`](file:///D:/Project%20Aayurface/docs/engineering/data/PHASE-04-C-FINAL-REPORT.md) | Phase 04-C Final Gate Report: Formal certification, positioning invariant, and Phase 05 unblocking |

---

### 3. Visual Data Architecture Diagrams

Located under [`diagrams/`](file:///D:/Project%20Aayurface/docs/engineering/data/diagrams/):
1. `conceptual-domain-model.mmd` — High-Level Enterprise Data Domains & Boundaries
2. `logical-erd.mmd` — Complete Entity-Relationship Diagram across all 28 Relational Entities
3. `user-data-lifecycle.mmd` — User Registration, Profile, Consent, and Cascading Account Purge
4. `facial-data-flow.mmd` — Ephemeral Capture, Signed S3 Upload, Feature Extraction & Biometric Decoupling
5. `analysis-data-flow.mmd` — End-to-End Multimodal Analysis Ingestion, Persistence & Version Lineage
6. `multimodal-fusion.mmd` — Mathematical Fusion of Visual, Questionnaire & Lifestyle Vectors
7. `rag-data-flow.mmd` — Ingestion, Vetting, Embedding, and Cosine Similarity Retrieval in `pgvector`
8. `research-data-flow.mmd` — De-Identification, Masked ROI Extraction, Double-Blind Annotation & Consensus
9. `deletion-flow.mmd` — Asynchronous Cascading Deletion State Machine with Anonymous WORM Tombstoning
10. `rls-ownership-flow.mmd` — PostgreSQL Engine Kernel Evaluation of Session Context & Policy Filtering
11. `async-job-lifecycle.mmd` — Asynchronous Analysis Job Queue, State Machine Transitions & Deadlines
12. `api-database-flow.mmd` — Transactional Boundary Mapping between API Endpoints and Database Engine

---

### 4. Architecture Decision Records (ADRs)

Located under [`adr/`](file:///D:/Project%20Aayurface/docs/engineering/data/adr/):
* `ADR-DB-001-identifier-strategy.md` — Primary Key Architecture: Sequential UUIDv7 vs Random UUIDv4
* `ADR-DB-002-relational-modeling.md` — Relational Normalization vs Structured JSONB Storage Strategy
* `ADR-DB-003-sensitive-data-separation.md` — Physical Separation of Personal Identifiers from Wellness Vectors
* `ADR-DB-004-facial-image-storage.md` — Private S3 Object Storage with Ephemeral HMAC-Signed URLs
* `ADR-DB-005-analysis-versioning.md` — Immutable Analysis Snapshots and Multi-Version Reproducibility
* `ADR-DB-006-longitudinal-data.md` — Longitudinal Checkpoint Snapshots and Historical Progress Deltas
* `ADR-DB-007-rls-ownership.md` — PostgreSQL Kernel Row-Level Security and Server-Side Identity Derivation
* `ADR-DB-008-knowledge-versioning.md` — Curated Classical Literature Ingestion and Immutable Version Lineage
* `ADR-DB-009-research-isolation.md` — Double-Blind Expert Research Enclave and De-Identification Pipeline
* `ADR-DB-010-retention-deletion.md` — Cascading Data Purge and Post-Disaster-Recovery Tombstone Reconciliation
* `ADR-DB-011-vector-storage.md` — PostgreSQL `pgvector` Extension with HNSW Cosine Distance Indexing
* `ADR-DB-012-delete-strategy.md` — Cascade Deletion Rules vs Soft-Delete Tombstones
* `ADR-DB-013-audit-data.md` — Immutable Write-Once-Read-Many (WORM) Security Telemetry Architecture
* `ADR-DB-014-async-jobs.md` — Database-Backed Asynchronous Analysis Job State Machine and Dead-Lettering
* `ADR-DB-015-indexing.md` — Workload-Driven B-Tree, GIN, and HNSW Indexing Strategy
