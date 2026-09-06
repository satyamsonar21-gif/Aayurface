# API Contract: Analysis Results & Explainability
## Normalized Result Snapshots, Observable Features & Transparent Reasoning

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Analysis Results  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Principal Backend Architect, AI Platform Architect, Ayurvedic Knowledge Analyst  

---

## 1. API-RES-001: Get Completed Analysis Result (`GET /api/v1/analyses/:id`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/analyses/:id`
* **Actor:** Authenticated User (`auth.uid()`)
* **Ownership Invariant:** Server-derived RLS `scan_results.user_id = auth.uid()`.

### Success Response (`200 OK`)

```json
{
  "data": {
    "id": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f87",
    "dominantDosha": "PITTA",
    "secondaryDosha": "VATA",
    "calibratedConfidence": 84.5,
    "confidenceLevel": "HIGH",
    "doshaPercentages": {
      "vata": 28.0,
      "pitta": 58.0,
      "kapha": 14.0
    },
    "visualObservables": {
      "erythemaWarmthIndex": 0.72,
      "melaninEvennessIndex": 0.81,
      "surfaceTextureRoughness": 0.35,
      "visibleDrynessScore": 0.28
    },
    "versionLineage": {
      "algorithmVersion": "v1.0.0",
      "visionModelVersion": "v1.2.0",
      "fusionVersion": "v1.0.0",
      "knowledgeBaseVersion": "v1.2.0"
    },
    "createdAt": "2026-09-03T20:30:05.420Z"
  },
  "meta": {
    "requestId": "req_res_01",
    "timestamp": "2026-09-03T20:30:10.000Z"
  }
}
```

---

## 2. API-RES-002: Get Analysis Explainability Breakdown (`GET /api/v1/analyses/:id/explainability`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/analyses/:id/explainability`
* **Actor:** Authenticated User (`auth.uid()`)

### Success Response (`200 OK`)

```json
{
  "data": {
    "analysisId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f87",
    "harmonicAgreementIndex": 0.88,
    "agreementState": "HIGH_AGREEMENT",
    "modalityContributions": [
      {
        "modality": "VISUAL_OBSERVATIONS",
        "weightPercentage": 40.0,
        "primarySignal": "Mild cheek erythema (CIELAB a* elevation) indicating Pitta heat tendency.",
        "confidence": 85.0
      },
      {
        "modality": "CONSTITUTIONAL_QUESTIONNAIRE",
        "weightPercentage": 35.0,
        "primarySignal": "Self-reported preference for cool climates and sensitive skin responses.",
        "confidence": 90.0
      },
      {
        "modality": "LIFESTYLE_ENVIRONMENT",
        "weightPercentage": 25.0,
        "primarySignal": "High ambient temperature and moderate stress aligning with Pitta aggravation.",
        "confidence": 78.0
      }
    ],
    "negativeBoundaries": [
      "This assessment is NOT a medical diagnosis of rosacea, dermatitis, or acne vulgaris.",
      "Visual signals represent surface Ayurvedic skin tendencies (Lakshanas), not pathology."
    ]
  },
  "meta": {
    "requestId": "req_res_exp_01",
    "timestamp": "2026-09-03T20:30:10.050Z"
  }
}
```
