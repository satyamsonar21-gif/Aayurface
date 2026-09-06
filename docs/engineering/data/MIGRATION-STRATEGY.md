# AayurFace — Database Architecture Specification
## Database Migration Strategy & Transition from Prototype schema.sql

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, DevOps/SRE Architect  

---

### 1. The Prototype-to-Production Migration Dilemma

As established in the forensic audit (`CURRENT-DATABASE-AUDIT.md`), the current repository contains a single static setup script (`supabase/schema.sql`) and **zero** migration tracking files (`supabase/migrations/` is absent). Manual execution of SQL in production web consoles causes schema drift, untracked changes, and catastrophic outages.

The target architecture establishes a strict **Versioned Migration Strategy** managed via the Supabase CLI and Git version control.

---

### 2. Transition Plan from `schema.sql` to Versioned Migrations

In **Milestone 04**, the engineering organization will execute a controlled transition:

```text
PHASE 1: BASELINE ARCHIVAL
Rename static `supabase/schema.sql` to `supabase/archive/schema.v0.sql`.
Preserve file strictly for legacy prototype reference.

PHASE 2: MIGRATION DIRECTORY INITIALIZATION
Initialize standard Supabase CLI migration directory:
`supabase/migrations/`

PHASE 3: SEQUENTIAL TIMESTAMPED MIGRATIONS
Create structured forward migration files:
├── 20260904000001_core_profiles_and_preferences.sql
├── 20260904000002_consents_ledger.sql
├── 20260904000003_intake_and_lifestyle.sql
├── 20260904000004_captures_and_quality.sql
├── 20260904000005_analysis_jobs_and_scan_results.sql
├── 20260904000006_visual_observations_and_fusions.sql
├── 20260904000007_routines_and_tracking.sql
├── 20260904000008_progress_checkpoints_and_shares.sql
├── 20260904000009_knowledge_pgvector_and_chunks.sql
└── 20260904000010_rls_policies_and_worm_rules.sql
```

---

### 3. Zero-Downtime Migration Guidelines (Expand-Contract Pattern)

For post-launch schema changes, all migrations must follow the **Expand-Contract (Parallel Run) Pattern**:
1. **Phase 1 (Expand):** Add new columns, tables, or non-blocking indexes (`CREATE INDEX CONCURRENTLY`). Never rename or delete columns in Phase 1.
2. **Phase 2 (Migrate Data):** Background worker backfills data from legacy columns to new columns in batched transactions.
3. **Phase 3 (Deploy Code):** Application code deploys, reading and writing exclusively to the new schema.
4. **Phase 4 (Contract):** Once verified across two release cycles, a deprecation migration drops the obsolete legacy columns.

---

### 4. CI/CD Migration Verification Standard

Every pull request modifying files under `supabase/migrations/` must pass automated CI checks:
* **Fresh Local Apply:** Spawns an ephemeral PostgreSQL Docker container via `supabase start` and applies all migrations from scratch.
* **Idempotency & Rollback Check:** Tests forward migration and corresponding rollback script.
* **RLS Verification:** Executes an automated test suite verifying that no table was created without enabling Row-Level Security (`SELECT relname FROM pg_class WHERE relrowsecurity = FALSE`).
