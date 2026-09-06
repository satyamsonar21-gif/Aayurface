# AayurFace — Database Architecture Specification
## Target Query Patterns & Access Path Specifications

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Staff Backend Architect  

---

### 1. Query Workload Profile

AayurFace features an 80/20 read-heavy workload characterized by:
* High-frequency, low-latency mobile profile and home dashboard reads ($< 25\text{ms}$).
* Transactional multi-table write bursts upon analysis completion.
* Sub-25ms approximate nearest neighbor semantic vector searches in `pgvector`.
* Asynchronous queue dequeuing via `FOR UPDATE SKIP LOCKED`.

---

### 2. Primary Query Patterns Catalog

#### QP-01: User Profile & Active Preferences Lookup
* **Trigger:** App startup / home screen render (`GET /api/v1/profile`).
* **Target Latency:** $\le 10\text{ms}$.
* **Access Path:** Single-row primary key lookup on `profiles(id)` joined with `user_preferences(user_id)`.
* **SQL Specification:**
  ```sql
  SELECT p.id, p.email, p.full_name, p.age_bracket, p.gender, p.role,
         u.theme, u.language, u.reminder_notifications
  FROM profiles p
  LEFT JOIN user_preferences u ON u.user_id = p.id
  WHERE p.id = auth.uid();
  ```

#### QP-02: Latest Analysis Snapshot
* **Trigger:** Home screen summary card / post-scan results render (`GET /api/v1/analysis/latest`).
* **Target Latency:** $\le 15\text{ms}$.
* **Access Path:** Index scan on `idx_scan_results_user_created` limited to 1 row.
* **SQL Specification:**
  ```sql
  SELECT s.id, s.dominant_dosha, s.agreement_state, s.calibrated_confidence,
         s.is_degraded, s.created_at,
         v.cielab_a_mean, v.glcm_contrast, v.melanin_index,
         m.fused_vata, m.fused_pitta, m.fused_kapha, m.agreement_index
  FROM scan_results s
  JOIN visual_observations v ON v.scan_id = s.id
  JOIN multimodal_fusions m ON m.scan_id = s.id
  WHERE s.user_id = auth.uid()
  ORDER BY s.created_at DESC
  LIMIT 1;
  ```

#### QP-03: Paginated User Analysis Timeline
* **Trigger:** History page scrolling (`GET /api/v1/analysis?limit=10&cursor=...`).
* **Target Latency:** $\le 20\text{ms}$.
* **Access Path:** Keyset pagination using `(created_at, id)` composite condition on `idx_scan_results_user_created`.
* **SQL Specification:**
  ```sql
  SELECT id, dominant_dosha, agreement_state, calibrated_confidence, created_at
  FROM scan_results
  WHERE user_id = auth.uid()
    AND created_at < :cursor_timestamp
  ORDER BY created_at DESC
  LIMIT 10;
  ```

#### QP-04: Active Routine & Ritual Schedule
* **Trigger:** Home screen Dinacharya section (`GET /api/v1/routines/active`).
* **Target Latency:** $\le 15\text{ms}$.
* **Access Path:** Partial index scan on `idx_routines_user_active` joined with `routine_items`.
* **SQL Specification:**
  ```sql
  SELECT r.id AS routine_id, r.title, r.target_dosha,
         i.id AS item_id, i.ritual_name, i.timing, i.frequency, i.instructions, i.display_order
  FROM routines r
  JOIN routine_items i ON i.routine_id = r.id
  WHERE r.user_id = auth.uid() AND r.is_active = TRUE
  ORDER BY i.display_order ASC;
  ```

#### QP-05: Today's Ritual Adherence State
* **Trigger:** Home screen checkbox renders (`GET /api/v1/routines/adherence/today`).
* **Target Latency:** $\le 10\text{ms}$.
* **Access Path:** Compound index scan on `idx_routine_tracking_user_date`.
* **SQL Specification:**
  ```sql
  SELECT routine_item_id, is_completed, completed_at
  FROM routine_tracking
  WHERE user_id = auth.uid()
    AND tracking_date = CURRENT_DATE;
  ```

#### QP-06: Asynchronous Job Dequeue (Worker Task Claim)
* **Trigger:** Continuous background worker polling loop.
* **Target Latency:** $\le 10\text{ms}$.
* **Access Path:** Partial index scan on `idx_analysis_jobs_queue_partial` with row lock skip.
* **SQL Specification:**
  ```sql
  UPDATE analysis_jobs
  SET status = 'VALIDATING', updated_at = NOW(), attempt_count = attempt_count + 1
  WHERE id = (
      SELECT id FROM analysis_jobs
      WHERE status IN ('QUEUED', 'RETRYING')
        AND execution_deadline > NOW()
      ORDER BY created_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
  )
  RETURNING *;
  ```

#### QP-07: Grounded Classical Knowledge Retrieval (pgvector HNSW)
* **Trigger:** Multimodal analysis orchestration pipeline.
* **Target Latency:** $\le 25\text{ms}$ (Budgeted target).
* **Access Path:** HNSW approximate nearest neighbor search over `knowledge_chunks.embedding`.
* **SQL Specification:**
  ```sql
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

#### QP-08: Longitudinal Progress Deltas
* **Trigger:** Progress tab render (`GET /api/v1/progress`).
* **Target Latency:** $\le 15\text{ms}$.
* **Access Path:** Index scan on `idx_progress_user_interval`.
* **SQL Specification:**
  ```sql
  SELECT checkpoint_interval, erythema_delta, texture_delta,
         adherence_percentage, stability_index, created_at
  FROM progress_checkpoints
  WHERE user_id = auth.uid()
  ORDER BY checkpoint_interval ASC;
  ```

#### QP-09: Public Shared Report Link Resolution
* **Trigger:** Visiting public URL `GET /share/{token}`.
* **Target Latency:** $\le 15\text{ms}$.
* **Access Path:** Unique index scan on `idx_shared_reports_token_hash`.
* **SQL Specification:**
  ```sql
  SELECT r.scan_id, r.user_id, r.expires_at, r.is_revoked,
         s.dominant_dosha, s.agreement_state, s.calibrated_confidence, s.created_at,
         m.fused_vata, m.fused_pitta, m.fused_kapha
  FROM shared_reports r
  JOIN scan_results s ON s.id = r.scan_id
  JOIN multimodal_fusions m ON m.scan_id = s.id
  WHERE r.token_hash = SHA256(:url_token::bytea)::text
    AND r.is_revoked = FALSE
    AND r.expires_at > NOW();
  ```
