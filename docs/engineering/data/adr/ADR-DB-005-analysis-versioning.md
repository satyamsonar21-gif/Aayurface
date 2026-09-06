# Architecture Decision Record (ADR)
## ADR-DB-005: Analysis Versioning — Immutable Snapshots & Multi-Version Reproducibility

**Status:** TARGET  
**Date:** 2026-09-03  
**Deciders:** AI Data Architect, Principal Database Architect, Ayurvedic Knowledge Analyst  
**Technical Category:** AI Governance & Data Lineage  

---

### Context & Problem Statement
Machine learning and foundation models evolve rapidly. Over the operational life of AayurFace, foundation model checkpoints (`gpt-4o-2024-08-06`), computer vision landmark extractors, multimodal fusion weights, system prompts, and classical knowledge embeddings will be upgraded. If an analysis record does not record the exact operational versions active at the moment of execution, historical assessments become non-reproducible, and comparing scans taken 30 days apart becomes statistically invalid.

### Decision Drivers
1. **Scientific Reproducibility:** Every generated Ayurvedic recommendation and doshic score must be mathematically reproducible from stored inputs.
2. **Auditability & Ayurvedic Lineage Traceability:** Capability to investigate user feedback by reconstructing the exact prompt, weights, and classical knowledge context presented to the model.
3. **Data Immutability:** Historical wellness analyses must never be silently mutated when platform software or AI models are updated.
4. **Longitudinal Comparability:** Ensure progress tracking engines know whether score shifts stem from lifestyle improvements or algorithm calibration updates.

### Decision Outcome
**Chosen Option: Immutable Append-Only Analysis Records with Multi-Vector Semantic Versioning.**

#### Architecture Specifications:
* **Append-Only Immutability:** `scan_results` records are strictly immutable. PostgreSQL Row-Level Security policies explicitly deny `UPDATE` operations to all roles (`CREATE POLICY ... FOR UPDATE USING (false)`).
* **Mandatory Semantic Version Columns in `scan_results`:**
  * `cv_version`: Version of the computer vision landmarking and feature extraction pipeline (e.g., `cv-v1.0.0`).
  * `fusion_version`: Version identifier of the multimodal fusion configuration and weights (e.g., `fuse-v1.1.0`).
  * `model_version`: Pinned upstream foundation model checkpoint string (e.g., `gpt-4o-2024-08-06`).
  * `prompt_version`: Semantic version of the master system prompt and safety fences (e.g., `prompt-v2.1.0`).
  * `knowledge_version`: Version string of the active classical RAG literature chunk database (e.g., `rag-v1.2.0`).
  * `schema_version`: Output JSON schema contract version (e.g., `schema-v1.0.0`).

### Consequences
* **Positive:** Complete scientific lineage and audit trail; zero data corruption from downstream software deployments; enables historical A/B benchmarking across algorithm releases.
* **Negative:** Storing version strings across all analysis rows increases row width slightly (mitigated by storing standardized version foreign keys or compact strings).
* **Status Classification:** `TARGET` — scheduled for Milestone 04 schema implementation.
