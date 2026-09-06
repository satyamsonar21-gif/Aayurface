# AayurFace — Database Architecture Specification
## Target Analysis Relational Data Model & Traceability Lineage

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, AI Data Architect  

---

### 1. Architectural Decomposition of the Analysis Domain

The existing prototype stored analyses as an unconstrained JSON blob (`scan_results.causes`, `remedies`, `prevention_tips`, `raw_analysis`). The target architecture decomposes this domain into four tightly bound, normalized relational tables:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. `scan_results` (Master Analysis Snapshot)                                │
│ Dominant Dosha • Agreement State • Calibrated Confidence • 6 Version Flags  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│ `visual_         │          │ `multimodal_     │          │ `recommendation_ │
│  observations`   │          │  fusions`        │          │  items`          │
│ CIELAB a*, b*,   │          │ Visual/Quiz/Life │          │ Actionable steps │
│ GLCM texture,    │          │ Vectors, Fused   │          │ linked to vetted │
│ Melanin index.   │          │ Doshic Tendency. │          │ knowledge chunks.│
└──────────────────┘          └──────────────────┘          └──────────────────┘
```

---

### 2. Concrete Schema Definitions

```sql
-- Target Analysis Schema (Milestone 04)

CREATE TABLE scan_results (
    id UUID PRIMARY KEY, -- UUIDv7
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    capture_id UUID REFERENCES captures(id) ON DELETE SET NULL,
    job_id UUID REFERENCES analysis_jobs(id) ON DELETE SET NULL,
    questionnaire_id UUID NOT NULL REFERENCES questionnaire_responses(id),
    lifestyle_id UUID NOT NULL REFERENCES lifestyle_contexts(id),
    
    dominant_dosha VARCHAR(20) NOT NULL CHECK (dominant_dosha IN (
        'VATA', 'PITTA', 'KAPHA', 'VATA_PITTA', 'PITTA_KAPHA', 'VATA_KAPHA', 'TRIDOSHIC'
    )),
    agreement_state VARCHAR(30) NOT NULL CHECK (agreement_state IN (
        'HIGH_AGREEMENT', 'MODERATE_AGREEMENT', 'LOW_AGREEMENT', 'INSUFFICIENT_DATA'
    )),
    calibrated_confidence FLOAT NOT NULL CHECK (calibrated_confidence BETWEEN 0.0 AND 100.0),
    is_degraded BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Multi-Vector Semantic Lineage
    cv_version VARCHAR(20) NOT NULL,
    fusion_version VARCHAR(20) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    prompt_version VARCHAR(20) NOT NULL,
    knowledge_version VARCHAR(20) NOT NULL,
    schema_version VARCHAR(20) NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE visual_observations (
    scan_id UUID PRIMARY KEY REFERENCES scan_results(id) ON DELETE CASCADE,
    luma_mean FLOAT NOT NULL CHECK (luma_mean BETWEEN 0.0 AND 255.0),
    cielab_a_mean FLOAT NOT NULL, -- Redness/erythema signal
    cielab_b_mean FLOAT NOT NULL, -- Warmth/yellow-blue axis
    glcm_contrast FLOAT NOT NULL CHECK (glcm_contrast >= 0.0), -- Texture roughness
    glcm_homogeneity FLOAT NOT NULL CHECK (glcm_homogeneity BETWEEN 0.0 AND 1.0),
    melanin_index FLOAT NOT NULL CHECK (melanin_index >= 0.0),
    erythema_index FLOAT NOT NULL CHECK (erythema_index >= 0.0),
    regional_features JSONB NOT NULL, -- Forehead, cheek ROI polygons
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE multimodal_fusions (
    scan_id UUID PRIMARY KEY REFERENCES scan_results(id) ON DELETE CASCADE,
    configuration_id UUID NOT NULL REFERENCES fusion_configurations(id) ON DELETE RESTRICT,
    
    -- Input Modality Vectors
    visual_vata FLOAT NOT NULL CHECK (visual_vata BETWEEN 0.0 AND 1.0),
    visual_pitta FLOAT NOT NULL CHECK (visual_pitta BETWEEN 0.0 AND 1.0),
    visual_kapha FLOAT NOT NULL CHECK (visual_kapha BETWEEN 0.0 AND 1.0),
    
    quiz_vata FLOAT NOT NULL CHECK (quiz_vata BETWEEN 0.0 AND 1.0),
    quiz_pitta FLOAT NOT NULL CHECK (quiz_pitta BETWEEN 0.0 AND 1.0),
    quiz_kapha FLOAT NOT NULL CHECK (quiz_kapha BETWEEN 0.0 AND 1.0),
    
    lifestyle_vata FLOAT NOT NULL CHECK (lifestyle_vata BETWEEN 0.0 AND 1.0),
    lifestyle_pitta FLOAT NOT NULL CHECK (lifestyle_pitta BETWEEN 0.0 AND 1.0),
    lifestyle_kapha FLOAT NOT NULL CHECK (lifestyle_kapha BETWEEN 0.0 AND 1.0),
    
    -- Fused Doshic Vector (Sum = 100.0)
    fused_vata FLOAT NOT NULL CHECK (fused_vata BETWEEN 0.0 AND 100.0),
    fused_pitta FLOAT NOT NULL CHECK (fused_pitta BETWEEN 0.0 AND 100.0),
    fused_kapha FLOAT NOT NULL CHECK (fused_kapha BETWEEN 0.0 AND 100.0),
    
    agreement_index FLOAT NOT NULL CHECK (agreement_index BETWEEN 0.0 AND 1.0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
```

---

### 3. Traceability & Lineage Invariant

Every analysis is completely traceable to its source inputs:
* `capture_id`: Points to the specific physical capture and lighting quality metadata.
* `questionnaire_id`: Points to the user's specific 15-question answers and intake dosha scores.
* `lifestyle_id`: Points to the user's sleep, hydration, and climate environment.
* `knowledge_chunk_id`: Every recommendation links directly to an authoritative verse chunk in *Charaka Samhita*, *Sushruta Samhita*, *Ashtanga Hridaya*, or *Bhavaprakasha*.
