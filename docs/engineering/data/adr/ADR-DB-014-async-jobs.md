# Architecture Decision Record (ADR)
## ADR-DB-014: Asynchronous Job Architecture — Database-Backed State Machine vs External Queue

**Status:** TARGET  
**Date:** 2026-09-03  
**Deciders:** Principal Database Architect, Staff Backend Architect, Platform/SRE Architect  
**Technical Category:** Asynchronous Orchestration & Background Processing  

---

### Context & Problem Statement
Multimodal skin analysis involves multiple distinct steps: client upload verification, serverless CV feature extraction (CIELAB/GLCM), multimodal fusion calculations, RAG vector retrieval, and OpenAI foundation model inference. Because total execution time can span 3 to 8 seconds, executing the pipeline synchronously within a single HTTP request causes client connection timeouts on flaky mobile cellular networks. The platform must choose between:
1. An external distributed message broker (RabbitMQ, AWS SQS, Redis BullMQ).
2. A database-backed asynchronous job queue utilizing PostgreSQL (`analysis_jobs`) with `FOR UPDATE SKIP LOCKED`.

### Decision Drivers
1. **Infrastructure Simplicity & Cost:** Minimize external infrastructure components in early milestones.
2. **Transactional Integrity:** Job creation, status updates, and scan result persistence must occur within unified ACID transaction boundaries.
3. **Auditability & Observability:** Real-time visibility into job states, retry counts, and failure reasons via simple SQL queries.
4. **Idempotency:** Prevent duplicate analysis jobs triggered by rapid client retries.

### Decision Outcome
**Chosen Option: Database-Backed Job Table (`analysis_jobs`) utilizing PostgreSQL `FOR UPDATE SKIP LOCKED`.**

#### Architecture Specifications:
* **Table Schema:** `analysis_jobs` with columns: `id`, `user_id`, `capture_id`, `status` (`QUEUED`, `VALIDATING`, `PROCESSING`, `COMPLETED`, `FAILED`, `RETRYING`, `CANCELLED`, `EXPIRED`), `idempotency_key`, `attempt_count` (max 3), `execution_deadline`, `error_category`, `error_details`, `correlation_id`, `created_at`, `updated_at`.
* **Worker Polling Mechanics:**
  ```sql
  -- Atomic worker claim without lock contention
  SELECT * FROM analysis_jobs
  WHERE status IN ('QUEUED', 'RETRYING')
    AND execution_deadline > NOW()
  ORDER BY created_at ASC
  FOR UPDATE SKIP LOCKED
  LIMIT 1;
  ```
* **Deadlines & Dead-Lettering:**
  * Execution deadline: 5 minutes from job creation.
  * If `attempt_count >= 3`, the job transitions permanently to `FAILED` and emits an alert.
* **Idempotency Constraint:** Unique index on `(user_id, idempotency_key)` prevents duplicate job enqueueing.

### Consequences
* **Positive:** Zero external queue infrastructure; atomic state transitions; seamless recovery on edge worker restarts; full SQL visibility.
* **Negative:** Modest database write load from job state transitions (easily accommodated under projected MVP throughput of $\le 500$ analyses/day). Can be migrated to Redis/BullMQ post-launch if queue throughput exceeds 100 jobs/second.
* **Status Classification:** `TARGET` — scheduled for Milestone 08 & 11 implementation.
