# Phase 13 Ingestion Pipeline & Cryptographic Idempotency
**Domain:** Document Ingestion, Content Hashing & Versioning  
**Standard:** Forensic • Deterministic • Production-Grade  
**Date:** September 2026  

---

## 1. Idempotent Ingestion Mathematics

To eliminate duplicate ingestion runs, redundant vector rows, and stale chunk cache pollution, every ingested document and chunk is assigned a deterministic cryptographic identity:

### 1.1 Ingestion Run Identity:
$$\text{IngestionKey} = \text{SHA256}(\text{sourceId} \parallel \text{sourceVersion} \parallel \text{contentHash} \parallel \text{parserVersion})$$

If an ingestion job is triggered with matching parameters, the ingestion engine detects an existing `IngestionKey` and safely short-circuits with a `304 Not Modified` / no-op semantic.

### 1.2 Chunk Addressability:
$$\text{ChunkId} = \text{"chunk-"} \parallel \text{normalized}(\text{sourceId} \parallel \text{section} \parallel \text{chapter} \parallel \text{verse/page})$$

Example: `chunk-src-ah-mar-sutrasthana-ayushkamiya-adhyaya-chapter-1-11`

---

## 2. Ingestion Stages

1. **Physical File Check:** Verify file existence, byte size, and compute full-file SHA-256 hash.
2. **Anti-Poisoning Scan (`detectDocumentPoisoning`):** Scan for instruction injection patterns (e.g., `IGNORE ALL PREVIOUS INSTRUCTIONS`, hidden developer commands, or unescaped XML delimiters).
3. **Semantic Normalization (`normalizeText`):**
   - Strips non-printable control characters.
   - Cleans pagination artifacts and repeated headers/footers.
   - Preserves all Devanagari combined glyphs and Sanskrit diacriticals.
4. **Citation-Preserving Chunking (`createKnowledgeChunk` / `chunkNarrativeText`):**
   - Attaches chapter, section, verse, and page coordinates.
   - Computes chunk-level SHA-256 hash.
   - Attaches authority tier (`TIER_1_CLASSICAL_PRIMARY` through `TIER_4_PROJECT_RESEARCH`).
   - Assigns topical safety classification (`TOPICAL_SAFE`, `CAUTION_REQUIRED`, etc.).
5. **Semantic Embedding Projection (`generateSemanticEmbedding`):**
   - Projects term frequencies across 48 reserved Ayurvedic semantic axes.
   - Incorporates general token projections across remaining dimensions.
   - Computes unit $L_2$ vector normalization.
6. **Vector Store Registration (`VectorStore.addChunk`):**
   - Commits chunk and unit vector to the in-memory or pgvector store.
