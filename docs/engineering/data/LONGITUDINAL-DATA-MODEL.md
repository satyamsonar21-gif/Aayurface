# AayurFace — Database Architecture Specification
## Longitudinal Progress Architecture & Baseline Delta Modeling

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Data Architect  

---

### 1. Longitudinal Tracking Principles

Tracking skin wellness progression across 30, 60, and 90 days requires rigorous scientific controls:
1. **Baseline Pinning:** Deltas must be calculated against a locked baseline scan (Day 1) rather than a shifting average.
2. **Version Invariance & Upgrades:** If a scan at Day 60 was processed with `cv-v1.1.0` while Day 1 used `cv-v1.0.0`, the system must record the pipeline version mismatch to prevent false biological trend claims.
3. **Multi-Signal Correlation:** Progress charts correlate changes in objective surface metrics (redness, texture) with the user's documented habit adherence percentage (`routine_tracking`).

---

### 2. Concrete Schema Specification

```sql
-- Target Schema for Longitudinal Progress Checkpoints (Milestone 13)

CREATE TABLE progress_checkpoints (
    id UUID PRIMARY KEY, -- UUIDv7
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    baseline_scan_id UUID NOT NULL REFERENCES scan_results(id) ON DELETE CASCADE,
    current_scan_id UUID NOT NULL REFERENCES scan_results(id) ON DELETE CASCADE,
    
    checkpoint_interval INT NOT NULL, -- e.g., 7, 14, 30, 60, 90 days
    days_elapsed INT NOT NULL,
    
    -- Calculated Objective Deltas (Current - Baseline)
    erythema_delta FLOAT NOT NULL, -- Negative indicates redness reduction
    texture_delta FLOAT NOT NULL,  -- Negative indicates texture smoothing
    melanin_stability_index FLOAT NOT NULL,
    
    -- Habit & Adherence Context
    adherence_percentage FLOAT NOT NULL CHECK (adherence_percentage BETWEEN 0.0 AND 100.0),
    routine_adherence_category VARCHAR(20) NOT NULL CHECK (
        routine_adherence_category IN ('HIGH_ADHERENCE', 'MODERATE_ADHERENCE', 'LOW_ADHERENCE')
    ),
    
    -- Version Compatibility Flags
    has_version_mismatch BOOLEAN NOT NULL DEFAULT FALSE,
    baseline_cv_version VARCHAR(20) NOT NULL,
    current_cv_version VARCHAR(20) NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 3. Asynchronous Checkpoint Generation Flow

1. When an analysis completes, the background worker queries prior scans for the user.
2. If the user has a Day 1 baseline scan and the elapsed time crosses a checkpoint boundary ($\ge 7, 30, 60, 90\text{ days}$):
   * Worker fetches Day 1 `visual_observations` and Current `visual_observations`.
   * Calculates delta: $\Delta_{\text{erythema}} = \text{current.cielab\_a\_mean} - \text{baseline.cielab\_a\_mean}$.
   * Queries `routine_tracking` to calculate ritual adherence over the elapsed window.
   * Compares `cv_version` strings: if different, sets `has_version_mismatch = TRUE`.
   * Inserts immutable row into `progress_checkpoints`.
3. Client dashboard queries `progress_checkpoints` directly, rendering instant progress graphs in $< 15\text{ms}$.
