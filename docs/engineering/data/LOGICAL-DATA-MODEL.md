# AayurFace — Database Architecture Specification
## Logical Relational Data Model & Normalization Analysis

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Data Architect  

---

### 1. Normalization Analysis (1NF, 2NF, 3NF)

The target relational model is designed to Third Normal Form (3NF) to guarantee data integrity, eliminate update anomalies, and maintain clear functional dependencies:

#### First Normal Form (1NF) Compliance:
* **Atomicity:** All table columns store atomic scalar values (integers, floats, timestamps, enums).
* **Repeating Groups Eliminated:** The prototype anti-pattern of storing arrays of complex remedy objects or cause strings within unstructured columns is eliminated. Elements are decomposed into `recommendation_items` and `routine_items`.
* **Unique Identification:** Every row is uniquely identified by an immutable UUID primary key.

#### Second Normal Form (2NF) Compliance:
* **Full Functional Dependency:** In tables with compound keys (e.g., `routine_tracking` on `(user_id, routine_item_id, tracking_date)`), every non-key attribute (`is_completed`, `completed_at`) depends functionally on the complete primary key, not a partial subset.
* **Partial Dependencies Eliminated:** Separate entities (`routines` vs `routine_items`) prevent duplicating routine metadata across individual ritual tracking logs.

#### Third Normal Form (3NF) Compliance:
* **Transitive Dependencies Eliminated:** Non-key attributes depend strictly and directly on the primary key, and nothing else (e.g., in `scan_results`, derived visual characteristics depend on `scan_id` via a dedicated 1-to-1 relation `visual_observations`, rather than transiting through capture metadata).
* **Reference Isolation:** `recommendation_items` references `knowledge_chunks.id` rather than redundantly copying Sanskrit verse text into every user recommendation row.

---

### 2. Rigorous Justification for Controlled Denormalizations

In enterprise production architectures, controlled denormalization is permitted only when strictly justified by read latency budgets and immutable snapshot semantics. Every denormalization in AayurFace is formalized below:

#### Denormalization 1: Precomputed Fused Tendencies in `multimodal_fusions`
* **Denormalized Fields:** `fused_vata`, `fused_pitta`, `fused_kapha`, `agreement_index`.
* **Why:** The fused vector and harmonic agreement index $A$ are derived mathematically from visual, questionnaire, and lifestyle vectors. Re-executing linear algebra and cosine similarity math across three tables during high-frequency user dashboard requests introduces unnecessary CPU and query latency.
* **Trade-Off:** Adds 32 bytes of storage per scan row.
* **Consistency Strategy:** The analysis snapshot is strictly **IMMUTABLE**. Once persisted, the input vectors and fused vectors never change. Zero risk of write-skew or drift.
* **Query Benefit:** Enables instant O(1) filtering on `fused_pitta > 0.50` and direct charting on mobile clients.
* **Update Strategy:** Updates are physically prohibited via PostgreSQL RLS (`FOR UPDATE USING (false)`).

#### Denormalization 2: `dominant_dosha` and `calibrated_confidence` on `scan_results`
* **Denormalized Fields:** `dominant_dosha`, `calibrated_confidence`, `agreement_state`.
* **Why:** These high-level summary values are queried on every single screen render of the history timeline (`GET /api/v1/analysis`). Joining through `multimodal_fusions` for a simple list view adds unnecessary join overhead.
* **Trade-Off:** Redundant with the maximum value in `multimodal_fusions.fused_*`.
* **Consistency Strategy:** Atomic insert within the same database transaction. Records are immutable.
* **Query Benefit:** Allows index-only scans on `scan_results(user_id, created_at DESC)` to render the complete user history list in $< 5\text{ms}$.
* **Update Strategy:** Never updated.

#### Denormalization 3: `progress_checkpoints` Precomputed Deltas
* **Denormalized Fields:** `erythema_delta`, `texture_delta`, `adherence_percentage_30d`.
* **Why:** Computing 30-day symptom deltas on-the-fly requires scanning dozens of past daily logs and past analyses. Precomputing checkpoints guarantees sub-50ms dashboard loading.
* **Trade-Off:** Duplicate storage of calculated differences.
* **Consistency Strategy:** Checkpoint rows are generated asynchronously by an idempotent worker upon scan completion. Checkpoint rows are immutable.
* **Query Benefit:** O(1) single-row lookup for progress visualizations.
* **Update Strategy:** Never updated.

---

### 3. Strict Boundary for JSONB Storage

JSONB is **NOT** a shortcut for lazy data modeling. In AayurFace, JSONB is strictly restricted to three specific architectural use cases:

1. **Facial ROI Coordinate Masks (`visual_observations.regional_features`):**
   * Stored as JSONB because the bounding polygons of the forehead, left cheek, and right cheek are polymorphic coordinate arrays ($x, y$ landmark floats) that are always fetched together and rendered as a single SVG canvas overlay. They are never queried or filtered individually.
2. **Technical Quality Landmark Arrays (`capture_quality_metrics.raw_landmarks`):**
   * 468 MediaPipe landmark coordinate points are stored as an in-memory JSON array for research auditability. Creating 468 relational rows per photo would result in 468,000,000 rows per 1,000,000 photos with zero relational benefit.
3. **Legal Client Metadata (`consents.client_metadata`):**
   * User-Agent strings, screen dimensions, and network subnet hashes captured solely to provide forensic proof of consent in regulatory disputes.
