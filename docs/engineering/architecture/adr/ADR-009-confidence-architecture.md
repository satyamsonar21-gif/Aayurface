# Architecture Decision Record: ADR-009
## Confidence Architecture: Calibrated Multi-Dimensional Metric & Uncertainty Presentation

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Deciders:** AI/ML Architect, Principal Software Architect, UX Architect  
**Technical Area:** Statistical Confidence & Explainability  

---

### 1. Context
The prototype renders a hardcoded static string ("94% Confidence") regardless of image quality or input completeness. Phase 01 mandates a dynamic, calibrated confidence score reflecting capture quality, completeness, and modality agreement.

### 2. Problem
Formulating a deterministic confidence calculation architecture that avoids arbitrary LLM hallucinations of confidence, correlates with observable data quality, and communicates uncertainty transparently.

### 3. Options Evaluated
* **Option A: LLM Self-Reported Confidence:** Ask GPT-4o to state its own confidence percentage in the prompt.
* **Option B: Deterministic Multi-Dimensional Formula (Selected):** Calculate numerical confidence as $\text{Confidence} = Q_{cap} \times C_{input} \times A \times 100\%$, where $Q_{cap}$ is capture quality, $C_{input}$ is data completeness, and $A$ is harmonic modality agreement.
* **Option C: Discrete Qualitative Badges Only (High / Medium / Low):** Omit numeric percentages entirely.

### 4. Decision
Adopt **Option B: Deterministic Multi-Dimensional Formula**.
Confidence is computed through a reproducible mathematical formula binding client capture quality ($Q_{cap}$), input completeness ($C_{input}$), and inter-modality agreement ($A$). When $A < 0.60$, the score is mathematically capped below 60% and rendered with an explicit uncertainty disclosure.

### 5. Rationale
* **Anti-Hallucination:** Eliminates LLM self-evaluation bias. LLMs consistently over-estimate confidence even when given flawed premises.
* **User Actionability:** If confidence is low due to poor lighting ($Q_{cap}$), the user is specifically guided to retake the scan with better light; if low due to input conflict ($A$), they are guided to review their lifestyle inputs.

### 6. Consequences
* *Positive:* Completely objective, reproducible, and verifiable across automated test suites.
* *Negative:* Thresholds and multiplier curves require calibration against empirical user test data.

### 7. Risks & Mitigations
* *Risk:* Complex formula creates confusion if users do not understand why their score dropped.
* *Mitigation:* Results UI features a clickable "How this was calculated" drawer detailing the 3 underlying sub-metrics.

### 8. Evidence
Phase 01 requirement `FR-CONF-001` and `FR-CONF-002` formalize these dimensions.

### 9. Revisit Conditions
Revisit if clinical validation indicates that questionnaire completeness should carry a nonlinear exponential penalty.
