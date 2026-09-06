# AayurFace — Database Architecture Specification
## End-to-End Data Lifecycle & Entity State Machines

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Data Architect  

---

### 1. The Six Lifecycle Stages

Every data asset processed in AayurFace transitions through six formal lifecycle stages:

```text
[1. INGESTION] ──► [2. PROCESSING] ──► [3. ACTIVE PERSISTENCE]
                                               │
                                               ▼
[6. BACKUP EXPIRY] ◄── [5. HARD PURGE] ◄── [4. DELETION TRIGGER]
```

1. **Ingestion:** Data enters via authenticated edge endpoint or signed S3 upload; validated against strict schemas.
2. **Processing:** Ephemeral manipulation in RAM (MediaPipe Wasm, CV feature extraction, multimodal fusion).
3. **Active Persistence:** Record stored in PostgreSQL (RLS enforced) or private S3; available for active queries.
4. **Deletion Trigger:** Initiated via user account erasure request, consent revocation, or automated retention expiry.
5. **Hard Purge:** Multi-service cascading eradication of database rows, S3 files, and distributed cache keys.
6. **Backup Expiry:** Data permanently rolls off daily encrypted point-in-time backup snapshots (30-day window).

---

### 2. Entity Lifecycle State Machines

#### 1. Analysis Job State Machine (`analysis_jobs`)
* `QUEUED`: Enqueued by API; waiting for worker claim.
* `VALIDATING`: Claimed by worker (`FOR UPDATE SKIP LOCKED`); verifying inputs.
* `PROCESSING`: Executing feature extraction, fusion, RAG retrieval, and LLM inference.
* `COMPLETED`: Analysis successfully stored in `scan_results` (Terminal).
* `RETRYING`: Transient error occurred; waiting for backoff timer to re-enqueue.
* `FAILED`: Hard error or attempts $\ge 3$ (Terminal).
* `EXPIRED`: 5-minute execution deadline breached (Terminal).
* `CANCELLED`: User deleted account during execution (Terminal).

#### 2. Biometric Capture State Machine (`captures` & S3)
* `UPLOADING`: Signed PUT URL issued; client uploading to S3.
* `ACTIVE`: File verified and referenced by an active analysis.
* `MARKED_FOR_PURGE`: Biometric feature extraction complete; awaiting deletion trigger (DEC-004).
* `PURGED`: Object deleted from S3; metadata row updated with `purged_at = NOW()` (Terminal).

#### 3. User Account State Machine (`profiles`)
* `REGISTERED`: Created in `auth.users`; profile initialized; `onboarding_completed = FALSE`.
* `ACTIVE`: Onboarding completed; consent granted; regular scanning and routine tracking.
* `PENDING_DELETION`: Deletion requested; re-authenticated; active sessions revoked.
* `PURGED`: Deleted from database; tombstone recorded in `deletion_tombstones` (Terminal).

#### 4. Classical Knowledge Chunk State Machine (`knowledge_chunks`)
* `DRAFT`: Ingested by editorial team; waiting for domain review.
* `UNDER_REVIEW`: Being reviewed by certified Ayurvedic experts.
* `ACTIVE`: Approved with cryptographic sign-off; available for RAG search.
* `DEPRECATED`: Replaced by an updated translation version; historical scans still reference it.
* `ARCHIVED`: Fully retired; excluded from active RAG searches (Terminal).
