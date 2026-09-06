# Architecture Decision Record: ADR-010
## RAG & Knowledge Architecture: pgvector Semantic Retrieval with Classical Attribution

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Deciders:** AI/ML Architect, Ayurvedic Knowledge Analyst, Staff Backend Architect  
**Technical Area:** Knowledge Retrieval & Classical Literature Grounding  

---

### 1. Context
Ayurvedic skin care guidance must be rooted in verified classical literature (*Charaka Samhita*, *Sushruta Samhita*, *Bhavaprakasha*) to guarantee safety and authenticity. The current prototype uses a static 3-branch `if/else` keyword check in `ChatPage.tsx` and ungrounded LLM completions.

### 2. Problem
Architecting a retrieval pipeline that guarantees grounding in classical literature, eliminates unverified remedy fabrication, and provides verifiable chapter and verse citations.

### 3. Options Evaluated
* **Option A: Pure Prompt Engineering (No Retrieval):** Instruct GPT-4o in the system prompt to "act like an Ayurvedic expert" and remember Charaka Samhita.
* **Option B: RAG with External Vector SaaS (Pinecone / Weaviate):** Store embeddings in external managed vector clouds.
* **Option C: Colocated PostgreSQL `pgvector` Retrieval with Fallback Safeguards (Selected):** Store chunked classical literature and 1536-dim embeddings in PostgreSQL via `pgvector`; execute cosine similarity searches; enforce deterministic fallback on retrieval miss.

### 4. Decision
Adopt **Option C: Colocated PostgreSQL `pgvector` Retrieval with Fallback Safeguards**.
* Classical texts are chunked (400–600 tokens) with chapter/verse metadata and embedded using OpenAI `text-embedding-3-small`.
* Queries retrieve top-5 chunks using cosine distance (`<=>`).
* If fewer than 2 chunks achieve $\ge 0.75$ similarity, generative synthesis is halted and a safe limitation fallback is presented.

### 5. Rationale
* **Zero Hallucination of Remedies:** LLMs cannot invent obscure herbal treatments when constrained strictly to retrieved context.
* **Architectural Simplicity:** `pgvector` operates directly inside the existing PostgreSQL database, avoiding external network roundtrips and separate cloud contracts.
* **Auditable Provenance:** Every insight links directly to verifiable verse references.

### 6. Consequences
* *Positive:* Authentic classical citations, strict safety guarantees, zero extra database infrastructure.
* *Negative:* Requires upfront editorial effort to curate and ingest clean classical Ayurvedic translations.

### 7. Risks & Mitigations
* *Risk:* Vector search misses relevant verses due to vocabulary mismatch (Sanskrit vs English terms).
* *Mitigation:* Hybrid metadata filtering by dosha domain and dual Sanskrit/English terminology indexing.

### 8. Evidence
Prototype reconnaissance confirmed Supabase PostgreSQL supports `pgvector` out of the box.

### 9. Revisit Conditions
Revisit if classical literature corpus expands beyond 500,000 chunks requiring dedicated distributed vector indexing.
