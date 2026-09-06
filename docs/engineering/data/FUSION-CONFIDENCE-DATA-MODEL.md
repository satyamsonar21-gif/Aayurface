# AayurFace — Database Architecture Specification
## Multimodal Fusion Weights, Agreement Metrics & Confidence Calibration

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, AI/ML Architect, Data Architect  
**Validation Notice:** The baseline weight distribution (40% Visual, 35% Questionnaire, 25% Lifestyle) is an **INITIAL HYPOTHESIS / PROPOSED CONFIGURATION** subject to empirical calibration in Milestone 11.  

---

### 1. Mathematical Fusion Formulation

The multimodal fusion engine calculates a composite Tridosha state vector by combining three independent normalized input vectors:
$$\vec{V}_{fused} = w_1 \cdot \vec{V}_{vis} + w_2 \cdot \vec{V}_{quiz} + w_3 \cdot \vec{V}_{life}$$
* $\vec{V}_{vis} = [v_{vata}, v_{pitta}, v_{kapha}]$: Derived from objective computer vision feature extraction.
* $\vec{V}_{quiz} = [q_{vata}, q_{pitta}, q_{kapha}]$: Derived from 15-question constitutional intake scoring.
* $\vec{V}_{life} = [l_{vata}, l_{pitta}, l_{kapha}]$: Derived from sleep, stress, climate, and hydration ratings.
* Constraint: $w_1 + w_2 + w_3 = 1.0$.

---

### 2. Configurable Fusion Configuration Table

To prevent hardcoding unvalidated weights into application code, fusion weights are defined in a versioned relational table:

```sql
-- Target Schema for Fusion Configurations (Milestone 11)

CREATE TABLE fusion_configurations (
    id UUID PRIMARY KEY,
    version VARCHAR(20) NOT NULL UNIQUE, -- e.g., 'fuse-v1.0.0'
    weight_visual FLOAT NOT NULL DEFAULT 0.40, -- Initial Hypothesis
    weight_quiz FLOAT NOT NULL DEFAULT 0.35,   -- Initial Hypothesis
    weight_lifestyle FLOAT NOT NULL DEFAULT 0.25, -- Initial Hypothesis
    agreement_threshold_high FLOAT NOT NULL DEFAULT 0.80,
    agreement_threshold_low FLOAT NOT NULL DEFAULT 0.60,
    confidence_base FLOAT NOT NULL DEFAULT 0.85,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_fusion_weights_unity 
        CHECK (abs(weight_visual + weight_quiz + weight_lifestyle - 1.0) < 0.0001)
);
```

---

### 3. Inter-Modality Agreement & Uncertainty Representation

Rather than smoothing away discrepancies between modalities, AayurFace explicitly preserves uncertainty:
1. **Pairwise Cosine Similarity:**
   $$S_{12} = \cos(\vec{V}_{vis}, \vec{V}_{quiz}), \quad S_{13} = \cos(\vec{V}_{vis}, \vec{V}_{life}), \quad S_{23} = \cos(\vec{V}_{quiz}, \vec{V}_{life})$$
2. **Harmonic Agreement Index ($A$):**
   $$A = \frac{3}{\frac{1}{S_{12}} + \frac{1}{S_{13}} + \frac{1}{S_{23}}}$$

| Harmonic Agreement $A$ | Agreement State Category | Confidence Calibration Formula | UI Presentation & Uncertainty Behavior |
|---|---|---|---|
| $A \ge 0.80$ | `HIGH_AGREEMENT` | $C = C_{base} \cdot A \cdot Q_{cap}$ | High-confidence badge rendered; visual and constitutional signals align. |
| $0.60 \le A < 0.80$ | `MODERATE_AGREEMENT` | $C = C_{base} \cdot A \cdot Q_{cap}$ | Moderate confidence; minor surface divergence noted in explanation. |
| $A < 0.60$ | `LOW_AGREEMENT` | **CAPPED at $< 60.0\%$** | **MANDATORY ADVISORY BANNER:** Alerts user that facial surface signals differ from constitutional lifestyle tendencies. Prioritizes lifestyle habits. |
| Missing Modality | `INSUFFICIENT_DATA` | **CAPPED at $\le 50.0\%$** | Degraded mode banner rendered; prompts user to retake scan under proper lighting. |

---

### 4. Database Persistence of Multimodal Vectors

```sql
-- Detail Table Linked 1:1 to scan_results
CREATE TABLE multimodal_fusions (
    scan_id UUID PRIMARY KEY REFERENCES scan_results(id) ON DELETE CASCADE,
    configuration_id UUID NOT NULL REFERENCES fusion_configurations(id) ON DELETE RESTRICT,
    
    -- Inputs
    visual_vata FLOAT NOT NULL, visual_pitta FLOAT NOT NULL, visual_kapha FLOAT NOT NULL,
    quiz_vata FLOAT NOT NULL, quiz_pitta FLOAT NOT NULL, quiz_kapha FLOAT NOT NULL,
    lifestyle_vata FLOAT NOT NULL, lifestyle_pitta FLOAT NOT NULL, lifestyle_kapha FLOAT NOT NULL,
    
    -- Outputs
    fused_vata FLOAT NOT NULL, fused_pitta FLOAT NOT NULL, fused_kapha FLOAT NOT NULL,
    agreement_index FLOAT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```
