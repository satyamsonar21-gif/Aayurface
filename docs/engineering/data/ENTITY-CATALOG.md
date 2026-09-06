# AayurFace — Database Architecture Specification
## Target Entity Catalog & Schema Specifications

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Data Architect  

---

### 1. Catalog Overview

This catalog specifies all 28 persistent relational entities comprising the target AayurFace data architecture. Each entity defines strict constraints, ownership rules, mutability bounds, and lifecycle policies.

---

### 2. Comprehensive Entity Specifications

#### ENT-01: `profiles`
* **Purpose:** Core application user profile; extends Supabase `auth.users`.
* **Domain:** Identity & Governance.
* **Data Classification:** Sensitive Personal Information (Tier 4).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `id UUID` (References `auth.users(id) ON DELETE CASCADE`).
* **Foreign Keys:** `id` $\rightarrow$ `auth.users.id`.
* **Important Fields:** `email VARCHAR(255) NOT NULL`, `full_name VARCHAR(100) NOT NULL`, `age_bracket VARCHAR(20)`, `gender VARCHAR(20)`, `role VARCHAR(20) DEFAULT 'authenticated'`, `is_verified BOOLEAN DEFAULT FALSE`, `created_at TIMESTAMPTZ DEFAULT NOW()`, `updated_at TIMESTAMPTZ DEFAULT NOW()`.
* **Immutable Fields:** `id`, `created_at`.
* **Mutable Fields:** `full_name`, `age_bracket`, `gender`, `avatar_url`.
* **Server-Controlled Fields:** `role`, `is_verified`, `email`.
* **Lifecycle:** Active account lifespan.
* **Retention:** Active until account deletion.
* **Deletion Behavior:** `ON DELETE CASCADE` from `auth.users`.
* **RLS Requirement:** Enabled (`auth.uid() = id`). Updates disallow modifying `role`.
* **Audit Requirement:** Audited on role change, verification change, or account deletion.
* **API Exposure:** `GET /api/v1/profile`, `PUT /api/v1/profile`.
* **Indexes:** PK on `(id)`, UNIQUE on `(email)`.
* **Status:** `TARGET` (Rework of existing table).

#### ENT-02: `user_preferences`
* **Purpose:** Stores user-configurable UI and application preferences.
* **Domain:** User Experience.
* **Data Classification:** Internal Operational (Tier 2).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `user_id UUID` (References `profiles(id) ON DELETE CASCADE`).
* **Important Fields:** `theme VARCHAR(10) DEFAULT 'light'`, `language VARCHAR(10) DEFAULT 'en'`, `enable_voice BOOLEAN DEFAULT FALSE`, `reminder_notifications BOOLEAN DEFAULT FALSE`.
* **Lifecycle:** Co-terminus with user profile.
* **RLS Requirement:** Enabled (`auth.uid() = user_id`).
* **Status:** `TARGET` (New entity).

#### ENT-03: `consents`
* **Purpose:** Immutable append-only audit ledger of granted and revoked consent scopes.
* **Domain:** Identity & Governance.
* **Data Classification:** Sensitive Legal Record (Tier 4).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `id UUID` (UUIDv7 recommended).
* **Foreign Keys:** `user_id UUID` $\rightarrow$ `profiles.id ON DELETE CASCADE`.
* **Important Fields:** `scope VARCHAR(50) NOT NULL` (`biometric_processing`, `analysis_storage`, `wellness_personalization`, `research_sharing`), `policy_version VARCHAR(20) NOT NULL`, `status VARCHAR(20) NOT NULL` (`GRANTED`, `REVOKED`), `client_metadata_hash VARCHAR(64) NOT NULL`, `granted_at TIMESTAMPTZ DEFAULT NOW()`, `revoked_at TIMESTAMPTZ`.
* **Immutable Fields:** All fields. Table is strictly append-only.
* **RLS Requirement:** Enabled (`auth.uid() = user_id`). `UPDATE` and `DELETE` return 0 rows.
* **Audit Requirement:** 100% of rows retained in audit ledger.
* **Indexes:** `idx_consents_user_scope` on `(user_id, scope, status)`.
* **Status:** `TARGET` (New entity; mandatory for DPDP compliance).

#### ENT-04: `questionnaire_templates`
* **Purpose:** Versioned catalog of the 15-question constitutional intake questions.
* **Domain:** Constitutional Intake.
* **Data Classification:** Public / Vetted (Tier 1).
* **Owner:** System / Administrative.
* **Primary Key:** `id UUID`.
* **Important Fields:** `version VARCHAR(20) NOT NULL UNIQUE`, `title VARCHAR(100) NOT NULL`, `questions JSONB NOT NULL`, `is_active BOOLEAN DEFAULT TRUE`, `effective_date DATE NOT NULL`.
* **Immutable Fields:** `version`, `questions`.
* **RLS Requirement:** Public read (`true`); write restricted to `role: admin`.
* **Status:** `TARGET` (New entity).

#### ENT-05: `questionnaire_responses`
* **Purpose:** Immutable record of a user's completed 15-question constitutional intake.
* **Domain:** Constitutional Intake.
* **Data Classification:** Sensitive Health Personal Data (Tier 4).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `id UUID` (UUIDv7).
* **Foreign Keys:** `user_id UUID` $\rightarrow$ `profiles.id ON DELETE CASCADE`, `template_id UUID` $\rightarrow$ `questionnaire_templates.id`.
* **Important Fields:** `raw_answers JSONB NOT NULL`, `vata_score FLOAT NOT NULL`, `pitta_score FLOAT NOT NULL`, `kapha_score FLOAT NOT NULL`, `completeness FLOAT NOT NULL`, `created_at TIMESTAMPTZ DEFAULT NOW()`.
* **Immutable Fields:** All fields. Immutable snapshot per intake session.
* **RLS Requirement:** Enabled (`auth.uid() = user_id`).
* **Indexes:** `idx_quiz_user_created` on `(user_id, created_at DESC)`.
* **Status:** `TARGET` (New entity).

#### ENT-06: `lifestyle_contexts`
* **Purpose:** Dynamic lifestyle, sleep, stress, and environmental context inputs.
* **Domain:** Constitutional Intake.
* **Data Classification:** Sensitive Health Personal Data (Tier 4).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `id UUID` (UUIDv7).
* **Foreign Keys:** `user_id UUID` $\rightarrow$ `profiles.id ON DELETE CASCADE`.
* **Important Fields:** `sleep_hours INT NOT NULL CHECK (sleep_hours BETWEEN 0 AND 24)`, `sleep_quality VARCHAR(20) NOT NULL`, `stress_level VARCHAR(20) NOT NULL`, `water_intake_liters FLOAT NOT NULL`, `climate VARCHAR(50) NOT NULL`, `diet_type VARCHAR(50) NOT NULL`, `activity_level VARCHAR(50) NOT NULL`, `created_at TIMESTAMPTZ DEFAULT NOW()`.
* **Immutable Fields:** All fields. Immutable snapshot feeding an analysis.
* **RLS Requirement:** Enabled (`auth.uid() = user_id`).
* **Indexes:** `idx_lifestyle_user_created` on `(user_id, created_at DESC)`.
* **Status:** `TARGET` (New entity).

#### ENT-07: `captures`
* **Purpose:** Metadata and storage tracking for biometric facial capture attempts.
* **Domain:** Biometric Capture.
* **Data Classification:** Sensitive Biometric Metadata (Tier 4).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `id UUID` (UUIDv7).
* **Foreign Keys:** `user_id UUID` $\rightarrow$ `profiles.id ON DELETE CASCADE`.
* **Important Fields:** `storage_path VARCHAR(255) NOT NULL UNIQUE`, `mime_type VARCHAR(50) NOT NULL DEFAULT 'image/jpeg'`, `file_size_bytes INT NOT NULL CHECK (file_size_bytes <= 5242880)`, `checksum_sha256 VARCHAR(64) NOT NULL`, `retention_state VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'`, `captured_at TIMESTAMPTZ DEFAULT NOW()`, `purged_at TIMESTAMPTZ`.
* **RLS Requirement:** Enabled (`auth.uid() = user_id`).
* **Indexes:** `idx_captures_user_id` on `(user_id)`, `idx_captures_retention` on `(retention_state)`.
* **Status:** `TARGET` (New entity).

#### ENT-08: `capture_quality_metrics`
* **Purpose:** Objective quality gateway metrics calculated by client Wasm and verified by server.
* **Domain:** Biometric Capture.
* **Data Classification:** Internal Operational (Tier 2).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `capture_id UUID` (References `captures(id) ON DELETE CASCADE`).
* **Important Fields:** `face_count INT NOT NULL CHECK (face_count = 1)`, `landmark_confidence FLOAT NOT NULL`, `yaw_deg FLOAT NOT NULL`, `pitch_deg FLOAT NOT NULL`, `roll_deg FLOAT NOT NULL`, `mean_luminance FLOAT NOT NULL`, `laplacian_blur_variance FLOAT NOT NULL`, `is_acceptable BOOLEAN NOT NULL`.
* **RLS Requirement:** Enabled (`auth.uid() = (SELECT user_id FROM captures WHERE id = capture_id)`).
* **Status:** `TARGET` (New entity).

#### ENT-09: `analysis_jobs`
* **Purpose:** Asynchronous analysis execution queue, state machine, and retry tracker.
* **Domain:** Analysis Orchestration.
* **Data Classification:** Internal Operational (Tier 2).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `id UUID` (UUIDv7).
* **Foreign Keys:** `user_id UUID` $\rightarrow$ `profiles.id ON DELETE CASCADE`, `capture_id UUID` $\rightarrow$ `captures(id) ON DELETE CASCADE`.
* **Important Fields:** `status VARCHAR(20) NOT NULL` (`QUEUED`, `VALIDATING`, `PROCESSING`, `COMPLETED`, `FAILED`, `RETRYING`, `CANCELLED`, `EXPIRED`), `idempotency_key VARCHAR(64) NOT NULL`, `attempt_count INT DEFAULT 0`, `execution_deadline TIMESTAMPTZ NOT NULL`, `error_category VARCHAR(50)`, `error_details TEXT`, `correlation_id VARCHAR(64) NOT NULL`, `created_at TIMESTAMPTZ DEFAULT NOW()`, `updated_at TIMESTAMPTZ DEFAULT NOW()`.
* **Indexes:** UNIQUE on `(user_id, idempotency_key)`, Partial B-tree on `(created_at ASC) WHERE status IN ('QUEUED', 'RETRYING')`.
* **RLS Requirement:** Enabled (`auth.uid() = user_id`).
* **Status:** `TARGET` (New entity).

#### ENT-10: `scan_results`
* **Purpose:** Primary analysis entity recording dominant doshic tendency, confidence, and version lineage.
* **Domain:** Analysis & Assessment.
* **Data Classification:** Sensitive Wellness Assessment (Tier 4).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `id UUID` (UUIDv7).
* **Foreign Keys:** `user_id UUID` $\rightarrow$ `profiles.id ON DELETE CASCADE`, `capture_id UUID` $\rightarrow$ `captures(id) ON DELETE SET NULL`, `job_id UUID` $\rightarrow$ `analysis_jobs(id) ON DELETE SET NULL`, `questionnaire_id UUID` $\rightarrow$ `questionnaire_responses(id)`, `lifestyle_id UUID` $\rightarrow$ `lifestyle_contexts(id)`.
* **Important Fields:** `dominant_dosha VARCHAR(20) NOT NULL` (`VATA`, `PITTA`, `KAPHA`, `VATA_PITTA`, `PITTA_KAPHA`, `VATA_KAPHA`, `TRIDOSHIC`), `agreement_state VARCHAR(30) NOT NULL` (`HIGH_AGREEMENT`, `MODERATE_AGREEMENT`, `LOW_AGREEMENT`, `INSUFFICIENT_DATA`), `calibrated_confidence FLOAT NOT NULL CHECK (calibrated_confidence BETWEEN 0 AND 100)`, `is_degraded BOOLEAN DEFAULT FALSE`, `cv_version VARCHAR(20) NOT NULL`, `fusion_version VARCHAR(20) NOT NULL`, `model_version VARCHAR(50) NOT NULL`, `prompt_version VARCHAR(20) NOT NULL`, `knowledge_version VARCHAR(20) NOT NULL`, `schema_version VARCHAR(20) NOT NULL`, `created_at TIMESTAMPTZ DEFAULT NOW()`.
* **Immutable Fields:** All fields. Immutable snapshot.
* **RLS Requirement:** Enabled (`auth.uid() = user_id`). `UPDATE` returns 0 rows.
* **Indexes:** `idx_scan_results_user_created` on `(user_id, created_at DESC)`.
* **Status:** `TARGET` (Rework of existing table).

#### ENT-11: `visual_observations`
* **Purpose:** Normalized numerical phenotypic signals extracted from facial imagery (decoupled from pixels).
* **Domain:** Analysis & Assessment.
* **Data Classification:** Sensitive Biometric Observation (Tier 4).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `scan_id UUID` (References `scan_results(id) ON DELETE CASCADE PRIMARY KEY`).
* **Important Fields:** `luma_mean FLOAT NOT NULL`, `cielab_a_mean FLOAT NOT NULL` (Erythema signal), `cielab_b_mean FLOAT NOT NULL` (Warmth/Melanin signal), `glcm_contrast FLOAT NOT NULL` (Texture roughness), `glcm_homogeneity FLOAT NOT NULL`, `melanin_index FLOAT NOT NULL`, `erythema_index FLOAT NOT NULL`, `regional_features JSONB NOT NULL` (Forehead/cheek masks), `created_at TIMESTAMPTZ DEFAULT NOW()`.
* **Immutable Fields:** All fields.
* **RLS Requirement:** Enabled via `scan_results` ownership join.
* **Status:** `TARGET` (New entity).

#### ENT-12: `fusion_configurations`
* **Purpose:** Versioned mathematical configurations and weightings for multimodal fusion.
* **Domain:** AI & Algorithmic Intelligence.
* **Data Classification:** Confidential Business Logic (Tier 3).
* **Owner:** System / Administrative.
* **Primary Key:** `id UUID`.
* **Important Fields:** `version VARCHAR(20) NOT NULL UNIQUE`, `weight_visual FLOAT NOT NULL DEFAULT 0.40`, `weight_quiz FLOAT NOT NULL DEFAULT 0.35`, `weight_lifestyle FLOAT NOT NULL DEFAULT 0.25`, `agreement_threshold_high FLOAT NOT NULL DEFAULT 0.80`, `agreement_threshold_low FLOAT NOT NULL DEFAULT 0.60`, `is_active BOOLEAN DEFAULT TRUE`.
* **Constraints:** `CHECK (weight_visual + weight_quiz + weight_lifestyle = 1.0)`.
* **Status:** `TARGET` (New entity).

#### ENT-13: `multimodal_fusions`
* **Purpose:** Detailed input and output vectors of the multimodal fusion calculation.
* **Domain:** AI & Algorithmic Intelligence.
* **Data Classification:** Sensitive Wellness Vector (Tier 4).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `scan_id UUID` (References `scan_results(id) ON DELETE CASCADE PRIMARY KEY`).
* **Foreign Keys:** `configuration_id UUID` $\rightarrow$ `fusion_configurations(id)`.
* **Important Fields:** `visual_vata FLOAT NOT NULL`, `visual_pitta FLOAT NOT NULL`, `visual_kapha FLOAT NOT NULL`, `quiz_vata FLOAT NOT NULL`, `quiz_pitta FLOAT NOT NULL`, `quiz_kapha FLOAT NOT NULL`, `lifestyle_vata FLOAT NOT NULL`, `lifestyle_pitta FLOAT NOT NULL`, `lifestyle_kapha FLOAT NOT NULL`, `fused_vata FLOAT NOT NULL`, `fused_pitta FLOAT NOT NULL`, `fused_kapha FLOAT NOT NULL`, `agreement_index FLOAT NOT NULL`, `created_at TIMESTAMPTZ DEFAULT NOW()`.
* **RLS Requirement:** Enabled via `scan_results` ownership join.
* **Status:** `TARGET` (New entity).

#### ENT-14: `recommendation_items`
* **Purpose:** Actionable Ayurvedic ritual recommendations generated per analysis, linked to grounded verses.
* **Domain:** Ayurvedic Intelligence.
* **Data Classification:** Sensitive Wellness Guidance (Tier 4).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `id UUID` (UUIDv7).
* **Foreign Keys:** `scan_id UUID` $\rightarrow$ `scan_results(id) ON DELETE CASCADE`, `knowledge_chunk_id UUID` $\rightarrow$ `knowledge_chunks(id) ON DELETE RESTRICT`.
* **Important Fields:** `ritual_name VARCHAR(100) NOT NULL`, `timing VARCHAR(20) NOT NULL` (`MORNING`, `EVENING`, `WEEKLY`), `instructions TEXT NOT NULL`, `contraindications TEXT`, `herb_name VARCHAR(100)`, `patch_test_required BOOLEAN DEFAULT TRUE`, `created_at TIMESTAMPTZ DEFAULT NOW()`.
* **RLS Requirement:** Enabled via `scan_results` ownership join.
* **Status:** `TARGET` (New entity).

#### ENT-15: `routines`
* **Purpose:** Active daily Dinacharya ritual schedule adopted by the user.
* **Domain:** Routine & Habit Guidance.
* **Data Classification:** Internal Operational (Tier 2).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `id UUID` (UUIDv7).
* **Foreign Keys:** `user_id UUID` $\rightarrow$ `profiles(id) ON DELETE CASCADE`, `scan_id UUID` $\rightarrow$ `scan_results(id) ON DELETE SET NULL`.
* **Important Fields:** `title VARCHAR(100) NOT NULL`, `target_dosha VARCHAR(20) NOT NULL`, `is_active BOOLEAN DEFAULT TRUE`, `created_at TIMESTAMPTZ DEFAULT NOW()`, `updated_at TIMESTAMPTZ DEFAULT NOW()`.
* **RLS Requirement:** Enabled (`auth.uid() = user_id`).
* **Indexes:** `idx_routines_user_active` on `(user_id, is_active)`.
* **Status:** `TARGET` (New entity).

#### ENT-16: `routine_items`
* **Purpose:** Individual ritual steps within an active daily routine.
* **Domain:** Routine & Habit Guidance.
* **Data Classification:** Internal Operational (Tier 2).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `id UUID` (UUIDv7).
* **Foreign Keys:** `routine_id UUID` $\rightarrow$ `routines(id) ON DELETE CASCADE`.
* **Important Fields:** `ritual_name VARCHAR(100) NOT NULL`, `timing VARCHAR(20) NOT NULL`, `frequency VARCHAR(50) NOT NULL`, `instructions TEXT NOT NULL`, `display_order INT NOT NULL`.
* **RLS Requirement:** Enabled via `routines` ownership join.
* **Status:** `TARGET` (New entity).

#### ENT-17: `routine_tracking`
* **Purpose:** High-frequency event log of completed daily rituals for habit tracking.
* **Domain:** Longitudinal Progress.
* **Data Classification:** Internal Operational (Tier 2).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `id UUID` (UUIDv7).
* **Foreign Keys:** `user_id UUID` $\rightarrow$ `profiles(id) ON DELETE CASCADE`, `routine_item_id UUID` $\rightarrow$ `routine_items(id) ON DELETE CASCADE`.
* **Important Fields:** `tracking_date DATE NOT NULL`, `is_completed BOOLEAN NOT NULL DEFAULT TRUE`, `completed_at TIMESTAMPTZ DEFAULT NOW()`.
* **Indexes:** UNIQUE on `(user_id, routine_item_id, tracking_date)`, B-tree on `(user_id, tracking_date)`.
* **RLS Requirement:** Enabled (`auth.uid() = user_id`).
* **Status:** `TARGET` (New entity).

#### ENT-18: `progress_checkpoints`
* **Purpose:** Precomputed analytical progress deltas at 30, 60, and 90-day intervals.
* **Domain:** Longitudinal Progress.
* **Data Classification:** Sensitive Personal Progress (Tier 4).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `id UUID` (UUIDv7).
* **Foreign Keys:** `user_id UUID` $\rightarrow$ `profiles(id) ON DELETE CASCADE`, `baseline_scan_id UUID` $\rightarrow$ `scan_results(id)`, `current_scan_id UUID` $\rightarrow$ `scan_results(id)`.
* **Important Fields:** `checkpoint_interval INT NOT NULL` (e.g., 7, 14, 30, 60, 90), `erythema_delta FLOAT NOT NULL`, `texture_delta FLOAT NOT NULL`, `adherence_percentage FLOAT NOT NULL`, `stability_index FLOAT NOT NULL`, `created_at TIMESTAMPTZ DEFAULT NOW()`.
* **RLS Requirement:** Enabled (`auth.uid() = user_id`).
* **Status:** `TARGET` (New entity).

#### ENT-19: `shared_reports`
* **Purpose:** Cryptographically governed public read-only shares of analysis summaries.
* **Domain:** Sharing & Export.
* **Data Classification:** Public / Shared Read-Only (Tier 1/Shared).
* **Owner:** Authenticated User (`auth.uid()`).
* **Primary Key:** `id UUID` (UUIDv7).
* **Foreign Keys:** `user_id UUID` $\rightarrow$ `profiles(id) ON DELETE CASCADE`, `scan_id UUID` $\rightarrow$ `scan_results(id) ON DELETE CASCADE`.
* **Important Fields:** `token_hash VARCHAR(64) NOT NULL UNIQUE`, `passcode_hash VARCHAR(100)`, `expires_at TIMESTAMPTZ NOT NULL`, `is_revoked BOOLEAN DEFAULT FALSE`, `view_count INT DEFAULT 0`, `created_at TIMESTAMPTZ DEFAULT NOW()`.
* **RLS Requirement:** Custom sharing policy: readable by public if token matches, unexpired, and unrevoked.
* **Status:** `TARGET` (New entity).

#### ENT-20: `knowledge_sources`
* **Purpose:** Master catalog of authoritative classical Ayurvedic texts.
* **Domain:** Classical Literature & RAG.
* **Data Classification:** Public Domain / Vetted (Tier 1).
* **Owner:** Public Domain / Editorial.
* **Primary Key:** `id UUID`.
* **Important Fields:** `title VARCHAR(100) NOT NULL UNIQUE`, `author VARCHAR(100) NOT NULL`, `tradition VARCHAR(50) NOT NULL DEFAULT 'Ayurveda'`, `total_chunks INT DEFAULT 0`.
* **Status:** `TARGET` (New entity).

#### ENT-21: `knowledge_documents`
* **Purpose:** Structural sections and chapters within a classical compendium.
* **Domain:** Classical Literature & RAG.
* **Data Classification:** Public Domain / Vetted (Tier 1).
* **Owner:** Editorial.
* **Primary Key:** `id UUID`.
* **Foreign Keys:** `source_id UUID` $\rightarrow$ `knowledge_sources(id) ON DELETE RESTRICT`.
* **Important Fields:** `sthana VARCHAR(100) NOT NULL`, `adhyaya VARCHAR(100) NOT NULL`, `title VARCHAR(200) NOT NULL`.
* **Status:** `TARGET` (New entity).

#### ENT-22: `knowledge_chunks`
* **Purpose:** Vetted 400–600 token verse chunks with translations and vector embeddings.
* **Domain:** Classical Literature & RAG.
* **Data Classification:** Public Domain / Vetted (Tier 1).
* **Owner:** Editorial.
* **Primary Key:** `id UUID`.
* **Foreign Keys:** `document_id UUID` $\rightarrow$ `knowledge_documents(id) ON DELETE RESTRICT`.
* **Important Fields:** `source_work VARCHAR(100) NOT NULL`, `section_reference VARCHAR(100) NOT NULL`, `verse_numbers VARCHAR(50) NOT NULL`, `content_sanskrit TEXT NOT NULL`, `content_english TEXT NOT NULL`, `content_hindi TEXT`, `token_count INT NOT NULL`, `embedding vector(1536) NOT NULL`, `status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'`, `version VARCHAR(20) NOT NULL DEFAULT 'v1.0.0'`, `approved_by UUID[] NOT NULL`, `created_at TIMESTAMPTZ DEFAULT NOW()`.
* **Indexes:** HNSW index on `embedding` (`vector_cosine_ops`), B-tree on `(status)`.
* **Status:** `TARGET` (New entity).

#### ENT-23: `research_subjects`
* **Purpose:** De-identified participant records for post-MVP algorithmic fairness studies.
* **Domain:** Expert Research & Evaluation (Post-MVP).
* **Data Classification:** Confidential Research Data (Tier 3).
* **Owner:** Research Enclave.
* **Primary Key:** `id UUID` (Random ephemeral UUID).
* **Important Fields:** `skin_tone_subgroup VARCHAR(20) NOT NULL` (`TYPE_I` through `TYPE_VI`, `UNSPECIFIED`), `age_bracket VARCHAR(20) NOT NULL`, `gender VARCHAR(20)`, `masked_roi_paths JSONB NOT NULL`, `created_at TIMESTAMPTZ DEFAULT NOW()`.
* **Status:** `TARGET / POST-MVP (REQUIRES VALIDATION)` (New entity).

#### ENT-24: `expert_annotations`
* **Purpose:** Double-blind independent dosha assessments submitted by certified Ayurvedic practitioners.
* **Domain:** Expert Research & Evaluation (Post-MVP).
* **Data Classification:** Confidential Research Data (Tier 3).
* **Owner:** Ayurvedic Practitioner (`practitioner_id`).
* **Primary Key:** `id UUID` (UUIDv7).
* **Foreign Keys:** `subject_id UUID` $\rightarrow$ `research_subjects(id) ON DELETE CASCADE`.
* **Important Fields:** `practitioner_id UUID NOT NULL`, `vata_percentage FLOAT NOT NULL`, `pitta_percentage FLOAT NOT NULL`, `kapha_percentage FLOAT NOT NULL`, `primary_imbalance VARCHAR(20) NOT NULL`, `is_locked BOOLEAN DEFAULT TRUE`, `submitted_at TIMESTAMPTZ DEFAULT NOW()`.
* **Status:** `TARGET / POST-MVP (REQUIRES VALIDATION)` (New entity).

#### ENT-25: `consensus_labels`
* **Purpose:** Adjudicated expert-consensus reference labels with calculated Fleiss' Kappa score.
* **Domain:** Expert Research & Evaluation (Post-MVP).
* **Data Classification:** Confidential Research Benchmark (Tier 3).
* **Owner:** Research Supervisor.
* **Primary Key:** `subject_id UUID` (References `research_subjects(id) ON DELETE CASCADE PRIMARY KEY`).
* **Important Fields:** `consensus_dosha VARCHAR(20) NOT NULL`, `fleiss_kappa FLOAT NOT NULL`, `adjudication_type VARCHAR(30) NOT NULL` (`STATISTICAL_MEAN`, `SENIOR_ARBITRATION`), `created_at TIMESTAMPTZ DEFAULT NOW()`.
* **Status:** `TARGET / POST-MVP (REQUIRES VALIDATION)` (New entity).

#### ENT-26: `security_audit_events`
* **Purpose:** Immutable security audit log of auth events, RLS denials, and deletions.
* **Domain:** Security & Compliance.
* **Data Classification:** High Confidentiality Audit (Tier 3).
* **Owner:** Platform Security Vault.
* **Primary Key:** `id UUID` (UUIDv7).
* **Important Fields:** `event_type VARCHAR(50) NOT NULL`, `severity VARCHAR(20) NOT NULL`, `actor_id UUID`, `actor_role VARCHAR(20)`, `target_entity VARCHAR(50)`, `target_id UUID`, `ip_subnet VARCHAR(50)`, `correlation_id VARCHAR(64) NOT NULL`, `payload JSONB NOT NULL`, `created_at TIMESTAMPTZ DEFAULT NOW()`.
* **Immutability:** Kernel rules reject `UPDATE` and `DELETE`.
* **Status:** `TARGET / PROPOSED (REQUIRES VALIDATION)` (New entity).

#### ENT-27: `deletion_tombstones`
* **Purpose:** Anonymous ledger of purged users to prevent backup restoration resurrection.
* **Domain:** Privacy & Disaster Recovery.
* **Data Classification:** Internal Governance (Tier 2).
* **Owner:** System.
* **Primary Key:** `tenant_hash VARCHAR(64) PRIMARY KEY` (SHA-256 of user UUID).
* **Important Fields:** `purged_at TIMESTAMPTZ DEFAULT NOW()`, `compliance_standard VARCHAR(50) DEFAULT 'DPDP_GDPR_ERASURE'`.
* **Status:** `TARGET` (New entity).

#### ENT-28: `remedies`
* **Purpose:** Public reference catalog of classical Ayurvedic formulations and home remedies.
* **Domain:** Ayurvedic Knowledge.
* **Data Classification:** Public Domain / Vetted (Tier 1).
* **Owner:** Editorial.
* **Primary Key:** `id UUID`.
* **Important Fields:** `name VARCHAR(100) NOT NULL`, `slug VARCHAR(100) NOT NULL UNIQUE`, `description TEXT NOT NULL`, `ingredients JSONB NOT NULL`, `preparation_steps JSONB NOT NULL`, `application_steps JSONB NOT NULL`, `frequency VARCHAR(50) NOT NULL`, `skin_concerns TEXT[] NOT NULL`, `skin_types TEXT[] NOT NULL`, `is_featured BOOLEAN DEFAULT FALSE`.
* **Status:** `CURRENT VERIFIED (REWORK)` (Preserved and normalized from existing prototype).
