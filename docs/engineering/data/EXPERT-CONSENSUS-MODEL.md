# AayurFace — Database Architecture Specification
## Double-Blind Expert Consensus & Inter-Rater Reliability Architecture

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Post-MVP)  
**Authority:** Principal Database Architect, Research Systems Analyst  

---

### 1. The Expert Consensus Workflow & Protocol

To establish an **expert reference label** (or **expert-consensus reference label**) for evaluating multimodal fusion and computer vision models without making unsubstantiated clinical claims, the research data architecture specifies the following rigorous consensus pipeline:

```text
Participant (De-Identified Masked ROIs)
    │
    ├──► Independent Expert Assessment #1 (Ayurvedic Practitioner A)
    ├──► Independent Expert Assessment #2 (Ayurvedic Practitioner B)
    └──► Independent Expert Assessment #3 (Ayurvedic Practitioner C)
            │
            ▼
    Agreement Analysis (Fleiss' Kappa κ Calculation)
            │
            ▼
    Consensus / No Consensus Determination
            │
            ▼
    Expert Reference Label (Derived Consensus State)
            │
            ▼
    Research Dataset (Stratified by Skin-Tone / Pigmentation Subgroups)
            │
            ▼
    Model Evaluation (Algorithmic Calibration & Fairness Benchmarking)
```

1. **Double-Blind Isolation:** Certified Ayurvedic practitioners review masked regional ROIs (cheeks/forehead) through a randomized worklist. Practitioners cannot view subject PII, prior assessments, or ratings submitted by peer practitioners.
2. **Immutable Submission Locking:** Once submitted, practitioner ratings are locked immediately (`is_locked = TRUE`) to prevent retroactive tampering or consensus anchoring bias.
3. **Statistical Agreement:** Inter-rater reliability is quantified using **Fleiss' Kappa ($\kappa$)** across multiple practitioners.
4. **Classification Notice:** This research architecture is **TARGET (POST-MVP MILESTONE 18) / REQUIRES VALIDATION**. It establishes expert-consensus reference labels for engineering evaluation, not clinical medical truth.

---

### 2. Concrete Schema Specification (Research Schema)

```sql
-- Target Schema for Double-Blind Annotations & Consensus (Post-MVP Milestone 18)

CREATE TABLE research.expert_annotations (
    id UUID PRIMARY KEY, -- UUIDv7
    subject_id UUID NOT NULL REFERENCES research.research_subjects(id) ON DELETE CASCADE,
    practitioner_id UUID NOT NULL, -- Isolated practitioner credential
    
    -- Independent Ayurvedic Ratings
    vata_percentage FLOAT NOT NULL CHECK (vata_percentage BETWEEN 0.0 AND 100.0),
    pitta_percentage FLOAT NOT NULL CHECK (pitta_percentage BETWEEN 0.0 AND 100.0),
    kapha_percentage FLOAT NOT NULL CHECK (kapha_percentage BETWEEN 0.0 AND 100.0),
    primary_imbalance VARCHAR(20) NOT NULL CHECK (
        primary_imbalance IN ('VATA', 'PITTA', 'KAPHA', 'VATA_PITTA', 'PITTA_KAPHA', 'VATA_KAPHA', 'TRIDOSHIC')
    ),
    surface_qualities TEXT[], -- e.g., ARRAY['Ruksha', 'Ushna', 'Snigdha']
    
    confidence_level VARCHAR(20) NOT NULL CHECK (confidence_level IN ('HIGH', 'MEDIUM', 'LOW')),
    is_locked BOOLEAN NOT NULL DEFAULT TRUE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_subject_practitioner UNIQUE (subject_id, practitioner_id)
);

CREATE TABLE research.consensus_labels (
    subject_id UUID PRIMARY KEY REFERENCES research.research_subjects(id) ON DELETE CASCADE,
    consensus_dosha VARCHAR(20) NOT NULL,
    consensus_vata FLOAT NOT NULL,
    consensus_pitta FLOAT NOT NULL,
    consensus_kapha FLOAT NOT NULL,
    
    fleiss_kappa FLOAT NOT NULL, -- Inter-rater reliability metric
    adjudication_type VARCHAR(30) NOT NULL CHECK (
        adjudication_type IN ('STATISTICAL_MEAN', 'SENIOR_ARBITRATION', 'TIE_BREAKER')
    ),
    adjudicated_by UUID,         -- Populated only if senior arbitration required
    adjudicated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 3. Consensus Adjudication Rules

1. **Statistical Consensus ($\kappa \ge 0.70$):**
   * If Fleiss' Kappa demonstrates strong inter-rater agreement ($\kappa \ge 0.70$), consensus scores are derived automatically as the arithmetic mean of practitioner ratings.
2. **Senior Arbitration ($\kappa < 0.70$):**
   * If annotators diverge significantly ($\kappa < 0.70$), the case is flagged and escalated to a Senior Ayurvedic Adjudicator for blind multi-party arbitration.
   * `adjudication_type` is recorded as `SENIOR_ARBITRATION`.
