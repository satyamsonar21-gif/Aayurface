# Architecture Decision Record (ADR)
## ADR-DB-006: Longitudinal Data — Checkpoint Snapshots vs On-The-Fly Aggregation

**Status:** TARGET  
**Date:** 2026-09-03  
**Deciders:** Principal Database Architect, Data Architect, Frontend Architect  
**Technical Category:** Analytics & Longitudinal Modeling  

---

### Context & Problem Statement
AayurFace provides users with longitudinal wellness tracking across 30, 60, and 90-day intervals, illustrating how skin surface characteristics (redness, texture smoothness, hydration balance) and daily Dinacharya adherence evolve over time. Computing historical deltas on-the-fly across hundreds of past analyses, routine tracking logs, and questionnaire answers causes slow dashboard loading times, high database CPU utilization, and unpredictable latency on mobile devices.

### Decision Drivers
1. **Instant Dashboard Performance:** Sub-100ms response time when rendering the user profile progress screen.
2. **Deterministic Baseline Comparisons:** Progress must be calculated against a locked baseline snapshot (Day 1) rather than a shifting historical average.
3. **Reproducible Progress Metrics:** Derived progress vectors must be stored immutably to prevent historical charting discrepancies.

### Decision Outcome
**Chosen Option: Hybrid Approach — Checkpoint Snapshot Table (`progress_checkpoints`) paired with Normalized Event Logs.**

#### Architecture Specifications:
* **Event Logging:** Daily ritual adherence continues to be recorded in `routine_tracking` rows.
* **Checkpoint Snapshots (`progress_checkpoints`):**
  * When a user completes a scan at Days 1, 7, 14, 30, 60, or 90, the analysis worker computes and persists an explicit checkpoint snapshot row.
  * Columns: `baseline_scan_id`, `current_scan_id`, `days_elapsed`, `redness_delta`, `texture_delta`, `adherence_percentage_30d`, `doshic_stability_score`.
  * Dashboard queries read directly from `progress_checkpoints` without executing multi-table aggregations.

### Consequences
* **Positive:** O(1) query time for progress timelines; completely decouples analytical charting from high-frequency operational tables.
* **Negative:** Requires an asynchronous background calculation task to generate and persist checkpoint rows upon analysis completion.
* **Status Classification:** `TARGET` — scheduled for Milestone 13 implementation.
