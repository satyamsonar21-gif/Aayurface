# Operational Contract: Asynchronous Background Job Engine
## Queue Mechanics, Pessimistic Row Locking & Dead-Letter Semantics

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Asynchronous Processing & Distributed Workloads  
**Status:** `TARGET ARCHITECTURE / PROPOSED (REQUIRES IMPLEMENTATION)`  
**Authority:** Distributed Systems Architect, Principal Backend Architect  

---

## 1. Asynchronous Job Table Schema & Worker Claim Query

```sql
-- Target Job Queue Table Schema (`analysis_jobs`)
CREATE TABLE analysis_jobs (
    id UUID PRIMARY KEY, -- UUIDv7
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    capture_id UUID NOT NULL REFERENCES captures(id) ON DELETE CASCADE,
    
    status VARCHAR(30) NOT NULL DEFAULT 'QUEUED' CHECK (
        status IN (
            'QUEUED', 'VALIDATING', 'PREPROCESSING', 'CV_PROCESSING',
            'AYURVEDIC_PROCESSING', 'FUSION_PROCESSING', 'CONFIDENCE_EVALUATION',
            'RAG_RETRIEVAL', 'EXPLANATION', 'SAFETY_VALIDATION',
            'COMPLETED', 'FAILED_RETRYABLE', 'FAILED_TERMINAL', 'CANCELLED'
        )
    ),
    
    stage INT NOT NULL DEFAULT 1,
    retry_count INT NOT NULL DEFAULT 0,
    max_retries INT NOT NULL DEFAULT 2,
    idempotency_key VARCHAR(64) NOT NULL,
    locked_by UUID,                    -- Worker instance identifier
    locked_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_idempotency UNIQUE (user_id, idempotency_key)
);
```

### Worker Claim Query (Pessimistic Concurrency):

```sql
-- Target Worker Job Claim Query (PROPOSED)
UPDATE analysis_jobs
SET status = 'VALIDATING',
    locked_by = :worker_id,
    locked_at = NOW(),
    started_at = NOW()
WHERE id = (
    SELECT id
    FROM analysis_jobs
    WHERE status IN ('QUEUED', 'FAILED_RETRYABLE')
      AND (locked_at IS NULL OR locked_at < NOW() - INTERVAL '60 seconds')
    ORDER BY created_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT 1
)
RETURNING *;
```

---

## 2. Dead-Letter & Timeout Semantics

* **Job Execution Timeout:** Single job execution timeout is capped at **45 seconds**.
* **Worker Zombie Reclaim:** If `locked_at < NOW() - INTERVAL '60 seconds'` and job is not completed, lock is expired and job is reclaimed by available workers.
* **Dead-Letter State:** After `max_retries = 2` attempts, status transitions to `FAILED_TERMINAL`, triggering an alert event to `security_audit_events`.
