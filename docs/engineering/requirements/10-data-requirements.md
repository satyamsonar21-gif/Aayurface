# AayurFace — Engineering Requirements Specification
## Document 10: Conceptual Data Models & Entity Specifications

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** Data Architect, Solution Architect  

---

### 1. Conceptual Domain Entity Inventory

The Phase 00 reconnaissance confirmed that the existing database schema (`supabase/schema.sql`) contains only 7 basic tables and omits 6 major functional domains. Phase 01 formalizes the complete conceptual data model required to support the PRD.

```text
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   auth.users    │◄──────┤    profiles     │◄──────┤    consents     │
└────────┬────────┘       └────────┬────────┘       └─────────────────┘
         │                         │
         │                         ├───────────────────────────────────┐
         ▼                         ▼                                   ▼
┌─────────────────┐       ┌─────────────────┐                 ┌─────────────────┐
│  chat_sessions  │       │ questionnaire_  │                 │    lifestyle_   │
│                 │       │    responses    │                 │    contexts     │
└────────┬────────┘       └────────┬────────┘                 └────────┬────────┘
         │                         │                                   │
         ▼                         └─────────────────┬─────────────────┘
┌─────────────────┐                                  │
│  chat_messages  │                                  ▼
└─────────────────┘                         ┌─────────────────┐
                                            │  scan_results   │◄──────┐
                                            │ (Fused Snapshot)│       │
                                            └────────┬────────┘       │
                                                     │                │
                      ┌──────────────────────────────┼────────────────┴─┐
                      ▼                              ▼                  ▼
             ┌─────────────────┐            ┌─────────────────┐ ┌───────────────┐
             │    routines     │            │    progress_    │ │   captures    │
             │   & tracking    │            │   checkpoints   │ │ (Storage Ref) │
             └─────────────────┘            └─────────────────┘ └───────────────┘
```

---

### 2. Detailed Entity Specifications

#### Entity 1: `Profile`
* **Purpose:** Stores extended consumer preferences, demographics, and clinical preferences.
* **Attributes:** `id` (UUID, PK), `user_id` (FK to `auth.users`), `full_name`, `age_range`, `gender`, `primary_concerns` (TEXT[]), `wellness_goals` (TEXT[]), `preferred_language` (VARCHAR), `role` (`consumer`, `researcher`, `expert_annotator`, `admin`), `created_at`, `updated_at`.
* **Ownership:** Owning User (`auth.uid() = user_id`).
* **Sensitivity:** PII (High).
* **Retention:** Active until account deletion.

#### Entity 2: `Consent`
* **Purpose:** Legal record of informed consent grants, versions, and scopes.
* **Attributes:** `id` (UUID, PK), `user_id` (FK), `consent_version` (VARCHAR), `scopes` (JSONB: biometric, storage, research, notifications), `granted_at` (TIMESTAMPTZ), `revoked_at` (TIMESTAMPTZ, nullable), `client_metadata` (JSONB).
* **Ownership:** Owning User.
* **Sensitivity:** Compliance / Legal (Critical).
* **Retention:** Retained during active account + 1 year post-deletion for legal audit defense.

#### Entity 3: `QuestionnaireResponse`
* **Purpose:** Stores constitutional quiz responses and computed Vata/Pitta/Kapha signal vectors.
* **Attributes:** `id` (UUID, PK), `user_id` (FK), `raw_answers` (JSONB), `vata_score` (FLOAT), `pitta_score` (FLOAT), `kapha_score` (FLOAT), `completeness` (FLOAT), `version` (VARCHAR), `created_at` (TIMESTAMPTZ).
* **Ownership:** Owning User.
* **Sensitivity:** Wellness / Health Data (Special Category).

#### Entity 4: `LifestyleContext`
* **Purpose:** Stores normalized environmental and behavioral variables.
* **Attributes:** `id` (UUID, PK), `user_id` (FK), `diet_type` (VARCHAR), `sleep_quality` (VARCHAR), `sleep_hours` (INTEGER), `stress_level` (VARCHAR), `geographic_climate` (VARCHAR), `water_intake_liters` (FLOAT), `activity_level` (VARCHAR), `environmental_exposures` (TEXT[]), `created_at` (TIMESTAMPTZ).
* **Ownership:** Owning User.
* **Sensitivity:** Personal Wellness Data.

#### Entity 5: `ScanResult` (Analysis Snapshot)
* **Purpose:** Immutable snapshot of completed multimodal analysis.
* **Attributes:** `id` (UUID, PK), `user_id` (FK), `capture_id` (FK to storage reference), `questionnaire_id` (FK), `lifestyle_id` (FK), `dominant_tendency` (VARCHAR), `agreement_state` (`HIGH_AGREEMENT`, `MODERATE_AGREEMENT`, `LOW_AGREEMENT`), `calibrated_confidence` (FLOAT), `visual_observations` (JSONB), `fused_tendencies` (JSONB: `{v, p, k}`), `explanation` (JSONB: 5-part XAI structure), `recommendations` (JSONB), `model_version` (VARCHAR), `knowledge_version` (VARCHAR), `is_degraded` (BOOLEAN), `created_at` (TIMESTAMPTZ).
* **Ownership:** Owning User.
* **Sensitivity:** Biometric & Wellness Insight (High).
* **Immutability:** Strictly Read-Only once inserted (`UPDATE` prohibited by RLS).

#### Entity 6: `Routine` & `RoutineTracking`
* **Purpose:** Personalized daily/weekly rituals and user adherence logs.
* **Attributes (`routines`):** `id` (UUID, PK), `user_id` (FK), `analysis_id` (FK), `time_of_day` (`morning`, `evening`, `weekly`), `title` (TEXT), `instructions` (TEXT), `why_selected` (TEXT), `is_active` (BOOLEAN).
* **Attributes (`routine_tracking`):** `id` (UUID, PK), `user_id` (FK), `routine_id` (FK), `completed_date` (DATE), `completed_at` (TIMESTAMPTZ).
* **Ownership:** Owning User.

#### Entity 7: `ProgressCheckpoint`
* **Purpose:** Longitudinal tracking metrics at 30, 60, and 90-day intervals.
* **Attributes:** `id` (UUID, PK), `user_id` (FK), `checkpoint_interval` (INTEGER: 30, 60, 90), `baseline_analysis_id` (FK), `current_analysis_id` (FK), `observed_changes` (JSONB), `adherence_rate` (FLOAT), `trend_summary` (TEXT), `created_at` (TIMESTAMPTZ).
* **Ownership:** Owning User.

#### Entity 8: `KnowledgeChunk` (Vector Store)
* **Purpose:** Curated, cited classical Ayurvedic literature for RAG retrieval.
* **Attributes:** `id` (UUID, PK), `source_title` (VARCHAR), `chapter` (VARCHAR), `verse_reference` (VARCHAR), `content` (TEXT), `ayurvedic_domain` (VARCHAR), `embedding` (VECTOR(1536) via pgvector), `version` (VARCHAR), `is_active` (BOOLEAN), `created_at` (TIMESTAMPTZ).
* **Ownership:** System / Admin Managed.
* **Sensitivity:** Public Educational / Curated Classical Texts.

---

### 3. Data Sensitivity & Retention Policies

| Entity | Sensitivity Classification | Encryption In-Transit | Encryption At-Rest | Retention Window | Deletion Protocol |
|---|---|---|---|---|---|
| `profiles` | Confidential / PII | TLS 1.3 | AES-256 | Account Lifetime | Immediate Purge upon Account Deletion |
| `consents` | Regulatory / Legal | TLS 1.3 | AES-256 | Account Lifetime + 1 Year | Soft-deleted; permanent archive |
| `captures` (Images) | Sensitive Biometric | TLS 1.3 | AES-256 | 30 Days (Default) or User Selected | Storage bucket hard deletion |
| `scan_results` | Health / Wellness Insight | TLS 1.3 | AES-256 | Account Lifetime | Cascading delete with user |
| `routine_tracking`| Behavior / Adherence | TLS 1.3 | AES-256 | Account Lifetime | Cascading delete with user |
| `knowledge_chunks`| Public Domain / Classical | TLS 1.3 | AES-256 | Indefinite (Versioned) | Admin deprecation (`is_active = false`)|
