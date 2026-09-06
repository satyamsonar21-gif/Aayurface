# Architecture Decision Record (ADR)
## ADR-DB-011: Vector Storage — PostgreSQL pgvector Extension with HNSW Indexing

**Status:** TARGET  
**Date:** 2026-09-03  
**Deciders:** AI Data Architect, Principal Database Architect, Platform/SRE Architect  
**Technical Category:** Vector Search & Information Retrieval  

---

### Context & Problem Statement
AayurFace requires semantic vector similarity search to retrieve classical Ayurvedic literature chunks that ground generative AI recommendations. The platform needs to decide between:
1. An external dedicated vector database (Pinecone, Qdrant, Weaviate).
2. The native PostgreSQL `pgvector` extension hosted within the primary Supabase instance.
Additionally, within `pgvector`, an index structure (IVFFlat vs HNSW) must be selected for 1536-dimensional OpenAI embeddings (`text-embedding-3-small`).

### Decision Drivers
1. **Operational Simplicity & Cost:** Avoid operating and paying for an external vector database cluster for a relatively small, highly curated corpus ($\le 50,000$ classical chunks).
2. **Transactional Consistency & Joins:** Query vector embeddings in the same SQL statement that filters by document metadata, status, and classical work.
3. **Retrieval Latency Budget:** Support semantic vector retrieval within the target retrieval budget ($\le 25\text{ms}$).
4. **Index Build Performance:** HNSW provides high recall without requiring periodic cluster re-training like IVFFlat.

### Decision Outcome
**Chosen Option: PostgreSQL `pgvector` Extension with Hierarchical Navigable Small World (HNSW) Cosine Distance Indexing.**

#### Architecture Specifications:
* **Extension:** `CREATE EXTENSION IF NOT EXISTS vector;`
* **Column Definition:** `knowledge_chunks.embedding vector(1536)` (generated via OpenAI `text-embedding-3-small`).
* **HNSW Index:**
  ```sql
  CREATE INDEX idx_knowledge_chunks_embedding_hnsw 
  ON knowledge_chunks 
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
  ```
* **Gating Threshold:** Vector searches specify an initial safety threshold: cosine similarity $\ge 0.75$ and match count $\ge 2$ (**HYPOTHESIS / PROPOSED SAFETY CONFIGURATION; REQUIRES VALIDATION** prior to production deployment).

### Consequences
* **Positive:** Zero external vector database infrastructure; unified backups; ACID transactions; sub-20ms vector lookups; high recall.
* **Negative:** HNSW indexes consume significant memory (RAM); for 50,000 chunks of 1536 dimensions, the HNSW index requires $\approx 350\text{ MB}$ of RAM, easily accommodated within standard Supabase instance tiers.
* **Status Classification:** `TARGET (REQUIRES IMPLEMENTATION & RETRIEVAL VALIDATION)` — scheduled for Milestone 09 implementation.
