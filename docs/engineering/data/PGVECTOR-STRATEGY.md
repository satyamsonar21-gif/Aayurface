# AayurFace — Database Architecture Specification
## PostgreSQL pgvector Architecture, HNSW Indexing & Semantic Search

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** AI Data Architect, Principal Database Architect  

---

### 1. Vector Search Architecture Selection

| Dimension | Option A: IVFFlat | Option B: HNSW (Chosen Standard) | Architectural Rationale |
|---|---|---|---|
| **Graph / Index Structure** | Inverted file with centroid Voronoi cells. | Multi-layer proximity graph (Hierarchical Navigable Small World). | HNSW delivers superior recall ($> 98\%$) and consistent sub-20ms search speeds without partition misses. |
| **Index Maintenance** | Requires periodic re-indexing and training on large datasets. | Dynamic, incremental insertions without re-training. | Editorial staff can insert and approve new classical chunks incrementally without index downtime. |
| **Memory Consumption** | Lower RAM footprint ($\approx 100\text{ MB}$). | Higher RAM footprint ($\approx 350\text{ MB}$ for 50,000 chunks). | Fully sustainable within standard Supabase instance RAM tiers ($4\text{ GB} - 8\text{ GB}$). |
| **Distance Metric** | Cosine distance (`vector_cosine_ops`). | Cosine distance (`vector_cosine_ops`). | Standard metric for normalized semantic embeddings (`text-embedding-3-small`). |

---

### 2. Physical Schema & Index Configuration

```sql
-- Target Database Configuration for pgvector (Milestone 09)

CREATE EXTENSION IF NOT EXISTS vector;

-- Define HNSW Index on Classical Knowledge Chunks
CREATE INDEX idx_knowledge_chunks_embedding_hnsw 
ON knowledge_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

#### Index Parameter Specifications:
* `m = 16`: Number of bidirectional links per node in the HNSW graph. Balances index size with graph connectivity.
* `ef_construction = 64`: Size of the dynamic candidate list during index building. Guarantees high clustering quality.
* `ef_search = 40`: Runtime query parameter. Configured locally before executing similarity queries (`SET LOCAL hnsw.ef_search = 40;`) to balance search latency ($< 20\text{ms}$) with recall ($> 98\%$).

---

### 3. Runtime Cosine Similarity Query & Safety Thresholds

```sql
-- Runtime Classical Knowledge Retrieval Query (Target Architecture)
SET LOCAL hnsw.ef_search = 40;

SELECT id, source_work, section_reference, verse_numbers,
       content_english, content_sanskrit,
       1 - (embedding <=> :query_vector) AS cosine_similarity
FROM knowledge_chunks
WHERE status = 'ACTIVE'
  AND (1 - (embedding <=> :query_vector)) >= 0.75
ORDER BY embedding <=> :query_vector
LIMIT 5;
```

#### Semantic Retrieval Safety Threshold Classification:
* **Threshold Status:** **HYPOTHESIS / PROPOSED SAFETY CONFIGURATION (REQUIRES VALIDATION)**.
* **Formal Threshold Statement:**
  > The values **0.75 cosine similarity** and **minimum 2 vetted matches** are initial safety hypotheses/configuration candidates. They require empirical calibration against the actual curated knowledge corpus and retrieval evaluation dataset before being treated as validated operating thresholds.

#### Mandatory Future Validation Requirements (Out of Scope for Phase 04-C; Scheduled for Milestone 09/10):
Prior to certifying these retrieval gates for production, the AI Data Architecture team must validate:
1. **Retrieval Precision:** Proportion of retrieved chunks that are directly relevant to the target Ayurvedic constitutional imbalance.
2. **Retrieval Recall:** Proportion of known relevant classical passages successfully retrieved by the query vector.
3. **False-Positive Retrieval Rate:** Frequency of retrieving inappropriate or non-applicable herbal formulations.
4. **False-Negative Retrieval Rate:** Frequency of failing to retrieve relevant safety warnings or classical contraindications.
5. **Corpus Size Sensitivity:** Retrieval latency and ranking stability as the chunk volume scales from 1,000 to 50,000 chunks.
6. **Embedding Model Comparison:** Evaluation of `text-embedding-3-small` vs domain-specific or multilingual embedding models.
7. **Language Variation:** Consistency of retrieval vectors across Devanagari Sanskrit, IAST Romanization, English, and Hindi.
8. **Chunking Strategy:** Optimization of token window size (e.g., 300 vs 500 vs 800 tokens) with respect to shloka semantic boundaries.
9. **Duplicate Sources:** Handling of identical or overlapping verses found across both *Charaka* and *Ashtanga Hridaya*.
10. **Source Authority Weighting:** Preferential ranking of Brihat Trayi primary classical texts over secondary commentaries.
11. **Multilingual Retrieval:** Cross-lingual semantic alignment between English user queries and Sanskrit source shlokas.
12. **Expert Relevance Judgement:** Formal double-blind evaluation by certified Ayurvedic domain experts scoring retrieved verse relevance.
