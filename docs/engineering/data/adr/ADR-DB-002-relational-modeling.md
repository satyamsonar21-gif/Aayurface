# Architecture Decision Record (ADR)
## ADR-DB-002: Relational Modeling — Relational Normalization vs Structured JSONB Storage

**Status:** TARGET  
**Date:** 2026-09-03  
**Deciders:** Principal Database Architect, Data Architect, Staff Backend Architect  
**Technical Category:** Data Modeling & Schema Design  

---

### Context & Problem Statement
In the existing prototype schema (`supabase/schema.sql`), `scan_results` stores causes, remedies, prevention tips, and raw analysis inside unconstrained `JSONB` columns (`causes JSONB`, `remedies JSONB`, `prevention_tips JSONB`, `raw_analysis JSONB`). While JSONB provides rapid prototyping flexibility, using it indiscriminately creates critical production failures:
1. Foreign key constraints cannot be enforced between JSONB elements and classical literature tables.
2. Relational integrity cannot prevent corrupt or malformed structures.
3. Querying specific ingredients or filtering by dosha requires expensive JSONB containment operations (`@>`) or full table scans.
4. Updates to individual recommendation items require rewriting the entire JSONB document.

### Decision Drivers
1. **Referential Integrity:** Ensure classical citations link directly to verified `knowledge_chunks`.
2. **Query Performance:** Support fast filtering by dominant dosha, skin characteristics, and routine completion dates.
3. **Reproducibility & Lineage:** Ensure extracted visual signals and multimodal weights are queryable mathematical vectors.
4. **Data Contract Enforcement:** Guarantee that AI output payloads strictly adhere to normalized schemas without relying on client-side parsing tolerance.

### Decision Outcome
**Chosen Option: Normalized Relational Model (3NF) for Domain Entities with Strictly Scoped JSONB for Deep Polymorphic Payloads.**

#### Specific Architectural Allocations:
* **Relational Entities (Strict 3NF):**
  * `scan_results`: Primary metadata, dominant dosha, calibrated confidence, agreement state, versions.
  * `visual_observations`: Normalized numerical columns (`cielab_a_mean`, `glcm_contrast`, `melanin_index`).
  * `multimodal_fusions`: Explicit scalar columns for visual, quiz, lifestyle, and fused doshic vectors.
  * `recommendation_items`: Individual relational rows linking to `scan_results.id` and foreign key `knowledge_chunks.id`.
  * `routines` and `routine_items`: Normalized master-detail relationship with individual item scheduling.
* **Permitted JSONB Fields (Semi-Structured / Polymorphic):**
  * `visual_observations.regional_features`: Detailed facial ROI coordinate masks (forehead, left cheek, right cheek) that are strictly read together for canvas overlays.
  * `consents.client_metadata`: Browser User-Agent and network metadata collected solely for legal compliance audit proofs.
  * `capture_quality_metrics.raw_landmarks`: 468 landmark coordinate vectors stored only when research consent is active.

### Consequences
* **Positive:** Absolute database-enforced integrity; zero orphan records; direct foreign keys to verified knowledge chunks; fast indexed queries.
* **Negative:** Requires multi-table transactions (`INSERT INTO scan_results`, `visual_observations`, `multimodal_fusions`, `recommendation_items`) during analysis persistence instead of a single document dump.
* **Status Classification:** `TARGET` — scheduled for Milestone 04 schema implementation.
