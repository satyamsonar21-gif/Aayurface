# AayurFace — Engineering Requirements Specification
## Document 07: Artificial Intelligence, Fusion & RAG Specifications

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** AI/ML Architect, Ayurvedic Knowledge Systems Analyst  

---

### 1. The Multimodal Intelligence Architecture

Unlike single-modality selfie scanners, AayurFace enforces a tri-modality fusion pipeline:

```text
[Visual Observations Vector]   [Questionnaire Vector]   [Lifestyle Vector]
             │                           │                       │
             ▼                           ▼                       ▼
      (Normalized $V_{vis}$)      (Normalized $V_{quiz}$)  (Normalized $V_{life}$)
             │                           │                       │
             └───────────────────┬───────────────────────────────┘
                                 │
                                 ▼
                     [Multimodal Fusion Engine]
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       [Fused Tendency Vector]       [Inter-Modality Agreement Engine]
       (Vata, Pitta, Kapha)          (Cosine Similarity Matrix)
                 │                               │
                 │                               ▼
                 │                    [Agreement State: High/Med/Low]
                 │                    [Calibrated Confidence Score]
                 │                               │
                 └───────────────┬───────────────┘
                                 │
                                 ▼
               [RAG Knowledge Grounding via pgvector]
               (Text-embedding-3-small + Cited Classical Chunks)
                                 │
                                 ▼
               [OpenAI GPT-4o Reasoning & XAI Synthesis]
                                 │
                                 ▼
               [Safety Filter & Medical Boundary Guard]
                                 │
                                 ▼
               [Structured AnalysisResult Contract]
```

---

### 2. Multimodal Fusion Specifications (AI-FUS)

* **AI-FUS-001 (Normalized Input Vectors):** Each of the three modalities shall output a normalized 3-dimensional constitutional representation on the unit simplex:
  $$\vec{V} = [v_{vata}, v_{pitta}, v_{kapha}], \quad \text{where } v_i \in [0.0, 1.0] \text{ and } \sum v_i = 1.0$$
* **AI-FUS-002 (Configurable Modality Weights & Hypothesis Status):** The multimodal fusion layer SHALL support configurable, versioned signal weighting and combination strategies. The architecture SHALL NOT permanently hardcode fixed weights into application logic.
  * *Formula:* $\vec{T}_{fused} = w_{vis}\vec{V}_{vis} + w_{quiz}\vec{V}_{quiz} + w_{life}\vec{V}_{life}$
  * *Status:* **PROPOSED / INITIAL HYPOTHESIS (OPEN / RESEARCH VALIDATION REQUIRED)**.
  * *Initial Prototyping Hypothesis:* $w_{vis} = 0.40, \quad w_{quiz} = 0.35, \quad w_{life} = 0.25$.
  * *Validation Constraint:* Initial weighting values, if used for prototyping, SHALL be treated as unvalidated working hypotheses and SHALL NOT be represented as clinically or scientifically validated weights. The system architecture SHALL permit calibration, subgroup evaluation, empirical validation against expert consensus data, and total replacement of the fusion strategy without core refactoring.
* **AI-FUS-003 (Degraded Modality Dynamic Re-Weighting):** If a modality is unavailable (e.g., user skipped optional lifestyle fields), the engine shall normalize weights across available modalities ($w'_{vis} + w'_{quiz} = 1.0$) and tag the analysis as `DEGRADED_MODE`.
* **AI-FUS-004 (Inter-Modality Agreement Metric):** The system shall compute pairwise cosine similarity across input vectors:
  $$S_{ij} = \frac{\vec{V}_i \cdot \vec{V}_j}{\|\vec{V}_i\| \|\vec{V}_j\|}$$
  The overall agreement index $A \in [0.0, 1.0]$ shall be the harmonic mean of pairwise similarities.
* **AI-FUS-005 (Agreement State Thresholds):**
  * $A \ge 0.80 \implies \text{HIGH\_AGREEMENT}$ (Jade pill)
  * $0.60 \le A < 0.80 \implies \text{MODERATE\_AGREEMENT}$ (Amber Turmeric pill)
  * $A < 0.60 \implies \text{LOW\_AGREEMENT}$ (Muted Rose / Amber advisory)
* **AI-FUS-006 (Calibrated Confidence Scoring):** Confidence shall NOT be an uncalibrated LLM self-assessment. It shall be a deterministic function of capture quality ($Q_{cap}$), input completeness ($C_{input}$), and modality agreement ($A$):
  $$\text{Confidence} = Q_{cap} \times C_{input} \times A \times 100\%$$

---

### 3. Explainable AI (XAI) Contracts (AI-XAI)

* **AI-XAI-001 (Five-Part Structured Explanation):** Every analysis result shall strictly conform to the 5-part explanation schema:
  1. `observed_features`: List of confirmed visual observations with location and intensity.
  2. `contextual_influences`: Explicit list of questionnaire and lifestyle factors contributing to the score.
  3. `agreement_assessment`: Human-readable explanation of why modalities agreed or disagreed.
  4. `ayurvedic_interpretation`: Classical meaning of the dominant doshic tendencies.
  5. `what_this_does_not_mean`: Explicit statements distinguishing wellness signals from clinical dermatological diseases.
* **AI-XAI-002 (Causal Attribution Invariant):** The explanation generator shall be constrained via system prompts to cite ONLY variables present in the input feature vectors. It is strictly prohibited from inventing unobserved factors.

---

### 4. Retrieval-Augmented Generation & Knowledge Grounding (AI-RAG)

* **AI-RAG-001 (pgvector Knowledge Ingestion):** Classical Ayurvedic texts (*Charaka Samhita*, *Sushruta Samhita*, *Ashtanga Hridaya*, *Bhavaprakasha*) shall be chunked (chunk size: 400–600 tokens, 50 token overlap), vectorized via `text-embedding-3-small` (1536 dimensions), and stored in `knowledge_chunks`.
* **AI-RAG-002 (Similarity Search Execution):** Prior to recommendation generation, the system shall retrieve top-$k$ ($k=5$) chunks using cosine distance matching the user's fused constitutional profile and primary skin concerns.
* **AI-RAG-003 (Threshold Gating):** Retrieved chunks with cosine similarity $< 0.75$ shall be excluded. If fewer than 2 relevant chunks are retrieved, the system shall trigger the safe limitation fallback.
* **AI-RAG-004 (Source Citation Requirement):** The generative prompt shall instruct GPT-4o to include explicit source metadata (`source_title`, `chapter`, `verse_ref`) for every remedy.

---

### 5. AI Safety Boundaries & Behavioral Invariants

| Category | Permitted AI Behavior | Strictly Forbidden AI Behavior |
|---|---|---|
| **Dermatological Scope** | Describing skin surface appearance (dryness, oiliness, redness, uneven tone, texture). | Diagnosing medical conditions (e.g., eczema, psoriasis, melanoma, rosacea, cystic acne). |
| **Ayurvedic Reasoning** | Explaining doshic tendencies, seasonal ritucharya, and daily dinacharya balancing rituals. | Claiming that Ayurvedic herbs "cure" diseases or replace pharmaceutical prescriptions. |
| **Certainty & Confidence** | Explicitly stating uncertainty, flagging conflicting inputs, recommending retakes. | Presenting speculative inferences with false certainty or fabricating high confidence scores. |
| **Herbal Remedies** | Recommending time-tested natural topical remedies with mandatory patch-test advisories. | Recommending internal herbal medicines with potential systemic toxicity or unverified safety. |
| **Output Integrity** | Returning strictly formatted, schema-validated JSON structures matching contracts. | Returning unformatted free-text or hallucinated Markdown that breaks UI rendering. |

---

### 6. Conceptual AI Output Contracts (JSON Schema Concept)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AnalysisResultContract",
  "type": "object",
  "required": [
    "analysis_id", "timestamp", "overall_insight", "agreement_state",
    "calibrated_confidence", "constitutional_tendencies", "visual_observations",
    "explanation", "recommendations", "safety_disclaimer"
  ],
  "properties": {
    "analysis_id": { "type": "string", "format": "uuid" },
    "timestamp": { "type": "string", "format": "date-time" },
    "overall_insight": {
      "type": "object",
      "required": ["primary_tendency", "summary_label", "description"],
      "properties": {
        "primary_tendency": { "type": "string", "enum": ["Vata", "Pitta", "Kapha", "Vata-Pitta", "Pitta-Kapha", "Vata-Kapha", "Tridoshic"] },
        "summary_label": { "type": "string" },
        "description": { "type": "string" }
      }
    },
    "agreement_state": { "type": "string", "enum": ["HIGH_AGREEMENT", "MODERATE_AGREEMENT", "LOW_AGREEMENT"] },
    "calibrated_confidence": { "type": "number", "minimum": 0, "maximum": 100 },
    "constitutional_tendencies": {
      "type": "object",
      "required": ["vata", "pitta", "kapha"],
      "properties": {
        "vata": { "type": "number", "minimum": 0, "maximum": 1 },
        "pitta": { "type": "number", "minimum": 0, "maximum": 1 },
        "kapha": { "type": "number", "minimum": 0, "maximum": 1 }
      }
    },
    "visual_observations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["signal_id", "label", "value", "significance"],
        "properties": {
          "signal_id": { "type": "string" },
          "label": { "type": "string" },
          "value": { "type": "number" },
          "significance": { "type": "string", "enum": ["Low", "Moderate", "High"] }
        }
      }
    },
    "explanation": {
      "type": "object",
      "required": ["observed_summary", "contextual_influences", "agreement_rationale", "what_this_does_not_mean"],
      "properties": {
        "observed_summary": { "type": "string" },
        "contextual_influences": { "type": "array", "items": { "type": "string" } },
        "agreement_rationale": { "type": "string" },
        "what_this_does_not_mean": { "type": "string" }
      }
    },
    "recommendations": {
      "type": "array",
      "minItems": 3,
      "maxItems": 5,
      "items": {
        "type": "object",
        "required": ["title", "category", "why_suggested", "instructions", "patch_test_required", "citation"],
        "properties": {
          "title": { "type": "string" },
          "category": { "type": "string", "enum": ["Herbal Formulation", "Skincare Ritual", "Dietary Advice", "Lifestyle"] },
          "why_suggested": { "type": "string" },
          "instructions": { "type": "string" },
          "patch_test_required": { "type": "boolean" },
          "citation": {
            "type": "object",
            "required": ["source_text", "reference"],
            "properties": {
              "source_text": { "type": "string" },
              "reference": { "type": "string" }
            }
          }
        }
      }
    },
    "safety_disclaimer": { "type": "string" }
  }
}
```
