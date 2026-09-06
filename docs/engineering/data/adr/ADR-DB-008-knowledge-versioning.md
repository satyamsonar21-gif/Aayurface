# Architecture Decision Record (ADR)
## ADR-DB-008: Knowledge Versioning — Classical Literature Ingestion & Lineage

**Status:** TARGET  
**Date:** 2026-09-03  
**Deciders:** AI Data Architect, Principal Database Architect, Ayurvedic Knowledge Systems Analyst  
**Technical Category:** RAG Knowledge Architecture & Content Governance  

---

### Context & Problem Statement
RAG generation in AayurFace relies on grounded retrieval from classical Ayurvedic texts (*Charaka Samhita*, *Sushruta Samhita*, *Ashtanga Hridaya*, and *Bhavaprakasha*). Over time, translations will be refined, modern botanical cross-references updated, or erroneous shloka transcriptions corrected. If knowledge chunks are directly overwritten in place, past analyses that cited those chunks will point to modified or contradictory text, destroying historical traceability.

### Decision Drivers
1. **Citation Immutability:** A recommendation generated on Day 1 must always trace to the exact Sanskrit and translation text retrieved at that moment.
2. **Domain Expert Approval:** Knowledge chunks must require certified Ayurvedic expert sign-off before becoming active.
3. **Graceful Deprecation:** Enable retiring outdated or controversial chunks without breaking foreign key referential integrity in historical scan records.

### Decision Outcome
**Chosen Option: Immutable Versioned Knowledge Chunks with Lifecycle Status Flags.**

#### Architecture Specifications:
* **Schema Decomposition:**
  * `knowledge_sources`: Master compendium metadata (e.g., *Charaka Samhita*).
  * `knowledge_documents`: Sthana and Adhyaya sections.
  * `knowledge_chunks`: Individual chunk entities (400–600 tokens) with Sanskrit, English, Hindi text, and vector embeddings.
* **Immutability & State Machine:** Chunks are never mutated in place. Chunks transition through:
  `DRAFT` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `ACTIVE` $\rightarrow$ `DEPRECATED` $\rightarrow$ `ARCHIVED`.
* **Deprecation Policy:** When an updated translation is vetted, a new chunk row is inserted with an incremented version (e.g., `v1.1.0`), and the prior chunk's status is set to `DEPRECATED`. Active RAG searches filter strictly by `status = 'ACTIVE'`. Historical scans retain foreign keys pointing to the original chunk ID.

### Consequences
* **Positive:** Absolute auditability and scientific reproducibility; zero broken foreign keys in user histories; clean separation between editorial curation and runtime search.
* **Negative:** Increased row count in `knowledge_chunks` (negligible given classical literature volume $\le 50,000$ chunks).
* **Status Classification:** `TARGET` — scheduled for Milestone 09 & 10 implementation.
