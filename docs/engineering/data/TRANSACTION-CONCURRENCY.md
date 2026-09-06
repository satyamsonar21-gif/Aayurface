# AayurFace — Database Architecture Specification
## ACID Transaction Boundaries & Concurrency Control

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Staff Backend Architect  

---

### 1. Transaction Isolation Standard

All relational transactions in AayurFace execute under PostgreSQL's default **`READ COMMITTED`** isolation level:
* Each query within a transaction sees only data committed before the query began.
* Dirty reads are mathematically impossible.
* For race-condition-sensitive state mutations (worker job claiming), explicit pessimistic row-level locking (`FOR UPDATE SKIP LOCKED`) is enforced.

---

### 2. Primary ACID Transaction Boundaries

```text
TRANSACTION 1: ATOMIC ANALYSIS PERSISTENCE (Multi-Table Insertion)
BEGIN TRANSACTION;
  1. INSERT INTO scan_results (...) RETURNING id;
  2. INSERT INTO visual_observations (scan_id, ...);
  3. INSERT INTO multimodal_fusions (scan_id, ...);
  4. INSERT INTO recommendation_items (scan_id, ...); -- Multiple rows
  5. UPDATE analysis_jobs SET status = 'COMPLETED' WHERE id = :job_id;
COMMIT TRANSACTION;
-- Guarantees that an analysis snapshot never partially persists without
-- its corresponding observations, fusions, recommendations, and job status.
```

```text
TRANSACTION 2: USER ACCOUNT ERASURE (Cascading Purge)
BEGIN TRANSACTION;
  1. UPDATE profiles SET status = 'PENDING_DELETION' WHERE id = :user_id;
  2. DELETE FROM auth.users WHERE id = :user_id; -- Cascades across all child tables
  3. INSERT INTO deletion_tombstones (tenant_hash, purged_at, ...);
COMMIT TRANSACTION;
-- Ensures that user erasure and tombstone recording succeed or roll back atomically.
```

```text
TRANSACTION 3: DAILY RITUAL ADHERENCE CHECKBOX (Idempotent Upsert)
BEGIN TRANSACTION;
  INSERT INTO routine_tracking (user_id, routine_item_id, tracking_date, is_completed)
  VALUES (:user_id, :item_id, CURRENT_DATE, TRUE)
  ON CONFLICT (user_id, routine_item_id, tracking_date)
  DO UPDATE SET is_completed = EXCLUDED.is_completed, completed_at = NOW();
COMMIT TRANSACTION;
```

---

### 3. Concurrency Control & Race Condition Defenses

| Concurrency Scenario | Potential Race Condition | Architectural Defense Mechanism | Failure Behavior |
|---|---|---|---|
| **Simultaneous Worker Dequeue** | Multiple background edge workers attempt to process the same queued analysis job. | `FOR UPDATE SKIP LOCKED` on `analysis_jobs`. | The first worker locks the row; subsequent workers instantly skip to the next available queued job without blocking. |
| **Rapid Duplicate Scan Submissions** | User double-taps the "Analyze Skin" button on mobile, firing two concurrent API calls. | Unique constraint on `analysis_jobs(user_id, idempotency_key)`. | Second insert throws PostgreSQL error code `23505` (unique_violation); API returns existing job status. |
| **Simultaneous Routine Edits** | User updates ritual time on mobile while desktop browser has an open edit session. | Optimistic locking via `updated_at` column timestamp verification. | If `updated_at` does not match database record, the second update is rejected with HTTP 409 Conflict. |
| **Account Deletion During Analysis** | User clicks "Delete Account" while a background worker is mid-way through an analysis. | Foreign key constraint check; worker transaction detects deleted profile and aborts. | Worker transaction fails with foreign key violation; worker drops task cleanly; zero orphaned records created. |
| **Concurrent Consensus Submissions** | Two Ayurvedic practitioners submit ratings for the same subject simultaneously. | Separate row inserts in `expert_annotations`; consensus calculation evaluates via atomic trigger. | Both annotations persist independently; consensus adjudication triggers after all 3 submit. |
