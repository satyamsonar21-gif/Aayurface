# AayurFace — Database Architecture Specification
## Expert Research Enclave, De-Identification & Fairness Modeling (Post-MVP)

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** PROPOSED / TARGET ARCHITECTURAL SPECIFICATION (Post-MVP; Implementation Pending)  
**Authority:** Principal Database Architect, Research Systems Analyst, Privacy Officer  
**Scope Notice:** Research dataset infrastructure is strictly deferred to **POST-MVP (Milestone 18)** per DEC-010.  

---

### 1. Architectural Schema Segregation

Research evaluation datasets reside in a dedicated, physically isolated PostgreSQL schema (`research.*`) or separate database instance:
* **Production Decoupling:** Consumer operational identities (`auth.users`, `profiles`) are never linked via direct foreign keys to research entities.
* **De-Identification Pipeline:** Data flows into `research.*` strictly via an automated one-way sanitization processor triggered only when a user possesses active `research_sharing = 'GRANTED'` consent.

---

### 2. Concrete Schema Specification (Research Schema)

```sql
-- Target Schema for Isolated Research Enclave (Post-MVP Milestone 18)

CREATE SCHEMA IF NOT EXISTS research;

CREATE TABLE research.research_subjects (
    id UUID PRIMARY KEY, -- Ephemeral random UUID (zero relation to auth.uid)
    skin_tone_subgroup VARCHAR(20) NOT NULL CHECK (
        skin_tone_subgroup IN ('TYPE_I', 'TYPE_II', 'TYPE_III', 'TYPE_IV', 'TYPE_V', 'TYPE_VI', 'UNSPECIFIED')
    ),
    age_bracket VARCHAR(20) NOT NULL, -- Coarsened (e.g., '25-34', '35-44')
    gender VARCHAR(20),
    geographic_region VARCHAR(50),    -- Macro-region only (e.g., 'South Asia')
    
    -- Masked Regional ROIs (Full faces strictly prohibited)
    masked_roi_paths JSONB NOT NULL,  -- S3 paths to cheek and forehead crops
    
    dataset_split VARCHAR(20) NOT NULL DEFAULT 'TRAIN' CHECK (
        dataset_split IN ('TRAIN', 'VALIDATION', 'BENCHMARK_TEST')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE research.fairness_benchmarks (
    id UUID PRIMARY KEY,
    evaluation_run_id VARCHAR(50) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    skin_tone_subgroup VARCHAR(20) NOT NULL,
    sample_size INT NOT NULL,
    accuracy_score FLOAT NOT NULL,
    disparate_impact_ratio FLOAT NOT NULL, -- Target >= 0.80 for 80% rule compliance
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 3. Skin-Tone / Pigmentation Subgroups & Fairness Auditing

To mitigate algorithmic bias across diverse skin tones and pigmentation levels, particularly subgroups corresponding to Fitzpatrick scale types **III, IV, V, and VI** prevalent in South Asian and global populations:

#### Classification Status:
* **Status:** **PROPOSED / REQUIRES VALIDATION** (Post-MVP Milestone 18).

#### Critical Scientific & Methodological Limitations:
1. **Not Objective Ground Truth:** The Fitzpatrick phototyping scale was originally designed to estimate UV erythema response for phototherapy, not as a comprehensive metric of visual skin characteristics or Ayurvedic constitution.
2. **Measurement Method & Potential Bias:** Skin-tone categorization in early phases is based on self-report or computer vision approximation, both of which are susceptible to subjective perception and ambient lighting bias. Expert practitioner assessment is required for research ground referencing.
3. **Subgroup Interpretation:** Categories ('TYPE_III' through 'TYPE_VI') must be treated as proxy subgroup variables for evaluating algorithmic equity, not as immutable biological truth.
4. **Mandatory Disparate Impact Auditing:** Benchmark runs will compute the Disparate Impact Ratio across subgroups:
   $$\text{Disparate Impact} = \frac{\text{Evaluation Metric}_{\text{Subgroup VI}}}{\text{Evaluation Metric}_{\text{Subgroup III}}}$$
   If the ratio drops below $0.80$ (Four-Fifths Rule), the release candidate is automatically flagged for re-calibration before deployment.
