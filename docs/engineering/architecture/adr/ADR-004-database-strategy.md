# Architecture Decision Record: ADR-004
## Database Strategy: Supabase Managed PostgreSQL with Row-Level Security (RLS) & pgvector

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Deciders:** Data Architect, Security Architect, Principal Software Architect  
**Technical Area:** Persistence & Vector Store  

---

### 1. Context
The platform stores structured relational entities (user profiles, consent audit logs, questionnaire answers, daily routines) alongside high-dimensional vector embeddings for classical Ayurvedic literature retrieval.

### 2. Problem
Selecting a unified or bifurcated database architecture that guarantees strict multi-tenant data isolation and enables sub-20ms semantic search over classical Ayurvedic texts.

### 3. Options Evaluated
* **Option A: PostgreSQL with Row-Level Security & `pgvector` Extension (Selected):** Unified relational and vector database managed by Supabase.
* **Option B: Bifurcated Database (PostgreSQL + External Vector Cloud like Pinecone):** Relational data stored in Postgres; embeddings stored in Pinecone/Qdrant.
* **Option C: NoSQL Document Store (MongoDB / DynamoDB):** Document-based JSON storage.

### 4. Decision
Adopt **Option A: Supabase Managed PostgreSQL with Row-Level Security (RLS) & `pgvector`**.
The target architecture requires Row-Level Security (RLS) coverage for all applicable user-owned sensitive tables (`auth.uid() = user_id`); implementation and verification are pending in Milestone 04. Classical Ayurvedic literature is embedded and indexed directly inside PostgreSQL using the `pgvector` extension and HNSW indexing.

### 5. Rationale
* **ACID Transactions:** Analysis snapshots, routine assignments, and history updates occur within transactional integrity boundaries.
* **Kernel-Level Multi-Tenancy:** Row-Level Security ensures that even if an application layer bug occurs, the database engine physically blocks cross-tenant data leakage.
* **Zero Cross-Cloud Overhead:** Colocating vectors inside Postgres avoids extra cloud bills, separate vector security credentials, and cross-system latency.

### 6. Consequences
* *Positive:* Single source of truth, unified backup/restore, strong relational constraints, zero additional vector cloud costs.
* *Negative:* Vector index memory usage must be monitored as the classical corpus grows beyond 100,000 chunks.

### 7. Risks & Mitigations
* *Risk:* Complex RLS policies introduce query latency.
* *Mitigation:* Apply index on `(user_id)` across all user-scoped tables; keep RLS expressions atomic (`USING (auth.uid() = user_id)`).

### 8. Evidence
`supabase/schema.sql` inspection confirmed existing PostgreSQL foundation; `pgvector` is natively supported in Supabase.

### 9. Revisit Conditions
Revisit if vector corpus scales to millions of real-time expert-annotated records requiring distributed vector sharding.
