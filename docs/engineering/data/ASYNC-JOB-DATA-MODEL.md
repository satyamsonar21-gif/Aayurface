# AayurFace — Database Architecture Specification
## Asynchronous Job Processing, State Machine & Failure Queue Architecture

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Staff Backend Architect  

---

### 1. The Asynchronous Processing Rationale

Executing the entire multimodal analysis synchronously within a single HTTP request introduces severe operational vulnerabilities:
* Cellular network connection drops on mobile clients.
* Supabase Edge Function execution timeouts (standard 150-second hard wall clock limit).
* Wasteful re-computation when transient upstream OpenAI API rate limits (HTTP 429) occur.

The target architecture decouples analysis orchestration into an asynchronous, database-backed job queue utilizing PostgreSQL's native `FOR UPDATE SKIP LOCKED`.

---

### 2. Concrete Job Queue Schema

```sql
-- Target Schema for Asynchronous Job Processing (Milestones 08 & 11)

CREATE TABLE analysis_jobs (
    id UUID PRIMARY KEY, -- UUIDv7
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    capture_id UUID NOT NULL REFERENCES captures(id) ON DELETE CASCADE,
    
    status VARCHAR(20) NOT NULL DEFAULT 'QUEUED' CHECK (
        status IN ('QUEUED', 'VALIDATING', 'PROCESSING', 'COMPLETED', 'FAILED', 'RETRYING', 'CANCELLED', 'EXPIRED')
    ),
    idempotency_key VARCHAR(64) NOT NULL,
    attempt_count INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 3,
    
    execution_deadline TIMESTAMPTZ NOT NULL, -- Defaults to NOW() + INTERVAL '5 minutes'
    
    error_category VARCHAR(50) CHECK (
        error_category IN ('QUALITY_REJECTION', 'UPSTREAM_API_TIMEOUT', 'RATE_LIMITED', 'SCHEMA_VALIDATION_ERROR', 'INTERNAL_WORKER_ERROR')
    ),
    error_details TEXT,
    correlation_id VARCHAR(64) NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    CONSTRAINT uq_jobs_user_idempotency UNIQUE (user_id, idempotency_key)
);

-- Partial Index for Sub-Millisecond Worker Dequeue
CREATE INDEX idx_analysis_jobs_queue_partial 
ON analysis_jobs (created_at ASC) 
WHERE status IN ('QUEUED', 'RETRYING');
```

---

### 3. Worker Polling & State Transition Protocol

```text
       ┌──────────┐
       │  QUEUED  │◄───────────────────┐
       └────┬─────┘                    │
            │ Worker Claims            │ Retry Backoff
            │ (FOR UPDATE SKIP LOCKED) │ (Attempts < 3)
            ▼                          │
      ┌────────────┐               ┌───┴──────┐
      │ VALIDATING ├──────────────►│ RETRYING │
      └─────┬──────┘ Transient     └───▲──────┘
            │ Passes Input Checks      │
            ▼                          │ Transient OpenAI
      ┌────────────┐                   │ 429/500 Error
      │ PROCESSING ├───────────────────┘
      └─────┬──────┴───────────────────┐
            │ Success                  │ Hard Failure OR
            ▼                          │ Attempts >= 3
      ┌───────────┐                    ▼
      │ COMPLETED │              ┌──────────┐
      └───────────┘              │  FAILED  │ (Dead Letter)
                                 └──────────┘
```

#### Transition Invariants:
1. **Atomic Lock Dequeue:** Workers claim jobs using:
   ```sql
   UPDATE analysis_jobs
   SET status = 'VALIDATING', updated_at = NOW(), attempt_count = attempt_count + 1
   WHERE id = (
       SELECT id FROM analysis_jobs
       WHERE status IN ('QUEUED', 'RETRYING') AND execution_deadline > NOW()
       ORDER BY created_at ASC
       FOR UPDATE SKIP LOCKED LIMIT 1
   ) RETURNING *;
   ```
2. **Deadline Enforcement:** If `NOW() > execution_deadline`, the reaper cron automatically updates the job to `EXPIRED`.
3. **Dead-Letter Handling:** If `attempt_count >= 3`, the job transitions permanently to `FAILED`, an alert is emitted to the security/ops team, and the user receives a graceful retry prompt on mobile.
