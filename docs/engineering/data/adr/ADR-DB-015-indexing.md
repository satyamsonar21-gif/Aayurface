# Architecture Decision Record (ADR)
## ADR-DB-015: Indexing Strategy — Workload-Driven B-Tree, GIN & HNSW Allocations

**Status:** TARGET  
**Date:** 2026-09-03  
**Deciders:** Principal Database Architect, Performance Architect, Staff Backend Architect  
**Technical Category:** Database Optimization & Physical Schema  

---

### Context & Problem Statement
Adding database indexes arbitrarily without analyzing query patterns introduces severe write amplification, inflates memory footprints, and slows down data ingestion. Conversely, missing indexes on foreign keys and RLS filter columns (`user_id`) causes PostgreSQL to fall back to sequential full table scans, destroying API response times under concurrent user loads.

### Decision Drivers
1. **Query-Pattern Alignment:** Every index must be justified by an explicit high-frequency or critical API query pattern.
2. **RLS Performance:** RLS policies evaluate `USING (auth.uid() = user_id)` on every query; foreign key lookups must be O(log N).
3. **Write Cost Balance:** Minimize indexes on high-throughput tables (`routine_tracking`, `security_audit_events`).
4. **Vector Search Recall:** Ensure vector similarity queries achieve $> 98\%$ recall within $\le 20\text{ms}$.

### Decision Outcome
**Chosen Option: Workload-Driven Index Matrix covering B-Tree, GIN, and HNSW Index Types.**

#### Physical Index Strategy:
1. **RLS & Foreign Key B-Tree Indexes:**
   * `idx_profiles_user_id`: B-tree on `profiles(id)` (Primary Key).
   * `idx_consents_user_scope`: Compound B-tree on `consents(user_id, scope, status)`.
   * `idx_scan_results_user_created`: Compound B-tree on `scan_results(user_id, created_at DESC)`.
   * `idx_routines_user_active`: Compound B-tree on `routines(user_id, is_active)`.
   * `idx_routine_tracking_user_date`: Compound B-tree on `routine_tracking(user_id, tracking_date)`.
2. **Specialized Search & Text GIN Indexes:**
   * `idx_remedies_skin_concerns_gin`: GIN index on `remedies(skin_concerns)` for fast array overlap queries (`&&`).
   * `idx_remedies_skin_types_gin`: GIN index on `remedies(skin_types)`.
3. **Vector Similarity HNSW Index:**
   * `idx_knowledge_chunks_embedding_hnsw`: HNSW index on `knowledge_chunks(embedding vector_cosine_ops)` with `m=16, ef_construction=64`.
4. **Job Queue Partial B-Tree Index:**
   * `idx_analysis_jobs_queue_partial`: Filtered B-tree on `analysis_jobs(created_at ASC) WHERE status IN ('QUEUED', 'RETRYING')`. Eliminates indexing completed/failed jobs.

### Consequences
* **Positive:** Sub-10ms point lookups; sub-20ms RAG vector searches; zero full table scans during RLS policy evaluations; minimal index maintenance overhead for completed jobs.
* **Negative:** Index maintenance adds slight CPU overhead to inserts (quantified and verified acceptable in capacity estimates).
* **Status Classification:** `TARGET` — scheduled for Milestone 04 & 09 implementation.
