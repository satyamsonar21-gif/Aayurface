# AayurFace — Database Architecture Specification
## Database Constraints, Invariants & Integrity Architecture

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, QA/Test Architect  

---

### 1. The Defense-in-Depth Integrity Principle

Data integrity in AayurFace is never left exclusively to application-layer code:
* Application code validation (via Zod schemas) catches errors early at the API perimeter.
* Database engine constraints (CHECK, UNIQUE, FK, NOT NULL) provide an unbypassable, kernel-level safety net preventing corrupt, out-of-range, or orphaned data from persisting under any failure condition.

---

### 2. Critical Business Invariants & Enforcement Traceability

| Business Invariant & Rule ID | Core Business Rule Description | Database Kernel Enforcement | Application Layer Enforcement | Future Test Requirement |
|---|---|---|---|---|
| **BR-SYS-001 (Multi-Tenancy)** | A user can never read, modify, or delete another user's personal health records. | RLS policy `USING (auth.uid() = user_id)` on 100% of user-owned tables. | Edge Gateway derives identity from JWT claim `auth.uid()`; rejects body `userId`. | `TST-SEC-03` (Vitest multi-user cross-read assertion). |
| **BR-SYS-002 (Upload File Cap)** | Image uploads must not exceed 5 MB ($5,242,880\text{ bytes}$). | `CHECK (file_size_bytes <= 5242880)` on `captures` table. | S3 signed PUT URL policy enforces `content-length-range` max 5 MB. | Direct upload attempt with 6 MB payload returns HTTP 413. |
| **BR-AI-001 (Non-Diagnostic)** | Platform provides non-diagnostic Ayurvedic wellness guidance; cannot diagnose disease. | `dominant_dosha` constrained to valid Ayurvedic enum strings; prohibited drug names barred. | Post-inference regex scanner scrubbing clinical disease and prescription drug terms. | `TST-SEC-10` (Adversarial medical prompt injection test). |
| **BR-FUS-001 (Weight Sum Unity)**| Multimodal fusion weights must sum exactly to 1.0 (100%). | `CHECK (abs(weight_visual + weight_quiz + weight_lifestyle - 1.0) < 0.0001)` on `fusion_configurations`. | Fusion configuration validation schema asserts sum equals 1.0. | Unit test attempting to insert weights summing to 1.20 fails constraint. |
| **BR-CONF-001 (Confidence Range)**| Confidence scores must remain strictly bounded between 0% and 100%. | `CHECK (calibrated_confidence BETWEEN 0.0 AND 100.0)` on `scan_results`. | Fusion engine clamps calibrated confidence to $[0, 100]$. | Boundary test passing confidence 105.0 asserts DB reject. |
| **BR-AGREE-001 (Agreement Cap)**| Under low inter-modality agreement ($A < 0.60$), confidence is capped at $< 60\%$. | `CHECK (agreement_state != 'LOW_AGREEMENT' OR calibrated_confidence < 60.0)` on `scan_results`. | Fusion engine caps confidence at 59.9% when $A < 0.60$. | Integration test with clashing inputs asserts confidence $< 60\%$. |
| **BR-IDEM-001 (No Duplicate Jobs)**| A user cannot trigger multiple duplicate analysis jobs with the same idempotency key. | `UNIQUE (user_id, idempotency_key)` constraint on `analysis_jobs`. | Edge API checks Redis/DB for active key within 120s sliding window. | Concurrently submitting identical request returns cached result. |
| **BR-ROUT-001 (Daily Adherence)** | A user can log completion of a specific ritual item only once per calendar date. | `UNIQUE (user_id, routine_item_id, tracking_date)` on `routine_tracking`. | UI disables completed checkbox; API enforces idempotent upsert. | Attempting duplicate INSERT on same date returns existing row. |
| **BR-RAG-001 (Active Verse RAG)**| Generative herbal recommendations can only cite active, vetted literature chunks. | `FOREIGN KEY (knowledge_chunk_id) REFERENCES knowledge_chunks(id) ON DELETE RESTRICT`. | RAG retrieval filters strictly by `status = 'ACTIVE'` and cosine $\ge 0.75$. | Foreign key integrity test asserting cited chunk exists in DB. |
| **BR-PURG-001 (Biometric Decouple)**| Database scan results must never store raw base64 image strings. | Schema decomposes `scan_results` into numerical floats; zero base64 columns exist. | Logger and API sanitizers intercept and strip `data:image/*` patterns. | Automated schema audit asserting no `TEXT` column holds base64. |

---

### 3. Enumerated Types & Status Constraints

All status columns are strictly constrained using PostgreSQL `CHECK` constraints or native enums:

```sql
-- Target Check Constraints for Milestone 04 Schema

-- 1. Scan Agreement States
ALTER TABLE scan_results ADD CONSTRAINT chk_agreement_state 
CHECK (agreement_state IN ('HIGH_AGREEMENT', 'MODERATE_AGREEMENT', 'LOW_AGREEMENT', 'INSUFFICIENT_DATA'));

-- 2. Dominant Dosha Tendencies
ALTER TABLE scan_results ADD CONSTRAINT chk_dominant_dosha 
CHECK (dominant_dosha IN ('VATA', 'PITTA', 'KAPHA', 'VATA_PITTA', 'PITTA_KAPHA', 'VATA_KAPHA', 'TRIDOSHIC'));

-- 3. Asynchronous Job Status
ALTER TABLE analysis_jobs ADD CONSTRAINT chk_job_status 
CHECK (status IN ('QUEUED', 'VALIDATING', 'PROCESSING', 'COMPLETED', 'FAILED', 'RETRYING', 'CANCELLED', 'EXPIRED'));

-- 4. Biometric Retention State (DEC-004)
ALTER TABLE captures ADD CONSTRAINT chk_retention_state 
CHECK (retention_state IN ('ACTIVE', 'MARKED_FOR_PURGE', 'PURGED'));

-- 5. Consent Scope Values
ALTER TABLE consents ADD CONSTRAINT chk_consent_scope 
CHECK (scope IN ('biometric_processing', 'analysis_storage', 'wellness_personalization', 'research_sharing', 'routine_reminders'));

-- 6. Knowledge Chunk Status
ALTER TABLE knowledge_chunks ADD CONSTRAINT chk_chunk_status 
CHECK (status IN ('DRAFT', 'UNDER_REVIEW', 'ACTIVE', 'DEPRECATED', 'ARCHIVED'));
```
