# AayurFace — Architecture Specification
## Target Data Architecture, Relational Models & Storage Lifecycle

**Phase:** Phase 02 — Target System Architecture, ADRs & Implementation Blueprint  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION  
**Authority:** Data Architect, Security & Privacy Architect  

---

### 1. Conceptual Domain Data Model

The data architecture establishes an unambiguous separation between raw biometric captures, derived mathematical features, immutable holistic wellness assessments, and curated classical knowledge.

```mermaid
erDiagram
    AUTH_USERS ||--|| PROFILES : "has"
    PROFILES ||--o{ CONSENTS : "grants"
    PROFILES ||--o{ QUESTIONNAIRE_RESPONSES : "submits"
    PROFILES ||--o{ LIFESTYLE_CONTEXTS : "provides"
    PROFILES ||--o{ CAPTURES : "uploads"
    PROFILES ||--o{ SCAN_RESULTS : "owns"
    PROFILES ||--o{ ROUTINES : "follows"
    PROFILES ||--o{ CHAT_SESSIONS : "participates"
    PROFILES ||--o{ PROGRESS_CHECKPOINTS : "tracks"

    CAPTURES ||--o| SCAN_RESULTS : "provides visual signals"
    QUESTIONNAIRE_RESPONSES ||--o| SCAN_RESULTS : "provides doshic vector"
    LIFESTYLE_CONTEXTS ||--o| SCAN_RESULTS : "provides environment"
    SCAN_RESULTS ||--o{ ROUTINES : "generates"
    ROUTINES ||--o{ ROUTINE_TRACKING : "logs daily completion"
    CHAT_SESSIONS ||--o{ CHAT_MESSAGES : "contains"
    SCAN_RESULTS }o--o{ KNOWLEDGE_CHUNKS : "cites classical sources"

    PROFILES {
        uuid id PK
        uuid user_id FK
        varchar full_name
        varchar age_range
        varchar gender
        text_array primary_concerns
        text_array wellness_goals
        varchar preferred_language
        varchar role
        timestamptz created_at
        timestamptz updated_at
    }

    CONSENTS {
        uuid id PK
        uuid user_id FK
        varchar consent_version
        jsonb scopes
        timestamptz granted_at
        timestamptz revoked_at
        jsonb client_metadata
    }

    QUESTIONNAIRE_RESPONSES {
        uuid id PK
        uuid user_id FK
        jsonb raw_answers
        float vata_score
        float pitta_score
        float kapha_score
        float completeness
        varchar version
        timestamptz created_at
    }

    LIFESTYLE_CONTEXTS {
        uuid id PK
        uuid user_id FK
        varchar diet_type
        varchar sleep_quality
        int sleep_hours
        varchar stress_level
        varchar geographic_climate
        float water_intake_liters
        varchar activity_level
        text_array environmental_exposures
        timestamptz created_at
    }

    CAPTURES {
        uuid id PK
        uuid user_id FK
        varchar storage_path
        varchar mime_type
        int file_size_bytes
        jsonb quality_metrics
        timestamptz captured_at
        timestamptz purge_scheduled_at
        boolean is_purged
    }

    SCAN_RESULTS {
        uuid id PK
        uuid user_id FK
        uuid capture_id FK
        uuid questionnaire_id FK
        uuid lifestyle_id FK
        varchar dominant_tendency
        varchar agreement_state
        float calibrated_confidence
        jsonb visual_observations
        jsonb fused_tendencies
        jsonb explanation
        jsonb recommendations
        varchar cv_version
        varchar fusion_version
        varchar model_version
        varchar knowledge_version
        varchar schema_version
        boolean is_degraded
        timestamptz created_at
    }

    ROUTINES {
        uuid id PK
        uuid user_id FK
        uuid analysis_id FK
        varchar time_of_day
        text title
        text instructions
        text why_selected
        boolean is_active
        timestamptz created_at
    }

    ROUTINE_TRACKING {
        uuid id PK
        uuid user_id FK
        uuid routine_id FK
        date completed_date
        timestamptz completed_at
    }

    KNOWLEDGE_CHUNKS {
        uuid id PK
        varchar source_title
        varchar chapter
        varchar verse_reference
        text content
        varchar ayurvedic_domain
        vector embedding
        varchar version
        boolean is_active
        timestamptz created_at
    }
```

---

### 2. Entity Schema Blueprints & Responsibilities

#### A. Core Identity & Legal Entities
1. **`profiles`:** Extended profile details linked 1:1 with `auth.users`. Contains display name, age range, gender, skin concerns, and preferred UI language. Protected by RLS (`auth.uid() = user_id`).
2. **`consents`:** Immutable audit log of informed consent transactions. Tracks unbundled scopes (`biometric_processing`, `analysis_storage`, `research_sharing`, `reminders`), client metadata hash, and revocation timestamps.

#### B. Input Modality Entities
3. **`questionnaire_responses`:** Stores normalized 15-question constitutional intake. Calculates phenotypic Tridosha signal ($V + P + K = 1.0$) and stores questionnaire version for longitudinal tracking.
4. **`lifestyle_contexts`:** Stores environmental, sleep, diet, hydration, and stress variables with deterministic downstream doshic relevance.
5. **`captures`:** Storage reference entity tracking image file metadata, client quality gateway verification tokens, and scheduled cryptographic purge timestamps.

#### C. Analysis Snapshot & Routine Entities
6. **`scan_results` (Immutable Analysis Snapshot):** Central analytical record. Binds visual observations, fused dosha scores, confidence, agreement status, 5-part XAI explanations, and version metadata. Strict invariant: Read-only once created; updates are forbidden by RLS.
7. **`routines` & `routine_tracking`:** Daily ritual prescriptions (Morning/Evening/Weekly) generated from analysis snapshots and daily user completion checkboxes.
8. **`progress_checkpoints`:** Longitudinal trend aggregates (30, 60, 90 days) comparing baseline and subsequent analyses across visual signal deltas and routine adherence.

#### D. Knowledge & RAG Entities
9. **`knowledge_chunks`:** Curated, cited classical literature (*Charaka Samhita*, *Sushruta Samhita*, *Bhavaprakasha*). Houses 1536-dimensional vector embeddings managed by `pgvector`.
10. **`chat_sessions` & `chat_messages`:** Context-aware conversational threads with message role (`user`, `assistant`), cited classical sources, and safety notices.

---

### 3. Data Sensitivity Classification & Retention Policies

| Entity / Asset | Sensitivity Level | Encryption In-Transit | Encryption At-Rest | Retention Window | Deletion & Purging Strategy |
|---|---|---|---|---|---|
| **Raw Facial Captures** | **Sensitive Biometric Data** | TLS 1.3 | AES-256 (S3 SSE) | **OPEN DECISION (DEC-004)** (Immediate vs 30 Days vs Opt-in) | S3 API Hard Purge + soft-delete reference update. |
| **`profiles`** | Confidential / PII | TLS 1.3 | AES-256 (TDE) | Account Lifetime | Cascading delete upon account deletion. |
| **`consents`** | Regulatory / Compliance | TLS 1.3 | AES-256 (TDE) | Account Lifetime + 1 Year | Soft-deleted; permanent archive for legal defense. |
| **`questionnaire_responses`** | Special Category Health | TLS 1.3 | AES-256 (TDE) | Account Lifetime | Cascading delete upon account deletion. |
| **`lifestyle_contexts`** | Personal Wellness Data | TLS 1.3 | AES-256 (TDE) | Account Lifetime | Cascading delete upon account deletion. |
| **`scan_results`** | Wellness Insight / Metric | TLS 1.3 | AES-256 (TDE) | Account Lifetime | Cascading delete upon account deletion. |
| **`knowledge_chunks`** | Public Classical Literature | TLS 1.3 | AES-256 (TDE) | Indefinite (Versioned) | Admin deprecation (`is_active = false`). |
| **`audit_logs`** | System Telemetry | TLS 1.3 | AES-256 (TDE) | 90 Days Rolling | Automated rolling partition purge; no PII. |
