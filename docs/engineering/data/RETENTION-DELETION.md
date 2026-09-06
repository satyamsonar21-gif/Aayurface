# AayurFace — Database Architecture Specification
## Data Retention Schedules, Cascading Purge & Tombstone Governance

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Privacy Officer  

---

### 1. Master Retention Schedule Matrix

| Data Category | Relational Entity / S3 Storage | Retention Trigger & Active Lifespan | Archival / Deprecation Rule | Purge Trigger | Deletion Action | Backup Roll-Off Horizon |
|---|---|---|---|---|---|---|
| **User Identity & Profile** | `auth.users`, `profiles`, `user_preferences` | Active account lifespan. | None. | Account deletion request. | Hard cascading delete via PostgreSQL foreign keys. | 30 days rolling. |
| **User Consents** | `consents` table | Active account lifespan. | Revoked scopes preserved in ledger. | Account deletion request. | Hard delete from table; tombstoned anonymously. | 30 days rolling. |
| **Raw Facial Captures** | Private S3 (`facial-captures/`) | **OPEN DECISION (DEC-004)**<br/>• Option A: Purged immediately post-extraction.<br/>• Option B: Rolling 30 days. | Excluded from relational backups. | Extraction completion OR 30-day lifecycle expiry OR user deletion. | Hard delete via S3 `DeleteObjects` API call. | Excluded from database backup snapshots. |
| **Visual Observations** | `visual_observations` | Active account lifespan. | Immutable snapshot. | Account deletion request. | `ON DELETE CASCADE` from `scan_results`. | 30 days rolling. |
| **Intake & Lifestyle** | `questionnaire_responses`, `lifestyle_contexts` | Active account lifespan. | Immutable snapshot. | Account deletion request. | `ON DELETE CASCADE` from `profiles`. | 30 days rolling. |
| **Analysis Results** | `scan_results`, `multimodal_fusions`, `recommendation_items` | Active account lifespan. | Immutable snapshot. | Account deletion request. | `ON DELETE CASCADE` from `profiles`. | 30 days rolling. |
| **Routines & Adherence**| `routines`, `routine_items`, `routine_tracking` | Active account lifespan. | Inactive routines marked `is_active = FALSE`. | Account deletion request. | `ON DELETE CASCADE` from `profiles`. | 30 days rolling. |
| **Progress Checkpoints**| `progress_checkpoints` | Active account lifespan. | Precomputed deltas. | Account deletion request. | `ON DELETE CASCADE` from `profiles`. | 30 days rolling. |
| **Shared Reports** | `shared_reports` table | Proposed 7 days (SEC-DEC-007). | Revocation toggle sets `is_revoked = TRUE`. | Expiration timestamp OR manual user revocation. | Hard delete or query masked via `expires_at > NOW()`. | 30 days rolling. |
| **Generated PDF Reports**| Private S3 (`reports/`) | 7 days ephemeral cache. | None. | 7-day S3 lifecycle rule expiration. | Automated S3 lifecycle hard deletion. | Excluded from backups. |
| **Classical Knowledge** | `knowledge_*` Tables | Permanent platform benchmark. | Older translations set to `DEPRECATED`. | Manual administrative retirement. | `ON DELETE RESTRICT` (Never hard deleted if referenced). | Permanent backup archival. |
| **Research Datasets** | `research.*` Tables | Permanent research benchmark. | Subject withdrawal detaches PII link. | Subject withdrawal. | Retained as anonymous mathematical benchmark. | Included in research backups. |
| **Security Audit Logs** | `security_audit_events` | 365 days minimum. | WORM table rules block modification. | 365-day automated partition drop. | Automated table partition rotation. | Archived to cold encrypted S3. |
| **Deletion Tombstones** | `deletion_tombstones` | Permanent governance ledger. | Immutable anonymous hash record. | Never deleted. | Permanent retention for DR reconciliation. | 30 days rolling. |

---

### 2. Cascading Purge Sequence & Foreign Key Rules

```text
USER ERASURE REQUEST (DELETE /api/v1/profile/account)
  │
  ├── 1. Invalidate active sessions (Revoke JWT & refresh tokens)
  │
  ├── 2. Asynchronous S3 Worker issues hard delete for:
  │      • s3://facial-captures/{userId}/*
  │      • s3://reports/{userId}/*
  │
  ├── 3. Execute SQL Cascading Purge:
  │      DELETE FROM auth.users WHERE id = :userId;
  │      ├── profiles (CASCADE)
  │      │   ├── user_preferences (CASCADE)
  │      │   ├── consents (CASCADE)
  │      │   ├── questionnaire_responses (CASCADE)
  │      │   ├── lifestyle_contexts (CASCADE)
  │      │   ├── captures (CASCADE)
  │      │   │   └── capture_quality_metrics (CASCADE)
  │      │   ├── analysis_jobs (CASCADE)
  │      │   ├── scan_results (CASCADE)
  │      │   │   ├── visual_observations (CASCADE)
  │      │   │   ├── multimodal_fusions (CASCADE)
  │      │   │   └── recommendation_items (CASCADE)
  │      │   ├── routines (CASCADE)
  │      │   │   ├── routine_items (CASCADE)
  │      │   │   └── routine_tracking (CASCADE)
  │      │   ├── progress_checkpoints (CASCADE)
  │      │   └── shared_reports (CASCADE)
  │
  └── 4. INSERT INTO deletion_tombstones (tenant_hash, purged_at)
```

---

### 3. Backup Reconciliation & Resurrection Prevention

* Automated daily database snapshots retain data for 30 days before rolling off.
* If a backup snapshot is restored during disaster recovery:
  * An automated post-restore reconciliation worker queries `deletion_tombstones`.
  * **TARGET:** The data lifecycle shall support verified deletion across all defined storage layers, designed to prevent previously deleted users from being resurrected into the live production database (**REQUIRES IMPLEMENTATION & RECONCILIATION TESTING**).

