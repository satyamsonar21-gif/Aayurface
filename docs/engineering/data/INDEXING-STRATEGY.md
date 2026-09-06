# AayurFace — Database Architecture Specification
## Query-Driven Indexing Strategy & Performance Allocation

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Performance Architect  

---

### 1. Indexing Philosophy & Trade-Off Governance

Every index consumes disk space and memory, and adds write amplification to every `INSERT`, `UPDATE`, and `DELETE` operation. In AayurFace, an index is approved only if:
1. It directly accelerates an explicit high-frequency user query (e.g., rendering the user's latest analysis).
2. It supports foreign key joins and PostgreSQL Row-Level Security policy evaluation (`auth.uid() = user_id`), preventing full table scans.
3. It provides specialized capability (e.g., pgvector HNSW for semantic search, GIN for array containment).

---

### 2. Comprehensive Workload-Driven Index Matrix

| Index Name | Target Table & Indexed Columns | Index Type | Accelerated Operational Query Pattern | Column Cardinality | Write Cost Impact | Architectural Justification | Target Status |
|---|---|---|---|---|---|---|---|
| `idx_profiles_email_unique` | `profiles(email)` | B-tree (UNIQUE) | User login lookup via email; uniqueness enforcement during registration. | High (Unique) | Minimal (Infrequent profile inserts) | Essential for authentication lookup and preventing duplicate accounts. | Target |
| `idx_consents_user_scope_active` | `consents(user_id, scope) WHERE status = 'GRANTED'` | Partial B-tree | Pre-flight API check: "Does user have active biometric consent before capture?" | High (user) / Low (scope) | Minimal (Infrequent consent changes) | Partial index keeps index size tiny ($< 1\text{ MB}$); sub-1ms consent verification. | Target |
| `idx_scan_results_user_created` | `scan_results(user_id, created_at DESC)` | Compound B-tree | `GET /api/v1/analysis` (History timeline) and `GET /api/v1/analysis/latest`. | High (user) / High (time) | Moderate (One insert per scan) | Crucial for RLS filtering and instant reverse-chronological timeline pagination. | Target |
| `idx_analysis_jobs_queue_partial`| `analysis_jobs(created_at ASC) WHERE status IN ('QUEUED', 'RETRYING')` | Partial B-tree | Worker polling: `SELECT * FROM analysis_jobs WHERE status IN ('QUEUED', 'RETRYING') FOR UPDATE SKIP LOCKED LIMIT 1;` | Low (Only pending jobs) | Minimal (Excludes completed jobs) | Extremely fast worker dequeue; index stays tiny because completed jobs are excluded. | Target |
| `idx_analysis_jobs_user_idempotency`| `analysis_jobs(user_id, idempotency_key)` | B-tree (UNIQUE) | API submission deduplication: "Has this exact request already been enqueued?" | High (Unique) | Minimal (One write per analysis) | Prevents duplicate background workers from executing identical analysis requests. | Target |
| `idx_captures_user_retention` | `captures(user_id, retention_state)` | Compound B-tree | S3 cleanup worker: "Find unpurged captures for users requesting erasure." | High (user) / Low (state) | Minimal (One insert per capture) | Eliminates table scans during daily automated biometric purge runs. | Target |
| `idx_routines_user_active` | `routines(user_id) WHERE is_active = TRUE` | Partial B-tree | Home screen query: "Fetch user's currently active Dinacharya routine." | High (user) | Minimal (Rare routine swaps) | Guarantees instant sub-2ms home screen loading of daily rituals. | Target |
| `idx_routine_tracking_user_date` | `routine_tracking(user_id, tracking_date)` | Compound B-tree | Daily checkbox query: "Which rituals has the user completed today?" | High (user) / Moderate (date) | Moderate (Multiple daily checkbox clicks)| Accelerates habit adherence calculations and weekly streak tracking. | Target |
| `idx_progress_user_interval` | `progress_checkpoints(user_id, checkpoint_interval)` | Compound B-tree | Longitudinal dashboard: "Fetch 30, 60, and 90-day progress deltas." | High (user) / Low (interval) | Minimal (One write every 30 days) | Enables instant rendering of longitudinal trend graphs. | Target |
| `idx_shared_reports_token_hash`| `shared_reports(token_hash)` | B-tree (UNIQUE) | Public link resolution: `GET /share/{token}` $\rightarrow$ lookup by SHA-256 hash. | High (Unique) | Minimal (Infrequent share generation) | Guarantees O(1) hash lookup; prevents sequential table scans on public endpoints. | Target |
| `idx_knowledge_chunks_embedding_hnsw` | `knowledge_chunks(embedding vector_cosine_ops)` | HNSW | RAG retrieval: `SELECT ... ORDER BY embedding <=> query_vector LIMIT 5;` | High (1536-dim vector) | Rare (Only during admin verse ingestion) | Sub-20ms approximate nearest neighbor search with $> 98\%$ recall. | Target |
| `idx_knowledge_chunks_status` | `knowledge_chunks(status)` | B-tree | Editorial admin filter: "List chunks pending expert domain review." | Low (4 status values) | Rare (Admin curation) | Filters active vs deprecated chunks during RAG searches. | Target |
| `idx_security_audit_created` | `security_audit_events(created_at DESC)` | B-tree | Security SIEM: "Stream latest security audit events for forensic review." | High (Time) | Moderate (Appends on security events) | Enables rapid forensic filtering during incident triage. | Target |
| `idx_remedies_skin_concerns_gin`| `remedies(skin_concerns)` | GIN | Library search: "Find remedies targeting Acne and Redness (`&& ARRAY[...]`)." | Moderate | Rare (Static catalog) | Enables lightning-fast array overlap searches on classical remedies catalog. | Target |
| `idx_remedies_skin_types_gin` | `remedies(skin_types)` | GIN | Library search: "Find remedies compatible with Pitta-sensitive skin." | Low | Rare (Static catalog) | Fast multi-tag array filtering in the Ayurvedic remedy library. | Target |
