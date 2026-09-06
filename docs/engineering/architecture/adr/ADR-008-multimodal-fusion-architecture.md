# Architecture Decision Record: ADR-008
## Multimodal Fusion Architecture: Configurable Strategy Pattern with Agreement Gating

**Status:** ACCEPTED WITH OPEN RESEARCH HYPOTHESIS (DEC-005)  
**Date:** 2026-09-03  
**Deciders:** AI/ML Architect, Ayurvedic Knowledge Analyst, Solution Architect  
**Technical Area:** Multimodal Data Fusion & Doshic Scoring  

---

### 1. Context
AayurFace combines three input modalities: Visual Signals ($\vec{V}_{vis}$), Constitutional Questionnaire ($\vec{V}_{quiz}$), and Lifestyle Context ($\vec{V}_{life}$). Phase 01 proposed fixed weights (40/35/25), which Phase 01-C reclassified as an unvalidated working hypothesis (DEC-005).

### 2. Problem
Designing a fusion architecture that accommodates empirical weight calibration, handles missing or degraded modalities, and detects inter-modality disagreements without manufacturing false certainty.

### 3. Options Evaluated
* **Option A: Hardcoded Static Weights:** Embed `0.40 * vis + 0.35 * quiz + 0.25 * life` directly into code.
* **Option B: Configurable Strategy Pattern with Agreement Gating (Selected):** Decouple fusion logic behind an `IFusionStrategy` interface; store weights in an active versioned registry; compute pairwise cosine agreement.
* **Option C: Black-Box Neural Fusion:** Pass all modalities into a deep neural network to predict dosha classes directly.

### 4. Decision
Adopt **Option B: Configurable Strategy Pattern with Agreement Gating**.
* The fusion weights are loaded dynamically from a versioned configuration entity. The 40/35/25 distribution is treated strictly as an initial prototyping baseline (DEC-005).
* Pairwise cosine similarity is calculated across all modalities. If the harmonic agreement index $A < 0.60$, the system automatically assigns `LOW_AGREEMENT`, caps confidence $< 60\%$, and presents explicit uncertainty advisories.

### 5. Rationale
* **Scientific Integrity:** Prevents unverified assumptions from being hardcoded as dogma; allows data scientists to calibrate weights against triple-practitioner Ayurvedic expert consensus datasets in the Research Phase.
* **Truth Over Completion:** Acknowledges real-world input contradictions instead of smoothing them away.

### 6. Consequences
* *Positive:* Complete calibration flexibility, graceful degradation if visual data is missing (`FR-FUS-003`), full explainability.
* *Negative:* Slightly higher computational overhead for pairwise cosine matrix calculation.

### 7. Risks & Mitigations
* *Risk:* Users receive frequent `LOW_AGREEMENT` notices if early hypothesis weights are poorly balanced.
* *Mitigation:* Clear, empathetic copy explaining that human skin signals naturally vary across stress, sleep, and environment.

### 8. Evidence
`AayurFace Research.pdf` advocates for multimodal fusion but establishes that weights require empirical domain calibration.

### 9. Revisit Conditions
Revisit after completing Phase 14 (Post-MVP Ayurvedic Research) when triple-practitioner consensus datasets provide empirical ground truth.
