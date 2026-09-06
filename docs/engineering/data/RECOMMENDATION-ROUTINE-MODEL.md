# AayurFace — Database Architecture Specification
## Recommendation Candidates, Active Routines & Adherence Tracking

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Data Architect  

---

### 1. Conceptual Distinction: Recommendations vs Active Routines

The data architecture establishes an absolute operational boundary between analysis recommendations and user routines:
* **Recommendation Items (`recommendation_items`):** Immutable, historical records of actionable rituals suggested by an AI analysis. They are permanently locked to that analysis snapshot.
* **Active Daily Routines (`routines` & `routine_items`):** The user's active, living daily Dinacharya plan. Users can adopt recommended rituals into their routine, modify reminder times, or disable specific items. A new analysis **NEVER** silently overwrites an existing active routine without user confirmation.

---

### 2. Relational Schema Definitions

```sql
-- Target Schema for Recommendations and Daily Routines (Milestones 04 & 13)

-- 1. Analysis-Specific Recommendations (Immutable)
CREATE TABLE recommendation_items (
    id UUID PRIMARY KEY, -- UUIDv7
    scan_id UUID NOT NULL REFERENCES scan_results(id) ON DELETE CASCADE,
    knowledge_chunk_id UUID NOT NULL REFERENCES knowledge_chunks(id) ON DELETE RESTRICT,
    ritual_name VARCHAR(100) NOT NULL,
    timing VARCHAR(20) NOT NULL CHECK (timing IN ('MORNING', 'EVENING', 'WEEKLY')),
    instructions TEXT NOT NULL,
    contraindications TEXT,
    herb_name VARCHAR(100),
    patch_test_required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. User Dinacharya Master Routine (Mutable)
CREATE TABLE routines (
    id UUID PRIMARY KEY, -- UUIDv7
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scan_id UUID REFERENCES scan_results(id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL,
    target_dosha VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Individual Ritual Steps in Routine
CREATE TABLE routine_items (
    id UUID PRIMARY KEY, -- UUIDv7
    routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
    ritual_name VARCHAR(100) NOT NULL,
    timing VARCHAR(20) NOT NULL CHECK (timing IN ('MORNING', 'EVENING', 'WEEKLY')),
    frequency VARCHAR(50) NOT NULL, -- e.g., 'Daily', '2-3 times per week'
    instructions TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 1,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. High-Frequency Adherence Event Log (Append-Only Events)
CREATE TABLE routine_tracking (
    id UUID PRIMARY KEY, -- UUIDv7
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    routine_item_id UUID NOT NULL REFERENCES routine_items(id) ON DELETE CASCADE,
    tracking_date DATE NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT TRUE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_routine_item_date UNIQUE (user_id, routine_item_id, tracking_date)
);
```

---

### 3. Adherence Calculations & Habit Streaks

Daily habit consistency is evaluated via the compound index on `routine_tracking(user_id, tracking_date)`:
* **Weekly Adherence Percentage:**
  $$\text{Adherence}_{7d} = \frac{\text{Completed Rituals in Last 7 Days}}{\text{Scheduled Rituals in Last 7 Days}} \times 100\%$$
* **Habit Streaks:** Streak counts are derived by querying consecutive unique `tracking_date` values where at least 1 ritual was completed.
