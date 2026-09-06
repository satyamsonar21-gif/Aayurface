# AayurFace — Database Architecture Specification
## Multi-Tier Versioning Architecture & Lineage Tracking

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** AI Data Architect, Principal Database Architect  

---

### 1. The Immutability vs Mutability Classification

Entities are strictly classified by their mutability and versioning behavior:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ IMMUTABLE / APPEND-ONLY ENTITIES (Never Updated via SQL)                    │
│ • `consents`: Every grant/revocation is an append-only audit event.         │
│ • `questionnaire_responses`: Intake snapshot feeding an analysis.          │
│ • `lifestyle_contexts`: Dynamic environment snapshot feeding an analysis.  │
│ • `scan_results`: Primary analysis result; locked upon creation.           │
│ • `visual_observations`: Derived numerical features; immutable per scan.   │
│ • `multimodal_fusions`: Modality vectors and agreement index; immutable.    │
│ • `recommendation_items`: Actionable ritual cards; immutable per scan.      │
│ • `routine_tracking`: Daily ritual adherence checkbox logs.                 │
│ • `progress_checkpoints`: 30/60/90-day progress delta snapshots.            │
│ • `expert_annotations`: Practitioner ratings locked upon submission.       │
│ • `security_audit_events`: WORM security events (Update/Delete blocked).    │
│ • `deletion_tombstones`: Anonymous hashes of permanently deleted accounts.  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ MUTABLE DOMAIN ENTITIES (Controlled In-Place Updates via `updated_at`)       │
│ • `profiles`: Display name, age bracket, avatar URL.                        │
│ • `user_preferences`: UI theme, language selection, notification toggles.   │
│ • `routines`: Active routine status (`is_active = FALSE` when swapped).     │
│ • `analysis_jobs`: Queue state machine transitions (`QUEUED` -> `COMPLETED`).│
│ • `shared_reports`: View counter increment and revocation (`is_revoked`).   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Multi-Vector Version Lineage in Analysis Snapshots

Every row in `scan_results` records the complete constellation of software, algorithmic, and knowledge versions active at the moment of execution:

```sql
-- Target Semantic Version Tracking Columns in scan_results
cv_version         VARCHAR(20) NOT NULL, -- e.g., 'cv-v1.0.0' (Feature extractor)
fusion_version     VARCHAR(20) NOT NULL, -- e.g., 'fuse-v1.1.0' (Fusion weights)
model_version      VARCHAR(50) NOT NULL, -- e.g., 'gpt-4o-2024-08-06' (Foundation model)
prompt_version     VARCHAR(20) NOT NULL, -- e.g., 'prompt-v2.1.0' (System prompt & fences)
knowledge_version  VARCHAR(20) NOT NULL, -- e.g., 'rag-v1.2.0' (Classical literature corpus)
schema_version     VARCHAR(20) NOT NULL  -- e.g., 'schema-v1.0.0' (Zod JSON contract)
```

#### Why Multi-Vector Versioning is Mandatory:
1. **Scientific Reproducibility:** If a user reviews an analysis conducted six months ago, the engineering team can reconstruct the exact prompt, weights, and knowledge corpus active on that date.
2. **Longitudinal Validity:** If an algorithmic update improves redness detection accuracy, the progress tracking engine knows that a score shift between Day 1 and Day 30 was influenced by a pipeline upgrade (`cv-v1.0.0` $\rightarrow$ `cv-v1.1.0`) rather than pure biological change.
3. **Auditability:** Non-diagnostic compliance can be proven for any historical response by referencing the immutable `prompt_version` and `schema_version`.
